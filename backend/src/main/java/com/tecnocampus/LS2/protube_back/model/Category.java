package com.tecnocampus.LS2.protube_back.model;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String name;

    @ManyToMany(mappedBy = "categories")
    private Set<Video> videos = new HashSet<>();

    public Category(String id, String name) {
        this.id = id;
        this.name = name;
    }

}
