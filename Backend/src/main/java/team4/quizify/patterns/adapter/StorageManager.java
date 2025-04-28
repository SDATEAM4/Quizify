package team4.quizify.patterns.adapter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Storage manager that selects appropriate storage adapter
 * based on configuration and requirements
 */
@Service
public class StorageManager {

    @Value("${storage.type:cloudinary}")
    private String storageType;
    
    @Autowired
    private CloudinaryStorageAdapter cloudinaryStorageAdapter;
    
    @Autowired
    private LocalStorageService localStorageService;
    
    /**
     * Gets the appropriate storage service based on configuration
     */
    public StorageService getStorageService() {
        if ("local".equalsIgnoreCase(storageType)) {
            return localStorageService;
        } else {
            return cloudinaryStorageAdapter;
        }
    }
    
    /**
     * Uploads file using the configured storage service
     */
    public String uploadFile(MultipartFile file) {
        return getStorageService().uploadFile(file);
    }
    
    /**
     * Deletes file using the configured storage service
     */
    public boolean deleteFile(String fileIdentifier) {
        return getStorageService().deleteFile(fileIdentifier);
    }
}
