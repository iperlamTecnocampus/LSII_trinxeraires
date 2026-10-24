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
    @GetMapping("/getAllVideos")
    public ResponseEntity<List<UUID>> getVideos() {
        return ResponseEntity.ok().body(videoService.getVideos());

    }
    
    @GetMapping("/getVideoInfo/{id}")
    public ResponseEntity<?> getVideoInfo(@PathVariable UUID id) {
        return ResponseEntity.ok().body(videoService.getVideoInfo(id));
    }

    @DeleteMapping("/deleteVideoById/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteVideoById(@PathVariable UUID id) {
        videoService.deleteVideoById(id);
    }

    @PostMapping("/createVideo")
    public VideoInfoDTO createVideo(@RequestBody CreateVideoDTO dto) {
        return videoService.createVideo(dto);
    }

    @PutMapping("/editVideo/{id}")
    public VideoInfoDTO editVideo(@PathVariable UUID id, @RequestBody EditVideoDTO dto) {
        return videoService.editVideo(id, dto);
    }

    @GetMapping("/searchVideo/{name}")
    public List<VideoInfoDTO> searchVideo(@PathVariable String name) {
        
    }
}
