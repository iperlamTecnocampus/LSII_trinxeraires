package com.tecnocampus.LS2.protube_back.controller;

import com.tecnocampus.LS2.protube_back.services.CategoryService;
import com.tecnocampus.LS2.protube_back.services.DTO.out.CategoryDTO;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class CategoryControllerTest {

    @Test
    void returnsCategoriesFromService() {
        CategoryService service = mock(CategoryService.class);
        CategoryController controller = new CategoryController(service);
        List<CategoryDTO> categories = List.of(new CategoryDTO("music", "Music"));
        when(service.getAllCategories()).thenReturn(categories);

        ResponseEntity<List<CategoryDTO>> response = controller.getCategories();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(categories, response.getBody());
        verify(service).getAllCategories();
    }

    @Test
    void createsCategoryAndReturnsNoContent() {
        CategoryService service = mock(CategoryService.class);
        CategoryController controller = new CategoryController(service);
        CategoryDTO category = new CategoryDTO("music", "Music");

        ResponseEntity<?> response = controller.createCategory(category);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(service).createCategory(category);
    }
}
