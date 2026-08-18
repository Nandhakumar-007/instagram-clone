package com.instagram.backend.service;

import com.instagram.backend.dto.StoryResponse;
import com.instagram.backend.entity.Follow;
import com.instagram.backend.entity.Story;
import com.instagram.backend.entity.User;
import com.instagram.backend.repository.FollowRepository;
import com.instagram.backend.repository.StoryRepository;
import com.instagram.backend.security.CurrentUserProvider;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StoryService {

    private final StoryRepository storyRepository;

    private final FollowRepository followRepository;

    private final CurrentUserProvider currentUserProvider;


    // ========================================
    // CREATE STORY
    // ========================================

    public StoryResponse createStory(
            String mediaUrl
    ) {

        User currentUser =
                currentUserProvider.getCurrentUser();

        Story story = new Story();

        story.setUser(currentUser);

        story.setMediaUrl(mediaUrl);

        story.setCreatedAt(
                LocalDateTime.now()
        );

        Story savedStory =
                storyRepository.save(story);

        return toResponse(savedStory);
    }


    // ========================================
    // GET STORIES
    // ========================================

    public List<StoryResponse> getStories() {

        User currentUser =
                currentUserProvider.getCurrentUser();

        LocalDateTime twentyFourHoursAgo =
                LocalDateTime.now()
                    .minusHours(24);

        List<User> users =
                new ArrayList<>();

        // Add current user
        users.add(currentUser);


        // Add users that current user follows
        List<Follow> follows =
                followRepository
                    .findByFollower(currentUser);

        for (Follow follow : follows) {

            users.add(
                follow.getFollowing()
            );
        }


        // Get stories from those users
        return storyRepository
                .findByUserInAndCreatedAtAfterOrderByCreatedAtAsc(
                    users,
                    twentyFourHoursAgo
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }


    // ========================================
    // CONVERT ENTITY -> DTO
    // ========================================

    private StoryResponse toResponse(
            Story story
    ) {

        User user =
                story.getUser();

        return new StoryResponse(

            story.getId(),

            user.getId(),

            user.getUsername(),

            user.getProfilePicUrl(),

            story.getMediaUrl(),

            story.getCreatedAt()
        );
    }
}