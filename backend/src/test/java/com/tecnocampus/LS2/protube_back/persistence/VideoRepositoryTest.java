package com.tecnocampus.LS2.protube_back.persistence;

import com.tecnocampus.LS2.protube_back.model.User;
import com.tecnocampus.LS2.protube_back.model.Video;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class VideoRepositoryTest {

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void findVideoBynameMatchesTitleOrDescriptionCaseInsensitively() {
        User author = userRepository.save(new User("search-test-user", "search-test@example.com"));
        Video titleMatch = new Video("Java walkthrough", "A programming tutorial", author);
        Video descriptionMatch = new Video("Cooking basics", "Learn JAVA with beginner examples", author);
        Video noMatch = new Video("Dessert recipes", "How to bake a cake", author);

        videoRepository.saveAll(List.of(titleMatch, descriptionMatch, noMatch));
        videoRepository.flush();

        List<Video> results = videoRepository.findVideoByname("java");

        assertThat(results).containsExactlyInAnyOrder(titleMatch, descriptionMatch);
    }

    @Test
    void findVideoBynameReturnsEmptyWhenNeitherFieldMatches() {
        User author = userRepository.save(new User("empty-search-user", "empty-search@example.com"));
        videoRepository.save(new Video("Cooking basics", "Learn to bake a cake", author));

        assertThat(videoRepository.findVideoByname("nonexistent")).isEmpty();
    }
}
