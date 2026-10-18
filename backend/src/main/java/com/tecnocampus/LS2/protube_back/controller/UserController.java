package com.tecnocampus.LS2.protube_back.controller;

import com.tecnocampus.LS2.protube_back.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/likeVideo")
    public ResponseEntity<Boolean> likeVideo(@RequestParam String userName, @RequestParam UUID videoId) {
        boolean liked = userService.likeVideo(userName, videoId);
        return ResponseEntity.ok(liked);
    }

    @PostMapping("/commentVideo")
    public ResponseEntity<Boolean> commentVideo(@RequestParam String userName, @RequestParam UUID videoId, @RequestBody String comment) {
        boolean isCommented = userService.commentVideo(userName, videoId, comment);
        return ResponseEntity.ok(isCommented);
    }

    @PostMapping("/subscribe")
    public ResponseEntity<Boolean> subscribeToUser(@RequestParam String subscriberUsername, @RequestParam String subscribedUsername) {
        boolean isSub = userService.subscribeToUser(subscriberUsername, subscribedUsername);
        return ResponseEntity.ok(isSub);

    }
}