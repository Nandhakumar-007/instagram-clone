package com.instagram.backend.repository;

import com.instagram.backend.entity.Story;
import com.instagram.backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface StoryRepository
        extends JpaRepository<Story, Long> {

    List<Story>
    findByUserInAndCreatedAtAfterOrderByCreatedAtAsc(
        List<User> users,
        LocalDateTime createdAt
    );
}