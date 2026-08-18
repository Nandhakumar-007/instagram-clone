package com.instagram.backend.repository;

import com.instagram.backend.entity.Conversation;
import com.instagram.backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

import java.util.Optional;

public interface ConversationRepository
        extends JpaRepository<Conversation, Long> {

    @Query("""
        SELECT DISTINCT c
        FROM Conversation c
        JOIN c.participants p
        WHERE p.user = :user
        ORDER BY c.updatedAt DESC
    """)
    List<Conversation> findUserConversations(User user);


    @Query("""
        SELECT c
        FROM Conversation c
        WHERE c.id IN (
            SELECT p1.conversation.id
            FROM ConversationParticipant p1
            WHERE p1.user = :user1
        )
        AND c.id IN (
            SELECT p2.conversation.id
            FROM ConversationParticipant p2
            WHERE p2.user = :user2
        )
    """)
    Optional<Conversation> findConversationBetweenUsers(
            User user1,
            User user2
    );
}