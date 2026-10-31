package com.tecnocampus.LS2.protube_back.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tecnocampus.LS2.protube_back.controller.exceptionHandler.DomainExceptionHandler;
import com.tecnocampus.LS2.protube_back.services.DTO.in.CreateUserDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.out.UserDTO;
import com.tecnocampus.LS2.protube_back.services.UserService;
import com.tecnocampus.LS2.protube_back.services.exceptions.UserAlreadyExistsException;
import com.tecnocampus.LS2.protube_back.services.exceptions.UserNotFoundException;
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

import java.time.LocalDate;
import java.util.Collections;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(value = UserController.class, properties = {
        "ENV_PROTUBE_STORE_DIR=C:/tmp/test-storage"
})
@Import(DomainExceptionHandler.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

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
    // ENDPOINT: POST /api/users/
    // =========================================================================
    @Nested
    @DisplayName("Tests para POST /api/users/")
    class CreateUserEndpointTests {

        @Test
        @DisplayName("Debe devolver HTTP 201 y el UserDTO al crear un usuario exitosamente")
        void createUser_Success() throws Exception {
            CreateUserDTO createDto = new CreateUserDTO(
                    username,
                    "John Doe",
                    "Descripción de prueba",
                    "john.doe@example.com",
                    "pic_fid_123"
            );

            UserDTO expectedUser = new UserDTO(
                    "pic_fid_123",
                    username,
                    "John Doe",
                    "Descripción de prueba",
                    "john.doe@example.com",
                    LocalDate.now(),
                    Collections.emptyList(),
                    0L,
                    Collections.emptyList()
            );

            when(userService.createUser(any(CreateUserDTO.class))).thenReturn(expectedUser);

            mockMvc.perform(post("/api/users/")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(createDto)))
                    .andExpect(status().isCreated())
                    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$.userName").value(username))
                    .andExpect(jsonPath("$.displayName").value("John Doe"))
                    .andExpect(jsonPath("$.email").value("john.doe@example.com"));

            verify(userService, times(1)).createUser(any(CreateUserDTO.class));
        }

        @Test
        @DisplayName("Debe lanzar UserAlreadyExistsException cuando el usuario ya existe")
        void createUser_AlreadyExists_AssertThrows() {
            CreateUserDTO createDto = new CreateUserDTO(
                    username,
                    "John Doe",
                    "Descripción de prueba",
                    "john.doe@example.com",
                    "pic_fid_123"
            );

            when(userService.createUser(any(CreateUserDTO.class)))
                    .thenThrow(new UserAlreadyExistsException("User already exists"));

            assertThrows(
                    UserAlreadyExistsException.class,
                    () -> userController.createUser(createDto)
            );

            verify(userService, times(1)).createUser(any(CreateUserDTO.class));
        }

        @Test
        @DisplayName("Debe lanzar IllegalArgumentException cuando faltan datos obligatorios")
        void createUser_InvalidArguments_AssertThrows() {
            CreateUserDTO invalidDto = new CreateUserDTO(
                    "",
                    "John Doe",
                    "Descripción",
                    "",
                    "pic_fid_123"
            );

            when(userService.createUser(any(CreateUserDTO.class)))
                    .thenThrow(new IllegalArgumentException("username and email are required"));

            assertThrows(
                    IllegalArgumentException.class,
                    () -> userController.createUser(invalidDto)
            );

            verify(userService, times(1)).createUser(any(CreateUserDTO.class));
        }
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