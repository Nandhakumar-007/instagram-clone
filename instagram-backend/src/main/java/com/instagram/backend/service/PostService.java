package com.instagram.backend.service;

import com.instagram.backend.dto.PostRequest;
import com.instagram.backend.dto.PostResponse;
import com.instagram.backend.entity.Post;
import com.instagram.backend.entity.PostLike;
import com.instagram.backend.entity.User;
import com.instagram.backend.repository.CommentRepository;
import com.instagram.backend.repository.PostLikeRepository;
import com.instagram.backend.repository.PostRepository;
import com.instagram.backend.repository.UserRepository;
import com.instagram.backend.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final CurrentUserProvider currentUserProvider;

    public PostResponse createPost(PostRequest request) {

        User user = currentUserProvider.getCurrentUser();

        Post post = new Post();

        post.setUser(user);
        post.setImageUrl(request.getImageUrl());
        post.setCaption(request.getCaption());

        Post saved = postRepository.save(post);

        return toResponse(saved, user);
    }

    public List<PostResponse> getFeed() {

        User currentUser = currentUserProvider.getCurrentUser();

        return postRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(post -> toResponse(post, currentUser))
                .toList();
    }

    // Get posts belonging to a specific user
    public List<PostResponse> getUserPosts(String username) {

        User profileUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        User currentUser = currentUserProvider.getCurrentUser();

        return postRepository
                .findByUserOrderByCreatedAtDesc(profileUser)
                .stream()
                .map(post -> toResponse(post, currentUser))
                .toList();
    }

    public PostResponse toggleLike(Long postId) {

        User currentUser = currentUserProvider.getCurrentUser();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        postLikeRepository
                .findByPostAndUser(post, currentUser)
                .ifPresentOrElse(
                        postLikeRepository::delete,
                        () -> {
                            PostLike like = new PostLike();

                            like.setPost(post);
                            like.setUser(currentUser);

                            postLikeRepository.save(like);
                        }
                );

        return toResponse(post, currentUser);
    }

    private PostResponse toResponse(Post post, User currentUser) {

        long likeCount = postLikeRepository.countByPost(post);

        boolean likedByCurrentUser =
                postLikeRepository.existsByPostAndUser(
                        post,
                        currentUser
                );

        return new PostResponse(
                post.getId(),
                post.getUser().getId(),
                post.getUser().getUsername(),
                post.getUser().getProfilePicUrl(),
                post.getImageUrl(),
                post.getCaption(),
                likeCount,
                likedByCurrentUser,
                post.getCreatedAt()
        );
    }

    // Delete post
    public void deletePost(Long postId) {

        User currentUser = currentUserProvider.getCurrentUser();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        // Only the owner can delete the post
        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException(
                    "You can only delete your own posts"
            );
        }

        // Delete comments first
        commentRepository.deleteAll(
                commentRepository.findByPostOrderByCreatedAtAsc(post)
        );

        // Delete likes
        postLikeRepository.deleteAll(
                postLikeRepository.findByPost(post)
        );

        // Finally delete the post
        postRepository.delete(post);
    }
}