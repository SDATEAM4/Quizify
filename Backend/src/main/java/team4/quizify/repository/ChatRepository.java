package team4.quizify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import team4.quizify.entity.Chat;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findBySenderIdOrReceiverId(int senderId, int receiverId);

    List<Chat> findByReceiverId(int receiverId);
    List<Chat> findAllById(Iterable<Long> ids);
    @Query("SELECT c FROM Chat c WHERE (c.senderId = ?1 AND c.receiverId = ?2) OR (c.senderId = ?2 AND c.receiverId = ?1)")
    List<Chat> findByTeacherAndStudent(int teacherId, int studentId);
}
