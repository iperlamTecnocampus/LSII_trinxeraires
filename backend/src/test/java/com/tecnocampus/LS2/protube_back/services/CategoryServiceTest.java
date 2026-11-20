package com.tecnocampus.LS2.protube_back.services;

import com.tecnocampus.LS2.protube_back.model.Category;
import com.tecnocampus.LS2.protube_back.persistence.CategoryRepository;
import com.tecnocampus.LS2.protube_back.services.DTO.out.CategoryDTO;
import com.tecnocampus.LS2.protube_back.services.exceptions.CategoryAlreadyExistsException;
import com.tecnocampus.LS2.protube_back.services.exceptions.CategoryNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CategoryServiceTest {
    private CategoryRepository categoryRepository;
    private CategoryService categoryService;

    @BeforeEach
    void setUp() {
        categoryRepository = mock(CategoryRepository.class);
        categoryService = new CategoryService(categoryRepository);
    }

    @Test
    void createsCategoryWithNormalizedId() {
        when(categoryRepository.existsById("gaming")).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Category result = categoryService.createCategory(new CategoryDTO("Gaming", "Gaming"));

        assertEquals("gaming", result.getId());
        assertEquals("Gaming", result.getName());
        verify(categoryRepository).save(result);
    }

    @Test
    void rejectsDuplicateCategoryId() {
        when(categoryRepository.existsById("gaming")).thenReturn(true);

        assertThrows(CategoryAlreadyExistsException.class,
                () -> categoryService.createCategory(new CategoryDTO("Gaming", "Gaming")));
        verify(categoryRepository, never()).save(any());
    }

    @Test
    void returnsAllCategoriesAsDtos() {
        when(categoryRepository.findAll()).thenReturn(List.of(new Category("gaming", "Gaming")));

        List<CategoryDTO> categories = categoryService.getAllCategories();

        assertEquals(List.of(new CategoryDTO("gaming", "Gaming")), categories);
    }

    @Test
    void getsCategoryByIdAndThrowsWhenMissing() {
        when(categoryRepository.findById("gaming")).thenReturn(Optional.of(new Category("gaming", "Gaming")));
        when(categoryRepository.findById("missing")).thenReturn(Optional.empty());

        assertEquals(new CategoryDTO("gaming", "Gaming"), categoryService.getCategoryById("gaming"));
        assertThrows(CategoryNotFoundException.class, () -> categoryService.getCategoryById("missing"));
    }
}
