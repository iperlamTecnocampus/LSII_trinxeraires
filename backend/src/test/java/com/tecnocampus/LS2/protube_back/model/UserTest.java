package com.tecnocampus.LS2.protube_back.model;

import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;

class UserTest {

    @Test
    void constructorSetsUsernameAndEmailAndInitializesRelations() throws Exception {
        User user = new User("alice", "alice@example.com");

        assertEquals("alice", fieldValue(user, "username"));
        assertEquals("alice@example.com", fieldValue(user, "email"));
        assertEmptyRelation(user, "subscribedTo");
        assertEmptyRelation(user, "subscribers");
        assertEmptyRelation(user, "videos");
    }

    @Test
    void onCreateDefaultsJoinDateAndDisplayName() throws Exception {
        User user = new User("alice", "alice@example.com");

        user.onCreate();

        assertEquals(LocalDate.now(), fieldValue(user, "joinDate"));
        assertEquals("alice", fieldValue(user, "displayName"));
    }

    @Test
    void onCreatePreservesExistingJoinDateAndDisplayName() throws Exception {
        User user = new User("alice", "alice@example.com");
        LocalDate joinDate = LocalDate.of(2020, 1, 2);
        setFieldValue(user, "joinDate", joinDate);
        setFieldValue(user, "displayName", "Alice A.");

        user.onCreate();

        assertSame(joinDate, fieldValue(user, "joinDate"));
        assertEquals("Alice A.", fieldValue(user, "displayName"));
    }

    private void assertEmptyRelation(User user, String fieldName) throws Exception {
        Object value = fieldValue(user, fieldName);
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
