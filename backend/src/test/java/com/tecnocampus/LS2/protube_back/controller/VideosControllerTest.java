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

import java.util.List;
import java.util.UUID;

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

    @MockBean
    private VideoService videoService;

    private UUID videoId;

    @BeforeEach
    void setUp() {
        videoId = UUID.randomUUID();
    }

    // =========================================================================
    // ENDPOINT: GET /api/videos/getAllVideos
    // =========================================================================
    @Nested
    @DisplayName("Tests per a GET /api/videos/getAllVideos")
    class GetVideosEndpointTests {

        @Test
        @DisplayName("Deu retornar HTTP 200 i la llista de UUIDs de vídeos")
        void getVideos_Success() throws Exception {
            List<UUID> videos = List.of(videoId, UUID.randomUUID());
            when(videoService.getVideos()).thenReturn(videos);

            mockMvc.perform(get("/api/videos/getAllVideos"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(2))
                    .andExpect(jsonPath("$[0]").value(videoId.toString()));

            verify(videoService, times(1)).getVideos();
        }
    }

    // =========================================================================
    // ENDPOINT: GET /api/videos/getVideoById/{id}
    // =========================================================================
    @Nested
    @DisplayName("Tests per a GET /api/videos/getVideoById/{id}")
    class GetVideoByIdEndpointTests {

        @Test
        @DisplayName("Deu retornar HTTP 200 i el UUID del vídeo quan existeix")
        void getVideoById_Success() throws Exception {
            when(videoService.getVideoById(videoId)).thenReturn(videoId);

            mockMvc.perform(get("/api/videos/getVideoById/{id}", videoId))
                    .andExpect(status().isOk())
                    .andExpect(content().string("\"" + videoId.toString() + "\""));

            verify(videoService, times(1)).getVideoById(videoId);
        }

        @Test
        @DisplayName("Deu retornar HTTP 404 Not Found quan el vídeo no existeix")
        void getVideoById_NotFound_Returns404() throws Exception {
            when(videoService.getVideoById(videoId))
                    .thenThrow(new VideoNotFoundException("Video not found"));

            mockMvc.perform(get("/api/videos/getVideoById/{id}", videoId))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.title").value("Video Not Found"))
                    .andExpect(jsonPath("$.detail").value("Video not found"))
                    .andExpect(jsonPath("$.timestamp").exists());

            verify(videoService, times(1)).getVideoById(videoId);
        }
    }

    // =========================================================================
    // ENDPOINT: GET /api/videos/getVideoInfo/{id}
    // =========================================================================
    @Nested
    @DisplayName("Tests per a GET /api/videos/getVideoInfo/{id}")
    class GetVideoInfoEndpointTests {

        @Test
        @DisplayName("Deu retornar HTTP 200 i els detalls del vídeo")
        void getVideoInfo_Success() throws Exception {
            VideoInfoDTO infoDTO = mock(VideoInfoDTO.class);
            when(videoService.getVideoInfo(videoId)).thenReturn(infoDTO);

            mockMvc.perform(get("/api/videos/getVideoInfo/{id}", videoId))
                    .andExpect(status().isOk());

            verify(videoService, times(1)).getVideoInfo(videoId);
        }

        @Test
        @DisplayName("Deu retornar HTTP 404 Not Found quan el vídeo no existeix")
        void getVideoInfo_NotFound_Returns404() throws Exception {
            when(videoService.getVideoInfo(videoId))
                    .thenThrow(new VideoNotFoundException("Video not found"));

            mockMvc.perform(get("/api/videos/getVideoInfo/{id}", videoId))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.title").value("Video Not Found"))
                    .andExpect(jsonPath("$.detail").value("Video not found"));

            verify(videoService, times(1)).getVideoInfo(videoId);
        }
    }

    // =========================================================================
    // ENDPOINT: DELETE /api/videos/deleteVideoById/{id}
    // =========================================================================
    @Nested
    @DisplayName("Tests per a DELETE /api/videos/deleteVideoById/{id}")
    class DeleteVideoByIdEndpointTests {

        @Test
        @DisplayName("Deu retornar HTTP 204 No Content en eliminar un vídeo correctament")
        void deleteVideoById_Success() throws Exception {
            doNothing().when(videoService).deleteVideoById(videoId);

            mockMvc.perform(delete("/api/videos/deleteVideoById/{id}", videoId))
                    .andExpect(status().isNoContent());

            verify(videoService, times(1)).deleteVideoById(videoId);
        }

        @Test
        @DisplayName("Deu retornar HTTP 404 Not Found quan es tenta eliminar un vídeo inexistent")
        void deleteVideoById_NotFound_Returns404() throws Exception {
            doThrow(new VideoNotFoundException("Video not found"))
                    .when(videoService).deleteVideoById(videoId);

            mockMvc.perform(delete("/api/videos/deleteVideoById/{id}", videoId))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.title").value("Video Not Found"))
                    .andExpect(jsonPath("$.detail").value("Video not found"));

            verify(videoService, times(1)).deleteVideoById(videoId);
        }
    }

    // =========================================================================
    // ENDPOINT: POST /api/videos/createVideo
    // =========================================================================
    @Nested
    @DisplayName("Tests per a POST /api/videos/createVideo")
    class CreateVideoEndpointTests {

        @Test
        @DisplayName("Deu retornar HTTP 200 i crear el vídeo correctament")
        void createVideo_Success() throws Exception {
            CategoryDTO category = new CategoryDTO(1L, "Tecnologia");
            VideoUserDTO author = mock(VideoUserDTO.class);
            CreateVideoDTO createDTO = new CreateVideoDTO("Títol de prova", "Descripció de prova", author, List.of(category));
            VideoInfoDTO expectedInfo = mock(VideoInfoDTO.class);

            when(videoService.createVideo(any(CreateVideoDTO.class))).thenReturn(expectedInfo);

            mockMvc.perform(post("/api/videos/createVideo")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(createDTO)))
                    .andExpect(status().isOk());

            verify(videoService, times(1)).createVideo(any(CreateVideoDTO.class));
        }

        @Test
        @DisplayName("Deu retornar HTTP 404 Not Found si l'autor/usuari del vídeo no existeix")
        void createVideo_UserNotFound_Returns404() throws Exception {
            CreateVideoDTO createDTO = new CreateVideoDTO("Títol", "Descripció", null, List.of());

            when(videoService.createVideo(any(CreateVideoDTO.class)))
                    .thenThrow(new UserNotFoundException("User not found"));

            mockMvc.perform(post("/api/videos/createVideo")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(createDTO)))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.title").value("User Not Found"))
                    .andExpect(jsonPath("$.detail").value("User not found"));

            verify(videoService, times(1)).createVideo(any(CreateVideoDTO.class));
        }
    }

    // =========================================================================
    // ENDPOINT: PUT /api/videos/editVideo/{id}
    // =========================================================================
    @Nested
    @DisplayName("Tests per a PUT /api/videos/editVideo/{id}")
    class EditVideoEndpointTests {

        @Test
        @DisplayName("Deu retornar HTTP 200 i editar el vídeo correctament")
        void editVideo_Success() throws Exception {
            EditVideoDTO editDTO = new EditVideoDTO("Nou Títol", "Nova Descripció");
            VideoInfoDTO expectedInfo = mock(VideoInfoDTO.class);

            when(videoService.editVideo(eq(videoId), any(EditVideoDTO.class))).thenReturn(expectedInfo);

            mockMvc.perform(put("/api/videos/editVideo/{id}", videoId)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(editDTO)))
                    .andExpect(status().isOk());

            verify(videoService, times(1)).editVideo(eq(videoId), any(EditVideoDTO.class));
        }

        @Test
        @DisplayName("Deu retornar HTTP 404 Not Found quan es tenta editar un vídeo inexistent")
        void editVideo_NotFound_Returns404() throws Exception {
            EditVideoDTO editDTO = new EditVideoDTO("Títol", "Descripció");

            when(videoService.editVideo(eq(videoId), any(EditVideoDTO.class)))
                    .thenThrow(new VideoNotFoundException("Video not found"));

            mockMvc.perform(put("/api/videos/editVideo/{id}", videoId)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(editDTO)))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.title").value("Video Not Found"))
                    .andExpect(jsonPath("$.detail").value("Video not found"));

            verify(videoService, times(1)).editVideo(eq(videoId), any(EditVideoDTO.class));
        }
    }
}