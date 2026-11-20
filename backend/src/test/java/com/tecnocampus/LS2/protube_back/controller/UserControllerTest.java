package com.tecnocampus.LS2.protube_back.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tecnocampus.LS2.protube_back.configuration.SecurityConfig;
import com.tecnocampus.LS2.protube_back.controller.exceptionHandler.DomainExceptionHandler;
import com.tecnocampus.LS2.protube_back.services.ProTubeOAuth2UserService;
import com.tecnocampus.LS2.protube_back.services.UserService;
import com.tecnocampus.LS2.protube_back.services.DTO.in.CreateUserDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.in.EditUserDTO;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(value = UserController.class, properties = "pro_tube.frontend.url=http://localhost:5173")
@Import({SecurityConfig.class, DomainExceptionHandler.class})
class UserControllerTest {
    private static final String SESSION_USERNAME = "session-user";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @MockBean
    private ProTubeOAuth2UserService oauth2UserService;

    @Test
    void publicProfileReadDoesNotRequireAuthentication() throws Exception {
        when(userService.getUser("public-user")).thenReturn(userDto("public-user"));

        mockMvc.perform(get("/api/users/{username}", "public-user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userName").value("public-user"));

        verify(userService).getUser("public-user");
    }

    @Test
    void userCreationIsProtectedAndConstrainedToTheSessionIdentity() throws Exception {
        CreateUserDTO request = new CreateUserDTO(
                SESSION_USERNAME,
                "Session User",
                null,
                SESSION_USERNAME + "@example.com",
                null,
                null
        );
        when(userService.createUser(any(CreateUserDTO.class))).thenReturn(userDto(SESSION_USERNAME));

        mockMvc.perform(post("/api/users/")
                        .with(authentication(authenticatedUser(SESSION_USERNAME)))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        verify(userService).createUser(request);

        mockMvc.perform(post("/api/users/")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void subscribeUsesTheSessionUsernameAndOnlyAcceptsTheTargetUsername() throws Exception {
        when(userService.subscribeToUser(SESSION_USERNAME, "target-user")).thenReturn(true);

        mockMvc.perform(post("/api/users/subscribe")
                        .param("subscribedUsername", "target-user")
                        .param("subscriberUsername", "forged-user")
                        .with(authentication(authenticatedUser(SESSION_USERNAME)))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        verify(userService).subscribeToUser(SESSION_USERNAME, "target-user");
    }

    @Test
    void profileEditTargetsTheCurrentSessionUserWithoutAUsernameInTheRequest() throws Exception {
        EditUserDTO request = new EditUserDTO("Updated display name", null, null, null);
        when(userService.editUserProfile(eq(SESSION_USERNAME), any(EditUserDTO.class)))
                .thenReturn(userDto(SESSION_USERNAME));

        mockMvc.perform(put("/api/users/me")
                        .with(authentication(authenticatedUser(SESSION_USERNAME)))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        verify(userService).editUserProfile(SESSION_USERNAME, request);
    }

    private static UserDTO userDto(String username) {
        return new UserDTO(null, null, username, "Display Name", null, username + "@example.com",
                LocalDate.now(), List.of(), 0L, List.of());
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
