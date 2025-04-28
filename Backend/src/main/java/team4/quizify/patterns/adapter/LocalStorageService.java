package team4.quizify.patterns.adapter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * Local file system storage implementation
 */
@Service
public class LocalStorageService implements StorageService {

    @Value("${local.storage.path:upload-dir}")
    private String storagePath;

    @Override
    public String uploadFile(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new IOException("Failed to store empty file");
            }
            
            Path rootLocation = Paths.get(storagePath);
            
            // Create directory if it doesn't exist
            if (!Files.exists(rootLocation)) {
                Files.createDirectories(rootLocation);
            }
            
            // Generate a unique file name
            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
            
            // Create file path
            Path destinationFile = rootLocation.resolve(Paths.get(uniqueFileName)).normalize();
            
            // Copy file to destination
            Files.copy(file.getInputStream(), destinationFile);
            
            // Return the file path or identifier
            return destinationFile.toString();
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    @Override
    public boolean deleteFile(String fileIdentifier) {
        try {
            File file = new File(fileIdentifier);
            return file.delete();
        } catch (Exception e) {
            return false;
        }
    }
}
