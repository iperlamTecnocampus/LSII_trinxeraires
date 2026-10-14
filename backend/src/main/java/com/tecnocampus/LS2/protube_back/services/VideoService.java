package com.tecnocampus.LS2.protube_back.services;

import com.tecnocampus.LS2.protube_back.persistance.VideoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class VideoService {

    private VideoRepository repository;

    public List<UUID> getVideos() {
        return repository.findAll().stream().map(video -> video.getUuid()).toList();
    }

    public UUID getVideoById(String id) {
       return repository.findById(id).get().getUuid();
    }
}
