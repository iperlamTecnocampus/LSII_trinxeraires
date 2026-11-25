package com.tecnocampus.LS2.protube_back.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class VideoRelationsAndAccessorsTest {

    @Test
    void exposesAndUpdatesVideoPropertiesAndRelations() {
        Video video = new Video();
        User author = new User("alice", "alice@example.com");
        Category category = new Category("music", "Music");
        Comment comment = new Comment("Nice video", author, video);
        Like like = new Like(author, video);
        View view = new View(author, video);
        Set<Category> categories = new HashSet<>(Set.of(category));
        Set<Comment> comments = new HashSet<>(Set.of(comment));
        Set<Like> likes = new HashSet<>(Set.of(like));
        Set<View> views = new HashSet<>(Set.of(view));
        LocalDateTime uploadedAt = LocalDateTime.of(2026, 1, 2, 3, 4);

        video.setAuthor(author);
        video.setCategories(categories);
        video.setComments(comments);
        video.setDescription("A description");
        video.setLikes(likes);
        video.setThumbnailFid("thumbnail-1");
        video.setTitle("Title");
        video.setUploadedAt(uploadedAt);
        video.setVideoFid("video-1");
        video.setViews(views);

        assertSame(author, video.getAuthor());
        assertSame(categories, video.getCategories());
        assertSame(comments, video.getComments());
        assertEquals("A description", video.getDescription());
        assertSame(likes, video.getLikes());
        assertEquals("thumbnail-1", video.getThumbnailFid());
        assertEquals("Title", video.getTitle());
        assertSame(uploadedAt, video.getUploadedAt());
        assertEquals("video-1", video.getVideoFid());
        assertSame(views, video.getViews());
        assertNull(video.getUuid());

        video.setAuthor(null);
        video.setCategories(null);
        video.setComments(null);
        video.setLikes(null);
        video.setViews(null);

        assertNull(video.getAuthor());
        assertNull(video.getCategories());
        assertNull(video.getComments());
        assertNull(video.getLikes());
        assertNull(video.getViews());
    }

    @Test
    void keepsVideoAndLikeCommentRelationsInSync() {
        User author = new User("alice", "alice@example.com");
        Video video = new Video("Title", "Description", author);
        Comment comment = new Comment("Nice video", author, video);
        Like like = new Like(author, video);

        video.addComment(comment);
        video.addLike(like);

        assertTrue(video.getComments().contains(comment));
        assertTrue(video.getLikes().contains(like));
        assertSame(video, comment.getVideo());
        assertSame(video, like.getVideo());

        video.removeComment(comment);
        video.removeLike(like);

        assertFalse(video.getComments().contains(comment));
        assertFalse(video.getLikes().contains(like));
        assertNull(comment.getVideo());
        assertNull(like.getVideo());
    }

    @Test
    void likeAccessorsExposeUserAndVideo() {
        Like like = new Like();
        User user = new User("alice", "alice@example.com");
        Video video = new Video("Title", "Description", user);

        like.setUser(user);
        like.setVideo(video);

        assertNull(like.getId());
        assertSame(user, like.getUser());
        assertSame(video, like.getVideo());
    }

    @Test
    void overloadedVideoConstructorCreatesDefaultRelations() {
        Video video = new Video("Title", "Description", new User("alice", "alice@example.com"));

        assertEquals("Title", video.getTitle());
        assertEquals("Description", video.getDescription());
        assertNotNull(video.getCategories());
        assertNotNull(video.getComments());
        assertNotNull(video.getLikes());
        assertNotNull(video.getViews());
        assertTrue(video.getCategories().isEmpty());
        assertTrue(video.getComments().isEmpty());
        assertTrue(video.getLikes().isEmpty());
        assertTrue(video.getViews().isEmpty());
    }
}
