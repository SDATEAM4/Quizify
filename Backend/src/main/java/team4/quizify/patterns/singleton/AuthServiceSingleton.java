package team4.quizify.patterns.singleton;

import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import team4.quizify.service.AuthService;


@Component
public class AuthServiceSingleton {
    private static AuthServiceSingleton instance;
    private final AuthService authService;
    
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
