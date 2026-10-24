package com.tecnocampus.LS2.protube_back.services;

import com.tecnocampus.LS2.protube_back.model.Comment;
import com.tecnocampus.LS2.protube_back.model.User;
import com.tecnocampus.LS2.protube_back.model.Video;
import com.tecnocampus.LS2.protube_back.persistance.CommentRepository;
import com.tecnocampus.LS2.protube_back.persistance.UserRepository;
import com.tecnocampus.LS2.protube_back.persistance.VideoRepository;
import com.tecnocampus.LS2.protube_back.services.DTO.in.CreateVideoDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.in.EditVideoDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.out.CommentDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.out.VideoInfoDTO;
import com.tecnocampus.LS2.protube_back.services.exceptions.UserNotFoundException;
import com.tecnocampus.LS2.protube_back.services.exceptions.VideoNotFoundException;
import com.tecnocampus.LS2.protube_back.services.mappers.CategoryMapper;
import com.tecnocampus.LS2.protube_back.services.mappers.CommentMapper;
import com.tecnocampus.LS2.protube_back.services.mappers.VideoMapper;
import com.tecnocampus.LS2.protube_back.services.mappers.VideoUserMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class VideoService {

    private final VideoRepository videoRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    private final VideoMapper videoMapper;
    private final CommentMapper commentMapper;
    public VideoService(VideoRepository videoRepository, UserRepository userRepository, CommentRepository conmmentRepository) {
        this.videoRepository = videoRepository;
        this.userRepository = userRepository;
        this.commentRepository = conmmentRepository;
        VideoUserMapper videoUserMapper = new VideoUserMapper();
        commentMapper = new CommentMapper(videoUserMapper);
        CategoryMapper categoryMapper = new CategoryMapper();
        this.videoMapper = new VideoMapper(videoUserMapper, commentMapper, categoryMapper);

    }
    public List<UUID> getVideos() {
        return videoRepository.findAll().stream().map(video -> video.getUuid()).toList();
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
        return videoRepository.findVideoByname(name).stream().map(video -> videoMapper.toDTO(video)).toList();
    }
}
