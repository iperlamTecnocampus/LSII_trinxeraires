package com.tecnocampus.LS2.protube_back.controller;

import com.tecnocampus.LS2.protube_back.services.DTO.in.EditUserDTO;
import com.tecnocampus.LS2.protube_back.services.UserService;
import com.tecnocampus.LS2.protube_back.services.DTO.in.CreateUserDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.out.UserDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "Endpoints for user registration, profile retrieval, and channel subscriptions")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(
            summary = "Register a new user",
            description = "Creates a new user account. Both username and email are required and the username must be unique."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User successfully created"),
            @ApiResponse(responseCode = "400", description = "Missing required fields (username or email is blank)", content = @Content),
            @ApiResponse(responseCode = "409", description = "User with this username already exists", content = @Content)
    })
    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public UserDTO createUser(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "New user registration details", required = true)
            @RequestBody CreateUserDTO dto,
            @AuthenticationPrincipal OAuth2User principal) {
        if (!principal.getName().equals(dto.username())
                || !Objects.equals(principal.getAttribute("email"), dto.email())) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "An authenticated user can only register their own account."
            );
        }
        return userService.createUser(dto);
    }

    @Operation(
            summary = "Get user by username",
            description = "Retrieves the basic profile information of a registered user by their username."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User profile successfully retrieved"),
            @ApiResponse(responseCode = "404", description = "User not found", content = @Content)
    })
    @GetMapping("/{username}")
    public UserDTO getUser(
            @Parameter(description = "Unique username of the user", example = "johndoe", required = true)
            @PathVariable String username) {
        return userService.getUser(username);
    }

    @Operation(
            summary = "Subscribe to another user",
            description = "Adds a subscription from the subscriber user to the target user channel. Returns true if the subscription is active."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Subscription processed successfully (returns true if subscribed)"),
            @ApiResponse(responseCode = "404", description = "Subscriber or target subscribed user not found", content = @Content)
    })
    @PostMapping("/subscribe")
    public ResponseEntity<Boolean> subscribeToUser(
            @Parameter(description = "Username of the channel being subscribed to", example = "janedoe", required = true)
            @RequestParam String subscribedUsername,
            @AuthenticationPrincipal OAuth2User principal) {
        boolean isSub = userService.subscribeToUser(principal.getName(), subscribedUsername);
        return ResponseEntity.ok(isSub);
    }

    @Operation(
            summary = "Unsubscribe from another user",
            description = "Removes the subscription from the authenticated user to the target user channel."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Subscription removed successfully"),
            @ApiResponse(responseCode = "404", description = "Subscriber or target subscribed user not found", content = @Content)
    })
    @DeleteMapping("/subscribe")
    public ResponseEntity<Void> unsubscribeFromUser(
            @Parameter(description = "Username of the channel being unsubscribed from", example = "janedoe", required = true)
            @RequestParam String subscribedUsername,
            @AuthenticationPrincipal OAuth2User principal) {
        userService.unsubscribeFromUser(principal.getName(), subscribedUsername);
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Edit user profile",
            description = "Updates an existing user's profile information, such as display name, description, profile picture, and banner image. Note that the username itself cannot be modified."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User profile successfully updated"),
            @ApiResponse(responseCode = "400", description = "Unsupported operation (e.g., attempting to change the username)", content = @Content),
            @ApiResponse(responseCode = "404", description = "User not found", content = @Content)
    })
    @PutMapping("/me")
    public UserDTO editUserProfile(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Updated user profile details", required = true)
            @RequestBody EditUserDTO dto,
            @AuthenticationPrincipal OAuth2User principal) {
        return userService.editUserProfile(principal.getName(), dto);
    }
}
