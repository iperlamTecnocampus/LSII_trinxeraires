package com.tecnocampus.LS2.protube_back.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tecnocampus.LS2.protube_back.controller.exceptionHandler.DomainExceptionHandler;
import com.tecnocampus.LS2.protube_back.services.DTO.in.CategoryDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.in.CreateVideoDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.in.EditVideoDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.out.VideoInfoDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.out.VideoUserDTO;
import com.tecnocampus.LS2.protube_back.services.VideoService;
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

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(value = VideosController.class, properties = {
        "ENV_PROTUBE_STORE_DIR=C:/tmp/test-storage"
})
@Import(DomainExceptionHandler.class)
class VideosControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private VideosController videoController;

    @MockBean
    private VideoService videoService;

    private UUID videoId;
    private String username;

    @BeforeEach
    void setUp() {
        videoId = UUID.randomUUID();
        username = "john_doe";
    }

    // =========================================================================
    // GET /api/videos
    // =========================================================================
    @Nested
    @DisplayName("Tests para GET /api/videos")
    class GetVideosEndpointTests {

        @Test
        @DisplayName("Debe devolver HTTP 200 y la lista de vídeos")
        void getVideos_Success() throws Exception {
            VideoInfoDTO video1 = mock(VideoInfoDTO.class);
            VideoInfoDTO video2 = mock(VideoInfoDTO.class);
            List<VideoInfoDTO> videos = List.of(video1, video2);

            when(videoService.getVideos()).thenReturn(videos);

            mockMvc.perform(get("/api/videos/"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(2));

            verify(videoService, times(1)).getVideos();
        }
    }

    // =========================================================================
    // GET /api/videos/{id}
    // =========================================================================
    @Nested
    @DisplayName("Tests para GET /api/videos/{id}")
    class GetVideoInfoEndpointTests {

        @Test
        @DisplayName("Debe devolver HTTP 200 y los detalles del vídeo")
        void getVideoInfo_Success() throws Exception {
            VideoInfoDTO infoDTO = mock(VideoInfoDTO.class);

            when(videoService.getVideoInfo(videoId)).thenReturn(infoDTO);

            mockMvc.perform(get("/api/videos/{id}", videoId))
                    .andExpect(status().isOk());

            verify(videoService, times(1)).getVideoInfo(videoId);
        }

        @Test
        @DisplayName("Debe devolver HTTP 404 cuando el vídeo no existe")
        void getVideoInfo_NotFound_Returns404() throws Exception {
            when(videoService.getVideoInfo(videoId))
                    .thenThrow(new VideoNotFoundException("Video not found"));

            mockMvc.perform(get("/api/videos/{id}", videoId))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.title").value("Video Not Found"))
                    .andExpect(jsonPath("$.detail").value("Video not found"));

            verify(videoService, times(1)).getVideoInfo(videoId);
        }
    }

    // =========================================================================
    // DELETE /api/videos/{id}
    // =========================================================================
    @Nested
    @DisplayName("Tests para DELETE /api/videos/{id}")
    class DeleteVideoByIdEndpointTests {

        @Test
        @DisplayName("Debe devolver HTTP 204 al eliminar un vídeo correctamente")
        void deleteVideoById_Success() throws Exception {
            doNothing().when(videoService).deleteVideoById(videoId);

            mockMvc.perform(delete("/api/videos/{id}", videoId))
                    .andExpect(status().isNoContent());

            verify(videoService, times(1)).deleteVideoById(videoId);
        }

        @Test
        @DisplayName("Debe devolver HTTP 404 cuando el vídeo no existe")
        void deleteVideoById_NotFound_Returns404() throws Exception {
            doThrow(new VideoNotFoundException("Video not found"))
                    .when(videoService).deleteVideoById(videoId);

            mockMvc.perform(delete("/api/videos/{id}", videoId))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.title").value("Video Not Found"))
                    .andExpect(jsonPath("$.detail").value("Video not found"));

            verify(videoService, times(1)).deleteVideoById(videoId);
        }
    }

    // =========================================================================
    // POST /api/videos/
    // =========================================================================
    @Nested
    @DisplayName("Tests para POST /api/videos/")
    class CreateVideoEndpointTests {

        @Test
        @DisplayName("Debe devolver HTTP 200 y crear el vídeo correctamente")
        void createVideo_Success() throws Exception {
            CategoryDTO category = new CategoryDTO(1L, "Tecnologia");
            VideoUserDTO author = mock(VideoUserDTO.class);

            CreateVideoDTO createDTO = new CreateVideoDTO(
                    "Títol de prova",
                    "Descripció de prova",
                    author,
                    List.of(category)
            );

            VideoInfoDTO expectedInfo = mock(VideoInfoDTO.class);

            when(videoService.createVideo(any(CreateVideoDTO.class)))
                    .thenReturn(expectedInfo);

            mockMvc.perform(post("/api/videos/")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(createDTO)))
                    .andExpect(status().isOk());

            verify(videoService, times(1))
                    .createVideo(any(CreateVideoDTO.class));
        }

        @Test
        @DisplayName("Debe devolver HTTP 404 si el usuario no existe")
        void createVideo_UserNotFound_Returns404() throws Exception {
            CreateVideoDTO createDTO = new CreateVideoDTO(
                    "Títol",
                    "Descripció",
                    null,
                    List.of()
            );

            when(videoService.createVideo(any(CreateVideoDTO.class)))
                    .thenThrow(new UserNotFoundException("User not found"));

            mockMvc.perform(post("/api/videos/")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(createDTO)))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.title").value("User Not Found"))
                    .andExpect(jsonPath("$.detail").value("User not found"));

            verify(videoService, times(1))
                    .createVideo(any(CreateVideoDTO.class));
        }
    }

    // =========================================================================
    // PUT /api/videos/{id}
    // =========================================================================
    @Nested
    @DisplayName("Tests para PUT /api/videos/{id}")
    class EditVideoEndpointTests {

        @Test
        @DisplayName("Debe devolver HTTP 200 y editar el vídeo correctamente")
        void editVideo_Success() throws Exception {
            EditVideoDTO editDTO = new EditVideoDTO(
                    "Nou Títol",
                    "Nova Descripció"
            );

            VideoInfoDTO expectedInfo = mock(VideoInfoDTO.class);

            when(videoService.editVideo(eq(videoId), any(EditVideoDTO.class)))
                    .thenReturn(expectedInfo);

            mockMvc.perform(put("/api/videos/{id}", videoId)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(editDTO)))
                    .andExpect(status().isOk());

            verify(videoService, times(1))
                    .editVideo(eq(videoId), any(EditVideoDTO.class));
        }

        @Test
        @DisplayName("Debe devolver HTTP 404 cuando el vídeo no existe")
        void editVideo_NotFound_Returns404() throws Exception {
            EditVideoDTO editDTO = new EditVideoDTO(
                    "Títol",
                    "Descripció"
            );

            when(videoService.editVideo(eq(videoId), any(EditVideoDTO.class)))
                    .thenThrow(new VideoNotFoundException("Video not found"));

            mockMvc.perform(put("/api/videos/{id}", videoId)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(editDTO)))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.title").value("Video Not Found"))
                    .andExpect(jsonPath("$.detail").value("Video not found"));

            verify(videoService, times(1))
                    .editVideo(eq(videoId), any(EditVideoDTO.class));
        }
    }

    // =========================================================================
    // GET /api/videos/search/{name}
    // =========================================================================
    @Nested
    @DisplayName("Tests para GET /api/videos/search/{name}")
    class SearchVideoEndpointTests {

        @Test
        @DisplayName("Debe devolver HTTP 200 y la lista de vídeos cuando hay coincidencias")
        void searchVideo_WithMatches_Success() throws Exception {
            String searchName = "Tutorial";
            VideoUserDTO authorDto = new VideoUserDTO("pic_fid_1", username, "John Doe");
            VideoInfoDTO videoDto = new VideoInfoDTO(
                    videoId,
                    "vid_fid_1",
                    "thumb_fid_1",
                    "Tutorial de Spring Boot",
                    "Descripción de prueba",
                    LocalDateTime.now(),
                    authorDto,
                    List.of(1L),
                    Collections.emptyList(),
                    15L,
                    120L
            );

            when(videoService.searchVideo(searchName)).thenReturn(List.of(videoDto));

            mockMvc.perform(get("/api/videos/search/{name}", searchName)
                            .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$.length()").value(1))
                    .andExpect(jsonPath("$[0].videoId").value(videoId.toString()))
                    .andExpect(jsonPath("$[0].title").value("Tutorial de Spring Boot"))
                    .andExpect(jsonPath("$[0].author.userName").value(username));

            verify(videoService, times(1)).searchVideo(searchName);
        }

        @Test
        @DisplayName("Debe devolver HTTP 200 y una lista vacía cuando no hay coincidencias")
        void searchVideo_EmptyResult_Success() throws Exception {
            String name = "VideoInexistente";

            when(videoService.searchVideo(name))
                    .thenReturn(List.of());

            mockMvc.perform(get("/api/videos/search/{name}", name))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(0));

            verify(videoService, times(1)).searchVideo(name);
        }
    }

    // =========================================================================
    // ENDPOINT: POST /api/videos/{id}/comments
    // =========================================================================
    @Nested
    @DisplayName("Tests para POST /api/videos/{id}/comments")
    class CommentVideoEndpointTests {

        @Test
        @DisplayName("Debe devolver HTTP 200 y true al añadir un comentario")
        void commentVideo_Success() throws Exception {
            String comment = "Excelente vídeo";

            when(videoService.commentVideo(username, videoId, comment))
                    .thenReturn(true);

            mockMvc.perform(post("/api/videos/{id}/comments", videoId)
                            .param("userName", username)
                            .contentType(MediaType.TEXT_PLAIN)
                            .content(comment))
                    .andExpect(status().isOk())
                    .andExpect(content().string("true"));

            verify(videoService, times(1))
                    .commentVideo(username, videoId, comment);
        }

        @Test
        @DisplayName("Debe devolver HTTP 404 cuando el vídeo no existe")
        void commentVideo_VideoNotFound_Returns404() throws Exception {
            String comment = "Comentario de prueba";

            when(videoService.commentVideo(username, videoId, comment))
                    .thenThrow(new VideoNotFoundException("Video not found"));

            mockMvc.perform(post("/api/videos/{id}/comments", videoId)
                            .param("userName", username)
                            .contentType(MediaType.TEXT_PLAIN)
                            .content(comment))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.title").value("Video Not Found"))
                    .andExpect(jsonPath("$.detail").value("Video not found"));

            verify(videoService, times(1))
                    .commentVideo(username, videoId, comment);
        }

        @Test
        @DisplayName("Debe devolver HTTP 404 cuando el usuario no existe")
        void commentVideo_UserNotFound_Returns404() throws Exception {
            String comment = "Comentario de prueba";

            when(videoService.commentVideo(username, videoId, comment))
                    .thenThrow(new UserNotFoundException("User not found"));

            mockMvc.perform(post("/api/videos/{id}/comments", videoId)
                            .param("userName", username)
                            .contentType(MediaType.TEXT_PLAIN)
                            .content(comment))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.title").value("User Not Found"))
                    .andExpect(jsonPath("$.detail").value("User not found"));

            verify(videoService, times(1))
                    .commentVideo(username, videoId, comment);
        }

        @Test
        @DisplayName("Debe devolver HTTP 400 si falta el nombre de usuario")
        void commentVideo_MissingUserName_BadRequest() throws Exception {
            String comment = "Comentario de prueba";

            mockMvc.perform(post("/api/videos/{id}/comments", videoId)
                            .contentType(MediaType.TEXT_PLAIN)
                            .content(comment))
                    .andExpect(status().isBadRequest());

            verify(videoService, never())
                    .commentVideo(any(), any(), any());
        }

        @Test
        @DisplayName("Debe lanzar VideoNotFoundException cuando el vídeo no existe")
        void commentVideo_VideoNotFound_AssertThrows() {
            String comment = "Comentario de prueba";

            when(videoService.commentVideo(username, videoId, comment))
                    .thenThrow(new VideoNotFoundException("Video not found"));

            assertThrows(
                    VideoNotFoundException.class,
                    () -> videoController.commentVideo(username, videoId, comment)
            );

            verify(videoService, times(1))
                    .commentVideo(username, videoId, comment);
        }
    }

    // =========================================================================
    // ENDPOINT: POST /api/videos/{id}/likes
    // =========================================================================
    @Nested
    @DisplayName("Tests para POST /api/videos/{id}/likes")
    class LikeVideoEndpointTests {

        @Test
        @DisplayName("Debe devolver HTTP 200 y true cuando el like es exitoso")
        void likeVideo_Success() throws Exception {
            when(videoService.likeVideo(username, videoId))
                    .thenReturn(true);

            mockMvc.perform(post("/api/videos/{id}/likes", videoId)
                            .param("userName", username))
                    .andExpect(status().isOk())
                    .andExpect(content().string("true"));

            verify(videoService, times(1))
                    .likeVideo(username, videoId);
        }

        @Test
        @DisplayName("Debe devolver HTTP 404 cuando el usuario no existe")
        void likeVideo_UserNotFound_Returns404() throws Exception {
            when(videoService.likeVideo(username, videoId))
                    .thenThrow(new UserNotFoundException("User not found"));

            mockMvc.perform(post("/api/videos/{id}/likes", videoId)
                            .param("userName", username))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.title").value("User Not Found"))
                    .andExpect(jsonPath("$.detail").value("User not found"))
                    .andExpect(jsonPath("$.timestamp").exists());

            verify(videoService, times(1))
                    .likeVideo(username, videoId);
        }

        @Test
        @DisplayName("Debe devolver HTTP 404 cuando el vídeo no existe")
        void likeVideo_VideoNotFound_Returns404() throws Exception {
            when(videoService.likeVideo(username, videoId))
                    .thenThrow(new VideoNotFoundException("Video not found"));

            mockMvc.perform(post("/api/videos/{id}/likes", videoId)
                            .param("userName", username))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.title").value("Video Not Found"))
                    .andExpect(jsonPath("$.detail").value("Video not found"));

            verify(videoService, times(1))
                    .likeVideo(username, videoId);
        }

        @Test
        @DisplayName("Debe devolver HTTP 400 si falta el nombre de usuario")
        void likeVideo_MissingUserName_BadRequest() throws Exception {
            mockMvc.perform(post("/api/videos/{id}/likes", videoId))
                    .andExpect(status().isBadRequest());

            verify(videoService, never())
                    .likeVideo(any(), any());
        }

        @Test
        @DisplayName("Debe lanzar UserNotFoundException cuando el usuario no existe")
        void likeVideo_UserNotFound_AssertThrows() {
            when(videoService.likeVideo(username, videoId))
                    .thenThrow(new UserNotFoundException("User not found"));

            assertThrows(
                    UserNotFoundException.class,
                    () -> videoController.likeVideo(username, videoId)
            );

            verify(videoService, times(1))
                    .likeVideo(username, videoId);
        }
    }
}