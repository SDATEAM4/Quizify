package team4.quizify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import team4.quizify.entity.Chat;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findBySenderIdOrReceiverId(Long senderId, Long receiverId);

    List<Chat> findByReceiverId(Long receiverId);

    List<Chat> findBySubjectId(Integer subjectId); // ✅ This line enables subject-based search

    @Query("SELECT c FROM Chat c WHERE (c.senderId = ?1 AND c.receiverId = ?2) OR (c.senderId = ?2 AND c.receiverId = ?1)")
    List<Chat> findByTeacherAndStudent(Long teacherId, Long studentId); // ✅ Bidirectional
}
