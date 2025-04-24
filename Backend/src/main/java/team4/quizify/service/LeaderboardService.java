package team4.quizify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import team4.quizify.entity.Report;
import team4.quizify.entity.Student;
import team4.quizify.entity.User;
import team4.quizify.repository.ReportRepository;
import team4.quizify.repository.StudentRepository;

import java.util.*;

@Service
public class LeaderboardService {
    
    @Autowired
    private ReportRepository reportRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    public List<Map<String, Object>> getLeaderboard() {
        // Get all reports and students
        List<Report> allReports = reportRepository.findAll();
        List<Student> allStudents = studentRepository.findAll();
        
        System.out.println("Total reports found: " + allReports.size());
        System.out.println("Total students found: " + allStudents.size());
        
        // Group reports by userId and calculate total points for each user
        Map<Integer, Integer> userPointsMap = new HashMap<>();
        
        for (Report report : allReports) {
            Integer userId = report.getUserId();
            Integer points = report.getPoints() != null ? report.getPoints() : 0;
            
            userPointsMap.put(userId, userPointsMap.getOrDefault(userId, 0) + points);
        }
        
        System.out.println("Users with points: " + userPointsMap.size());
        
        // Convert to a list of entries for sorting
        List<Map<String, Object>> leaderboardEntries = new ArrayList<>();
        
        // Add all students to the leaderboard, whether they have attempted quizzes or not
        for (Student student : allStudents) {
            User user = student.getUser();
            if (user != null) {
                Integer userId = user.getUserId();
                
                Map<String, Object> leaderboardEntry = new HashMap<>();
                leaderboardEntry.put("userId", userId);
                leaderboardEntry.put("username", user.getUsername());
                leaderboardEntry.put("name", user.getFname() + " " + user.getLname());
                
                // Get total points from the map or default to 0
                Integer totalPoints = userPointsMap.getOrDefault(userId, 0);
                leaderboardEntry.put("points", totalPoints);
                
                // Add attempted quiz count
                leaderboardEntry.put("attemptedQuizCount", student.getAttemptedQuiz() != null ? 
                    student.getAttemptedQuiz().length : 0);
                
                leaderboardEntries.add(leaderboardEntry);
            }
        }
        
        System.out.println("Total leaderboard entries: " + leaderboardEntries.size());
        
        // Sort by points (descending)
        leaderboardEntries.sort((a, b) -> ((Integer) b.get("points")).compareTo((Integer) a.get("points")));
        
        // Add position numbers with equal positions for equal points
        if (!leaderboardEntries.isEmpty()) {
            int position = 1;
            Integer prevPoints = (Integer) leaderboardEntries.get(0).get("points");
            leaderboardEntries.get(0).put("position", position);
            
            for (int i = 1; i < leaderboardEntries.size(); i++) {
                Integer currentPoints = (Integer) leaderboardEntries.get(i).get("points");
                if (!currentPoints.equals(prevPoints)) {
                    position = i + 1; // Update position only when points differ
                }
                leaderboardEntries.get(i).put("position", position);
                prevPoints = currentPoints;
            }
        }
        
        return leaderboardEntries;
    }
}
