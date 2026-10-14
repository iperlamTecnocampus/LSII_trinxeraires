package com.tecnocampus.LS2.protube_back.services.mappers;

import com.tecnocampus.LS2.protube_back.model.User;
import com.tecnocampus.LS2.protube_back.services.DTO.out.VideoUserDTO;
import org.springframework.stereotype.Component;

@Component
public class VideoUserMapper {

    public VideoUserDTO toDTO(User user) {
        if (user == null) return null;

        return new VideoUserDTO(
                user.getPictureFid(),
                user.getUsername(),
                user.getDisplayName()
        );
    }

    public User toEntity(VideoUserDTO dto) {
        if (dto == null) return null;

        User user = new User();
        user.setUsername(dto.userName());
        user.setDisplayName(dto.displayName());
        user.setPictureFid(dto.pictureFid());
        return user;
    }
}