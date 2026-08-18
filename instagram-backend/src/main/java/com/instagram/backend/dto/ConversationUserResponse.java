package com.instagram.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ConversationUserResponse {

    private Long id;

    private String username;

    private String fullName;

    private String profilePicUrl;
}