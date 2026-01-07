package com.campus.service;

import com.campus.exception.CustomExceptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {
    
    private final Path fileStorageLocation;
    
    public FileStorageService(@Value("${file.upload-dir:d:/Demo/uploads}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }
    
    public String storeFile(MultipartFile file, String subFolder) {
        // Normalize file name
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        
        try {
            // Check if the file's name contains invalid characters
            if (originalFileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + originalFileName);
            }
            
            // Generate unique filename
            String fileExtension = "";
            if (originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
            
            // Create subfolder if it doesn't exist
            Path targetLocation = this.fileStorageLocation.resolve(subFolder);
            Files.createDirectories(targetLocation);
            
            // Copy file to the target location
            Path filePath = targetLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            return subFolder + "/" + uniqueFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }
    
    public Resource loadFileAsResource(String fileName, String subFolder) {
        try {
            Path filePath = this.fileStorageLocation.resolve(subFolder).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                return resource;
            } else {
                throw new CustomExceptions.UserNotFoundException("File not found " + fileName);
            }
        } catch (Exception ex) {
            throw new CustomExceptions.UserNotFoundException("File not found " + fileName);
        }
    }
    
    public void deleteFile(String filePath) {
        try {
            Path path = this.fileStorageLocation.resolve(filePath).normalize();
            Files.deleteIfExists(path);
        } catch (IOException ex) {
            log.error("Could not delete file " + filePath, ex);
        }
    }
}
