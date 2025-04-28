package team4.quizify.patterns.adapter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


@Service
public class StorageManager {

    @Value("${storage.type:cloudinary}")
    private String storageType;
    
    @Autowired
    private CloudinaryStorageAdapter cloudinaryStorageAdapter;
    
    @Autowired
    private LocalStorageService localStorageService;
    
 
    public StorageService getStorageService() {
        if ("local".equalsIgnoreCase(storageType)) {
            return localStorageService;
        } else {
            return cloudinaryStorageAdapter;
        }
    }
    
  
    public String uploadFile(MultipartFile file) {
        return getStorageService().uploadFile(file);
    }
    
  
    public boolean deleteFile(String fileIdentifier) {
        return getStorageService().deleteFile(fileIdentifier);
    }
}
