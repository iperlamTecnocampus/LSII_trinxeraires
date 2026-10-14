package com.tecnocampus.LS2.protube_back.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "videos")
public class Video {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID uuid;

    // Video S3 file id
    @Column(name = "video_fid", unique = true)
    private String videoFid;

    // Video S3 file id
    @Column(name = "thumbnail_fid", unique = true)
    private String thumbnailFid;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 5000)
    private String description;

    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private LocalDateTime uploadedAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_username", nullable = false)
    private User author;

    @ManyToMany
    @JoinTable(
            name = "video_categories",
            joinColumns = @JoinColumn(name = "video_uuid"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))
    private Set<Category> categories = new HashSet<>();

    @OneToMany(mappedBy = "video", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Set<Comment> comments = new HashSet<>();

    @OneToMany(mappedBy = "video", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Set<Like> likes = new HashSet<>();

    @OneToMany(mappedBy = "video", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Set<View> views = new HashSet<>();

    @PrePersist
    void onCreate() {
        if (this.uploadedAt == null) this.uploadedAt = LocalDateTime.now();
    }

    public Video(String title, String description, User author, Set<Category> categories) {
        this.title = title;
        this.description = description;
        this.author = author;
        this.categories = categories;
    }

}
