package com.tecnocampus.LS2.protube_back.model;

import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CategoryTest {

    @Test
    void constructorSetsIdAndNameAndInitializesVideos() {
        Category category = new Category(111L, "Music");

        assertEquals(111L, category.getId());
        assertEquals("Music", category.getName());
        assertNotNull(category.getVideos());
        assertTrue(category.getVideos().isEmpty());
    }

    @Test
    void defaultConstructorInitializesVideos() {
        Category category = new Category();

        assertNotNull(category.getVideos());
        assertTrue(category.getVideos().isEmpty());
    }

    @Test
    void settersAndVideoOperationsUpdateCategory() {
        Category category = new Category();
        Video firstVideo = new Video();
        Video secondVideo = new Video();
        Set<Video> videos = new HashSet<>(Set.of(firstVideo));

        category.setName("Music");
        category.setVideos(videos);
        category.addVideo(secondVideo);
        category.removeVideo(firstVideo);

        assertEquals("Music", category.getName());
        assertSame(videos, category.getVideos());
        assertTrue(category.getVideos().contains(secondVideo));
        assertEquals(Set.of(secondVideo), category.getVideos());
    }
}
