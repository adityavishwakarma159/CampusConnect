package com.campus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkUploadResponse {
    private int totalRows;
    private int successCount;
    private int errorCount;
    private List<UserDTO> createdUsers = new ArrayList<>();
    private List<ExcelError> errors = new ArrayList<>();
}
