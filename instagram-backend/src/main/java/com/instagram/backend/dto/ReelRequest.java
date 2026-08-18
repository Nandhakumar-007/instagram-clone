package com.instagram.backend.dto;

import lombok.Getter;
import lombok.Setter;

// Matches the JSON body sent by reelService.jsx -> createReel():
// { videoUrl, caption }
@Getter
@Setter
public class ReelRequest {

    private String videoUrl;
    private String caption;
}