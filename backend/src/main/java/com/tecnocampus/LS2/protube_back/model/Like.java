package com.tecnocampus.LS2.protube_back.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity(name = "VideoLike")
@Table(name = "video_likes",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_username", "video_uuid"}))
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_username", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "video_uuid", nullable = false)
    private Video video;

    public Like(User user, Video video) {
        this.user = user;
        this.video = video;
    }

    public Like() {

    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Video getVideo() {
        return video;
    }

    public void setVideo(Video video) {
        this.video = video;
    }
}
