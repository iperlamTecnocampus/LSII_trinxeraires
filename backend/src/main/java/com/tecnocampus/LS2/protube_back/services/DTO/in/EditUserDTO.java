package com.tecnocampus.LS2.protube_back.services.DTO.in;

public record EditUserDTO(
        String displayName,
        String description,
        String pictureFid,
        String bannerFid
) {
}
