package com.tecnocampus.LS2.protube_back.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertSame;

class LikeCommentTest {

    @Test
    void constructorSetsUserAndComment() {
        User user = new User("alice", "alice@example.com");
        Comment comment = new Comment("Nice video", user, new Video());

        LikeComment like = new LikeComment(user, comment);

        assertSame(user, like.getUser());
        assertSame(comment, like.getComment());
    }
}
