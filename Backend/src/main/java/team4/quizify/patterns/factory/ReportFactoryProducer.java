package team4.quizify.patterns.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class ReportFactoryProducer {
    
    @Autowired
    private AdminReportFactory adminReportFactory;
    
    @Autowired
    private TeacherReportFactory teacherReportFactory;
    
    @Autowired
    private StudentReportFactory studentReportFactory;
    
 
    public ReportFactory getFactory(String userRole) {
        if (userRole == null) {
            return null;
        }
        
        if (userRole.equalsIgnoreCase("Admin")) {
            return adminReportFactory;
        } else if (userRole.equalsIgnoreCase("Teacher")) {
            return teacherReportFactory;
        } else if (userRole.equalsIgnoreCase("Student")) {
            return studentReportFactory;
        }
        
        return null;
    }
}
