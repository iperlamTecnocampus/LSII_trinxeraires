package com.tecnocampus.LS2.protube_back.services.DTO.in;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record CreateVideoDTO(
        String title,
        String description,
        List<String> categories,
        @JsonProperty("videoFid") String videoFid,
        @JsonProperty("thumbnailFid") String thumbnailFid
) {
    public CreateVideoDTO(String title, String description, List<String> categories) {
        this(title, description, categories, null, null);
    }
}
