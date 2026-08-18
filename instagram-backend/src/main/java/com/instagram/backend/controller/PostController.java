package com.instagram.backend.controller;

import com.instagram.backend.dto.PostRequest;
import com.instagram.backend.dto.PostResponse;
import com.instagram.backend.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // POST /api/posts
    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @Valid @RequestBody PostRequest request) {

        return ResponseEntity.ok(
                postService.createPost(request)
        );
    }

    // GET /api/posts/feed
    @GetMapping("/feed")
    public ResponseEntity<List<PostResponse>> getFeed() {

        return ResponseEntity.ok(
                postService.getFeed()
        );
    }

    // GET /api/posts/user/{username}
    @GetMapping("/user/{username}")
    public ResponseEntity<List<PostResponse>> getUserPosts(
            @PathVariable String username) {

        return ResponseEntity.ok(
                postService.getUserPosts(username)
        );
    }

    // POST /api/posts/{postId}/like
    @PostMapping("/{postId}/like")
    public ResponseEntity<PostResponse> toggleLike(
            @PathVariable Long postId) {

        return ResponseEntity.ok(
                postService.toggleLike(postId)
        );
    }
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {

        postService.deletePost(postId);

        return ResponseEntity.noContent().build();
    }
}