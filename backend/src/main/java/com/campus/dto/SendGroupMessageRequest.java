package com.campus.dto;

import com.campus.model.ChatMessage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendGroupMessageRequest {
    
    @NotNull(message = "Department ID is required")
    private Long departmentId;
    
    @NotNull(message = "Chat type is required")
    private ChatMessage.ChatType chatType;
    
    @NotBlank(message = "Message is required")
    private String message;
}
