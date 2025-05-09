package team4.quizify.patterns.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class UserFactoryProducer {
    
    @Autowired
    private StudentFactory studentFactory;
    
    @Autowired
    private TeacherFactory teacherFactory;
    
   
    public UserFactory getFactory(String userRole) {
        if (userRole == null) {
            return null;
        }
        
        if (userRole.equalsIgnoreCase("Student")) {
            return studentFactory;
        } else if (userRole.equalsIgnoreCase("Teacher")) {
            return teacherFactory;
        }
        
        return null;
    }
}
