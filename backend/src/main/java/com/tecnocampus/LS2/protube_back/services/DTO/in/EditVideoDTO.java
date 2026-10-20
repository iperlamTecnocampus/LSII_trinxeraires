package com.tecnocampus.LS2.protube_back.services.DTO.in;

import org.springframework.lang.Nullable;

public record EditVideoDTO(
        @Nullable
        String title,
        @Nullable
        String description
) {
}
