package com.tecnocampus.LS2.protube_back.services;

import com.tecnocampus.LS2.protube_back.model.Comment;
import com.tecnocampus.LS2.protube_back.model.User;
import com.tecnocampus.LS2.protube_back.model.Video;
import com.tecnocampus.LS2.protube_back.persistance.UserRepository;
import com.tecnocampus.LS2.protube_back.persistance.VideoRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {
    private UserRepository userRepository;
    private VideoRepository videoRepository;

    public UserService(UserRepository userRepository, VideoRepository videoRepository) {
        this.userRepository = userRepository;
        this.videoRepository = videoRepository;
    }

    //like a video
    public void likeVideo(String userName, UUID videoId) {
        User user = userRepository.findById(userName).orElseThrow(() -> new RuntimeException("User not found"));
        Video video = videoRepository.findById(videoId).orElseThrow(() -> new RuntimeException("Video not found"));
        user.addLikedVideo(video);
        userRepository.save(user);
        videoRepository.save(video);

    }

    public void commentVideo(String userName, UUID videoId, String comment) {
        User user = userRepository.findById(userName).orElseThrow(() -> new RuntimeException("User not found"));
        Video video = videoRepository.findById(videoId).orElseThrow(() -> new RuntimeException("Video not found"));
        Comment newComment = new Comment(comment, user, video);
        video.addComment(newComment);

        videoRepository.save(video);
    }

    //suscribe to a user
    public void subscribeToUser(String subscriberUsername, String subscribedUsername) {
        User subscriber = userRepository.findById(subscriberUsername).orElseThrow(() -> new RuntimeException("Subscriber user not found"));
        User subscribed = userRepository.findById(subscribedUsername).orElseThrow(() -> new RuntimeException("Subscribed user not found"));
        subscriber.addSubscription(subscribed);
        userRepository.save(subscriber);
        userRepository.save(subscribed);
    }

}
