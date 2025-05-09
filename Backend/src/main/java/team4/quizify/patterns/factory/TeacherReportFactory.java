package team4.quizify.patterns.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import team4.quizify.service.TeacherReportService;

import java.util.List;
import java.util.Map;


@Component
public class TeacherReportFactory implements ReportFactory {

    @Autowired
    private TeacherReportService teacherReportService;
    
    @Override
    public Map<String, Object> generateReport(Integer quizId) {
        // For teachers, generate statistics for a specific quiz
        return teacherReportService.generateQuizStatistics(quizId);
    }

    @Override
    public List<Map<String, Object>> generateAllReports(Integer teacherId) {
        // For teachers, generate reports for all their quizzes
        return teacherReportService.generateTeacherAllQuizzesReport(teacherId);
    }
}
