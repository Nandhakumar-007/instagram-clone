package com.instagram.backend.repository;

import com.instagram.backend.entity.Post;
import com.instagram.backend.entity.PostLike;
import com.instagram.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {

    Optional<PostLike> findByPostAndUser(Post post, User user);

    long countByPost(Post post);

    boolean existsByPostAndUser(Post post, User user);

    List<PostLike> findByPost(Post post);
}