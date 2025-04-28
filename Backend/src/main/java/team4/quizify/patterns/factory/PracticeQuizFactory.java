package team4.quizify.patterns.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import team4.quizify.entity.PracticeQuiz;
import team4.quizify.service.QuizService;
import java.util.List;
import java.util.Map;

/**
 * Factory for creating Practice Quizzes
 */
@Component
public class PracticeQuizFactory {
    
    @Autowired
    private QuizService quizService;
    
    /**
     * Creates a practice quiz based on provided parameters
     */
    public List<PracticeQuiz> createPracticeQuiz(String subject, String topic, String description, 
                                                String level, int numQuestions) {
        // Validate parameters
        if (numQuestions > 20) {
            numQuestions = 20;
        } else if (numQuestions < 1) {
            numQuestions = 5;
        }
        
        // Generate quiz using the QuizService (OpenRouter API)
        return quizService.generateQuiz(subject, topic, description, level, numQuestions);
    }
}
