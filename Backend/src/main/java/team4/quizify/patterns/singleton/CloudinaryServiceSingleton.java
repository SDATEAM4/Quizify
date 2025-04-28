package team4.quizify.patterns.singleton;

import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import team4.quizify.service.CloudinaryService;

@Component
public class CloudinaryServiceSingleton {
    private static CloudinaryServiceSingleton instance;
    private final CloudinaryService cloudinaryService;
    
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
