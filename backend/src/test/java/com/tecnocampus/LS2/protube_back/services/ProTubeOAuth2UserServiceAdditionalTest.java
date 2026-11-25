package com.tecnocampus.LS2.protube_back.services;

import com.tecnocampus.LS2.protube_back.model.User;
import com.tecnocampus.LS2.protube_back.persistence.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ProTubeOAuth2UserServiceAdditionalTest {

    @Test
    @SuppressWarnings("unchecked")
    void rejectsMissingOrInvalidRequiredIdentityAttributes() {
        UserRepository repository = mock(UserRepository.class);
        OAuth2UserRequest request = mock(OAuth2UserRequest.class);
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = mock(OAuth2UserService.class);
        ProTubeOAuth2UserService service = new ProTubeOAuth2UserService(repository, delegate);
        when(delegate.loadUser(request)).thenReturn(oauthUser(Map.of(
                "sub", "google-id",
                "email", " ",
                "email_verified", true
        )));

        OAuth2AuthenticationException exception =
                assertThrows(OAuth2AuthenticationException.class, () -> service.loadUser(request));

        assertEquals("invalid_user_info", exception.getError().getErrorCode());
        verifyNoInteractions(repository);
    }

    @Test
    @SuppressWarnings("unchecked")
    void createsSanitizedCollisionSafeUsernameAndDefaultDisplayNameAndAuthority() {
        UserRepository repository = mock(UserRepository.class);
        OAuth2UserRequest request = mock(OAuth2UserRequest.class);
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = mock(OAuth2UserService.class);
        ProTubeOAuth2UserService service = new ProTubeOAuth2UserService(repository, delegate);
        when(delegate.loadUser(request)).thenReturn(oauthUser(Map.of(
                "sub", "google-id",
                "email", "Ali+ce@example.com",
                "email_verified", true,
                "name", " "
        )));
        when(repository.findByEmailIgnoreCase("Ali+ce@example.com")).thenReturn(Optional.empty());
        when(repository.existsById("ali_ce")).thenReturn(true);
        when(repository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OAuth2User result = service.loadUser(request);

        String username = result.getName();
        assertTrue(username.matches("ali_ce-[0-9a-f]{10}"));
        assertEquals(username, result.getAttribute("username"));
        assertEquals("Ali+ce@example.com", result.getAttribute("email"));
        assertEquals(List.of(new SimpleGrantedAuthority("ROLE_USER")), result.getAuthorities().stream().toList());
        verify(repository).save(argThat(user ->
                user.getUsername().equals(username)
                        && user.getDisplayName().equals(username)
        ));
    }

    @Test
    @SuppressWarnings("unchecked")
    void truncatesLongGeneratedUsernameToTheDatabaseLimit() {
        UserRepository repository = mock(UserRepository.class);
        OAuth2UserRequest request = mock(OAuth2UserRequest.class);
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = mock(OAuth2UserService.class);
        ProTubeOAuth2UserService service = new ProTubeOAuth2UserService(repository, delegate);
        String localPart = "a".repeat(70);
        when(delegate.loadUser(request)).thenReturn(oauthUser(Map.of(
                "sub", "long-subject",
                "email", localPart + "@example.com",
                "email_verified", true
        )));
        when(repository.findByEmailIgnoreCase(localPart + "@example.com")).thenReturn(Optional.empty());
        when(repository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OAuth2User result = service.loadUser(request);

        assertEquals(50, result.getName().length());
        assertEquals("a".repeat(50), result.getName());
    }

    private static OAuth2User oauthUser(Map<String, Object> values) {
        Map<String, Object> attributes = new HashMap<>(values);
        attributes.putIfAbsent("sub", "google-sub");
        return new DefaultOAuth2User(List.of(), attributes, "sub");
    }
}
