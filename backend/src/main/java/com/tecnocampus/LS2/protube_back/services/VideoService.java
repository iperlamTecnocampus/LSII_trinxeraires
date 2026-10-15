package com.tecnocampus.LS2.protube_back.services;

import com.tecnocampus.LS2.protube_back.model.Video;
import com.tecnocampus.LS2.protube_back.persistance.VideoRepository;
import com.tecnocampus.LS2.protube_back.services.DTO.in.CreateVideoDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.in.EditVideoDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.out.VideoInfoDTO;
import com.tecnocampus.LS2.protube_back.services.mappers.CategoryMapper;
import com.tecnocampus.LS2.protube_back.services.mappers.CommentMapper;
import com.tecnocampus.LS2.protube_back.services.mappers.VideoMapper;
import com.tecnocampus.LS2.protube_back.services.mappers.VideoUserMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class VideoService {

    private final VideoRepository repository;
    private final VideoMapper videoMapper;

    public VideoService(VideoRepository repository) {
        this.repository = repository;
        VideoUserMapper videoUserMapper = new VideoUserMapper();
        CommentMapper commentMapper = new CommentMapper(videoUserMapper);
        CategoryMapper categoryMapper = new CategoryMapper();
        this.videoMapper = new VideoMapper(videoUserMapper, commentMapper, categoryMapper);
    }
    public List<UUID> getVideos() {
        return repository.findAll().stream().map(video -> video.getUuid()).toList();
    }

    public UUID getVideoById(UUID id) {
        Video video = repository.findById(id).orElseThrow(() -> new RuntimeException("Video not found"));
        return video.getUuid();
    }

    public void deleteVideoById(UUID id) {
        repository.deleteById(id);
    }

    //fetch info video
    public VideoInfoDTO getVideoInfo(UUID id) {
        Video video = repository.findById(id).orElseThrow(() -> new RuntimeException("Video not found"));
        return videoMapper.toDTO(video);
    }

    public VideoInfoDTO creatreVideo(CreateVideoDTO dto) {
        Video video = videoMapper.toEntity(dto);
        repository.save(video);
        return videoMapper.toDTO(video);
    }

    //edit tittle and description
    public VideoInfoDTO editVideo(UUID id, EditVideoDTO dto) {
        Video video = repository.findById(id).orElseThrow(() -> new RuntimeException("Video not found"));
        video.setTitle(dto.title() != null ? dto.title() : video.getTitle());
        video.setDescription(dto.description() != null ? dto.description() : video.getDescription());
        repository.save(video);
        return videoMapper.toDTO(video);
    }


}
