package com.tecnocampus.LS2.protube_back.services.DTO.out;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public record VideoInfoDTO(
        UUID videoId,
        String videoFid,
        String thumbnailFid,
        String title,
        String description,
        LocalDateTime uploadedAt,
        VideoUserDTO author,
        List<Long> categories,
        List<CommentDTO> comments,
        Long likes,
        Long views


) {
}
