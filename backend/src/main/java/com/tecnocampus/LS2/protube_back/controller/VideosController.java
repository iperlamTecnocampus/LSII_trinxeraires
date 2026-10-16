package com.tecnocampus.LS2.protube_back.controller;

import com.tecnocampus.LS2.protube_back.services.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/videos")
public class VideosController {

    @Autowired
    VideoService videoService;

    @GetMapping("/getAllVideos")
    public ResponseEntity<List<UUID>> getVideos() {
        return ResponseEntity.ok().body(videoService.getVideos());

    }

    @GetMapping("/getVideoById/{id}")
    public ResponseEntity<UUID> getVideoById(@PathVariable UUID id) {
        return ResponseEntity.ok().body(videoService.getVideoById(id));
    }

    @GetMapping("/getVideoInfo/{id}")
    public ResponseEntity<?> getVideoInfo(@PathVariable UUID id) {
        return ResponseEntity.ok().body(videoService.getVideoInfo(id));
    }
}
