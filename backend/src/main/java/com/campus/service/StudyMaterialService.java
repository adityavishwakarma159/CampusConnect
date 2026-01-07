package com.campus.service;

import com.campus.dto.StudyMaterialDTO;
import com.campus.dto.UploadMaterialRequest;
import com.campus.exception.CustomExceptions;
import com.campus.model.Department;
import com.campus.model.Notification;
import com.campus.model.StudyMaterial;
import com.campus.model.User;
import com.campus.repository.NotificationRepository;
import com.campus.repository.StudyMaterialRepository;
import com.campus.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudyMaterialService {
    
    private final StudyMaterialRepository studyMaterialRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final FileStorageService fileStorageService;
    
    @Transactional
    public StudyMaterialDTO uploadMaterial(UploadMaterialRequest request, MultipartFile file, Long facultyId) {
        User faculty = userRepository.findById(facultyId)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("Faculty not found"));
        
        if (faculty.getDepartment() == null) {
            throw new RuntimeException("User must be assigned to a department to upload study materials");
        }
        
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is required");
        }
        
        // Store file
        String fileUrl = fileStorageService.storeFile(
            file,
            "study-materials/" + faculty.getDepartment().getId()
        );
        
        StudyMaterial material = new StudyMaterial();
        material.setTitle(request.getTitle());
        material.setDescription(request.getDescription());
        material.setDepartment(faculty.getDepartment());
        material.setUploadedBy(faculty);
        material.setSubject(request.getSubject());
        material.setTopic(request.getTopic());
        material.setType(request.getType());
        material.setFileUrl(fileUrl);
        material.setFileName(file.getOriginalFilename());
        material.setFileSize(file.getSize());
        material.setFileType(file.getContentType());
        material.setDownloadCount(0);
        
        StudyMaterial saved = studyMaterialRepository.save(material);
        
        // Notify department students
        notifyDepartmentStudents(saved);
        
        return convertToDTO(saved);
    }
    
    public List<StudyMaterialDTO> getMaterials(Long departmentId) {
        List<StudyMaterial> materials = studyMaterialRepository.findByDepartmentIdOrderByCreatedAtDesc(departmentId);
        return materials.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public StudyMaterialDTO getMaterialById(Long id) {
        StudyMaterial material = studyMaterialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Study material not found"));
        return convertToDTO(material);
    }
    
    @Transactional
    public StudyMaterialDTO updateMaterial(Long id, UploadMaterialRequest request) {
        StudyMaterial material = studyMaterialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Study material not found"));
        
        material.setTitle(request.getTitle());
        material.setDescription(request.getDescription());
        material.setSubject(request.getSubject());
        material.setTopic(request.getTopic());
        material.setType(request.getType());
        
        StudyMaterial updated = studyMaterialRepository.save(material);
        return convertToDTO(updated);
    }
    
    @Transactional
    public void deleteMaterial(Long id) {
        StudyMaterial material = studyMaterialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Study material not found"));
        
        // Delete file
        try {
            fileStorageService.deleteFile(material.getFileUrl());
        } catch (Exception e) {
            log.error("Error deleting file: {}", e.getMessage());
        }
        
        // Delete record
        studyMaterialRepository.delete(material);
    }
    
    @Transactional
    public Resource downloadMaterial(Long id) {
        StudyMaterial material = studyMaterialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Study material not found"));
        
        // Increment download count
        material.setDownloadCount(material.getDownloadCount() + 1);
        studyMaterialRepository.save(material);
        
        // Load file - extract subfolder from fileUrl
        String fileUrl = material.getFileUrl();
        int lastSlash = fileUrl.lastIndexOf('/');
        String subFolder = fileUrl.substring(0, lastSlash);
        String fileName = fileUrl.substring(lastSlash + 1);
        
        return fileStorageService.loadFileAsResource(fileName, subFolder);
    }
    
    public List<StudyMaterialDTO> searchMaterials(String query, Long departmentId, String subject, String type) {
        List<StudyMaterial> materials = studyMaterialRepository.search(query, departmentId, subject, type);
        return materials.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<String> getSubjects(Long departmentId) {
        return studyMaterialRepository.findDistinctSubjectsByDepartmentId(departmentId);
    }
    
    private void notifyDepartmentStudents(StudyMaterial material) {
        Department department = material.getDepartment();
        List<User> students = userRepository.findByDepartmentId(department.getId()).stream()
                .filter(u -> u.getRole() == User.Role.STUDENT)
                .collect(Collectors.toList());
        
        for (User student : students) {
            Notification notification = new Notification();
            notification.setUserId(student.getId());
            notification.setTitle("New Study Material");
            notification.setMessage("New " + material.getType().toString().replace("_", " ").toLowerCase() + 
                    " uploaded: " + material.getTitle() + " (" + material.getSubject() + ")");
            notification.setType(Notification.NotificationType.STUDY_MATERIAL);
            notification.setReferenceId(material.getId());
            notification.setIsRead(false);
            
            notificationRepository.save(notification);
        }
        
        log.info("Sent study material notifications to {} students", students.size());
    }
    
    private StudyMaterialDTO convertToDTO(StudyMaterial material) {
        StudyMaterialDTO dto = new StudyMaterialDTO();
        dto.setId(material.getId());
        dto.setTitle(material.getTitle());
        dto.setDescription(material.getDescription());
        dto.setDepartmentId(material.getDepartment().getId());
        dto.setDepartmentName(material.getDepartment().getName());
        dto.setUploadedById(material.getUploadedBy().getId());
        dto.setUploadedByName(material.getUploadedBy().getName());
        dto.setSubject(material.getSubject());
        dto.setTopic(material.getTopic());
        dto.setType(material.getType());
        dto.setFileName(material.getFileName());
        dto.setFileSize(material.getFileSize());
        dto.setFileType(material.getFileType());
        dto.setDownloadCount(material.getDownloadCount());
        dto.setCreatedAt(material.getCreatedAt());
        dto.setUpdatedAt(material.getUpdatedAt());
        return dto;
    }
}
