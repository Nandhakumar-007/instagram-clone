package com.instagram.backend.repository;

import com.instagram.backend.entity.Conversation;
import com.instagram.backend.entity.Message;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository
        extends JpaRepository<Message, Long> {

    List<Message>
    findByConversationOrderByCreatedAtAsc(
            Conversation conversation
    );
}