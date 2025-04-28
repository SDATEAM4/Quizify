package team4.quizify.patterns.singleton;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import team4.quizify.service.AuthService;

/**
 * Singleton wrapper for AuthService
 * This ensures there is only one instance of AuthService throughout the application
 */
@Component
public class AuthServiceSingleton {
    private static AuthServiceSingleton instance;
    private final AuthService authService;
    
    @Autowired
    private AuthServiceSingleton(ApplicationContext context) {
        this.authService = context.getBean(AuthService.class);
    }
    
    public static synchronized AuthServiceSingleton getInstance(ApplicationContext context) {
        if (instance == null) {
            instance = new AuthServiceSingleton(context);
        }
        return instance;
    }
    
    public AuthService getAuthService() {
        return authService;
    }
}
