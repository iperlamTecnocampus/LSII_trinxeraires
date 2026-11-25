package com.tecnocampus.LS2.protube_back.controller;

import com.tecnocampus.LS2.protube_back.services.VideoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/comments")
public class CommentsController {

    private final VideoService videoService;

    public CommentsController(VideoService videoService) {
        this.videoService = videoService;
    }

    @Operation(
            summary = "Like a comment",
            description = "Registers a like from the authenticated user on a comment. Repeated likes do not create duplicates."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Like registered successfully (returns true)"),
            @ApiResponse(responseCode = "404", description = "User or comment not found", content = @Content)
    })
    @PostMapping("/{id}/likes")
    public ResponseEntity<Boolean> likeComment(
            @Parameter(description = "ID of the comment being liked", required = true)
            @PathVariable("id") Long commentId,
            @AuthenticationPrincipal OAuth2User principal) {
        return ResponseEntity.ok(videoService.likeComment(principal.getName(), commentId));
    }

    @Operation(
            summary = "Unlike a comment",
            description = "Removes the authenticated user's like from a comment. Returns true when the comment is no longer liked by the user."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Unlike processed successfully"),
            @ApiResponse(responseCode = "404", description = "User or comment not found", content = @Content)
    })
    @DeleteMapping("/{id}/likes")
    public ResponseEntity<Boolean> unlikeComment(
            @Parameter(description = "ID of the comment to unlike", required = true)
            @PathVariable("id") Long commentId,
            @AuthenticationPrincipal OAuth2User principal) {
        return ResponseEntity.ok(videoService.unlikeComment(principal.getName(), commentId));
    }
}
