package com.tecnocampus.LS2.protube_back.controller;

import com.tecnocampus.LS2.protube_back.services.DTO.in.CreateVideoDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.in.EditVideoDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.out.VideoInfoDTO;
import com.tecnocampus.LS2.protube_back.services.VideoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/videos")
public class VideosController {

    private final VideoService videoService;

    public VideosController(VideoService videoService) {
        this.videoService = videoService;
    }
    @GetMapping("/")
    public ResponseEntity<List<UUID>> getVideos() {
        return ResponseEntity.ok().body(videoService.getVideos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VideoInfoDTO> getVideoInfo(@PathVariable UUID id) {
        return ResponseEntity.ok().body(videoService.getVideoInfo(id));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteVideoById(@PathVariable UUID id) {
        videoService.deleteVideoById(id);
    }

    @PostMapping("/")
    public VideoInfoDTO createVideo(@RequestBody CreateVideoDTO dto) {
        return videoService.createVideo(dto);
    }

    @PutMapping("/{id}")
    public VideoInfoDTO editVideo(@PathVariable UUID id, @RequestBody EditVideoDTO dto) {
        return videoService.editVideo(id, dto);
    }

    @GetMapping("/search/{name}")
    public List<VideoInfoDTO> searchVideo(@PathVariable String name) {
        return videoService.searchVideo(name);
    }
    
    //Comments
    @PostMapping("/{id}/comments")
    public ResponseEntity<Boolean> commentVideo(@RequestParam String userName, @PathVariable("id") UUID videoId, @RequestBody String comment) {
        boolean isCommented = videoService.commentVideo(userName, videoId, comment);
        return ResponseEntity.ok(isCommented);
    }


    //likes
    @PostMapping("/{id}/likes")
    public ResponseEntity<Boolean> likeVideo(@RequestParam String userName, @PathVariable("id") UUID videoId) {
        boolean liked = videoService.likeVideo(userName, videoId);
        return ResponseEntity.ok(liked);
    }
}
