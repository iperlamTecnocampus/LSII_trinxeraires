package com.tecnocampus.LS2.protube_back.services;

import com.tecnocampus.LS2.protube_back.model.Category;
import com.tecnocampus.LS2.protube_back.model.Comment;
import com.tecnocampus.LS2.protube_back.model.User;
import com.tecnocampus.LS2.protube_back.model.Video;
import com.tecnocampus.LS2.protube_back.persistance.CategoryRepository;
import com.tecnocampus.LS2.protube_back.persistance.CommentRepository;
import com.tecnocampus.LS2.protube_back.persistance.UserRepository;
import com.tecnocampus.LS2.protube_back.persistance.VideoRepository;
import com.tecnocampus.LS2.protube_back.services.DTO.out.CategoryDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.in.CreateVideoDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.in.EditVideoDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.out.CommentDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.out.VideoInfoDTO;
import com.tecnocampus.LS2.protube_back.services.exceptions.CategoryNotFoundException;
import com.tecnocampus.LS2.protube_back.services.exceptions.UserNotFoundException;
import com.tecnocampus.LS2.protube_back.services.exceptions.VideoNotFoundException;
import com.tecnocampus.LS2.protube_back.services.mappers.CategoryMapper;
import com.tecnocampus.LS2.protube_back.services.mappers.CommentMapper;
import com.tecnocampus.LS2.protube_back.services.mappers.VideoMapper;
import com.tecnocampus.LS2.protube_back.services.mappers.VideoUserMapper;
import org.springframework.stereotype.Service;

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
    public List<VideoInfoDTO> getVideos() {
        return videoRepository.findAll().stream().map(video -> videoMapper.toDTO(video)).toList();
    }

    public void deleteVideoById(UUID id) {
        videoRepository.deleteById(id);
    }

    //fetch info video
    public VideoInfoDTO getVideoInfo(UUID id) {
        Video video = videoRepository.findById(id).orElseThrow(() -> new VideoNotFoundException("Video not found"));
        return videoMapper.toDTO(video);
    }

    public VideoInfoDTO createVideo(CreateVideoDTO dto) {
        Video video = videoMapper.toEntity(dto);

        Set<Category> categories = new HashSet<>();
        List<String> categoryIds = dto.categories();
        for (String cid : categoryIds) {
            categories.add(this.categoryRepository.findById(cid)
                    .orElseThrow(
                            () -> new CategoryNotFoundException("Category " + cid + " doesn't exist.")
                    ));
        }
        video.setCategories(categories);

        String authorName = dto.author() != null ? dto.author().userName() : null;
        User author = userRepository.findById(authorName != null ? authorName : "")
                .orElseThrow(() -> new UserNotFoundException("Author not found"));
        video.setAuthor(author);
        videoRepository.save(video);
        return videoMapper.toDTO(video);
    }

    //edit title and description
    public VideoInfoDTO editVideo(UUID id, EditVideoDTO dto) {
        Video video = videoRepository.findById(id).orElseThrow(() -> new VideoNotFoundException("Video not found"));
        video.setTitle(dto.title() != null ? dto.title() : video.getTitle());
        video.setDescription(dto.description() != null ? dto.description() : video.getDescription());
        videoRepository.save(video);
        return videoMapper.toDTO(video);
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

    public List<VideoInfoDTO> searchVideo(String name) {
        List<VideoInfoDTO> videos = videoRepository.findVideoByname(name).stream().map(video -> videoMapper.toDTO(video)).toList();
        System.out.println(videos);
        return videos;
    }

    public boolean likeVideo(String userName, UUID videoId) {
        User user = userRepository.findById(userName).orElseThrow(() -> new UserNotFoundException("User not found"));
        Video video = videoRepository.findById(videoId).orElseThrow(() -> new VideoNotFoundException("Video not found"));

        user.addLikedVideo(video);

        userRepository.save(user);
        videoRepository.save(video);
        return userRepository.hasLiked(userName, videoId);
    }
}
