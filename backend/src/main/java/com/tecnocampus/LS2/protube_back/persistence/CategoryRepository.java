package com.tecnocampus.LS2.protube_back.persistence;

import com.tecnocampus.LS2.protube_back.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, String> {
}