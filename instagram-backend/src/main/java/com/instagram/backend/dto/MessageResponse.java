package com.instagram.backend.dto;

import com.instagram.backend.entity.MessageType;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class MessageResponse {

    private Long id;

    private Long senderId;

    private String senderUsername;

    private MessageType type;

    private String content;

    private String imageUrl;

    private Long sharedPostId;

    private Long sharedReelId;

    private LocalDateTime createdAt;

    private boolean seen;
}