package com.tecnocampus.LS2.protube_back.services.mappers;

import com.tecnocampus.LS2.protube_back.model.Category;
import com.tecnocampus.LS2.protube_back.services.DTO.in.CategoryDTO;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

class CategoryMapperTest {

    private final CategoryMapper mapper = new CategoryMapper();

    @Test
    void toDtoMapsCategoryFieldsCorrectly() {
        Category category = new Category(1L, "Music");

        CategoryDTO dto = mapper.toDTO(category);

        assertNotNull(dto);
        assertEquals(1L, dto.id());
        assertEquals("Music", dto.name());
    }

    @Test
    void toDtoReturnsNullWhenCategoryIsNull() {
        assertNull(mapper.toDTO(null));
    }

    @Test
    void toEntityMapsDtoFieldsToCategoryCorrectly() throws Exception {
        CategoryDTO dto = new CategoryDTO(1L, "Music");

        Category category = mapper.toEntity(dto);

        assertNotNull(category);
        assertEquals(1L, fieldValue(category, "id"));
        assertEquals("Music", fieldValue(category, "name"));
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