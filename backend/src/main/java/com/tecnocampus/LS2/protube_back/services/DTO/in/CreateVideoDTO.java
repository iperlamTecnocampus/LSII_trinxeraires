package com.tecnocampus.LS2.protube_back.services.DTO.in;

import com.tecnocampus.LS2.protube_back.services.DTO.out.VideoUserDTO;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public record CreateVideoDTO(
        String title,
        String description,
        UUID author,
        List<Long> categories
) {
}
