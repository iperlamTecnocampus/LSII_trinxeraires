package com.tecnocampus.LS2.protube_back.controller;

import com.tecnocampus.LS2.protube_back.services.DTO.in.CreateVideoDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.in.EditVideoDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.out.VideoInfoDTO;
import com.tecnocampus.LS2.protube_back.services.VideoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/videos")
@Tag(name = "Videos", description = "Endpoints for uploading, retrieving, updating, and interacting with videos")
public class VideosController {

    private final VideoService videoService;

    public VideosController(VideoService videoService) {
        this.videoService = videoService;
    }

    @Operation(
            summary = "Get all videos",
            description = "Retrieves a list of all available videos on the platform with their full metadata."
    )
    @ApiResponse(responseCode = "200", description = "List of videos successfully retrieved")
    @GetMapping("/")
    public ResponseEntity<List<VideoInfoDTO>> getVideosInfo() {
        return ResponseEntity.ok().body(videoService.getVideos());
    }

    @Operation(
            summary = "Get video by ID",
            description = "Retrieves the details and metadata of a specific video by its unique UUID identifier."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Video successfully retrieved"),
            @ApiResponse(responseCode = "404", description = "Video not found", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<VideoInfoDTO> getVideoInfo(
            @Parameter(description = "Unique UUID of the video", example = "123e4567-e89b-12d3-a456-426614174000", required = true)
            @PathVariable UUID id) {
        return ResponseEntity.ok().body(videoService.getVideoInfo(id));
    }

    @Operation(
            summary = "Delete a video by ID",
            description = "Permanently deletes a video from the database using its unique UUID."
    )
    @ApiResponse(responseCode = "204", description = "Video successfully deleted", content = @Content)
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteVideoById(
            @Parameter(description = "Unique UUID of the video to delete", example = "123e4567-e89b-12d3-a456-426614174000", required = true)
            @PathVariable UUID id) {
        videoService.deleteVideoById(id);
    }

    @Operation(
            summary = "Create a new video",
            description = "Creates and saves a new video associated with an existing author username."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Video successfully created"),
            @ApiResponse(responseCode = "404", description = "Author user not found", content = @Content)
    })
    @PostMapping("/")
    public VideoInfoDTO createVideo(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Video creation data including author details", required = true)
            @RequestBody CreateVideoDTO dto) {
        return videoService.createVideo(dto);
    }

    @Operation(
            summary = "Edit video title and description",
            description = "Updates the title and/or description of an existing video. Null fields will keep their current values."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Video successfully updated"),
            @ApiResponse(responseCode = "404", description = "Video not found", content = @Content)
    })
    @PutMapping("/{id}")
    public VideoInfoDTO editVideo(
            @Parameter(description = "Unique UUID of the video to update", example = "123e4567-e89b-12d3-a456-426614174000", required = true)
            @PathVariable UUID id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Updated title and description for the video", required = true)
            @RequestBody EditVideoDTO dto) {
        return videoService.editVideo(id, dto);
    }

    @Operation(
            summary = "Search videos by name",
            description = "Finds and returns a list of videos matching the specified name query."
    )
    @ApiResponse(responseCode = "200", description = "Search results successfully retrieved")
    @GetMapping("/search/{name}")
    public ResponseEntity<List<VideoInfoDTO>> searchVideo(
            @Parameter(description = "Video title or keyword to search for", example = "gameplay", required = true)
            @PathVariable String name) {
        return ResponseEntity.ok().body(videoService.searchVideo(name));
    }

    @Operation(
            summary = "Add a comment to a video",
            description = "Posts a new text comment on a specific video by a registered user. Returns true if the comment was successfully saved."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Comment processed (returns true if saved)"),
            @ApiResponse(responseCode = "404", description = "User or Video not found", content = @Content)
    })
    @PostMapping("/{id}/comments")
    public ResponseEntity<Boolean> commentVideo(
            @Parameter(description = "Username of the user posting the comment", example = "johndoe", required = true)
            @RequestParam String userName,
            @Parameter(description = "Unique UUID of the video being commented on", example = "123e4567-e89b-12d3-a456-426614174000", required = true)
            @PathVariable("id") UUID videoId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Plain text content of the comment", required = true)
            @RequestBody String comment) {
        boolean isCommented = videoService.commentVideo(userName, videoId, comment);
        return ResponseEntity.ok(isCommented);
    }

    @Operation(
            summary = "Like a video",
            description = "Registers a like from a user on a specific video. Returns true if the user has liked the video."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Like registered successfully (returns true)"),
            @ApiResponse(responseCode = "404", description = "User or Video not found", content = @Content)
    })
    @PostMapping("/{id}/likes")
    public ResponseEntity<Boolean> likeVideo(
            @Parameter(description = "Username of the user liking the video", example = "johndoe", required = true)
            @RequestParam String userName,
            @Parameter(description = "Unique UUID of the liked video", example = "123e4567-e89b-12d3-a456-426614174000", required = true)
            @PathVariable("id") UUID videoId) {
        boolean liked = videoService.likeVideo(userName, videoId);
        return ResponseEntity.ok(liked);
    }
}