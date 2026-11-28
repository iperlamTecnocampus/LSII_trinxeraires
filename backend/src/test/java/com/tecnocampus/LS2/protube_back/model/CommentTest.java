package com.tecnocampus.LS2.protube_back.model;

import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CommentTest {

    @Test
    void constructorSetsCommentUserAndVideo() throws Exception {
        User user = new User("alice", "alice@example.com");
        Video video = new Video("Title", "Description", user, java.util.Set.of());
        Comment comment = new Comment("Nice video", user, video);

        assertEquals("Nice video", fieldValue(comment, "comment"));
        assertSame(user, fieldValue(comment, "user"));
        assertSame(video, fieldValue(comment, "video"));
        assertNotNull(comment.getLikes());
        assertTrue(comment.getLikes().isEmpty());
        assertNotNull(comment.getReplies());
        assertTrue(comment.getReplies().isEmpty());
        assertNull(comment.getParentComment());
    }

    @Test
    void addReplySetsItsParent() {
        User user = new User("alice", "alice@example.com");
        Video video = new Video("Title", "Description", user, java.util.Set.of());
        Comment parent = new Comment("Root", user, video);
        Comment reply = new Comment("Reply", user, video);

        parent.addReply(reply);

        assertTrue(parent.getReplies().contains(reply));
        assertSame(parent, reply.getParentComment());
        assertThrows(IllegalArgumentException.class, () -> reply.addReply(new Comment("Nested", user, video)));
    }

    private Object fieldValue(Object target, String fieldName) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        return field.get(target);
    }
}
