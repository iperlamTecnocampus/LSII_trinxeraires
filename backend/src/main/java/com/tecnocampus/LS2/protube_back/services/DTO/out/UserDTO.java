package com.tecnocampus.LS2.protube_back.services.DTO.out;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public record UserDTO(
        String pictureFid,
        String userName,
        String displayName,
        String description,
        String email,
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDate joinDate,
        List<UserDTO> subscribedTo,
        Long suscribers,
        List<VideoInfoDTO> video

) {
}
