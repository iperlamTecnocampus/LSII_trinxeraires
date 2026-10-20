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
    // ENDPOINT: POST /api/users/likeVideo
    // =========================================================================
    @Nested
    @DisplayName("Tests para POST /api/users/likeVideo")
    class LikeVideoEndpointTests {

        @Test
        @DisplayName("Debe devolver HTTP 200 y true cuando el 'like' es exitoso")
        void likeVideo_Success() throws Exception {
            when(userService.likeVideo(username, videoId)).thenReturn(true);

            mockMvc.perform(post("/api/users/likeVideo")
                            .param("userName", username)
                            .param("videoId", videoId.toString()))
                    .andExpect(status().isOk())
                    .andExpect(content().string("true"));

            verify(userService, times(1)).likeVideo(username, videoId);
        }

        @Test
        @DisplayName("Debe devolver HTTP 404 Not Found cuando el usuario no existe")
        void likeVideo_UserNotFound_Returns404() throws Exception {
            when(userService.likeVideo(username, videoId))
                    .thenThrow(new UserNotFoundException("User not found"));

            mockMvc.perform(post("/api/users/likeVideo")
                            .param("userName", username)
                            .param("videoId", videoId.toString()))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.title").value("User Not Found"))
                    .andExpect(jsonPath("$.detail").value("User not found"))
                    .andExpect(jsonPath("$.timestamp").exists());

            verify(userService, times(1)).likeVideo(username, videoId);
        }

        @Test
        @DisplayName("Comprobar excepción UserNotFoundException con assertThrows")
        void likeVideo_UserNotFound_AssertThrows() {
            when(userService.likeVideo(username, videoId))
                    .thenThrow(new UserNotFoundException("User not found"));

            UserNotFoundException exception = assertThrows(
                    UserNotFoundException.class,
                    () -> userController.likeVideo(username, videoId)
            );

            verify(userService, times(1)).likeVideo(username, videoId);
        }

        @Test
        @DisplayName("Debe devolver HTTP 400 Bad Request si faltan parámetros obligatorios")
        void likeVideo_MissingParams_BadRequest() throws Exception {
            mockMvc.perform(post("/api/users/likeVideo")
                            .param("userName", username)) // Falta videoId
                    .andExpect(status().isBadRequest());

            verify(userService, never()).likeVideo(any(), any());
        }
    }

    // =========================================================================
    // ENDPOINT: POST /api/users/commentVideo
    // =========================================================================
    @Nested
    @DisplayName("Tests para POST /api/users/commentVideo")
    class CommentVideoEndpointTests {

        @Test
        @DisplayName("Debe devolver HTTP 200 y true al añadir un comentario")
        void commentVideo_Success() throws Exception {
            String comment = "Excelente vídeo";
            when(userService.commentVideo(username, videoId, comment)).thenReturn(true);

            mockMvc.perform(post("/api/users/commentVideo")
                            .param("userName", username)
                            .param("videoId", videoId.toString())
                            .contentType(MediaType.TEXT_PLAIN)
                            .content(comment))
                    .andExpect(status().isOk())
                    .andExpect(content().string("true"));

            verify(userService, times(1)).commentVideo(username, videoId, comment);
        }

        @Test
        @DisplayName("Debe devolver HTTP 404 Not Found cuando el vídeo no existe")
        void commentVideo_VideoNotFound_Returns404() throws Exception {
            String comment = "Comentario de prueba";
            when(userService.commentVideo(username, videoId, comment))
                    .thenThrow(new VideoNotFoundException("Video not found"));

            mockMvc.perform(post("/api/users/commentVideo")
                            .param("userName", username)
                            .param("videoId", videoId.toString())
                            .contentType(MediaType.TEXT_PLAIN)
                            .content(comment))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.title").value("Video Not Found"))
                    .andExpect(jsonPath("$.detail").value("Video not found"));

            verify(userService, times(1)).commentVideo(username, videoId, comment);
        }

        @Test
        @DisplayName("Comprobar excepción VideoNotFoundException con assertThrows")
        void commentVideo_VideoNotFound_AssertThrows() {
            String comment = "Comentario de prueba";
            when(userService.commentVideo(username, videoId, comment))
                    .thenThrow(new VideoNotFoundException("Video not found"));

            assertThrows(
                    VideoNotFoundException.class,
                    () -> userController.commentVideo(username, videoId, comment)
            );
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