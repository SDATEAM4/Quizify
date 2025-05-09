package team4.quizify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team4.quizify.entity.Report;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {
    // Find reports by quiz ID
    List<Report> findByQuizId(Integer quizId);
    
    // Find reports by user ID
    List<Report> findByUserId(Integer userId);
    
    // Find reports by both quiz ID and user ID
    List<Report> findByQuizIdAndUserId(Integer quizId, Integer userId);
    
    // Custom query to get average marks for a quiz
    @Query("SELECT AVG(r.obtainMarks) FROM Report r WHERE r.quizId = :quizId")
    Double getAverageMarksByQuizId(@Param("quizId") Integer quizId);
    
    // Custom query to get maximum marks for a quiz
    @Query("SELECT MAX(r.obtainMarks) FROM Report r WHERE r.quizId = :quizId")
    Integer getMaxMarksByQuizId(@Param("quizId") Integer quizId);
    
    // Custom query to get minimum marks for a quiz
    @Query("SELECT MIN(r.obtainMarks) FROM Report r WHERE r.quizId = :quizId")
    Integer getMinMarksByQuizId(@Param("quizId") Integer quizId);
}
