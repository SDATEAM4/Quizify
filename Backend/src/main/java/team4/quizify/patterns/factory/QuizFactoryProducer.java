package team4.quizify.patterns.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class QuizFactoryProducer {
    
    @Autowired
    private ManualQuizFactory manualQuizFactory;
    
    @Autowired
    private AutoQuizFactory autoQuizFactory;
    
    @Autowired
    private PracticeQuizFactory practiceQuizFactory;
    
    
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
    

    public PracticeQuizFactory getPracticeQuizFactory() {
        return practiceQuizFactory;
    }
}
