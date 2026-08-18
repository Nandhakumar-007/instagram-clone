package com.instagram.backend.controller;

import com.instagram.backend.dto.ReelRequest;
import com.instagram.backend.dto.ReelResponse;
import com.instagram.backend.service.ReelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Paths match the frontend exactly (src/Services/reelService.jsx):
//   POST   /api/reels
//   GET    /api/reels/feed
//   GET    /api/reels/user/{username}
//   POST   /api/reels/{id}/like
//   DELETE /api/reels/{id}
@RestController
@RequestMapping("/api/reels")
@RequiredArgsConstructor
public class ReelController {

    private final ReelService reelService;

    @PostMapping
    public ResponseEntity<ReelResponse> createReel(@RequestBody ReelRequest request) {
        return ResponseEntity.ok(reelService.createReel(request));
    }

    @GetMapping("/feed")
    public ResponseEntity<List<ReelResponse>> getFeed() {
        return ResponseEntity.ok(reelService.getFeed());
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<ReelResponse>> getUserReels(@PathVariable String username) {
        return ResponseEntity.ok(reelService.getUserReels(username));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<ReelResponse> toggleLike(@PathVariable("id") Long reelId) {
        return ResponseEntity.ok(reelService.toggleLike(reelId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReel(@PathVariable("id") Long reelId) {
        reelService.deleteReel(reelId);
        return ResponseEntity.noContent().build();
    }
}