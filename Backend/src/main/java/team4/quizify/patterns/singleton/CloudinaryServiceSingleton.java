package team4.quizify.patterns.singleton;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import team4.quizify.service.CloudinaryService;

/**
 * Singleton wrapper for CloudinaryService
 * This ensures there is only one instance of CloudinaryService throughout the application
 */
@Component
public class CloudinaryServiceSingleton {
    private static CloudinaryServiceSingleton instance;
    private final CloudinaryService cloudinaryService;
    
    @Autowired
    private CloudinaryServiceSingleton(ApplicationContext context) {
        this.cloudinaryService = context.getBean(CloudinaryService.class);
    }
    
    public static synchronized CloudinaryServiceSingleton getInstance(ApplicationContext context) {
        if (instance == null) {
            instance = new CloudinaryServiceSingleton(context);
        }
        return instance;
    }
    
    public CloudinaryService getCloudinaryService() {
        return cloudinaryService;
    }
}
