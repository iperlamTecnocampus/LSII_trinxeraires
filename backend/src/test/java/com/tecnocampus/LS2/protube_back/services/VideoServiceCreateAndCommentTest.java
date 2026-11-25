package com.tecnocampus.LS2.protube_back.services;

import com.tecnocampus.LS2.protube_back.model.Category;
import com.tecnocampus.LS2.protube_back.model.Comment;
import com.tecnocampus.LS2.protube_back.model.User;
import com.tecnocampus.LS2.protube_back.model.Video;
import com.tecnocampus.LS2.protube_back.persistence.CategoryRepository;
import com.tecnocampus.LS2.protube_back.persistence.CommentRepository;
import com.tecnocampus.LS2.protube_back.persistence.UserRepository;
import com.tecnocampus.LS2.protube_back.persistence.VideoRepository;
import com.tecnocampus.LS2.protube_back.services.DTO.in.CreateVideoDTO;
import com.tecnocampus.LS2.protube_back.services.exceptions.CategoryNotFoundException;
import com.tecnocampus.LS2.protube_back.services.exceptions.UserNotFoundException;
import com.tecnocampus.LS2.protube_back.services.exceptions.VideoNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class VideoServiceCreateAndCommentTest {
    private VideoRepository videos;
    private UserRepository users;
    private CommentRepository comments;
    private CategoryRepository categories;
    private VideoService service;
    private User author;
    private UUID videoId;

    @BeforeEach
    void setUp() {
        videos = mock(VideoRepository.class);
        users = mock(UserRepository.class);
        comments = mock(CommentRepository.class);
        categories = mock(CategoryRepository.class);
        service = new VideoService(videos, users, comments, categories);
        author = new User("alice", "alice@example.com");
        author.setDisplayName("Alice");
        videoId = UUID.randomUUID();
    }

    @Test
    void createsVideoWithOptionalMetadataAndResolvedCategories() {
        Category category = new Category("music", "Music");
        when(categories.findById("music")).thenReturn(Optional.of(category));
        when(users.findById("alice")).thenReturn(Optional.of(author));
        when(videos.save(any(Video.class))).thenAnswer(invocation -> {
            Video video = invocation.getArgument(0);
            ReflectionTestUtils.setField(video, "uuid", videoId);
            return video;
        });

        var result = service.createVideo(
                new CreateVideoDTO("Song", "Description", List.of("music"), "video-fid", "thumb-fid"),
                "alice"
        );

        assertEquals(videoId, result.videoId());
        assertEquals("Song", result.title());
        assertEquals("video-fid", result.videoFid());
        assertEquals("thumb-fid", result.thumbnailFid());
        assertEquals(List.of("music"), result.categories().stream().map(dto -> dto.id()).toList());
        verify(videos).save(argThat(video ->
                video.getAuthor() == author
                        && video.getCategories().contains(category)
        ));
    }

    @Test
    void createsVideoWithoutCategoriesWhenCategoryListIsNull() {
        when(users.findById("alice")).thenReturn(Optional.of(author));
        when(videos.save(any(Video.class))).thenAnswer(invocation -> {
            Video video = invocation.getArgument(0);
            ReflectionTestUtils.setField(video, "uuid", videoId);
            return video;
        });

        var result = service.createVideo(new CreateVideoDTO("Song", "Description", null), "alice");

        assertTrue(result.categories().isEmpty());
        verifyNoInteractions(categories);
    }

    @Test
    void rejectsUnknownCategoryOrAuthorWhileCreatingVideo() {
        when(categories.findById("missing")).thenReturn(Optional.empty());
        assertThrows(CategoryNotFoundException.class,
                () -> service.createVideo(new CreateVideoDTO("Song", "Description", List.of("missing")), "alice"));

        when(users.findById("alice")).thenReturn(Optional.empty());
        assertThrows(UserNotFoundException.class,
                () -> service.createVideo(new CreateVideoDTO("Song", "Description", null), "alice"));
        verify(videos, never()).save(any(Video.class));
    }

    @Test
    void savesCommentAndReturnsRepositoryExistenceResult() {
        Video video = new Video("Song", "Description", author);
        ReflectionTestUtils.setField(video, "uuid", videoId);
        when(users.findById("alice")).thenReturn(Optional.of(author));
        when(videos.findById(videoId)).thenReturn(Optional.of(video));
        when(comments.save(any(Comment.class))).thenAnswer(invocation -> {
            Comment saved = invocation.getArgument(0);
            ReflectionTestUtils.setField(saved, "id", 17L);
            return saved;
        });
        when(videos.existCommentByIdAndVideoId(17L, videoId)).thenReturn(true);

        assertTrue(service.commentVideo("alice", videoId, "Great!"));

        assertEquals(1, video.getComments().size());
        assertEquals("Great!", video.getComments().iterator().next().getComment());
        verify(videos).save(video);
        verify(comments).save(any(Comment.class));
    }

    @Test
    void commentRejectsMissingUserOrVideo() {
        when(users.findById("missing")).thenReturn(Optional.empty());
        assertThrows(UserNotFoundException.class,
                () -> service.commentVideo("missing", videoId, "Hello"));
        verifyNoInteractions(videos, comments);

        when(users.findById("alice")).thenReturn(Optional.of(author));
        when(videos.findById(videoId)).thenReturn(Optional.empty());
        assertThrows(VideoNotFoundException.class,
                () -> service.commentVideo("alice", videoId, "Hello"));
        verifyNoInteractions(comments);
    }
}
