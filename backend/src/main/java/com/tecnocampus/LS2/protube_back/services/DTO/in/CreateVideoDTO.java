package com.tecnocampus.LS2.protube_back.services.DTO.in;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.tecnocampus.LS2.protube_back.services.DTO.out.CategoryDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.out.VideoUserDTO;

import java.util.List;

public record CreateVideoDTO(
        String title,
        String description,
        VideoUserDTO author,
        List<String> categories,
        @JsonProperty("videoFid") String videoFid,
        @JsonProperty("thumbnailFid") String thumbnailFid
) {
    public CreateVideoDTO(String title, String description, VideoUserDTO author, List<String> categories) {
        this(title, description, author, categories, null, null);
    }
}
