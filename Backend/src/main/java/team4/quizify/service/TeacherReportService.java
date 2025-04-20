package team4.quizify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import team4.quizify.entity.Quiz;
import team4.quizify.entity.Report;
import team4.quizify.repository.QuizRepository;
import team4.quizify.repository.ReportRepository;

import java.util.*;


@Service
public class TeacherReportService {
      @Autowired
    private ReportRepository reportRepository;
    
    @Autowired
    private QuizRepository quizDataRepository;
    
    public List<Map<String, Object>> generateSubjectTeacherStudentReport() {
        return new ArrayList<>();
    }
    
    // Method to generate a report for a specific quiz taken by a student
    public Map<String, Object> generateQuizStatistics(Integer quizId) {
        Map<String, Object> statistics = new HashMap<>();
        
        // Check if the quiz exists
        Optional<Quiz> quizDataOptional = quizDataRepository.findById(quizId);
        if (quizDataOptional.isEmpty()) {
            statistics.put("error", "Quiz not found with ID: " + quizId);
            return statistics;
        }
        
        Quiz quizData = quizDataOptional.get();
        
        // Get all reports for the quiz
        List<Report> reports = reportRepository.findByQuizId(quizId);
        
        if (reports.isEmpty()) {
            statistics.put("quizId", quizId);
            statistics.put("quizName", quizData.getType()); 
            statistics.put("totalMarks", quizData.getMarks());
            statistics.put("message", "No students have attempted this quiz yet.");
            statistics.put("totalAttempts", 0);
            statistics.put("averageMarks", 0);
            statistics.put("maximumMarks", 0);
            statistics.put("minimumMarks", 0);
            return statistics;
        }
        
        // Get total number of students who attempted
        int totalAttempts = reports.size();
        
        // Calculate statistics
        Double averageMarks = reportRepository.getAverageMarksByQuizId(quizId);
        Integer maxMarks = reportRepository.getMaxMarksByQuizId(quizId);
        Integer minMarks = reportRepository.getMinMarksByQuizId(quizId);
        
        // Build response
        statistics.put("quizId", quizId);
        statistics.put("quizName", quizData.getType()); 
        statistics.put("totalMarks", quizData.getMarks());
        statistics.put("totalAttempts", totalAttempts);
        statistics.put("averageMarks", averageMarks != null ? averageMarks : 0);
        statistics.put("maximumMarks", maxMarks != null ? maxMarks : 0);
        statistics.put("minimumMarks", minMarks != null ? minMarks : 0);
        statistics.put("level", quizData.getLevel());
        statistics.put("timeLimit", quizData.getTimelimit());
        statistics.put("subjectId", quizData.getSubjectId());
        
        return statistics;
    }
}
