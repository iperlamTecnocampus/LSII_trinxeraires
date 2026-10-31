package com.tecnocampus.LS2.protube_back.persistance;

import com.tecnocampus.LS2.protube_back.model.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface VideoRepository extends JpaRepository<Video, UUID> {

    @Query("select count(c) > 0 from Comment c where c.video.uuid = :videoId and c.id = :commentId")
    boolean existCommentByIdAndVideoId(@Param("commentId") Long commentId, @Param("videoId") UUID videoId);

    @Query("select v from Video v where lower(v.title) like lower(concat('%', :videoName, '%'))")
    List<Video> findVideoByname(@Param("videoName") String name);
}
