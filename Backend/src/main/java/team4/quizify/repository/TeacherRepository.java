package team4.quizify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import team4.quizify.entity.Teacher;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Integer> {    // Find teacher by user ID
    Teacher findByUser_UserId(Integer userId);
}
