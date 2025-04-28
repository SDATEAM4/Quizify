package team4.quizify.patterns.adapter;

import org.springframework.web.multipart.MultipartFile;

/**
 * Storage interface defining common storage operations
 */
public interface StorageService {
    String uploadFile(MultipartFile file);
    boolean deleteFile(String fileIdentifier);
}
