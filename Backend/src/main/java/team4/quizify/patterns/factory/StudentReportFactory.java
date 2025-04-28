package team4.quizify.patterns.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import team4.quizify.service.StudentReportService;

import java.util.List;
import java.util.Map;

/**
 * Concrete implementation of ReportFactory for Student Reports
 */
@Component
public class StudentReportFactory implements ReportFactory {

    @Autowired
    private StudentReportService studentReportService;
    
    @Override
    public Map<String, Object> generateReport(Integer quizId) {
        // For students, generate a report for a specific quiz
        // Note: This requires a student ID as well, so we overload this method below
        return studentReportService.generateQuizReport(quizId);
    }
    
    /**
     * Generate a report for a specific student and quiz
     */
    public Map<String, Object> generateStudentQuizReport(Integer quizId, Integer userId) {
        return studentReportService.generateStudentQuizReport(quizId, userId);
    }

    @Override
    public List<Map<String, Object>> generateAllReports(Integer userId) {
        // For students, generate reports for all quizzes
        return studentReportService.generateStudentAllQuizzesReport(userId);
    }
    
    /**
     * Generate a mark distribution report for a student
     */
    public Map<String, Object> generateMarkDistributionReport(Integer userId) {
        return studentReportService.generateStudentQuizMarkDistributionReport(userId);
    }
}
