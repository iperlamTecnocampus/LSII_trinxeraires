package com.tecnocampus.LS2.protube_back.services.DTO.out;

import java.time.LocalDate;
import java.util.Set;

public record UserDTO(
        String pictureFid,
        String userName,
        String displayName,
        String description,
        String email,
        LocalDate joinDate,
        Set<UserDTO> subscribedTo,
        Long suscribers,
        Set<VideoInfoDTO> vi

) {
}
