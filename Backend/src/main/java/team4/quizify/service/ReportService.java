package team4.quizify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import team4.quizify.entity.Quiz;
import team4.quizify.entity.Report;
import team4.quizify.entity.TeacherReport;
import team4.quizify.repository.QuizRepository;
import team4.quizify.repository.ReportRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ReportService {
    @Autowired
    private ReportRepository reportRepository;
    
    @Autowired
    private QuizRepository quizDataRepository;
    
   
    public Report saveQuizScore(Report report) {
        // Check if the quiz exists
        Optional<Quiz> quizData = quizDataRepository.findById(report.getQuizId());
        if (quizData.isEmpty()) {
            throw new IllegalArgumentException("Quiz with ID " + report.getQuizId() + " not found");
        }
        
        // Save the report
        return reportRepository.save(report);
    }
    
   
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }
    
   
    public List<Report> getReportsByUserId(Integer userId) {
        return reportRepository.findByUserId(userId);
    }
    
   
    public List<Report> getReportsByQuizId(Integer quizId) {
        return reportRepository.findByQuizId(quizId);
    }
    
    // Method to generate a report for a specific quiz
    public TeacherReport generateTeacherReport(Integer quizId) {
        // Check if the quiz exists
        Optional<Quiz> quizData = quizDataRepository.findById(quizId);
        if (quizData.isEmpty()) {
            throw new IllegalArgumentException("Quiz with ID " + quizId + " not found");
        }
        
        TeacherReport teacherReport = new TeacherReport();
        teacherReport.setQuizId(quizId);
        
        // Get all reports for the quiz
        List<Report> reports = reportRepository.findByQuizId(quizId);
        teacherReport.setTotalStudentsAttempted(reports.size());
        
        // Get average marks
        Double averageMarks = reportRepository.getAverageMarksByQuizId(quizId);
        teacherReport.setAverageMarks(averageMarks != null ? averageMarks : 0.0);
        
        // Get maximum marks
        Integer maxMarks = reportRepository.getMaxMarksByQuizId(quizId);
        teacherReport.setMaximumMarks(maxMarks != null ? maxMarks : 0);
        
        // Get minimum marks
        Integer minMarks = reportRepository.getMinMarksByQuizId(quizId);
        teacherReport.setMinimumMarks(minMarks != null ? minMarks : 0);
        
        // Set total available marks from the quiz data
        Quiz quiz = quizData.get();
        teacherReport.setTotalAvailableMarks(quiz.getMarks());
        
        // Add additional quiz context information
        teacherReport.setQuizLevel(quiz.getLevel());
        teacherReport.setQuizType(quiz.getType());
        teacherReport.setTimeLimit(quiz.getTimelimit());
        teacherReport.setSubjectId(quiz.getSubjectId());
        
        return teacherReport;
    }
    
    /**
     * Delete all reports for a specific quiz
     * 
     * @param quizId The ID of the quiz to delete reports for
     * @return The number of reports deleted
     */
    public int deleteReportsByQuizId(Integer quizId) {
        List<Report> reports = reportRepository.findByQuizId(quizId);
        int count = reports.size();
        reportRepository.deleteAll(reports);
        return count;
    }
}
