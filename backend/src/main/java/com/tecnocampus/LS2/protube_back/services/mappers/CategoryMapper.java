package com.tecnocampus.LS2.protube_back.services.mappers;

import com.tecnocampus.LS2.protube_back.model.Category;
import com.tecnocampus.LS2.protube_back.services.DTO.in.CategoryDTO;

public class CategoryMapper {
    public CategoryDTO toDTO(Category category) {
        if(category == null) return null;
        return new CategoryDTO(category.getId(), category.getName());
    }

    public Category toEntity(CategoryDTO categoryDTO) {
        if(categoryDTO == null) return null;
        return new Category(categoryDTO.id(), categoryDTO.name());
    }
}
