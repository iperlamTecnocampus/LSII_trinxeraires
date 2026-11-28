package com.tecnocampus.LS2.protube_back.services.DTO.out;

import java.util.List;

public record CommentDTO(
        VideoUserDTO author,
        String comment,
        Long id,
        Long likes,
        boolean likedByCurrentUser,
        List<CommentDTO> replies

) {
}
