package com.instagram.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ConversationResponse {

    private Long id;

    private ConversationUserResponse user;

    private String lastMessage;

    private LocalDateTime lastMessageTime;

    private long unreadCount;
}