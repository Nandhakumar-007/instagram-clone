package com.instagram.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class StoryResponse {

    private Long id;

    private Long userId;

    private String username;

    private String avatar;

    private String media;

    private LocalDateTime createdAt;
}