package com.tecnocampus.LS2.protube_back.services;

import com.tecnocampus.LS2.protube_back.model.User;
import com.tecnocampus.LS2.protube_back.persistence.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ProTubeOAuth2UserServiceTest {
    private UserRepository userRepository;
    private OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate;
    private ProTubeOAuth2UserService service;
    private OAuth2User googleUser;
    private OAuth2UserRequest userRequest;

    @BeforeEach
    @SuppressWarnings("unchecked")
    void setUp() {
        userRepository = mock(UserRepository.class);
        delegate = mock(OAuth2UserService.class);
        service = new ProTubeOAuth2UserService(userRepository, delegate);
        userRequest = mock(OAuth2UserRequest.class);
        googleUser = new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority("ROLE_USER")),
                Map.of(
                        "sub", "google-sub-123",
                        "email", "alice@example.com",
                        "email_verified", true,
                        "name", "Alice Example",
                        "picture", "https://example.com/alice.png"
                ),
                "sub"
        );
        when(delegate.loadUser(userRequest)).thenReturn(googleUser);
    }

    @Test
    void createsUserFromVerifiedGoogleIdentityAndMakesDatabaseUsernameThePrincipalName() {
        when(userRepository.findByEmailIgnoreCase("alice@example.com")).thenReturn(Optional.empty());
        when(userRepository.existsById("alice")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OAuth2User result = service.loadUser(userRequest);

        assertEquals("alice", result.getName());
        assertEquals("alice", result.getAttribute("username"));
        assertEquals("https://example.com/alice.png", result.getAttribute("picture"));
        verify(userRepository).save(argThat(user ->
                user.getUsername().equals("alice")
                        && user.getEmail().equals("alice@example.com")
                        && user.getDisplayName().equals("Alice Example")
        ));
    }

    @Test
    void reusesExistingUserWhenGoogleEmailMatchesCaseInsensitively() {
        User existing = new User("alice-account", "Alice@Example.com");
        when(userRepository.findByEmailIgnoreCase("alice@example.com")).thenReturn(Optional.of(existing));

        OAuth2User result = service.loadUser(userRequest);

        assertEquals("alice-account", result.getName());
        verify(userRepository, never()).save(any());
        verify(userRepository, never()).existsById(any());
    }

    @Test
    void rejectsUnverifiedGoogleEmail() {
        OAuth2User unverifiedUser = new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority("ROLE_USER")),
                Map.of("sub", "google-sub-123", "email", "alice@example.com", "email_verified", false),
                "sub"
        );
        when(delegate.loadUser(userRequest)).thenReturn(unverifiedUser);

        assertThrows(OAuth2AuthenticationException.class, () -> service.loadUser(userRequest));
        verify(userRepository, never()).save(any());
    }
}
