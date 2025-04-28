package team4.quizify.patterns.factory;

import team4.quizify.entity.Quiz;
import java.util.Map;


public interface QuizFactory {
    Quiz createQuiz(Map<String, Object> requestBody);
    Quiz editQuiz(Integer quizId, Map<String, Object> requestBody);
}
