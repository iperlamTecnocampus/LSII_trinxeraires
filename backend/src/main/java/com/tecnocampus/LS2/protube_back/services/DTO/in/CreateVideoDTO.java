package com.tecnocampus.LS2.protube_back.services.DTO.in;

import com.tecnocampus.LS2.protube_back.services.DTO.out.CategoryDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.out.VideoUserDTO;

import java.util.List;

public record CreateVideoDTO(
        String title,
        String description,
        VideoUserDTO author,
        List<String> categories
) {
}
