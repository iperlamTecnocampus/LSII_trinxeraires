package com.tecnocampus.LS2.protube_back.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(length = 50)
    private String username;

    @Column(name = "display_name", length = 100)
    private String displayName;

    @Column(length = 5000)
    private String description;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "picture_fid", unique = true)
    private String pictureFid;

    @Column(name = "join_date", nullable = false, updatable = false)
    private LocalDate joinDate;

    @ManyToMany
    @JoinTable(
            name = "subscriptions",
            joinColumns = @JoinColumn(name = "subscriber_username"),
            inverseJoinColumns = @JoinColumn(name = "channel_username"))
    private Set<User> subscribedTo = new HashSet<>();

    @ManyToMany(mappedBy = "subscribedTo")
    private Set<User> subscribers = new HashSet<>();

    @OneToMany(mappedBy = "author", cascade = CascadeType.REMOVE)
    private Set<Video> videos = new HashSet<>();

    public User() {

    }

    @PrePersist
    void onCreate() {
        if (this.joinDate == null) this.joinDate = LocalDate.now();
        if (this.displayName == null) this.displayName = username;
    }

    public User(String username, String email) {
        this.username = username;
        this.email = email;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(LocalDate joinDate) {
        this.joinDate = joinDate;
    }

    public String getPictureFid() {
        return pictureFid;
    }

    public void setPictureFid(String pictureFid) {
        this.pictureFid = pictureFid;
    }

    public Set<User> getSubscribedTo() {
        return subscribedTo;
    }

    public void setSubscribedTo(Set<User> subscribedTo) {
        this.subscribedTo = subscribedTo;
    }

    public Set<User> getSubscribers() {
        return subscribers;
    }

    public void setSubscribers(Set<User> subscribers) {
        this.subscribers = subscribers;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Set<Video> getVideos() {
        return videos;
    }

    public void setVideos(Set<Video> videos) {
        this.videos = videos;
    }
}
