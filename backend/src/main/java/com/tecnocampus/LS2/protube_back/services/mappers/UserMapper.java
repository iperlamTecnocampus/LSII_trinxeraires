package com.tecnocampus.LS2.protube_back.services.mappers;

import com.tecnocampus.LS2.protube_back.model.User;
import com.tecnocampus.LS2.protube_back.services.DTO.out.UserDTO;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class UserMapper {

    private final VideoMapper videoMapper;

    public UserMapper(VideoMapper videoMapper) {
        this.videoMapper = videoMapper;
    }

    public UserDTO toDTO(User user) {
        if (user == null) return null;

        return new UserDTO(
                user.getPictureFid(),
                user.getUsername(),
                user.getDisplayName(),
                user.getDescription(),
                user.getEmail(),
                user.getJoinDate(),
                user.getSubscribedTo() != null ?
                        user.getSubscribedTo().stream().map(this::toDTOBasic).toList() : Collections.emptyList(),
                user.getSubscribers() != null ? (long) user.getSubscribers().size() : 0L,
                user.getVideos() != null ?
                        user.getVideos().stream().map(videoMapper::toDTO).toList() : Collections.emptyList()
        );
    }

    // Mapeo básico sin colecciones anidadas para romper ciclos de recursividad en 'subscribedTo'
    public UserDTO toDTOBasic(User user) {
        if (user == null) return null;

        return new UserDTO(
                user.getPictureFid(),
                user.getUsername(),
                user.getDisplayName(),
                user.getDescription(),
                user.getEmail(),
                user.getJoinDate(),
                Collections.emptyList(),
                user.getSubscribers() != null ? (long) user.getSubscribers().size() : 0L,
                Collections.emptyList()
        );
    }
}