package com.tecnocampus.LS2.protube_back.services;

import com.tecnocampus.LS2.protube_back.model.Comment;
import com.tecnocampus.LS2.protube_back.model.User;
import com.tecnocampus.LS2.protube_back.model.Video;
import com.tecnocampus.LS2.protube_back.persistance.CommentRepository;
import com.tecnocampus.LS2.protube_back.persistance.UserRepository;
import com.tecnocampus.LS2.protube_back.persistance.VideoRepository;
import com.tecnocampus.LS2.protube_back.services.exceptions.UserNotFoundException;
import com.tecnocampus.LS2.protube_back.services.exceptions.VideoNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {
    private UserRepository userRepository;
    private VideoRepository videoRepository;
    private CommentRepository commentRepository;
    public UserService(UserRepository userRepository, VideoRepository videoRepository, CommentRepository commentRepository) {
        this.userRepository = userRepository;
        this.videoRepository = videoRepository;
        this.commentRepository = commentRepository;
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

}
