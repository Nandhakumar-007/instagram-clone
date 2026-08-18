package com.instagram.backend.controller;

import com.instagram.backend.dto.*;
import com.instagram.backend.service.MessageService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;


    /*
     * GET current user's conversations
     */
    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationResponse>> getConversations() {

        return ResponseEntity.ok(
                messageService.getMyConversations()
        );
    }


    /*
     * Create / open conversation with username
     *
     * Example:
     * POST /api/messages/conversations/user/mahesh
     */
    @PostMapping("/conversations/user/{username}")
    public ResponseEntity<ConversationResponse> openConversation(
            @PathVariable String username
    ) {

        return ResponseEntity.ok(
                messageService.getOrCreateConversation(username)
        );
    }


    /*
     * Get conversation messages
     *
     * Example:
     * GET /api/messages/conversations/5
     */
    @GetMapping("/conversations/{conversationId}")
    public ResponseEntity<List<MessageResponse>> getMessages(
            @PathVariable Long conversationId
    ) {

        return ResponseEntity.ok(
                messageService.getMessages(conversationId)
        );
    }


    /*
     * Send text message
     *
     * Example:
     * POST /api/messages/conversations/5
     */
    @PostMapping("/conversations/{conversationId}")
    public ResponseEntity<MessageResponse> sendMessage(
            @PathVariable Long conversationId,
            @RequestBody SendMessageRequest request
    ) {

        return ResponseEntity.ok(
                messageService.sendMessage(
                        conversationId,
                        request.getContent()
                )
        );
    }


    /*
     * Share post
     *
     * Example:
     * POST /api/messages/conversations/5/share-post/10
     */
    @PostMapping("/conversations/{conversationId}/share-post/{postId}")
    public ResponseEntity<MessageResponse> sharePost(
            @PathVariable Long conversationId,
            @PathVariable Long postId
    ) {

        return ResponseEntity.ok(
                messageService.sharePost(
                        conversationId,
                        postId
                )
        );
    }


    /*
     * Share reel
     *
     * Example:
     * POST /api/messages/conversations/5/share-reel/10
     */
    @PostMapping("/conversations/{conversationId}/share-reel/{reelId}")
    public ResponseEntity<MessageResponse> shareReel(
            @PathVariable Long conversationId,
            @PathVariable Long reelId
    ) {

        return ResponseEntity.ok(
                messageService.shareReel(
                        conversationId,
                        reelId
                )
        );
    }
}