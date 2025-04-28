package team4.quizify.patterns.singleton;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import team4.quizify.service.QuizService;

/**
 * Singleton wrapper for QuizService (OpenRouter API service)
 * This ensures there is only one instance of the OpenRouter API service throughout the application
 */
@Component
public class OpenRouterServiceSingleton {
    private static OpenRouterServiceSingleton instance;
    private final QuizService quizService;
    
    @Autowired
    private OpenRouterServiceSingleton(ApplicationContext context) {
        this.quizService = context.getBean(QuizService.class);
    }
    
    public static synchronized OpenRouterServiceSingleton getInstance(ApplicationContext context) {
        if (instance == null) {
            instance = new OpenRouterServiceSingleton(context);
        }
        return instance;
    }
    
    public QuizService getQuizService() {
        return quizService;
    }
}
