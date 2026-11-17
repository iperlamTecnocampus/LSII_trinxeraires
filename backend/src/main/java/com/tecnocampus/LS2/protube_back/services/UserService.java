package com.tecnocampus.LS2.protube_back.services;

import com.tecnocampus.LS2.protube_back.model.User;
import com.tecnocampus.LS2.protube_back.persistence.CommentRepository;
import com.tecnocampus.LS2.protube_back.persistence.UserRepository;
import com.tecnocampus.LS2.protube_back.persistence.VideoRepository;
import com.tecnocampus.LS2.protube_back.services.DTO.in.EditUserDTO;
import com.tecnocampus.LS2.protube_back.services.exceptions.UserNotFoundException;
import com.tecnocampus.LS2.protube_back.services.DTO.in.CreateUserDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.out.UserDTO;
import com.tecnocampus.LS2.protube_back.services.exceptions.UserAlreadyExistsException;
import com.tecnocampus.LS2.protube_back.services.mappers.UserMapper;
import com.tecnocampus.LS2.protube_back.services.mappers.VideoMapper;
import com.tecnocampus.LS2.protube_back.services.mappers.VideoUserMapper;
import com.tecnocampus.LS2.protube_back.services.mappers.CommentMapper;
import com.tecnocampus.LS2.protube_back.services.mappers.CategoryMapper;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private UserRepository userRepository;
    private VideoRepository videoRepository;
    private CommentRepository commentRepository;
    private final UserMapper userMapper;
    public UserService(UserRepository userRepository, VideoRepository videoRepository, CommentRepository commentRepository) {
        this.userRepository = userRepository;
        this.videoRepository = videoRepository;
        this.commentRepository = commentRepository;
        VideoUserMapper videoUserMapper = new VideoUserMapper();
        VideoMapper videoMapper = new VideoMapper(videoUserMapper, new CommentMapper(videoUserMapper), new CategoryMapper());
        this.userMapper = new UserMapper(videoMapper);
    }

    public UserDTO createUser(CreateUserDTO dto) {
        if (dto == null || dto.username() == null || dto.username().isBlank() || dto.email() == null || dto.email().isBlank()) {
            throw new IllegalArgumentException("username and email are required");
        }
        if (userRepository.existsById(dto.username())) {
            throw new UserAlreadyExistsException("User already exists");
        }
        User saved = userRepository.save(userMapper.toEntity(dto));
        return userMapper.toDTOBasic(saved);
    }

    public UserDTO getUser(String username) {
        User user = userRepository.findById(username).orElseThrow(() -> new UserNotFoundException("User not found"));
        return userMapper.toDTOBasic(user);
    }
    
    //suscribe to a user
    public boolean subscribeToUser(String subscriberUsername, String subscribedUsername) {
        User subscriber = userRepository.findById(subscriberUsername).orElseThrow(() -> new UserNotFoundException("Subscriber user not found"));
        User subscribed = userRepository.findById(subscribedUsername).orElseThrow(() -> new UserNotFoundException("Subscribed user not found"));
        subscriber.addSubscription(subscribed);
        userRepository.save(subscriber);
        userRepository.save(subscribed);
        return userRepository.isSubscribed(subscriberUsername, subscribedUsername);
    }

    public UserDTO editUserProfile(String currentUsername, EditUserDTO dto) {
        User user = userRepository.findById(currentUsername)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Check if user is attempting to change their username (Primary Key)
        if (dto.username() != null && !dto.username().isBlank() && !dto.username().equals(currentUsername)) {
            throw new UnsupportedOperationException("Changing the username is not supported because it is a Primary Key. Please contact support or refactor the DB to use UUIDs as keys.");
        }

        // Apply updates if the fields are present in the request
        if (dto.displayName() != null) {
            user.setDisplayName(dto.displayName());
        }
        if (dto.description() != null) {
            user.setDescription(dto.description());
        }
        if (dto.pictureFid() != null) {
            user.setPictureFid(dto.pictureFid());
        }
        if (dto.bannerFid() != null) {
            user.setBannerFid(dto.bannerFid());
        }

        User updatedUser = userRepository.save(user);
        return userMapper.toDTOBasic(updatedUser);
    }

}
