package com.tecnocampus.LS2.protube_back.persistance;

import com.tecnocampus.LS2.protube_back.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;


public interface UserRepository extends JpaRepository<User, String> {

    @Query("select count(u) > 0 from User u join u.likedVideos v where u.userName = :userName and v.id = :videoId")
    boolean hasLiked(@Param("userName") String userName, @Param("videoId") UUID videoId);

    @Query(" select count(u) > 0 from User u join u.subscriptions s where u.userName = :subscriber and s.userName = :subscribed")
    boolean isSubscribed(@Param("subscriber") String subscriber, @Param("subscribed") String subscribed);
}
