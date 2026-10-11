package com.tecnocampus.LS2.protube_back.model;

import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;

class CommentTest {

    @Test
    void constructorSetsCommentUserAndVideo() throws Exception {
        User user = new User("alice", "alice@example.com");
        Video video = new Video("Title", "Description", user, java.util.Set.of());
        Comment comment = new Comment("Nice video", user, video);

        assertEquals("Nice video", fieldValue(comment, "comment"));
        assertSame(user, fieldValue(comment, "user"));
        assertSame(video, fieldValue(comment, "video"));
    }

    private Object fieldValue(Object target, String fieldName) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        return field.get(target);
    }
}
