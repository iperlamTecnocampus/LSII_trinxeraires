package com.tecnocampus.LS2.protube_back.model;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2000)
    private String comment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_username", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "video_uuid", nullable = false)
    private Video video;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    private Comment parentComment;

    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Set<Comment> replies = new HashSet<>();

    @OneToMany(mappedBy = "comment", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Set<LikeComment> likes = new HashSet<>();

    public Comment(String comment, User user, Video video) {
        this.comment = comment;
        this.user = user;
        this.video = video;
    }

    public Comment() {

    }

    public Long getId() {
        return id;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Video getVideo() {
        return video;
    }

    public void setVideo(Video video) {
        this.video = video;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<LikeComment> getLikes() {
        return likes;
    }

    public void setLikes(Set<LikeComment> likes) {
        this.likes = likes;
    }

    public void addLike(LikeComment like) {
        this.likes.add(like);
        like.setComment(this);
    }

    public void removeLike(LikeComment like) {
        this.likes.remove(like);
        like.setComment(null);
    }

    public Comment getParentComment() {
        return parentComment;
    }

    public void setParentComment(Comment parentComment) {
        this.parentComment = parentComment;
    }

    public Set<Comment> getReplies() {
        return replies;
    }

    public void setReplies(Set<Comment> replies) {
        this.replies = replies;
    }

    public void addReply(Comment reply) {
        if (parentComment != null) {
            throw new IllegalArgumentException("Replies to replies are not allowed.");
        }
        this.replies.add(reply);
        reply.setParentComment(this);
    }

    public void removeReply(Comment reply) {
        this.replies.remove(reply);
        reply.setParentComment(null);
    }
}
