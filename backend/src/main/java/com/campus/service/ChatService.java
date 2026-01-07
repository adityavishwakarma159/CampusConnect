package com.campus.service;

import com.campus.dto.ChatMessageDTO;
import com.campus.dto.ConversationDTO;
import com.campus.dto.SendGroupMessageRequest;
import com.campus.dto.SendMessageRequest;
import com.campus.exception.CustomExceptions;
import com.campus.model.ChatMessage;
import com.campus.model.ChatParticipant;
import com.campus.model.Department;
import com.campus.model.User;
import com.campus.repository.ChatMessageRepository;
import com.campus.repository.ChatParticipantRepository;
import com.campus.repository.DepartmentRepository;
import com.campus.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {
    
    private final ChatMessageRepository chatMessageRepository;
    private final ChatParticipantRepository chatParticipantRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    
    @Transactional
    public ChatMessageDTO saveMessage(SendMessageRequest request, Long senderId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("Sender not found"));
        
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("Receiver not found"));
        
        // Validate: same department
        if (!sender.getDepartment().getId().equals(receiver.getDepartment().getId())) {
            throw new RuntimeException("Cannot chat with users from different departments");
        }
        
        // Create and save message
        ChatMessage message = new ChatMessage();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setMessage(request.getMessage());
        message.setChatType(ChatMessage.ChatType.ONE_TO_ONE);
        message.setDepartment(sender.getDepartment());
        message.setIsRead(false);
        
        ChatMessage savedMessage = chatMessageRepository.save(message);
        
        // Update chat participants
        updateChatParticipant(sender.getId(), receiver.getId(), savedMessage.getId(), false);
        updateChatParticipant(receiver.getId(), sender.getId(), savedMessage.getId(), true);
        
        return convertToDTO(savedMessage);
    }
    
    private void updateChatParticipant(Long userId, Long otherUserId, Long messageId, boolean incrementUnread) {
        ChatParticipant participant = chatParticipantRepository
                .findByUserIdAndOtherUserIdAndChatType(userId, otherUserId, ChatMessage.ChatType.ONE_TO_ONE)
                .orElse(new ChatParticipant(userId, otherUserId, ChatMessage.ChatType.ONE_TO_ONE));
        
        participant.setLastMessageId(messageId);
        
        if (incrementUnread) {
            participant.setUnreadCount(participant.getUnreadCount() + 1);
        }
        
        chatParticipantRepository.save(participant);
    }
    
    public List<ConversationDTO> getConversations(Long userId) {
        List<ChatParticipant> participants = chatParticipantRepository.findByUserIdOrderByUpdatedAtDesc(userId);
        
        List<ConversationDTO> conversations = new ArrayList<>();
        
        for (ChatParticipant participant : participants) {
            User otherUser = userRepository.findById(participant.getOtherUserId())
                    .orElse(null);
            
            if (otherUser == null) continue;
            
            ChatMessage lastMessage = null;
            if (participant.getLastMessageId() != null) {
                lastMessage = chatMessageRepository.findById(participant.getLastMessageId())
                        .orElse(null);
            }
            
            ConversationDTO dto = new ConversationDTO();
            dto.setId(participant.getId());
            dto.setOtherUserId(otherUser.getId());
            dto.setOtherUserName(otherUser.getName());
            dto.setOtherUserRole(otherUser.getRole().toString());
            dto.setLastMessage(lastMessage != null ? lastMessage.getMessage() : "");
            dto.setUnreadCount(participant.getUnreadCount());
            dto.setUpdatedAt(participant.getUpdatedAt());
            
            conversations.add(dto);
        }
        
        return conversations;
    }
    
    public List<ChatMessageDTO> getMessageHistory(Long userId, Long otherUserId) {
        // Validate users are in same department
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("User not found"));
        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("Other user not found"));
        
        if (!user.getDepartment().getId().equals(otherUser.getDepartment().getId())) {
            throw new RuntimeException("Cannot view messages from users in different departments");
        }
        
        List<ChatMessage> messages = chatMessageRepository.findMessageHistory(userId, otherUserId);
        return messages.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void markMessagesAsRead(Long userId, Long otherUserId) {
        // Mark all messages as read
        chatMessageRepository.markAsRead(userId, otherUserId);
        
        // Reset unread count in participant
        ChatParticipant participant = chatParticipantRepository
                .findByUserIdAndOtherUserIdAndChatType(userId, otherUserId, ChatMessage.ChatType.ONE_TO_ONE)
                .orElse(null);
        
        if (participant != null) {
            participant.setUnreadCount(0);
            chatParticipantRepository.save(participant);
        }
    }
    
    public List<User> getChatUsers(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("User not found"));
        
        // Get all users in the same department except the current user
        return userRepository.findByDepartmentId(user.getDepartment().getId())
                .stream()
                .filter(u -> !u.getId().equals(userId))
                .collect(Collectors.toList());
    }
    
    @Transactional
    public ChatMessageDTO saveGroupMessage(SendGroupMessageRequest request, Long senderId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("Sender not found"));
        
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));
        
        // Validate: user is in the department
        if (!sender.getDepartment().getId().equals(department.getId())) {
            throw new RuntimeException("Cannot post in other department's group");
        }
        
        // Create and save group message
        ChatMessage message = new ChatMessage();
        message.setSender(sender);
        message.setReceiver(null); // No specific receiver for group messages
        message.setMessage(request.getMessage());
        message.setChatType(request.getChatType());
        message.setDepartment(department);
        message.setIsRead(false);
        
        ChatMessage savedMessage = chatMessageRepository.save(message);
        
        return convertToDTO(savedMessage);
    }
    
    public List<ChatMessageDTO> getGroupMessages(Long departmentId, ChatMessage.ChatType chatType) {
        List<ChatMessage> messages = chatMessageRepository.findByDepartmentIdAndChatTypeOrderByCreatedAtAsc(
            departmentId, chatType
        );
        
        return messages.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<User> getGroupParticipants(Long departmentId) {
        return userRepository.findByDepartmentId(departmentId);
    }
    
    private ChatMessageDTO convertToDTO(ChatMessage message) {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setId(message.getId());
        dto.setSenderId(message.getSender().getId());
        dto.setSenderName(message.getSender().getName());
        dto.setReceiverId(message.getReceiver() != null ? message.getReceiver().getId() : null);
        dto.setReceiverName(message.getReceiver() != null ? message.getReceiver().getName() : null);
        dto.setMessage(message.getMessage());
        dto.setIsRead(message.getIsRead());
        dto.setCreatedAt(message.getCreatedAt());
        return dto;
    }
}
