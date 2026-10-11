package com.tecnocampus.LS2.protube_back.model;

import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;

class ViewTest {

    @Test
    void constructorSetsUserAndVideo() throws Exception {
        User user = new User("alice", "alice@example.com");
        Video video = new Video("Title", "Description", user, java.util.Set.of());
        View view = new View(user, video);

        assertSame(user, fieldValue(view, "user"));
        assertSame(video, fieldValue(view, "video"));
    }

    @Test
    void onCreateDefaultsTimestamp() throws Exception {
        View view = new View(null, null);

        view.onCreate();

        assertNotNull(fieldValue(view, "timestamp"));
    }

    @Test
    void onCreatePreservesExistingTimestamp() throws Exception {
        View view = new View(null, null);
        LocalDateTime timestamp = LocalDateTime.of(2020, 1, 2, 3, 4);
        setFieldValue(view, "timestamp", timestamp);

        view.onCreate();

        assertSame(timestamp, fieldValue(view, "timestamp"));
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
