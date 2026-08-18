package com.instagram.backend.controller;

import com.instagram.backend.dto.CommentRequest;
import com.instagram.backend.dto.CommentResponse;
import com.instagram.backend.entity.Comment;
import com.instagram.backend.entity.Post;
import com.instagram.backend.entity.User;
import com.instagram.backend.repository.CommentRepository;
import com.instagram.backend.repository.PostRepository;
import com.instagram.backend.security.CurrentUserProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final CurrentUserProvider currentUserProvider;

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        List<CommentResponse> comments = commentRepository.findByPostOrderByCreatedAtAsc(post).stream()
                .map(c -> new CommentResponse(c.getId(), c.getUser().getId(), c.getUser().getUsername(),
                        c.getText(), c.getCreatedAt()))
                .toList();

        return ResponseEntity.ok(comments);
    }

    @PostMapping
    public ResponseEntity<CommentResponse> addComment(@PathVariable Long postId,
                                                        @Valid @RequestBody CommentRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        User currentUser = currentUserProvider.getCurrentUser();

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(currentUser);
        comment.setText(request.getText());

        Comment saved = commentRepository.save(comment);

        return ResponseEntity.ok(new CommentResponse(saved.getId(), currentUser.getId(),
                currentUser.getUsername(), saved.getText(), saved.getCreatedAt()));
    }
}
