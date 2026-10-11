package com.tecnocampus.LS2.protube_back.model;

import jakarta.persistence.*;

@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 2000)
    private String comment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_username", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "video_uuid", nullable = false)
    private Video video;

    public Comment(String comment, User user, Video video) {
        this.comment = comment;
        this.user = user;
        this.video = video;
    }

}
