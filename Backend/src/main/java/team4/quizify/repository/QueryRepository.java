package team4.quizify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import team4.quizify.entity.Query;
import java.util.List;

public interface QueryRepository extends JpaRepository<Query, Long> {
    List<Query> findByReceiverIdAndResolveStatusFalse(int receiverId);
}
