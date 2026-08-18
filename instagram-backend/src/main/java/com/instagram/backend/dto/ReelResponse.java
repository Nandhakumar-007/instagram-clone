package com.instagram.backend.dto;

import lombok.Getter;

import java.time.LocalDateTime;

// Mirrors PostResponse's shape/order. Field names line up with what the
// frontend reads directly in Pages/Reels.jsx (r.videoUrl, r.username,
// r.userProfilePicUrl, r.caption, r.likeCount, r.likedByCurrentUser).
@Getter
public class ReelResponse {

    private final Long id;
    private final Long userId;
    private final String username;
    private final String userProfilePicUrl;
    private final String videoUrl;
    private final String caption;
    private final long likeCount;
    private final boolean likedByCurrentUser;
    private final LocalDateTime createdAt;

    public ReelResponse(Long id, Long userId, String username, String userProfilePicUrl,
                         String videoUrl, String caption, long likeCount,
                         boolean likedByCurrentUser, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.userProfilePicUrl = userProfilePicUrl;
        this.videoUrl = videoUrl;
        this.caption = caption;
        this.likeCount = likeCount;
        this.likedByCurrentUser = likedByCurrentUser;
        this.createdAt = createdAt;
    }
}