package com.tecnocampus.LS2.protube_back.model;

import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CategoryTest {

    @Test
    void constructorSetsIdAndNameAndInitializesVideos() throws Exception {
        Category category = new Category("music", "Music");

        assertEquals("music", fieldValue(category, "id"));
        assertEquals("Music", fieldValue(category, "name"));
        assertNotNull(fieldValue(category, "videos"));
        assertTrue(((Set<?>) fieldValue(category, "videos")).isEmpty());
    }

    private Object fieldValue(Object target, String fieldName) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        return field.get(target);
    }
}
