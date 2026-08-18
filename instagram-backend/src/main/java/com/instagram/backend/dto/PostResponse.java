package com.instagram.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class PostResponse {
    private Long id;
    private Long userId;
    private String username;
    private String userProfilePicUrl;
    private String imageUrl;
    private String caption;
    private long likeCount;
    private boolean likedByCurrentUser;
    private LocalDateTime createdAt;
}
