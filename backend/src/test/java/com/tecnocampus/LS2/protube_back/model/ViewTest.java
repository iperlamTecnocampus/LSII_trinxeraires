package com.tecnocampus.LS2.protube_back.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;

class ViewTest {

    @Test
    void constructorSetsUserAndVideo() {
        User user = new User("alice", "alice@example.com");
        Video video = new Video("Title", "Description", user, java.util.Set.of());
        View view = new View(user, video);

        assertSame(user, view.getUser());
        assertSame(video, view.getVideo());
    }

    @Test
    void defaultConstructorLeavesUnsetFieldsNull() {
        View view = new View();

        assertNull(view.getId());
        assertNull(view.getTimestamp());
        assertNull(view.getUser());
        assertNull(view.getVideo());
    }

    @Test
    void onCreateDefaultsTimestamp() {
        View view = new View(null, null);

        view.onCreate();

        assertNotNull(view.getTimestamp());
    }

    @Test
    void onCreatePreservesExistingTimestamp() {
        View view = new View(null, null);
        LocalDateTime timestamp = LocalDateTime.of(2020, 1, 2, 3, 4);
        view.setTimestamp(timestamp);

        view.onCreate();

        assertSame(timestamp, view.getTimestamp());
    }

    @Test
    void settersUpdateViewFields() {
        View view = new View();
        LocalDateTime timestamp = LocalDateTime.of(2020, 1, 2, 3, 4);
        User user = new User("alice", "alice@example.com");
        Video video = new Video("Title", "Description", user, java.util.Set.of());

        view.setTimestamp(timestamp);
        view.setUser(user);
        view.setVideo(video);

        assertSame(timestamp, view.getTimestamp());
        assertSame(user, view.getUser());
        assertSame(video, view.getVideo());
    }
}
