package com.tecnocampus.LS2.protube_back.model;

import jakarta.persistence.*;

import javax.annotation.processing.Generated;
import java.time.LocalDateTime;

@Entity(name = "VideoView")
@Table(name = "video_views")
public class View {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "viewed_at", nullable = false, updatable = false)
    private LocalDateTime timestamp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_username")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "video_uuid", nullable = false)
    private Video video;

    public View() {

    }

    @PrePersist
    void onCreate() {
        if (timestamp == null) timestamp = LocalDateTime.now();
    }

    public View(User user, Video video) {
        this.user = user;
        this.video = video;
    }

    public Long getId() {
        return id;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
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
