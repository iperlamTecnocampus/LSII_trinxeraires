package com.tecnocampus.LS2.protube_back.controller;

import com.tecnocampus.LS2.protube_back.services.CategoryService;
import com.tecnocampus.LS2.protube_back.services.DTO.in.CreateVideoDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.out.CategoryDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.out.VideoInfoDTO;
import com.tecnocampus.LS2.protube_back.services.exceptions.CategoryAlreadyExistsException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@Tag(name = "Categories", description = "Endpoints for managing categories / tags")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @Operation(
            summary = "Get all categories"
    )
    @ApiResponse(responseCode = "200", description = "List of categories successfully retrieved")
    @GetMapping("/")
    public ResponseEntity<List<CategoryDTO>> getCategories() {
        return ResponseEntity.ok().body(this.categoryService.getAllCategories());
    }

    @Operation(
            summary = "Create a new category"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Category successfully created"),
            @ApiResponse(responseCode = "409", description = "Category already exists", content = @Content)
    })
    @PostMapping("/")
    public ResponseEntity createCategory(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Category creation data", required = true)
            @RequestBody CategoryDTO dto) {

        this.categoryService.createCategory(dto);

        return new ResponseEntity(HttpStatus.NO_CONTENT);

    }
}