package com.tecnocampus.LS2.protube_back.services;

import com.tecnocampus.LS2.protube_back.model.Category;
import com.tecnocampus.LS2.protube_back.model.Comment;
import com.tecnocampus.LS2.protube_back.model.User;
import com.tecnocampus.LS2.protube_back.model.Video;
import com.tecnocampus.LS2.protube_back.persistence.CategoryRepository;
import com.tecnocampus.LS2.protube_back.persistence.CommentRepository;
import com.tecnocampus.LS2.protube_back.persistence.UserRepository;
import com.tecnocampus.LS2.protube_back.persistence.VideoRepository;
import com.tecnocampus.LS2.protube_back.services.DTO.in.CreateVideoDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.in.EditVideoDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.out.CommentDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.out.VideoInfoDTO;
import com.tecnocampus.LS2.protube_back.services.exceptions.CategoryNotFoundException;
import com.tecnocampus.LS2.protube_back.services.exceptions.CommentNotFoundException;
import com.tecnocampus.LS2.protube_back.services.exceptions.UserNotFoundException;
import com.tecnocampus.LS2.protube_back.services.exceptions.VideoNotFoundException;
import com.tecnocampus.LS2.protube_back.services.mappers.CategoryMapper;
import com.tecnocampus.LS2.protube_back.services.mappers.CommentMapper;
import com.tecnocampus.LS2.protube_back.services.mappers.VideoMapper;
import com.tecnocampus.LS2.protube_back.services.mappers.VideoUserMapper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class VideoService {

    private final VideoRepository videoRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final CategoryRepository categoryRepository;

    private final VideoMapper videoMapper;
    private final CommentMapper commentMapper;
    public VideoService(VideoRepository videoRepository, UserRepository userRepository, CommentRepository commentRepository, CategoryRepository categoryRepository) {
        this.videoRepository = videoRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
        this.categoryRepository = categoryRepository;

        VideoUserMapper videoUserMapper = new VideoUserMapper();
        commentMapper = new CommentMapper(videoUserMapper);
        CategoryMapper categoryMapper = new CategoryMapper();
        this.videoMapper = new VideoMapper(videoUserMapper, commentMapper, categoryMapper);

    }
    public List<VideoInfoDTO> getVideos(String currentUsername) {
        return videoRepository.findAll().stream().map(video -> toDTO(video, currentUsername)).toList();
    }

    public void deleteVideoById(UUID id, String currentUsername) {
        Video video = videoRepository.findById(id).orElseThrow(() -> new VideoNotFoundException("Video not found"));
        ensureOwner(video, currentUsername);
        videoRepository.delete(video);
    }

    //fetch info video
    public VideoInfoDTO getVideoInfo(UUID id, String currentUsername) {
        Video video = videoRepository.findById(id).orElseThrow(() -> new VideoNotFoundException("Video not found"));
        return toDTO(video, currentUsername);
    }

    public VideoInfoDTO createVideo(CreateVideoDTO dto, String currentUsername) {
        Video video = videoMapper.toEntity(dto);

        Set<Category> categories = new HashSet<>();
        List<String> categoryIds = dto.categories() == null ? List.of() : dto.categories();
        for (String cid : categoryIds) {
            categories.add(this.categoryRepository.findById(cid)
                    .orElseThrow(
                            () -> new CategoryNotFoundException("Category " + cid + " doesn't exist.")
                    ));
        }
        video.setCategories(categories);

        User author = userRepository.findById(currentUsername)
                .orElseThrow(() -> new UserNotFoundException("Author not found"));
        video.setAuthor(author);
        videoRepository.save(video);
        return toDTO(video, currentUsername);
    }

    //edit title and description
    public VideoInfoDTO editVideo(UUID id, EditVideoDTO dto, String currentUsername) {
        Video video = videoRepository.findById(id).orElseThrow(() -> new VideoNotFoundException("Video not found"));
        ensureOwner(video, currentUsername);
        video.setTitle(dto.title() != null ? dto.title() : video.getTitle());
        video.setDescription(dto.description() != null ? dto.description() : video.getDescription());
        videoRepository.save(video);
        return toDTO(video, currentUsername);
    }


    public boolean commentVideo(String userName, UUID videoId, String comment) {
        User user = userRepository.findById(userName).orElseThrow(() -> new UserNotFoundException("User not found"));
        Video video = videoRepository.findById(videoId).orElseThrow(() -> new VideoNotFoundException("Video not found"));
        Comment newComment = new Comment(comment, user, video);
        video.addComment(newComment);

        videoRepository.save(video);
        Comment savedComment = commentRepository.save(newComment);
        return videoRepository.existCommentByIdAndVideoId(savedComment.getId(), video.getUuid());
    }

    public List<CommentDTO> getCommentsByVideoId(UUID videoId) {
        Video video = videoRepository.findById(videoId).orElseThrow(() -> new VideoNotFoundException("Video not found"));
        return video.getComments().stream().map(comment -> commentMapper.toDTO(comment)).toList();
    }

    public List<VideoInfoDTO> searchVideo(String name, String currentUsername) {
        List<VideoInfoDTO> videos = videoRepository.findVideoByname(name).stream()
                .map(video -> toDTO(video, currentUsername)).toList();
        System.out.println(videos);
        return videos;
    }

    public boolean likeVideo(String userName, UUID videoId) {
        User user = userRepository.findById(userName).orElseThrow(() -> new UserNotFoundException("User not found"));
        Video video = videoRepository.findById(videoId).orElseThrow(() -> new VideoNotFoundException("Video not found"));

        if (userRepository.hasLiked(userName, videoId)) {
            return true;
        }

        user.addLikedVideo(video);

        userRepository.save(user);
        videoRepository.save(video);
        return userRepository.hasLiked(userName, videoId);
    }

    @Transactional
    public boolean unlikeVideo(String userName, UUID videoId) {
        User user = userRepository.findById(userName).orElseThrow(() -> new UserNotFoundException("User not found"));
        Video video = videoRepository.findById(videoId).orElseThrow(() -> new VideoNotFoundException("Video not found"));

        if (userRepository.hasLiked(userName, videoId)) {
            user.removeLikedVideo(video);
            userRepository.save(user);
            videoRepository.save(video);
        }

        return !userRepository.hasLiked(userName, videoId);
    }

    public boolean likeComment(String userName, Long commentId) {
        User user = userRepository.findById(userName)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException("Comment not found"));

        if (userRepository.hasLikedComment(userName, commentId)) {
            return true;
        }

        user.addLikedComment(comment);
        userRepository.save(user);
        commentRepository.save(comment);
        return userRepository.hasLikedComment(userName, commentId);
    }

    @Transactional
    public boolean unlikeComment(String userName, Long commentId) {
        User user = userRepository.findById(userName)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException("Comment not found"));

        if (userRepository.hasLikedComment(userName, commentId)) {
            user.removeLikedComment(comment);
            userRepository.save(user);
            commentRepository.save(comment);
        }

        return !userRepository.hasLikedComment(userName, commentId);
    }

    private static void ensureOwner(Video video, String currentUsername) {
        if (video.getAuthor() == null || !video.getAuthor().getUsername().equals(currentUsername)) {
            throw new AccessDeniedException("Only the video owner can modify this video.");
        }
    }

    private VideoInfoDTO toDTO(Video video, String currentUsername) {
        boolean likedByCurrentUser = currentUsername != null
                && userRepository.hasLiked(currentUsername, video.getUuid());
        List<CommentDTO> comments = toCommentDTOs(video, currentUsername);
        return videoMapper.toDTO(video, likedByCurrentUser, comments);
    }

    private List<CommentDTO> toCommentDTOs(Video video, String currentUsername) {
        if (video.getComments() == null) {
            return List.of();
        }
        if (currentUsername == null) {
            return video.getComments().stream().map(commentMapper::toDTO).toList();
        }
        return video.getComments().stream()
                .map(comment -> commentMapper.toDTO(comment,
                        userRepository.hasLikedComment(currentUsername, comment.getId())))
                .toList();
    }
}
