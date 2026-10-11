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

    @OneToMany(mappedBy = "uploader", cascade = CascadeType.REMOVE)
    private Set<Video> videos = new HashSet<>();

    @PrePersist
    void onCreate() {
        if (this.joinDate == null) this.joinDate = LocalDate.now();
        if (this.displayName == null) this.displayName = username;
    }

    public User(String username, String email) {
        this.username = username;
        this.email = email;
    }

}
