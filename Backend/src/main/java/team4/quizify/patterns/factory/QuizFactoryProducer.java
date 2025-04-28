package team4.quizify.patterns.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Abstract Factory for creating different types of Quizzes
 */
@Component
public class QuizFactoryProducer {
    
    @Autowired
    private ManualQuizFactory manualQuizFactory;
    
    @Autowired
    private AutoQuizFactory autoQuizFactory;
    
    @Autowired
    private PracticeQuizFactory practiceQuizFactory;
    
    /**
     * Returns the appropriate quiz factory based on the quiz type
     */
    public QuizFactory getFactory(String quizType) {
        if (quizType == null) {
            return null;
        }
        
        if (quizType.equalsIgnoreCase("Manual")) {
            return manualQuizFactory;
        } else if (quizType.equalsIgnoreCase("Auto")) {
            return autoQuizFactory;
        }
        
        return null;
    }
    
    /**
     * Returns the practice quiz factory
     */
    public PracticeQuizFactory getPracticeQuizFactory() {
        return practiceQuizFactory;
    }
}
