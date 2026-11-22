package com.tecnocampus.LS2.protube_back.controller;

import com.tecnocampus.LS2.protube_back.configuration.SecurityConfig;
import com.tecnocampus.LS2.protube_back.controller.exceptionHandler.DomainExceptionHandler;
import com.tecnocampus.LS2.protube_back.services.ProTubeOAuth2UserService;
import com.tecnocampus.LS2.protube_back.services.VideoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(value = CommentsController.class, properties = "pro_tube.frontend.url=http://localhost:5173")
@Import({SecurityConfig.class, DomainExceptionHandler.class})
class CommentsControllerTest {
    private static final String SESSION_USERNAME = "session-user";
    private static final Long COMMENT_ID = 42L;

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private VideoService videoService;

    @MockBean
    private ProTubeOAuth2UserService oauth2UserService;

    @Test
    void likeUsesAuthenticatedPrincipal() throws Exception {
        when(videoService.likeComment(SESSION_USERNAME, COMMENT_ID)).thenReturn(true);

        mockMvc.perform(post("/api/comments/{id}/likes", COMMENT_ID)
                        .param("username", "forged-user")
                        .with(authentication(authenticatedUser(SESSION_USERNAME)))
                        .with(csrf()))
                .andExpect(status().isOk());

        verify(videoService).likeComment(SESSION_USERNAME, COMMENT_ID);
    }

    @Test
    void likingCommentRequiresAuthentication() throws Exception {
        mockMvc.perform(post("/api/comments/{id}/likes", COMMENT_ID)
                        .with(csrf()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void unlikeUsesAuthenticatedPrincipal() throws Exception {
        when(videoService.unlikeComment(SESSION_USERNAME, COMMENT_ID)).thenReturn(true);

        mockMvc.perform(delete("/api/comments/{id}/likes", COMMENT_ID)
                        .with(authentication(authenticatedUser(SESSION_USERNAME)))
                        .with(csrf()))
                .andExpect(status().isOk());

        verify(videoService).unlikeComment(SESSION_USERNAME, COMMENT_ID);
    }

    @Test
    void unlikingCommentRequiresAuthentication() throws Exception {
        mockMvc.perform(delete("/api/comments/{id}/likes", COMMENT_ID)
                        .with(csrf()))
                .andExpect(status().isUnauthorized());
    }

    private static OAuth2AuthenticationToken authenticatedUser(String username) {
        DefaultOAuth2User principal = new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority("ROLE_USER")),
                Map.of("username", username, "email", username + "@example.com"),
                "username"
        );
        return new OAuth2AuthenticationToken(principal, principal.getAuthorities(), "google");
    }
}
