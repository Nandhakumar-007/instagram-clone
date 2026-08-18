package com.instagram.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String username;
    private String fullName;
    private String bio;
    private String profilePicUrl;
    private long followerCount;
    private long followingCount;
    private long postCount;
    private boolean followedByCurrentUser;
}
