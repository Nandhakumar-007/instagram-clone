package com.instagram.backend.service;

import com.instagram.backend.dto.ReelRequest;
import com.instagram.backend.dto.ReelResponse;
import com.instagram.backend.entity.Reel;
import com.instagram.backend.entity.ReelLike;
import com.instagram.backend.entity.User;
import com.instagram.backend.repository.ReelLikeRepository;
import com.instagram.backend.repository.ReelRepository;
import com.instagram.backend.repository.UserRepository;
import com.instagram.backend.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReelService {

    private final ReelRepository reelRepository;
    private final ReelLikeRepository reelLikeRepository;
    private final UserRepository userRepository;
    private final CurrentUserProvider currentUserProvider;

    public ReelResponse createReel(ReelRequest request) {

        User user = currentUserProvider.getCurrentUser();

        Reel reel = new Reel();

        reel.setUser(user);
        reel.setVideoUrl(request.getVideoUrl());
        reel.setCaption(request.getCaption());

        Reel saved = reelRepository.save(reel);

        return toResponse(saved, user);
    }

    public List<ReelResponse> getFeed() {

        User currentUser = currentUserProvider.getCurrentUser();

        return reelRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(reel -> toResponse(reel, currentUser))
                .toList();
    }

    // Get reels belonging to a specific user
    public List<ReelResponse> getUserReels(String username) {

        User profileUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        User currentUser = currentUserProvider.getCurrentUser();

        return reelRepository
                .findByUserOrderByCreatedAtDesc(profileUser)
                .stream()
                .map(reel -> toResponse(reel, currentUser))
                .toList();
    }

    public ReelResponse toggleLike(Long reelId) {

        User currentUser = currentUserProvider.getCurrentUser();

        Reel reel = reelRepository.findById(reelId)
                .orElseThrow(() -> new IllegalArgumentException("Reel not found"));

        reelLikeRepository
                .findByReelAndUser(reel, currentUser)
                .ifPresentOrElse(
                        reelLikeRepository::delete,
                        () -> {
                            ReelLike like = new ReelLike();

                            like.setReel(reel);
                            like.setUser(currentUser);

                            reelLikeRepository.save(like);
                        }
                );

        return toResponse(reel, currentUser);
    }

    private ReelResponse toResponse(Reel reel, User currentUser) {

        long likeCount = reelLikeRepository.countByReel(reel);

        boolean likedByCurrentUser =
                reelLikeRepository.existsByReelAndUser(
                        reel,
                        currentUser
                );

        return new ReelResponse(
                reel.getId(),
                reel.getUser().getId(),
                reel.getUser().getUsername(),
                reel.getUser().getProfilePicUrl(),
                reel.getVideoUrl(),
                reel.getCaption(),
                likeCount,
                likedByCurrentUser,
                reel.getCreatedAt()
        );
    }

    // Delete reel
    public void deleteReel(Long reelId) {

        User currentUser = currentUserProvider.getCurrentUser();

        Reel reel = reelRepository.findById(reelId)
                .orElseThrow(() -> new IllegalArgumentException("Reel not found"));

        // Only the owner can delete the reel
        if (!reel.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException(
                    "You can only delete your own reels"
            );
        }

        // Delete likes first
        reelLikeRepository.deleteAll(
                reelLikeRepository.findByReel(reel)
        );

        // Finally delete the reel
        reelRepository.delete(reel);
    }
}