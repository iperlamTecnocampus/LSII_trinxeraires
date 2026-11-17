package com.tecnocampus.LS2.protube_back.services.DTO.out;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record VideoInfoDTO(
        UUID videoId,
        String videoFid,
        String thumbnailFid,
        String title,
        String description,

        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime uploadedAt,

        VideoUserDTO author,
        List<CategoryDTO> categories,
        List<CommentDTO> comments,
        Long likes,
        Long views


) {
}
