package com.tecnocampus.LS2.protube_back.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tecnocampus.LS2.protube_back.configuration.SecurityConfig;
import com.tecnocampus.LS2.protube_back.controller.exceptionHandler.DomainExceptionHandler;
import com.tecnocampus.LS2.protube_back.services.ProTubeOAuth2UserService;
import com.tecnocampus.LS2.protube_back.services.VideoService;
import com.tecnocampus.LS2.protube_back.services.DTO.in.CreateVideoDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.in.EditVideoDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.out.VideoInfoDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(value = VideosController.class, properties = "pro_tube.frontend.url=http://localhost:5173")
@Import({SecurityConfig.class, DomainExceptionHandler.class})
class VideosControllerTest {
    private static final String SESSION_USERNAME = "session-user";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private VideoService videoService;

    @MockBean
    private ProTubeOAuth2UserService oauth2UserService;

    private UUID videoId;

    @BeforeEach
    void setUp() {
        videoId = UUID.randomUUID();
    }

    @Test
    void listingVideosIsPublic() throws Exception {
        when(videoService.getVideos(null)).thenReturn(List.of());

        mockMvc.perform(get("/api/videos/"))
                .andExpect(status().isOk());

        verify(videoService).getVideos(null);
    }

    @Test
    void videoInfoUsesAuthenticatedPrincipalWhenAvailable() throws Exception {
        when(videoService.getVideoInfo(videoId, SESSION_USERNAME)).thenReturn(
                new VideoInfoDTO(videoId, null, null, "Video", null, null, null,
                        List.of(), List.of(), 0L, 0L, true));

        mockMvc.perform(get("/api/videos/{id}", videoId)
                        .with(authentication(authenticatedUser(SESSION_USERNAME))))
                .andExpect(status().isOk());

        verify(videoService).getVideoInfo(videoId, SESSION_USERNAME);
    }

    @Test
    void creatingVideoRequiresAuthentication() throws Exception {
        mockMvc.perform(post("/api/videos/")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title":"Video","description":"Description","categories":[]}
                                """))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(videoService);
    }

    @Test
    void createdVideoUsesTheAuthenticatedPrincipalInsteadOfRequestAuthor() throws Exception {
        VideoInfoDTO result = new VideoInfoDTO(videoId, "video-fid", "thumbnail-fid",
                "Video", "Description", null, null, List.of(), List.of(), 0L, 0L, false);
        when(videoService.createVideo(any(CreateVideoDTO.class), eq(SESSION_USERNAME))).thenReturn(result);

        mockMvc.perform(post("/api/videos/")
                        .with(authentication(authenticatedUser(SESSION_USERNAME)))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title":"Video",
                                  "description":"Description",
                                  "author":{"userName":"forged-user"},
                                  "categories":[],
                                  "videoFid":"video-fid",
                                  "thumbnailFid":"thumbnail-fid"
                                }
                                """))
                .andExpect(status().isOk());

        verify(videoService).createVideo(any(CreateVideoDTO.class), eq(SESSION_USERNAME));
    }

    @Test
    void commentUsesAuthenticatedPrincipalAndIgnoresCallerSuppliedUsername() throws Exception {
        when(videoService.commentVideo(SESSION_USERNAME, videoId, "Nice video")).thenReturn(true);

        mockMvc.perform(post("/api/videos/{id}/comments", videoId)
                        .param("userName", "forged-user")
                        .with(authentication(authenticatedUser(SESSION_USERNAME)))
                        .with(csrf())
                        .contentType(MediaType.TEXT_PLAIN)
                        .content("Nice video"))
                .andExpect(status().isOk());

        verify(videoService).commentVideo(SESSION_USERNAME, videoId, "Nice video");
    }

       
    @Test
        void likedVideosUsesAuthenticatedPrincipal() throws Exception {
        when(videoService.getLikedVideos(SESSION_USERNAME)).thenReturn(List.of());

        mockMvc.perform(get("/api/videos/liked")
                        .with(authentication(authenticatedUser(SESSION_USERNAME))))
                .andExpect(status().isOk());

        verify(videoService).getLikedVideos(SESSION_USERNAME);
        }

    @Test
    void unlikeUsesAuthenticatedPrincipal() throws Exception {
        when(videoService.unlikeVideo(SESSION_USERNAME, videoId)).thenReturn(true);

        mockMvc.perform(delete("/api/videos/{id}/likes", videoId)
                        .with(authentication(authenticatedUser(SESSION_USERNAME)))
                        .with(csrf()))
                .andExpect(status().isOk());

        verify(videoService).unlikeVideo(SESSION_USERNAME, videoId);
    }

    @Test
    void editAndDeletePassTheAuthenticatedPrincipalToTheService() throws Exception {
        when(videoService.editVideo(eq(videoId), any(EditVideoDTO.class), eq(SESSION_USERNAME)))
                .thenReturn(new VideoInfoDTO(videoId, null, null, "Updated", null,
                        null, null, List.of(), List.of(), 0L, 0L, false));

        mockMvc.perform(put("/api/videos/{id}", videoId)
                        .with(authentication(authenticatedUser(SESSION_USERNAME)))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new EditVideoDTO("Updated", null))))
                .andExpect(status().isOk());

        mockMvc.perform(delete("/api/videos/{id}", videoId)
                        .with(authentication(authenticatedUser(SESSION_USERNAME)))
                        .with(csrf()))
                .andExpect(status().isNoContent());

        verify(videoService).editVideo(eq(videoId), any(EditVideoDTO.class), eq(SESSION_USERNAME));
        verify(videoService).deleteVideoById(videoId, SESSION_USERNAME);
    }

    private static OAuth2AuthenticationToken authenticatedUser(String username) {
        DefaultOAuth2User principal = new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority("ROLE_USER")),
                Map.of("username", username, "email", username + "@example.com"),
                "username"
        );
        return new OAuth2AuthenticationToken(principal, principal.getAuthorities(), "google");
    }
}
