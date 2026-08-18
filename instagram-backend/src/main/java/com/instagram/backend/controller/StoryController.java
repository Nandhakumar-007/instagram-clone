package com.instagram.backend.controller;

import com.instagram.backend.dto.StoryResponse;
import com.instagram.backend.service.StoryService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stories")
@RequiredArgsConstructor
public class StoryController {

    private final StoryService storyService;


    // ========================================
    // GET STORIES
    // ========================================

    @GetMapping
    public ResponseEntity<List<StoryResponse>>
    getStories() {

        return ResponseEntity.ok(
            storyService.getStories()
        );
    }


    // ========================================
    // CREATE STORY
    // ========================================

    @PostMapping
    public ResponseEntity<StoryResponse>
    createStory(
            @RequestParam String mediaUrl
    ) {

        return ResponseEntity.ok(
            storyService.createStory(
                mediaUrl
            )
        );
    }
}