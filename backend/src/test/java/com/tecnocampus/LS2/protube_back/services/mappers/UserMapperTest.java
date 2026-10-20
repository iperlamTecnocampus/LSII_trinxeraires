package com.tecnocampus.LS2.protube_back.services.mappers;

import com.tecnocampus.LS2.protube_back.model.User;
import com.tecnocampus.LS2.protube_back.services.DTO.out.UserDTO;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class UserMapperTest {

    private final VideoUserMapper videoUserMapper = new VideoUserMapper();
    private final CommentMapper commentMapper = new CommentMapper(videoUserMapper);
    private final CategoryMapper categoryMapper = new CategoryMapper();
    private final VideoMapper videoMapper = new VideoMapper(videoUserMapper, commentMapper, categoryMapper);
    private final UserMapper mapper = new UserMapper(videoMapper);

    @Test
    void toDtoMapsUserFieldsCorrectly() throws Exception {
        User user = new User("johndoe", "john@example.com");
        user.setDisplayName("John Doe");
        user.setDescription("Bio description");

        User subscribedUser = new User("channel1", "channel@example.com");
        user.setSubscribedTo(Set.of(subscribedUser));

        UserDTO dto = mapper.toDTO(user);

        assertNotNull(dto);
        assertEquals("johndoe", dto.userName());
        assertEquals("John Doe", dto.displayName());
        assertEquals("john@example.com", dto.email());
        assertEquals(1, dto.subscribedTo().size());
        assertEquals("channel1", dto.subscribedTo().get(0).userName());
    }

    @Test
    void toDtoBasicAvoidsInfiniteRecursion() throws Exception {
        User user = new User("johndoe", "john@example.com");

        UserDTO dto = mapper.toDTOBasic(user);

        assertNotNull(dto);
        assertEquals("johndoe", dto.userName());
        assertTrue(dto.subscribedTo().isEmpty());
        assertTrue(dto.video().isEmpty());
    }

    @Test
    void toDtoReturnsNullWhenUserIsNull() {
        assertNull(mapper.toDTO(null));
    }

}