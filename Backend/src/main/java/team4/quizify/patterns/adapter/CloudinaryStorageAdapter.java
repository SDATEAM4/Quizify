package team4.quizify.patterns.adapter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import team4.quizify.service.CloudinaryService;

/**
 * Adapter implementation for Cloudinary storage
 */
@Service
public class CloudinaryStorageAdapter implements StorageService {

    private final CloudinaryService cloudinaryService;
    
    @Autowired
    public CloudinaryStorageAdapter(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @Override
    public String uploadFile(MultipartFile file) {
        return cloudinaryService.uploadFile(file);
    }

    @Override
    public boolean deleteFile(String fileIdentifier) {
        // This is a placeholder as the current CloudinaryService doesn't 
        // support deletion. It would be implemented here when needed.
        return false;
    }
}
