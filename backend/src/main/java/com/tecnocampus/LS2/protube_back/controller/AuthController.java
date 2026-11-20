package com.tecnocampus.LS2.protube_back.controller;

import com.tecnocampus.LS2.protube_back.services.DTO.out.UserDTO;
import com.tecnocampus.LS2.protube_back.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<CurrentUserDTO> currentUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserDTO user = userService.getUser(principal.getName());
        Object picture = principal.getAttribute("picture");
        return ResponseEntity.ok(new CurrentUserDTO(
                user.userName(),
                user.displayName(),
                user.email(),
                user.pictureFid(),
                picture instanceof String pictureUrl ? pictureUrl : null
        ));
    }

    @GetMapping("/csrf")
    public CsrfTokenDTO csrfToken(CsrfToken csrfToken) {
        return new CsrfTokenDTO(csrfToken.getToken(), csrfToken.getHeaderName(), csrfToken.getParameterName());
    }

    public record CurrentUserDTO(
            String userName,
            String displayName,
            String email,
            String pictureFid,
            String pictureUrl
    ) {
    }

    public record CsrfTokenDTO(String token, String headerName, String parameterName) {
    }
}
