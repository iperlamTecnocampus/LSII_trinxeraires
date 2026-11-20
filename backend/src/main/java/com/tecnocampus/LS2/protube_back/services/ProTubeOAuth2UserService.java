package com.tecnocampus.LS2.protube_back.services;

import com.tecnocampus.LS2.protube_back.model.User;
import com.tecnocampus.LS2.protube_back.persistence.UserRepository;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HexFormat;
import java.util.Locale;
import java.util.Map;

@Service
public class ProTubeOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    private static final int MAX_USERNAME_LENGTH = 50;

    private final UserRepository userRepository;
    private final DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();

    public ProTubeOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User googleUser = delegate.loadUser(userRequest);
        Map<String, Object> attributes = new HashMap<>(googleUser.getAttributes());
        String email = stringAttribute(attributes, "email");
        String googleId = stringAttribute(attributes, "sub");

        if (email == null || email.isBlank() || googleId == null || googleId.isBlank()) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("invalid_user_info"),
                    "Google did not return the required email and subject claims."
            );
        }

        Object verified = attributes.get("email_verified");
        if (!Boolean.TRUE.equals(verified)) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("unverified_email"),
                    "A verified Google email address is required."
            );
        }

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseGet(() -> createUser(email, googleId, attributes));

        attributes.put("username", user.getUsername());
        return new DefaultOAuth2User(
                new ArrayList<>(googleUser.getAuthorities().isEmpty()
                        ? java.util.List.of(new SimpleGrantedAuthority("ROLE_USER"))
                        : googleUser.getAuthorities()),
                attributes,
                "username"
        );
    }

    private User createUser(String email, String googleId, Map<String, Object> attributes) {
        String username = uniqueUsername(email, googleId);
        User user = new User(username, email);
        String displayName = stringAttribute(attributes, "name");
        user.setDisplayName(displayName == null || displayName.isBlank() ? username : displayName);
        return userRepository.save(user);
    }

    private String uniqueUsername(String email, String googleId) {
        int at = email.indexOf('@');
        String localPart = at > 0 ? email.substring(0, at) : email;
        String base = localPart.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9._-]", "_");
        if (base.isBlank()) {
            base = "user";
        }

        String candidate = truncate(base, MAX_USERNAME_LENGTH);
        if (!userRepository.existsById(candidate)) {
            return candidate;
        }

        String suffix = "-" + stableSuffix(googleId);
        candidate = truncate(base, MAX_USERNAME_LENGTH - suffix.length()) + suffix;
        int collision = 2;
        while (userRepository.existsById(candidate)) {
            String numberedSuffix = suffix + "-" + collision++;
            candidate = truncate(base, MAX_USERNAME_LENGTH - numberedSuffix.length()) + numberedSuffix;
        }
        return candidate;
    }

    private static String stringAttribute(Map<String, Object> attributes, String key) {
        Object value = attributes.get(key);
        return value instanceof String string ? string : null;
    }

    private static String truncate(String value, int maxLength) {
        return value.substring(0, Math.min(value.length(), maxLength));
    }

    private static String stableSuffix(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest).substring(0, 10);
        } catch (NoSuchAlgorithmException exception) {
            throw new AuthenticationServiceException("SHA-256 is unavailable.", exception);
        }
    }
}
