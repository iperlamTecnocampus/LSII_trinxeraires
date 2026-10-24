package com.tecnocampus.LS2.protube_back.controller;

import com.tecnocampus.LS2.protube_back.controller.exceptionHandler.DomainExceptionHandler;

import com.tecnocampus.LS2.protube_back.services.UserService;
import com.tecnocampus.LS2.protube_back.services.exceptions.UserNotFoundException;
import com.tecnocampus.LS2.protube_back.services.exceptions.VideoNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(value = UserController.class, properties = {
        "ENV_PROTUBE_STORE_DIR=C:/tmp/test-storage"
})
@Import(DomainExceptionHandler.class) // Importa el ExceptionHandler
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private UserController userController;

    private String username;
    private UUID videoId;

    @BeforeEach
    void setUp() {
        username = "john_doe";
        videoId = UUID.randomUUID();
    }

    // =========================================================================
    // ENDPOINT: POST /api/users/subscribe
    // =========================================================================
    @Nested
    @DisplayName("Tests para POST /api/users/subscribe")
    class SubscribeToUserEndpointTests {

        @Test
        @DisplayName("Debe devolver HTTP 200 y true al suscribirse exitosamente")
        void subscribeToUser_Success() throws Exception {
            String subscriber = "john_doe";
            String subscribed = "jane_doe";
            when(userService.subscribeToUser(subscriber, subscribed)).thenReturn(true);

            mockMvc.perform(post("/api/users/subscribe")
                            .param("subscriberUsername", subscriber)
                            .param("subscribedUsername", subscribed))
                    .andExpect(status().isOk())
                    .andExpect(content().string("true"));

            verify(userService, times(1)).subscribeToUser(subscriber, subscribed);
        }

        @Test
        @DisplayName("Debe devolver HTTP 404 Not Found cuando el usuario a suscribir no existe")
        void subscribeToUser_UserNotFound_Returns404() throws Exception {
            String subscriber = "john_doe";
            String subscribed = "non_existent_user";
            when(userService.subscribeToUser(subscriber, subscribed))
                    .thenThrow(new UserNotFoundException("Subscribed user not found"));

            mockMvc.perform(post("/api/users/subscribe")
                            .param("subscriberUsername", subscriber)
                            .param("subscribedUsername", subscribed))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.title").value("User Not Found"))
                    .andExpect(jsonPath("$.detail").value("Subscribed user not found"));

            verify(userService, times(1)).subscribeToUser(subscriber, subscribed);
        }
    }
}