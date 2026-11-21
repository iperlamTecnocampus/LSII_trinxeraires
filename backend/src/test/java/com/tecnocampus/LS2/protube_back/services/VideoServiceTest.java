package com.tecnocampus.LS2.protube_back.services;

import com.tecnocampus.LS2.protube_back.model.User;
import com.tecnocampus.LS2.protube_back.model.Video;
import com.tecnocampus.LS2.protube_back.persistence.CommentRepository;
import com.tecnocampus.LS2.protube_back.persistence.CategoryRepository;
import com.tecnocampus.LS2.protube_back.persistence.UserRepository;
import com.tecnocampus.LS2.protube_back.persistence.VideoRepository;
import com.tecnocampus.LS2.protube_back.services.DTO.in.EditVideoDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.out.VideoInfoDTO;
import com.tecnocampus.LS2.protube_back.services.exceptions.VideoNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VideoServiceTest {

    @Mock
    private VideoRepository videoRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private CategoryRepository categoryRepository;

    private VideoService videoService;

    private UUID videoId;
    private String username;
    private User author;
    private Video sampleVideo;

    @BeforeEach
    void setUp() {
        videoService = new VideoService(videoRepository, userRepository, commentRepository, categoryRepository);
        videoId = UUID.randomUUID();
        username = "john_doe";

        author = new User(username, "john.doe@example.com");
        author.setDisplayName("John Doe");
        author.setPictureFid("pic_fid_1");

        sampleVideo = new Video("Tutorial de Java", "Descripción del tutorial", author);
        sampleVideo.setVideoFid("vid_fid_1");
        sampleVideo.setThumbnailFid("thumb_fid_1");
        sampleVideo.setUploadedAt(LocalDateTime.now());
        ReflectionTestUtils.setField(sampleVideo, "uuid", videoId);
    }

    // =========================================================================
    // METHOD: searchVideo
    // =========================================================================
    @Nested
    @DisplayName("Tests para searchVideo en VideoService")
    class SearchVideoServiceTests {

        @Test
        @DisplayName("Debe devolver una lista de VideoInfoDTO cuando existen vídeos que coinciden")
        void searchVideo_WhenMatchesExist_ReturnsDTOList() {
            String searchQuery = "Tutorial";

            when(videoRepository.findVideoByname(searchQuery)).thenReturn(List.of(sampleVideo));

            List<VideoInfoDTO> result = videoService.searchVideo(searchQuery);

            assertNotNull(result);
            assertEquals(1, result.size());
            assertEquals(videoId, result.get(0).videoId());
            assertEquals("Tutorial de Java", result.get(0).title());
            assertEquals("Descripción del tutorial", result.get(0).description());
            assertEquals(username, result.get(0).author().userName());

            verify(videoRepository, times(1)).findVideoByname(searchQuery);
        }

        @Test
        @DisplayName("Debe devolver una lista vacía cuando ningún vídeo coincide con la búsqueda")
        void searchVideo_WhenNoMatches_ReturnsEmptyList() {
            String searchQuery = "SinResultados";

            when(videoRepository.findVideoByname(searchQuery)).thenReturn(Collections.emptyList());

            List<VideoInfoDTO> result = videoService.searchVideo(searchQuery);

            assertNotNull(result);
            assertTrue(result.isEmpty());

            verify(videoRepository, times(1)).findVideoByname(searchQuery);
        }
    }

    // =========================================================================
    // METHOD: getVideos & getVideoInfo & deleteVideoById
    // =========================================================================
    @Nested
    @DisplayName("Tests para consulta y borrado de vídeos en VideoService")
    class GetAndDeleteVideoServiceTests {

        @Test
        @DisplayName("getVideos debe devolver todos los vídeos mapeados a DTO")
        void getVideos_ReturnsList() {
            when(videoRepository.findAll()).thenReturn(List.of(sampleVideo));

            List<VideoInfoDTO> result = videoService.getVideos();

            assertEquals(1, result.size());
            assertEquals(videoId, result.get(0).videoId());
            verify(videoRepository, times(1)).findAll();
        }

        @Test
        @DisplayName("getVideoInfo debe devolver el DTO si el vídeo existe")
        void getVideoInfo_Success() {
            when(videoRepository.findById(videoId)).thenReturn(Optional.of(sampleVideo));

            VideoInfoDTO result = videoService.getVideoInfo(videoId);

            assertNotNull(result);
            assertEquals(videoId, result.videoId());
            verify(videoRepository, times(1)).findById(videoId);
        }

        @Test
        @DisplayName("getVideoInfo debe lanzar VideoNotFoundException si no existe")
        void getVideoInfo_NotFound_ThrowsException() {
            when(videoRepository.findById(videoId)).thenReturn(Optional.empty());

            assertThrows(VideoNotFoundException.class, () -> videoService.getVideoInfo(videoId));
        }

        @Test
        @DisplayName("deleteVideoById debe llamar al repositorio")
        void deleteVideoById_Success() {
            when(videoRepository.findById(videoId)).thenReturn(Optional.of(sampleVideo));

            videoService.deleteVideoById(videoId, username);

            verify(videoRepository, times(1)).delete(sampleVideo);
        }
    }

    // =========================================================================
    // METHOD: editVideo & likeVideo
    // =========================================================================
    @Nested
    @DisplayName("Tests para editar y dar like en VideoService")
    class EditAndLikeVideoServiceTests {

        @Test
        @DisplayName("editVideo debe actualizar título y descripción")
        void editVideo_Success() {
            EditVideoDTO editDto = new EditVideoDTO("Nuevo Título", "Nueva Descripción");
            when(videoRepository.findById(videoId)).thenReturn(Optional.of(sampleVideo));
            when(videoRepository.save(any(Video.class))).thenReturn(sampleVideo);

            VideoInfoDTO result = videoService.editVideo(videoId, editDto, username);

            assertEquals("Nuevo Título", result.title());
            assertEquals("Nueva Descripción", result.description());
            verify(videoRepository, times(1)).save(sampleVideo);
        }

        @Test
        @DisplayName("edit and delete reject users who do not own the video")
        void modificationsRequireVideoOwnership() {
            when(videoRepository.findById(videoId)).thenReturn(Optional.of(sampleVideo));

            assertThrows(AccessDeniedException.class,
                    () -> videoService.editVideo(videoId, new EditVideoDTO("New", null), "another-user"));
            assertThrows(AccessDeniedException.class,
                    () -> videoService.deleteVideoById(videoId, "another-user"));

            verify(videoRepository, never()).save(any(Video.class));
            verify(videoRepository, never()).delete(any(Video.class));
        }

        @Test
        @DisplayName("likeVideo debe añadir el like y devolver true")
        void likeVideo_Success() {
            when(userRepository.findById(username)).thenReturn(Optional.of(author));
            when(videoRepository.findById(videoId)).thenReturn(Optional.of(sampleVideo));
            when(userRepository.hasLiked(username, videoId)).thenReturn(false, true);

            boolean liked = videoService.likeVideo(username, videoId);

            assertTrue(liked);
            verify(userRepository, times(1)).save(author);
            verify(videoRepository, times(1)).save(sampleVideo);
            verify(userRepository, times(2)).hasLiked(username, videoId);
        }

        @Test
        @DisplayName("likeVideo no debe guardar un like que ya existe")
        void likeVideo_AlreadyLiked() {
            when(userRepository.findById(username)).thenReturn(Optional.of(author));
            when(videoRepository.findById(videoId)).thenReturn(Optional.of(sampleVideo));
            when(userRepository.hasLiked(username, videoId)).thenReturn(true);

            boolean liked = videoService.likeVideo(username, videoId);

            assertTrue(liked);
            verify(userRepository, never()).save(any(User.class));
            verify(videoRepository, never()).save(any(Video.class));
        }
    }
}
