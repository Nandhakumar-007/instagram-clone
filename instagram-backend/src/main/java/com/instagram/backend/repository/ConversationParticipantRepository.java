package com.instagram.backend.repository;

import com.instagram.backend.entity.Conversation;
import com.instagram.backend.entity.ConversationParticipant;
import com.instagram.backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConversationParticipantRepository
        extends JpaRepository<
                ConversationParticipant,
                Long> {

    Optional<ConversationParticipant>
    findByConversationAndUser(
            Conversation conversation,
            User user
    );
}