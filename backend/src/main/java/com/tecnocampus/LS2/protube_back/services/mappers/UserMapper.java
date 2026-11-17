package com.tecnocampus.LS2.protube_back.services.mappers;

import com.tecnocampus.LS2.protube_back.model.User;
import com.tecnocampus.LS2.protube_back.model.Video;
import com.tecnocampus.LS2.protube_back.services.DTO.in.CreateUserDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.out.UserDTO;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class UserMapper {

    private final VideoMapper videoMapper;

    public UserMapper(VideoMapper videoMapper) {
        this.videoMapper = videoMapper;
    }

    public UserDTO toDTO(User user) {
        if (user == null) return null;

        return toDTO(user, user.getVideos() == null ? Collections.emptyList() : List.copyOf(user.getVideos()),
                user.getSubscribedTo() == null ? Collections.emptyList() : List.copyOf(user.getSubscribedTo()));
    }

    public UserDTO toDTO(User user, List<Video> videos, List<User> subscriptions) {
        if (user == null) return null;

        return new UserDTO(
                user.getPictureFid(),
                user.getBannerFid(),
                user.getUsername(),
                user.getDisplayName(),
                user.getDescription(),
                user.getEmail(),
                user.getJoinDate(),
                subscriptions != null ? subscriptions.stream().map(this::toDTOBasic).toList() : Collections.emptyList(),
                user.getSubscribers() != null ? (long) user.getSubscribers().size() : 0L,
                videos != null ? videos.stream().map(videoMapper::toDTO).toList() : Collections.emptyList()
        );
    }

    // Mapeo básico sin colecciones anidadas para romper ciclos de recursividad en 'subscribedTo'
    public UserDTO toDTOBasic(User user) {
        if (user == null) return null;

        return new UserDTO(
                user.getPictureFid(),
                user.getBannerFid(),
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

    public User toEntity(CreateUserDTO dto) {
        if (dto == null) return null;
        User user = new User(dto.username(), dto.email());
        user.setDisplayName(dto.displayName());
        user.setDescription(dto.description());
        user.setPictureFid(dto.pictureFid());
        user.setBannerFid(dto.bannerFid());
        return user;
    }
}
