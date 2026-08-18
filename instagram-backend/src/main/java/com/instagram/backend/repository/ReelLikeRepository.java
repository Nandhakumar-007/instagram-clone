package com.instagram.backend.repository;

import com.instagram.backend.entity.Reel;
import com.instagram.backend.entity.ReelLike;
import com.instagram.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReelLikeRepository extends JpaRepository<ReelLike, Long> {

    Optional<ReelLike> findByReelAndUser(Reel reel, User user);

    long countByReel(Reel reel);

    boolean existsByReelAndUser(Reel reel, User user);

    List<ReelLike> findByReel(Reel reel);
}