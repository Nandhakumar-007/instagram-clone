package com.instagram.backend.dto;

import lombok.Data;

@Data
public class ShareContentRequest {

    private Long postId;

    private Long reelId;
}