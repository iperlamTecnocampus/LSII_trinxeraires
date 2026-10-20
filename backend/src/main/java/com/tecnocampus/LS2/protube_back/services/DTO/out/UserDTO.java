package com.tecnocampus.LS2.protube_back.services.DTO.out;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public record UserDTO(
        String pictureFid,
        String userName,
        String displayName,
        String description,
        String email,
        LocalDate joinDate,
        List<UserDTO> subscribedTo,
        Long suscribers,
        List<VideoInfoDTO> video

) {
}
