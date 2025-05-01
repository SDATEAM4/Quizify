package team4.quizify.patterns.adapter;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import team4.quizify.service.CloudinaryService;


@Service
public class CloudinaryStorageAdapter implements StorageService {

    private final CloudinaryService cloudinaryService;
    
    
    public CloudinaryStorageAdapter(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @Override
    public String uploadFile(MultipartFile file) {
        return cloudinaryService.uploadFile(file);
    }
}
