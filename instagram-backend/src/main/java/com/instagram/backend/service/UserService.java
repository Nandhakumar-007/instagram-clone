package com.instagram.backend.service;

import com.instagram.backend.dto.UpdateProfileRequest;
import com.instagram.backend.dto.UserProfileResponse;
import com.instagram.backend.entity.Follow;
import com.instagram.backend.entity.User;
import com.instagram.backend.repository.FollowRepository;
import com.instagram.backend.repository.PostRepository;
import com.instagram.backend.repository.UserRepository;
import com.instagram.backend.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.instagram.backend.dto.UserSummaryResponse;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final PostRepository postRepository;
    private final CurrentUserProvider currentUserProvider;

    public UserProfileResponse getProfile(String username) {

        User profileUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        User currentUser = currentUserProvider.getCurrentUser();

        long followerCount = followRepository.countByFollowing(profileUser);
        long followingCount = followRepository.countByFollower(profileUser);
        long postCount = postRepository
                .findByUserOrderByCreatedAtDesc(profileUser)
                .size();

        boolean followedByCurrentUser =
                followRepository.existsByFollowerAndFollowing(
                        currentUser,
                        profileUser
                );

        return new UserProfileResponse(
                profileUser.getId(),
                profileUser.getUsername(),
                profileUser.getFullName(),
                profileUser.getBio(),
                profileUser.getProfilePicUrl(),
                followerCount,
                followingCount,
                postCount,
                followedByCurrentUser
        );
    }
    public List<UserSummaryResponse> getFollowers(String username) {
        User profileUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        User currentUser = currentUserProvider.getCurrentUser();

        return followRepository.findByFollowing(profileUser)
                .stream()
                .map(f -> toSummary(f.getFollower(), currentUser))
                .toList();
    }

    public List<UserSummaryResponse> getFollowing(String username) {
        User profileUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        User currentUser = currentUserProvider.getCurrentUser();

        return followRepository.findByFollower(profileUser)
                .stream()
                .map(f -> toSummary(f.getFollowing(), currentUser))
                .toList();
    }

    private UserSummaryResponse toSummary(User user, User currentUser) {
        boolean followed = followRepository.existsByFollowerAndFollowing(currentUser, user);
        return new UserSummaryResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getProfilePicUrl(),
                followed
        );
    }
    public void toggleFollow(String usernameToFollow) {

        User currentUser = currentUserProvider.getCurrentUser();

        User targetUser = userRepository.findByUsername(usernameToFollow)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (currentUser.getId().equals(targetUser.getId())) {
            throw new IllegalArgumentException("You cannot follow yourself");
        }

        followRepository
                .findByFollowerAndFollowing(currentUser, targetUser)
                .ifPresentOrElse(
                        followRepository::delete,
                        () -> {
                            Follow follow = new Follow();
                            follow.setFollower(currentUser);
                            follow.setFollowing(targetUser);
                            followRepository.save(follow);
                        }
                );
    }

    public List<User> searchUsers(String query) {
        return userRepository.findByUsernameContainingIgnoreCase(query);
    }

    // Update logged-in user's profile
    public UserProfileResponse updateProfile(UpdateProfileRequest request) {

        User currentUser = currentUserProvider.getCurrentUser();

        currentUser.setFullName(request.getFullName());
        currentUser.setBio(request.getBio());
        currentUser.setProfilePicUrl(request.getProfilePicUrl());

        userRepository.save(currentUser);

        return getProfile(currentUser.getUsername());
        
        
        
        
        
    }
}
