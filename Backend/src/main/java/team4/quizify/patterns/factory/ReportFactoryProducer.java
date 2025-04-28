package team4.quizify.patterns.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Factory Producer for Report Factories
 */
@Component
public class ReportFactoryProducer {
    
    @Autowired
    private AdminReportFactory adminReportFactory;
    
    @Autowired
    private TeacherReportFactory teacherReportFactory;
    
    @Autowired
    private StudentReportFactory studentReportFactory;
    
    /**
     * Returns the appropriate report factory based on the user role
     */
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
