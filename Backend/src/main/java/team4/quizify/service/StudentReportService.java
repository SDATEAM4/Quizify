package team4.quizify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import team4.quizify.entity.Report;
import team4.quizify.entity.Subject;
import team4.quizify.entity.User;
import team4.quizify.entity.Quiz;
import team4.quizify.repository.ReportRepository;
import team4.quizify.repository.SubjectRepository;
import team4.quizify.repository.UserRepository;
import team4.quizify.repository.QuizRepository;

import java.util.*;

@Service
public class StudentReportService implements team4.quizify.service.Report {
    
    @Autowired
    private ReportRepository reportRepository;
    
    @Autowired
    private UserRepository userRepository;
      @Autowired
    private QuizRepository quizDataRepository;
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    @Override
    public List<Map<String, Object>> generateSubjectTeacherStudentReport() {
        return new ArrayList<>();
    }
    
    public Map<String, Object> generateStudentQuizReport(Integer quizId, Integer userId) {
        Map<String, Object> reportData = new HashMap<>();
        
        List<Report> reports = reportRepository.findByQuizIdAndUserId(quizId, userId);
        
        if (reports.isEmpty()) {
            reportData.put("message", "No report found for this quiz and user");
            return reportData;
        }
        
        Report report = reports.get(0);
          Optional<Quiz> quizOptional = quizDataRepository.findById(quizId);
        if (!quizOptional.isPresent()) {
            reportData.put("message", "Quiz not found");
            return reportData;
        }
        
        Quiz quiz = quizOptional.get();
        Integer totalMarks = quiz.getMarks();
        Integer subjectId = quiz.getSubjectId();
        
        // Get subject name
        String subjectName = "Unknown Subject";
        Optional<Subject> subjectOptional = subjectRepository.findById(subjectId);
        if (subjectOptional.isPresent()) {
            subjectName = subjectOptional.get().getName();
        }
        
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            reportData.put("studentName", user.getFname() + " " + user.getLname());
        }
        
        reportData.put("quizId", quizId);
        reportData.put("userId", userId);
        reportData.put("obtainedMarks", report.getObtainMarks());
        reportData.put("totalMarks", totalMarks);
        reportData.put("title", quiz.getTitle());
        reportData.put("description", quiz.getDescription());
        reportData.put("subjectName", subjectName);
        reportData.put("subjectId", subjectId);
        
        Double avgMarks = reportRepository.getAverageMarksByQuizId(quizId);
        Integer maxMarks = reportRepository.getMaxMarksByQuizId(quizId);
        Integer minMarks = reportRepository.getMinMarksByQuizId(quizId);
        
        reportData.put("averageMarks", avgMarks != null ? avgMarks : 0);
        reportData.put("maxMarks", maxMarks != null ? maxMarks : 0);
        reportData.put("minMarks", minMarks != null ? minMarks : 0);
        
        return reportData;
    }
    
    public List<Map<String, Object>> generateStudentAllQuizzesReport(Integer userId) {
        List<Map<String, Object>> reportData = new ArrayList<>();
        
        List<Report> reports = reportRepository.findByUserId(userId);
        
        if (reports.isEmpty()) {
            Map<String, Object> emptyReport = new HashMap<>();
            emptyReport.put("message", "No reports found for this user");
            reportData.add(emptyReport);
            return reportData;
        }
        
        Map<Integer, List<Report>> reportsByQuizId = new HashMap<>();
        for (Report report : reports) {
            Integer quizId = report.getQuizId();
            if (!reportsByQuizId.containsKey(quizId)) {
                reportsByQuizId.put(quizId, new ArrayList<>());
            }
            reportsByQuizId.get(quizId).add(report);
        }
        
        Optional<User> userOptional = userRepository.findById(userId);
        String studentName = "";
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            studentName = user.getFname() + " " + user.getLname();
        }
        
        for (Map.Entry<Integer, List<Report>> entry : reportsByQuizId.entrySet()) {
            Integer quizId = entry.getKey();
            Report report = entry.getValue().get(0);
              Optional<Quiz> quizOptional = quizDataRepository.findById(quizId);
            if (!quizOptional.isPresent()) {
                continue;
            }
            
            Quiz quiz = quizOptional.get();
            Integer totalMarks = quiz.getMarks();
            Integer subjectId = quiz.getSubjectId();
            
            // Get subject name
            String subjectName = "Unknown Subject";
            Optional<Subject> subjectOptional = subjectRepository.findById(subjectId);
            if (subjectOptional.isPresent()) {
                subjectName = subjectOptional.get().getName();
            }
            
            Map<String, Object> quizReport = new HashMap<>();
            quizReport.put("quizId", quizId);
            quizReport.put("studentName", studentName);
            quizReport.put("userId", userId);
            quizReport.put("obtainedMarks", report.getObtainMarks());
            quizReport.put("totalMarks", totalMarks);
            quizReport.put("title", quiz.getTitle());
            quizReport.put("description", quiz.getDescription());
            quizReport.put("subjectName", subjectName);
            quizReport.put("subjectId", subjectId);
            
            Double avgMarks = reportRepository.getAverageMarksByQuizId(quizId);
            Integer maxMarks = reportRepository.getMaxMarksByQuizId(quizId);
            Integer minMarks = reportRepository.getMinMarksByQuizId(quizId);
            
            quizReport.put("averageMarks", avgMarks != null ? avgMarks : 0);
            quizReport.put("maxMarks", maxMarks != null ? maxMarks : 0);
            quizReport.put("minMarks", minMarks != null ? minMarks : 0);
            
            reportData.add(quizReport);
        }
        
        return reportData;
    }
    
    public Map<String, Object> generateQuizReport(Integer quizId) {
        Map<String, Object> reportData = new HashMap<>();
        
        List<Report> reports = reportRepository.findByQuizId(quizId);
        
        if (reports.isEmpty()) {
            reportData.put("message", "No reports found for this quiz");
            return reportData;
        }
          Optional<Quiz> quizOptional = quizDataRepository.findById(quizId);
        if (!quizOptional.isPresent()) {
            reportData.put("message", "Quiz not found");
            return reportData;
        }
        
        Quiz quiz = quizOptional.get();
        Integer totalMarks = quiz.getMarks();
        Integer subjectId = quiz.getSubjectId();
        
        // Get subject name
        String subjectName = "Unknown Subject";
        Optional<Subject> subjectOptional = subjectRepository.findById(subjectId);
        if (subjectOptional.isPresent()) {
            subjectName = subjectOptional.get().getName();
        }
        
        Double avgMarks = reportRepository.getAverageMarksByQuizId(quizId);
        Integer maxMarks = reportRepository.getMaxMarksByQuizId(quizId);
        Integer minMarks = reportRepository.getMinMarksByQuizId(quizId);
        
        reportData.put("quizId", quizId);
        reportData.put("totalMarks", totalMarks);
        reportData.put("totalStudents", reports.size());
        reportData.put("averageMarks", avgMarks != null ? avgMarks : 0);
        reportData.put("maxMarks", maxMarks != null ? maxMarks : 0);
        reportData.put("minMarks", minMarks != null ? minMarks : 0);
        reportData.put("title", quiz.getTitle());
        reportData.put("description", quiz.getDescription());
        reportData.put("subjectName", subjectName);
        reportData.put("subjectId", subjectId);
        
        List<Map<String, Object>> studentPerformances = new ArrayList<>();
        for (Report report : reports) {
            Map<String, Object> performance = new HashMap<>();
            
            Optional<User> userOptional = userRepository.findById(report.getUserId());
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                performance.put("studentName", user.getFname() + " " + user.getLname());
            }
            
            performance.put("userId", report.getUserId());
            performance.put("obtainedMarks", report.getObtainMarks());
            
            studentPerformances.add(performance);
        }
        
        reportData.put("studentPerformances", studentPerformances);
        
        return reportData;
    }
    
    public Map<String, Object> generateStudentQuizMarkDistributionReport(Integer userId) {
        Map<String, Object> reportData = new HashMap<>();
        
        List<Report> reports = reportRepository.findByUserId(userId);
        
        if (reports.isEmpty()) {
            reportData.put("message", "No reports found for this user");
            return reportData;
        }
        
        // Initialize counters for each percentage range
        int range1 = 0; // 0-25%
        int range2 = 0; // 25-50%
        int range3 = 0; // 50-75%
        int range4 = 0; // 75-100%
        
        for (Report report : reports) {
            Integer quizId = report.getQuizId();
            Integer obtainedMarks = report.getObtainMarks();
            
            Optional<Quiz> quizOptional = quizDataRepository.findById(quizId);
            if (!quizOptional.isPresent()) {
                continue;
            }
            
            Quiz quiz = quizOptional.get();
            Integer totalMarks = quiz.getMarks();
            
            if (totalMarks == 0) {
                continue; // Avoid division by zero
            }
            
            // Calculate percentage
            double percentage = (double) obtainedMarks / totalMarks * 100;
            
            // Categorize by percentage range
            if (percentage >= 0 && percentage < 25) {
                range1++;
            } else if (percentage >= 25 && percentage < 50) {
                range2++;
            } else if (percentage >= 50 && percentage < 75) {
                range3++;
            } else if (percentage >= 75 && percentage <= 100) {
                range4++;
            }
        }
        
        // Return the distribution
        reportData.put("a", String.valueOf(range1)); // 0-25%
        reportData.put("b", String.valueOf(range2)); // 25-50%
        reportData.put("c", String.valueOf(range3)); // 50-75% 
        reportData.put("d", String.valueOf(range4)); // 75-100%
        
        return reportData;
    }
}
