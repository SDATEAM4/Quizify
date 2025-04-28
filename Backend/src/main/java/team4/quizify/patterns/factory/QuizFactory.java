package team4.quizify.patterns.factory;

import team4.quizify.entity.Quiz;
import java.util.List;
import java.util.Map;

/**
 * Interface for Quiz Factory
 * Defines common operations for all quiz factories
 */
public interface QuizFactory {
    Quiz createQuiz(Map<String, Object> requestBody);
    Quiz editQuiz(Integer quizId, Map<String, Object> requestBody);
}
