package team4.quizify.patterns.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import team4.quizify.service.StudentReportService;

import java.util.List;
import java.util.Map;


@Component
public class StudentReportFactory implements ReportFactory {

    @Autowired
    private StudentReportService studentReportService;
    
    @Override
    public Map<String, Object> generateReport(Integer quizId) {
        // For students, generate a report for a specific quiz
        return studentReportService.generateQuizReport(quizId);
    }
    
    
    public Map<String, Object> generateStudentQuizReport(Integer quizId, Integer userId) {
        return studentReportService.generateStudentQuizReport(quizId, userId);
    }

    @Override
    public List<Map<String, Object>> generateAllReports(Integer userId) {
        // For students, generate reports for all quizzes
        return studentReportService.generateStudentAllQuizzesReport(userId);
    }

    
    public Map<String, Object> generateMarkDistributionReport(Integer userId) {
        return studentReportService.generateStudentQuizMarkDistributionReport(userId);
    }
}
