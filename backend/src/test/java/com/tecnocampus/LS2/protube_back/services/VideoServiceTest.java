package com.tecnocampus.LS2.protube_back.services;

import com.tecnocampus.LS2.protube_back.model.User;
import com.tecnocampus.LS2.protube_back.model.Video;
import com.tecnocampus.LS2.protube_back.persistance.UserRepository;
import com.tecnocampus.LS2.protube_back.persistance.VideoRepository;
import com.tecnocampus.LS2.protube_back.services.DTO.in.EditVideoDTO;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VideoServiceTest {

    @Mock
    private VideoRepository repository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private VideoService videoService;

    @Nested
    @DisplayName("Pruebas para el método getVideos")
    class GetVideosTests {

        @Test
        @DisplayName("Debe retornar la lista de UUIDs de todos los vídeos")
        void getVideosSuccess() {
            // Arrange
            UUID id1 = UUID.randomUUID();
            UUID id2 = UUID.randomUUID();

            Video video1 = mock(Video.class);
            Video video2 = mock(Video.class);

            when(video1.getUuid()).thenReturn(id1);
            when(video2.getUuid()).thenReturn(id2);
            when(repository.findAll()).thenReturn(List.of(video1, video2));

            // Act
            List<UUID> result = videoService.getVideos();

            // Assert
            assertEquals(2, result.size());
            assertEquals(id1, result.get(0));
            assertEquals(id2, result.get(1));
            verify(repository, times(1)).findAll();
        }

        @Test
        @DisplayName("Debe retornar una lista vacía cuando no existen vídeos")
        void getVideosEmpty() {
            // Arrange
            when(repository.findAll()).thenReturn(List.of());

            // Act
            List<UUID> result = videoService.getVideos();

            // Assert
            assertNotNull(result);
            assertTrue(result.isEmpty());
            verify(repository, times(1)).findAll();
        }
    }

    @Nested
    @DisplayName("Pruebas para el método deleteVideoById")
    class DeleteVideoByIdTests {

        @Test
        @DisplayName("Debe llamar al método deleteById del repositorio")
        void deleteVideoByIdSuccess() {
            // Arrange
            UUID videoId = UUID.randomUUID();

            // Act
            videoService.deleteVideoById(videoId);

            // Assert
            verify(repository, times(1)).deleteById(videoId);
        }
    }

    @Nested
    @DisplayName("Pruebas para el método getVideoInfo")
    class GetVideoInfoTests {

        @Test
        @DisplayName("Debe lanzar excepción si el vídeo solicitado no existe")
        void getVideoInfoNotFound() {
            // Arrange
            UUID videoId = UUID.randomUUID();
            when(repository.findById(videoId)).thenReturn(Optional.empty());

            // Act & Assert
            RuntimeException exception = assertThrows(RuntimeException.class, () ->
                    videoService.getVideoInfo(videoId)
            );

            assertEquals("Video not found", exception.getMessage());
            verify(repository, times(1)).findById(videoId);
        }
    }

    @Nested
    @DisplayName("Pruebas para el método editVideo")
    class EditVideoTests {

        @Test
        @DisplayName("Debe actualizar título y descripción correctamente")
        void editVideoBothFields() {
            // Arrange
            UUID videoId = UUID.randomUUID();
            Video video = new Video();
            video.setTitle("Título Antiguo");
            video.setDescription("Descripción Antigua");

            EditVideoDTO dto = new EditVideoDTO("Nuevo Título", "Nueva Descripción");

            when(repository.findById(videoId)).thenReturn(Optional.of(video));
            when(repository.save(any(Video.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            videoService.editVideo(videoId, dto);

            // Assert
            assertEquals("Nuevo Título", video.getTitle());
            assertEquals("Nueva Descripción", video.getDescription());
            verify(repository, times(1)).save(video);
        }

        @Test
        @DisplayName("Debe mantener los valores previos si las propiedades del DTO son nulas")
        void editVideoKeepExistingValuesWhenNull() {
            // Arrange
            UUID videoId = UUID.randomUUID();
            Video video = new Video();
            video.setTitle("Título Antiguo");
            video.setDescription("Descripción Antigua");

            EditVideoDTO dto = new EditVideoDTO(null, null);

            when(repository.findById(videoId)).thenReturn(Optional.of(video));
            when(repository.save(any(Video.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            videoService.editVideo(videoId, dto);

            // Assert
            assertEquals("Título Antiguo", video.getTitle());
            assertEquals("Descripción Antigua", video.getDescription());
            verify(repository, times(1)).save(video);
        }

        @Test
        @DisplayName("Debe lanzar excepción si el vídeo a editar no existe")
        void editVideoNotFound() {
            // Arrange
            UUID videoId = UUID.randomUUID();
            EditVideoDTO dto = new EditVideoDTO("Título", "Descripción");

            when(repository.findById(videoId)).thenReturn(Optional.empty());

            // Act & Assert
            RuntimeException exception = assertThrows(RuntimeException.class, () ->
                    videoService.editVideo(videoId, dto)
            );

            assertEquals("Video not found", exception.getMessage());
            verify(repository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("Pruebas para el método likeVideo")
    class LikeVideoTests {

        @Test
        @DisplayName("Debe dar me gusta a un vídeo correctamente y guardar los cambios")
        void likeVideoSuccess() {
            // Arrange
            String username = "johndoe";
            UUID videoId = UUID.randomUUID();

            User user = new User(username, "john@example.com");
            Video video = new Video();
            when(userRepository.findById("johndoe")).thenReturn(Optional.of(user));
            when(repository.findById(videoId)).thenReturn(Optional.of(video));
            when(userRepository.hasLiked(username, videoId)).thenReturn(true);

            // Act
            boolean like = videoService.likeVideo(username, videoId);

            // Assert
            assertTrue(like);
            assertEquals(1, video.getLikes().size());

            verify(userRepository, times(1)).save(user);
            verify(repository, times(1)).save(video);
        }

        @Test
        @DisplayName("Debe lanzar excepción si el usuario no existe")
        void likeVideoUserNotFound() {
            // Arrange
            String username = "nonexistent";
            UUID videoId = UUID.randomUUID();

            when(userRepository.findById(username)).thenReturn(Optional.empty());

            // Act & Assert
            RuntimeException exception = assertThrows(RuntimeException.class, () ->
                    videoService.likeVideo(username, videoId)
            );

            assertEquals("User not found", exception.getMessage());
            verify(repository, never()).findById(any());
            verify(userRepository, never()).save(any());
            verify(repository, never()).save(any());
        }

        @Test
        @DisplayName("Debe lanzar excepción si el vídeo no existe")
        void likeVideoVideoNotFound() {
            // Arrange
            String username = "johndoe";
            UUID videoId = UUID.randomUUID();
            User user = new User(username, "john@example.com");

            when(userRepository.findById(username)).thenReturn(Optional.of(user));
            when(repository.findById(videoId)).thenReturn(Optional.empty());

            // Act & Assert
            RuntimeException exception = assertThrows(RuntimeException.class, () ->
                    videoService.likeVideo(username, videoId)
            );

            assertEquals("Video not found", exception.getMessage());
            verify(userRepository, never()).save(any());
            verify(repository, never()).save(any());
        }
    }
}