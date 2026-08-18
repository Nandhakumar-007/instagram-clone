package com.instagram.backend.service;

import com.instagram.backend.dto.*;
import com.instagram.backend.entity.*;
import com.instagram.backend.repository.*;
import com.instagram.backend.security.*;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final ConversationRepository conversationRepository;

    private final ConversationParticipantRepository
            participantRepository;

    private final MessageRepository messageRepository;

    private final UserRepository userRepository;

    private final CurrentUserProvider currentUserProvider;


    /*
     * Get all conversations of current user
     */
    @Transactional(readOnly = true)
    public List<ConversationResponse>
    getMyConversations() {

        User currentUser =
                currentUserProvider.getCurrentUser();

        return conversationRepository
                .findUserConversations(currentUser)
                .stream()
                .map(c ->
                        toConversationResponse(
                                c,
                                currentUser
                        )
                )
                .toList();
    }


    /*
     * Create conversation or return existing one
     */
    @Transactional
    public ConversationResponse
    getOrCreateConversation(
            String username
    ) {

        User currentUser =
                currentUserProvider.getCurrentUser();

        User otherUser =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User not found"
                                )
                        );

        if (currentUser.getId()
                .equals(otherUser.getId())) {

            throw new IllegalArgumentException(
                    "You cannot message yourself"
            );
        }


        var existing =
                conversationRepository
                        .findConversationBetweenUsers(
                                currentUser,
                                otherUser
                        );

        if (existing.isPresent()) {

            return toConversationResponse(
                    existing.get(),
                    currentUser
            );
        }


        Conversation conversation =
                new Conversation();

        conversation =
                conversationRepository.save(
                        conversation
                );


        ConversationParticipant p1 =
                new ConversationParticipant();

        p1.setConversation(conversation);
        p1.setUser(currentUser);


        ConversationParticipant p2 =
                new ConversationParticipant();

        p2.setConversation(conversation);
        p2.setUser(otherUser);


        participantRepository.save(p1);
        participantRepository.save(p2);


        return toConversationResponse(
                conversation,
                currentUser
        );
    }


    /*
     * Get messages
     */
    @Transactional(readOnly = true)
    public List<MessageResponse>
    getMessages(Long conversationId) {

        User currentUser =
                currentUserProvider.getCurrentUser();

        Conversation conversation =
                conversationRepository
                        .findById(conversationId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Conversation not found"
                                )
                        );


        checkParticipant(
                conversation,
                currentUser
        );


        return messageRepository
                .findByConversationOrderByCreatedAtAsc(
                        conversation
                )
                .stream()
                .map(this::toMessageResponse)
                .toList();
    }


    /*
     * Send text message
     */
    @Transactional
    public MessageResponse
    sendMessage(
            Long conversationId,
            String content
    ) {

        User currentUser =
                currentUserProvider.getCurrentUser();

        Conversation conversation =
                conversationRepository
                        .findById(conversationId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Conversation not found"
                                )
                        );


        checkParticipant(
                conversation,
                currentUser
        );


        if (content == null ||
                content.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Message cannot be empty"
            );
        }


        Message message =
                new Message();

        message.setConversation(conversation);
        message.setSender(currentUser);
        message.setType(MessageType.TEXT);
        message.setContent(content.trim());
        message.setSeen(false);


        message =
                messageRepository.save(message);


        conversationRepository.save(conversation);


        return toMessageResponse(message);
    }


    /*
     * Share post
     */
    @Transactional
    public MessageResponse
    sharePost(
            Long conversationId,
            Long postId
    ) {

        return shareContent(
                conversationId,
                postId,
                null
        );
    }


    /*
     * Share reel
     */
    @Transactional
    public MessageResponse
    shareReel(
            Long conversationId,
            Long reelId
    ) {

        return shareContent(
                conversationId,
                null,
                reelId
        );
    }


    private MessageResponse
    shareContent(
            Long conversationId,
            Long postId,
            Long reelId
    ) {

        User currentUser =
                currentUserProvider.getCurrentUser();

        Conversation conversation =
                conversationRepository
                        .findById(conversationId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Conversation not found"
                                )
                        );


        checkParticipant(
                conversation,
                currentUser
        );


        Message message =
                new Message();

        message.setConversation(conversation);
        message.setSender(currentUser);


        if (postId != null) {

            message.setType(
                    MessageType.POST
            );

            message.setSharedPostId(
                    postId
            );

        } else {

            message.setType(
                    MessageType.REEL
            );

            message.setSharedReelId(
                    reelId
            );
        }


        message =
                messageRepository.save(message);


        return toMessageResponse(message);
    }


    private void checkParticipant(
            Conversation conversation,
            User user
    ) {

        boolean participant =
                conversation
                        .getParticipants()
                        .stream()
                        .anyMatch(
                                p ->
                                        p.getUser()
                                                .getId()
                                                .equals(user.getId())
                        );


        if (!participant) {

            throw new IllegalArgumentException(
                    "You are not part of this conversation"
            );
        }
    }


    private ConversationResponse
    toConversationResponse(
            Conversation conversation,
            User currentUser
    ) {

        User otherUser =
                conversation
                        .getParticipants()
                        .stream()
                        .map(
                                ConversationParticipant::getUser
                        )
                        .filter(
                                u ->
                                        !u.getId()
                                                .equals(
                                                        currentUser.getId()
                                                )
                        )
                        .findFirst()
                        .orElse(null);


        if (otherUser == null) {

            return new ConversationResponse(
                    conversation.getId(),
                    null,
                    null,
                    conversation.getUpdatedAt(),
                    0
            );
        }


        return new ConversationResponse(
                conversation.getId(),

                new ConversationUserResponse(
                        otherUser.getId(),
                        otherUser.getUsername(),
                        otherUser.getFullName(),
                        otherUser.getProfilePicUrl()
                ),

                null,

                conversation.getUpdatedAt(),

                0
        );
    }


    private MessageResponse
    toMessageResponse(Message message) {

        User sender =
                message.getSender();

        return new MessageResponse(
                message.getId(),

                sender.getId(),

                sender.getUsername(),

                message.getType(),

                message.getContent(),

                message.getImageUrl(),

                message.getSharedPostId(),

                message.getSharedReelId(),

                message.getCreatedAt(),

                message.isSeen()
        );
    }
}