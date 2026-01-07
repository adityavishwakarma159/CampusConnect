package com.campus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {
    
    @NotNull(message = "Receiver ID is required")
    private Long receiverId;
    
    @NotBlank(message = "Message is required")
    private String message;
}
