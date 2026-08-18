package com.instagram.backend.repository;

import com.instagram.backend.entity.Follow;
import com.instagram.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    Optional<Follow> findByFollowerAndFollowing(User follower, User following);

    boolean existsByFollowerAndFollowing(User follower, User following);

    long countByFollowing(User following);
    long countByFollower(User follower);

    List<Follow> findByFollower(User follower);     // -> people this user follows
    List<Follow> findByFollowing(User following);    // -> people who follow this user (NEW)
}