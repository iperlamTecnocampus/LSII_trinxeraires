package com.tecnocampus.LS2.protube_back.services;

import com.tecnocampus.LS2.protube_back.model.Category;
import com.tecnocampus.LS2.protube_back.persistance.CategoryRepository;
import com.tecnocampus.LS2.protube_back.services.DTO.out.CategoryDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.out.VideoInfoDTO;
import com.tecnocampus.LS2.protube_back.services.exceptions.CategoryAlreadyExistsException;
import com.tecnocampus.LS2.protube_back.services.exceptions.CategoryNotFoundException;
import com.tecnocampus.LS2.protube_back.services.mappers.CategoryMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;

        this.categoryMapper = new CategoryMapper();
    }

    public Category createCategory(CategoryDTO dto) {
        String id = dto.id().toLowerCase();

        if (this.categoryRepository.existsById(id)) throw new CategoryAlreadyExistsException("Category " + dto.id() + " already exists.");

        Category cat = new Category(id, dto.name());

        this.categoryRepository.save(cat);

        return cat;
    }

    public List<CategoryDTO> getAllCategories() {
        return this.categoryRepository.findAll().stream().map(this.categoryMapper::toDTO).toList();
    }

    public CategoryDTO getCategoryById(String id) {
        return this.categoryMapper.toDTO(
                this.categoryRepository.findById(id).orElseThrow(() -> new CategoryNotFoundException("Category not found."))
        );
    }

}
