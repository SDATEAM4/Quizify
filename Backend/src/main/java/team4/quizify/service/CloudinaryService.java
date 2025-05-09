package team4.quizify.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {
    private static final Logger logger = LoggerFactory.getLogger(CloudinaryService.class);

    @Autowired
    private Cloudinary cloudinary;    public String uploadFile(MultipartFile file) {
        try {
            logger.info("Attempting to upload file to Cloudinary: {}", file.getOriginalFilename());
            
            // Use the proper authentication params instead of empty map
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), 
                ObjectUtils.asMap(
                    "resource_type", "auto"
                ));
                
            logger.info("Successfully uploaded file to Cloudinary");
            return (String) uploadResult.get("url");
        } catch (IOException e) {
            logger.error("Error uploading file to Cloudinary: {}", e.getMessage(), e);
            throw new RuntimeException("Error uploading file to Cloudinary: " + e.getMessage(), e);
        }
    }
}