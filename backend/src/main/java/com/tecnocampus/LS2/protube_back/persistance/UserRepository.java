package com.tecnocampus.LS2.protube_back.persistance;

import com.tecnocampus.LS2.protube_back.model.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, String> {
}
