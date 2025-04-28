package team4.quizify.patterns.singleton;

import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import team4.quizify.service.QuizService;

@Component
public class OpenRouterServiceSingleton {
    private static OpenRouterServiceSingleton instance;
    private final QuizService quizService;
    
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
