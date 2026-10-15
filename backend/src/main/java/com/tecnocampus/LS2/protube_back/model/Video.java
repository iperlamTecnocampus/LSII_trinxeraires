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

    public Video() {

    }

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

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public Set<Category> getCategories() {
        return categories;
    }

    public void setCategories(Set<Category> categories) {
        this.categories = categories;
    }

    public Set<Comment> getComments() {
        return comments;
    }

    public void setComments(Set<Comment> comments) {
        this.comments = comments;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Like> getLikes() {
        return likes;
    }

    public void setLikes(Set<Like> likes) {
        this.likes = likes;
    }

    public String getThumbnailFid() {
        return thumbnailFid;
    }

    public void setThumbnailFid(String thumbnailFid) {
        this.thumbnailFid = thumbnailFid;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public UUID getUuid() {
        return uuid;
    }

    public String getVideoFid() {
        return videoFid;
    }

    public void setVideoFid(String videoFid) {
        this.videoFid = videoFid;
    }

    public Set<View> getViews() {
        return views;
    }

    public void setViews(Set<View> views) {
        this.views = views;
    }

    public void addLike(Like like) {
        this.likes.add(like);
        like.setVideo(this);
    }

    public void removeLike(Like like) {
        this.likes.remove(like);
        like.setVideo(null);
    }

    public void addComment(Comment comment) {
        this.comments.add(comment);
        comment.setVideo(this);
    }

    public void removeComment(Comment comment) {
        this.comments.remove(comment);
        comment.setVideo(null);
    }
}
