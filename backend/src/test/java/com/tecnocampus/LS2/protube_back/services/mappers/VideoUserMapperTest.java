package com.tecnocampus.LS2.protube_back.services.mappers;

import com.tecnocampus.LS2.protube_back.model.User;
import com.tecnocampus.LS2.protube_back.services.DTO.out.VideoUserDTO;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

class VideoUserMapperTest {

    private final VideoUserMapper mapper = new VideoUserMapper();

    @Test
    void toDtoMapsUserFieldsCorrectly() throws Exception {
        User user = new User("johndoe", "john@example.com");
        user.setDisplayName("John Doe");
        user.setPictureFid("pic123");

        VideoUserDTO dto = mapper.toDTO(user);

        assertNotNull(dto);
        assertEquals("johndoe", dto.userName());
        assertEquals("John Doe", dto.displayName());
        assertEquals("pic123", dto.pictureFid());
    }

    @Test
    void toDtoReturnsNullWhenUserIsNull() {
        assertNull(mapper.toDTO(null));
    }

    @Test
    void toEntityMapsDtoFieldsToUserCorrectly() throws Exception {
        VideoUserDTO dto = new VideoUserDTO("pic123", "johndoe", "John Doe");

        User user = mapper.toEntity(dto);

        assertNotNull(user);
        assertEquals("johndoe", fieldValue(user, "username"));
        assertEquals("John Doe", fieldValue(user, "displayName"));
        assertEquals("pic123", fieldValue(user, "pictureFid"));
    }

    @Test
    void toEntityReturnsNullWhenDtoIsNull() {
        assertNull(mapper.toEntity(null));
    }

    private Object fieldValue(Object target, String fieldName) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        return field.get(target);
    }
}