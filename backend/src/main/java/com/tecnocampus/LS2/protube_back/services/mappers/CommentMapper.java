package com.tecnocampus.LS2.protube_back.services.mappers;

import com.tecnocampus.LS2.protube_back.model.Comment;
import com.tecnocampus.LS2.protube_back.model.User;
import com.tecnocampus.LS2.protube_back.model.Video;
import com.tecnocampus.LS2.protube_back.services.DTO.out.CommentDTO;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CommentMapper {

    private final VideoUserMapper videoUserMapper;

    public CommentMapper(VideoUserMapper videoUserMapper) {
        this.videoUserMapper = videoUserMapper;
    }

    public CommentDTO toDTO(Comment comment) {
        return toDTO(comment, false);
    }

    public CommentDTO toDTO(Comment comment, boolean likedByCurrentUser) {
        return toDTO(comment, likedByCurrentUser, List.of());
    }

    public CommentDTO toDTO(Comment comment, boolean likedByCurrentUser, List<CommentDTO> replies) {
        if (comment == null) return null;

        return new CommentDTO(
                videoUserMapper.toDTO(comment.getUser()),
                comment.getComment(),
                comment.getId(),
                comment.getLikes() != null ? (long) comment.getLikes().size() : 0L,
                likedByCurrentUser,
                replies == null ? List.of() : replies
        );
    }

    public Comment toEntity(String commentText, User user, Video video) {
        if (commentText == null && user == null && video == null) return null;

        Comment comment = new Comment();
        comment.setComment(commentText);
        comment.setUser(user);
        comment.setVideo(video);
        return comment;
    }
}
