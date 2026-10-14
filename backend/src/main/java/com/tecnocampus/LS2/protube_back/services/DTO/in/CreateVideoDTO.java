package com.tecnocampus.LS2.protube_back.services.DTO.in;

import java.util.Set;

public record CreateVideoDTO(
        String title,
        String description,
        String author,
        Set<Long> categories
) {
}
