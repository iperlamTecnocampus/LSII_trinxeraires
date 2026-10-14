package com.tecnocampus.LS2.protube_back.services.mappers;

import com.tecnocampus.LS2.protube_back.model.Comment;
import com.tecnocampus.LS2.protube_back.model.User;
import com.tecnocampus.LS2.protube_back.model.Video;
import com.tecnocampus.LS2.protube_back.services.DTO.out.CommentDTO;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

class CommentMapperTest {

    private final VideoUserMapper videoUserMapper = new VideoUserMapper();
    private final CommentMapper mapper = new CommentMapper(videoUserMapper);

    @Test
    void toDtoMapsCommentFieldsCorrectly() throws Exception {
        User user = new User("johndoe", "john@example.com");
        user.setDisplayName("John Doe");
        user.setPictureFid("pic123");
        Video video = new Video();
        Comment comment = new Comment("Great video!", user, video);

        CommentDTO dto = mapper.toDTO(comment);

        assertNotNull(dto);
        assertEquals("Great video!", dto.comment());
        assertNotNull(dto.author());
        assertEquals("johndoe", dto.author().userName());
    }

    @Test
    void toDtoReturnsNullWhenCommentIsNull() {
        assertNull(mapper.toDTO(null));
    }

    @Test
    void toEntityCreatesCommentCorrectly() throws Exception {
        User user = new User("johndoe", "john@example.com");
        Video video = new Video();

        Comment comment = mapper.toEntity("Great video!", user, video);

        assertNotNull(comment);
        assertEquals("Great video!", fieldValue(comment, "comment"));
        assertEquals(user, fieldValue(comment, "user"));
        assertEquals(video, fieldValue(comment, "video"));
    }

    private Object fieldValue(Object target, String fieldName) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        return field.get(target);
    }
}