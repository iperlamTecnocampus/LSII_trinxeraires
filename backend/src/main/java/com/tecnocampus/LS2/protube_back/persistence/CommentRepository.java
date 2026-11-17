package com.tecnocampus.LS2.protube_back.persistence;

import com.tecnocampus.LS2.protube_back.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}
