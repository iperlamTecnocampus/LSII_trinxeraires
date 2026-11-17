package com.tecnocampus.LS2.protube_back.services.mappers;

import com.tecnocampus.LS2.protube_back.model.Category;
import com.tecnocampus.LS2.protube_back.model.Video;
import com.tecnocampus.LS2.protube_back.services.DTO.in.CreateVideoDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.out.VideoInfoDTO;

import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class VideoMapper {

    private final VideoUserMapper videoUserMapper;
    private final CommentMapper commentMapper;
    private final CategoryMapper categoryMapper;

    public VideoMapper(VideoUserMapper videoUserMapper, CommentMapper commentMapper, CategoryMapper categoryMapper) {
        this.videoUserMapper = videoUserMapper;
        this.commentMapper = commentMapper;
        this.categoryMapper = categoryMapper;
    }

    public VideoInfoDTO toDTO(Video video) {
        if (video == null) return null;

        return new VideoInfoDTO(
                video.getUuid(),
                video.getVideoFid(),
                video.getThumbnailFid(),
                video.getTitle(),
                video.getDescription(),
                video.getUploadedAt(),
                videoUserMapper.toDTO(video.getAuthor()),
                video.getCategories() != null ? video.getCategories().stream().map(categoryMapper::toDTO).toList() : Collections.emptyList(),
                video.getComments() != null ?
                        video.getComments().stream().map(commentMapper::toDTO).toList() : Collections.emptyList(),
                video.getLikes() != null ? (long) video.getLikes().size() : 0L,
                video.getViews() != null ? (long) video.getViews().size() : 0L
        );
    }

    public Video toEntity(CreateVideoDTO dto) {
        if (dto == null) return null;
        Video video = new Video();
        video.setTitle(dto.title());
        video.setDescription(dto.description());
        video.setAuthor(videoUserMapper.toEntity(dto.author()));
        return video;
    }
}