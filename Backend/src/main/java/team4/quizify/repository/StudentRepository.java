package team4.quizify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import team4.quizify.entity.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    // Find student by user ID
    Student findByUserId(Long userId);
}
