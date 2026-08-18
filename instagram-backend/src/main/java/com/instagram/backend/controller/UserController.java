package com.instagram.backend.controller;

import com.instagram.backend.dto.UpdateProfileRequest;
import com.instagram.backend.dto.UserProfileResponse;
import com.instagram.backend.dto.UserSearchResponse;
import com.instagram.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.instagram.backend.dto.UserSummaryResponse;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // GET /api/users/search?query=...
    @GetMapping("/search")
    public ResponseEntity<List<UserSearchResponse>> search(
            @RequestParam String query) {

        List<UserSearchResponse> results = userService.searchUsers(query)
                .stream()
                .map(u -> new UserSearchResponse(
                        u.getId(),
                        u.getUsername(),
                        u.getFullName(),
                        u.getProfilePicUrl()
                ))
                .toList();

        return ResponseEntity.ok(results);
    }

    // GET /api/users/{username}
    @GetMapping("/{username}")
    public ResponseEntity<UserProfileResponse> getProfile(
            @PathVariable String username) {

        return ResponseEntity.ok(userService.getProfile(username));
    }

 // GET /api/users/{username}/followers
    @GetMapping("/{username}/followers")
    public ResponseEntity<List<UserSummaryResponse>> getFollowers(
            @PathVariable String username) {
        return ResponseEntity.ok(userService.getFollowers(username));
    }

    // GET /api/users/{username}/following
    @GetMapping("/{username}/following")
    public ResponseEntity<List<UserSummaryResponse>> getFollowing(
            @PathVariable String username) {
        return ResponseEntity.ok(userService.getFollowing(username));
    }
    // POST /api/users/{username}/follow
    @PostMapping("/{username}/follow")
    public ResponseEntity<Void> toggleFollow(
            @PathVariable String username) {

        userService.toggleFollow(username);

        return ResponseEntity.ok().build();
    }

    // PUT /api/users/me
    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @RequestBody UpdateProfileRequest request) {

        return ResponseEntity.ok(
                userService.updateProfile(request)
        );
    }
}