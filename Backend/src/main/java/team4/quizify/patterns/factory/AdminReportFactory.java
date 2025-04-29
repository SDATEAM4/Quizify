package team4.quizify.patterns.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import team4.quizify.service.AdminReportService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Component
public class AdminReportFactory implements ReportFactory {

    @Autowired
    private AdminReportService adminReportService;
    
    @Override
    public Map<String, Object> generateReport(Integer id) {
        // Admins don't typically generate reports for a single entity ID
        Map<String, Object> emptyReport = new HashMap<>();
        emptyReport.put("message", "Admin reports are aggregated across the system, not per entity");
        return emptyReport;
    }

    @Override
    public List<Map<String, Object>> generateAllReports(Integer id) {
        // For admins, generate a subject-teacher-student relationship report
        return adminReportService.generateSubjectTeacherStudentReport();
    }
    
 
    public List<Map<String, Object>> generateSubjectTeacherStudentReport() {
        return adminReportService.generateSubjectTeacherStudentReport();
    }
}
