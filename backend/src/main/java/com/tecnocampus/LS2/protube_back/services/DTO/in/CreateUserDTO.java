package com.tecnocampus.LS2.protube_back.services.DTO.in;

public record CreateUserDTO(
        String username,
        String displayName,
        String description,
        String email,
        String pictureFid
) {
}
