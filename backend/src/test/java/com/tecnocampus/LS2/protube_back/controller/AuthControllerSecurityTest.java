package com.tecnocampus.LS2.protube_back.controller;

import com.tecnocampus.LS2.protube_back.configuration.SecurityConfig;
import com.tecnocampus.LS2.protube_back.controller.exceptionHandler.DomainExceptionHandler;
import com.tecnocampus.LS2.protube_back.services.ProTubeOAuth2UserService;
import com.tecnocampus.LS2.protube_back.services.UserService;
import com.tecnocampus.LS2.protube_back.services.DTO.out.UserDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(value = AuthController.class, properties = "pro_tube.frontend.url=http://localhost:5173")
@Import({SecurityConfig.class, DomainExceptionHandler.class})
class AuthControllerSecurityTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private ProTubeOAuth2UserService oauth2UserService;

    @Test
    void currentSessionEndpointReturnsUnauthorizedForAnonymousRequests() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void currentSessionEndpointReturnsAuthenticatedAccountAndGooglePicture() throws Exception {
        when(userService.getUser("alice")).thenReturn(new UserDTO(
                null, null, "alice", "Alice", null, "alice@example.com",
                LocalDate.of(2026, 1, 1), List.of(), 0L, List.of()
        ));

        mockMvc.perform(get("/api/auth/me").with(authentication(authenticatedAlice())))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.userName").value("alice"))
                .andExpect(jsonPath("$.email").value("alice@example.com"))
                .andExpect(jsonPath("$.pictureUrl").value("https://example.com/alice.png"));
    }

    @Test
    void csrfEndpointProvidesTokenAndHeaderMetadata() throws Exception {
        mockMvc.perform(get("/api/auth/csrf"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.headerName").value("X-CSRF-TOKEN"));
    }

    @Test
    void logoutInvalidatesTheAuthenticatedSession() throws Exception {
        mockMvc.perform(post("/api/auth/logout")
                        .with(authentication(authenticatedAlice()))
                        .with(csrf()))
                .andExpect(status().isNoContent());
    }

    private static OAuth2AuthenticationToken authenticatedAlice() {
        DefaultOAuth2User principal = new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority("ROLE_USER")),
                Map.of(
                        "username", "alice",
                        "email", "alice@example.com",
                        "picture", "https://example.com/alice.png"
                ),
                "username"
        );
        return new OAuth2AuthenticationToken(principal, principal.getAuthorities(), "google");
    }
}
