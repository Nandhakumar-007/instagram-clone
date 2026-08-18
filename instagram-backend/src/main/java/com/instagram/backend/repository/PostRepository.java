package com.instagram.backend.repository;

import com.instagram.backend.entity.Post;
import com.instagram.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findAllByOrderByCreatedAtDesc();

    List<Post> findByUserOrderByCreatedAtDesc(User user);

    List<Post> findByUserIdInOrderByCreatedAtDesc(List<Long> userIds);
}
