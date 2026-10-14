package com.tecnocampus.LS2.protube_back.services.DTO.out;

import java.time.LocalDateTime;
import java.util.Set;

public record VideoInfoDTO(
        String title,
        String description,
        LocalDateTime uploadedAt,
        VideoUserDTO author,
        Set<CommentDTO> comments,
        Long likes,
        Long views


) {
}
