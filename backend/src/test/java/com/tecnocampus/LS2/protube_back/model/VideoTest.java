package com.tecnocampus.LS2.protube_back.model;

import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;

class VideoTest {

    @Test
    void constructorSetsFieldsAndInitializesRelations() throws Exception {
        User author = new User("alice", "alice@example.com");
        Set<Category> categories = Set.of(new Category(111l, "Music"));
        Video video = new Video("Title", "Description", author, categories);

        assertEquals("Title", fieldValue(video, "title"));
        assertEquals("Description", fieldValue(video, "description"));
        assertSame(author, fieldValue(video, "author"));
        assertSame(categories, fieldValue(video, "categories"));
        assertEmptyRelation(video, "comments");
        assertEmptyRelation(video, "likes");
        assertEmptyRelation(video, "views");
    }

    @Test
    void onCreateDefaultsUploadedAt() throws Exception {
        Video video = new Video("Title", "Description", null, new HashSet<>());

        video.onCreate();

        assertNotNull(fieldValue(video, "uploadedAt"));
    }

    @Test
    void onCreatePreservesExistingUploadedAt() throws Exception {
        Video video = new Video("Title", "Description", null, new HashSet<>());
        LocalDateTime uploadedAt = LocalDateTime.of(2020, 1, 2, 3, 4);
        setFieldValue(video, "uploadedAt", uploadedAt);

        video.onCreate();

        assertSame(uploadedAt, fieldValue(video, "uploadedAt"));
    }

    private void assertEmptyRelation(Video video, String fieldName) throws Exception {
        Object value = fieldValue(video, fieldName);
        assertNotNull(value);
        assertTrue(((Set<?>) value).isEmpty());
    }

    private Object fieldValue(Object target, String fieldName) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        return field.get(target);
    }

    private void setFieldValue(Object target, String fieldName, Object value) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }
}
