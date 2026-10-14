package com.tecnocampus.LS2.protube_back.services.DTO.out;

public record CommentDTO(
        VideoUserDTO author,
        String comment,
        Long id

) {
}
