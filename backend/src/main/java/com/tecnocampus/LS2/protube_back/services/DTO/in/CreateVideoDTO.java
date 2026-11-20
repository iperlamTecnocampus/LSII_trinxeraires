package com.tecnocampus.LS2.protube_back.services.DTO.in;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.tecnocampus.LS2.protube_back.services.DTO.out.VideoUserDTO;

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

    /**
     * Compatibility constructor for existing Java callers. The supplied author is deliberately ignored;
     * the authenticated session is the only source of author identity.
     */
    @Deprecated
    public CreateVideoDTO(
            String title,
            String description,
            VideoUserDTO ignoredAuthor,
            List<String> categories
    ) {
        this(title, description, categories, null, null);
    }

    @Deprecated
    public CreateVideoDTO(
            String title,
            String description,
            VideoUserDTO ignoredAuthor,
            List<String> categories,
            String videoFid,
            String thumbnailFid
    ) {
        this(title, description, categories, videoFid, thumbnailFid);
    }
}
