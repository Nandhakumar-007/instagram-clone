package com.instagram.backend.repository;

import com.instagram.backend.entity.Reel;
import com.instagram.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReelRepository extends JpaRepository<Reel, Long> {

    List<Reel> findAllByOrderByCreatedAtDesc();

    List<Reel> findByUserOrderByCreatedAtDesc(User user);
}