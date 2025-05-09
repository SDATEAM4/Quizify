package team4.quizify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import team4.quizify.entity.Query;
import java.util.List;
import java.util.Optional;

public interface QueryRepository extends JpaRepository<Query, Long> {
    List<Query> findByReceiverIdAndResolveStatusFalse(int receiverId);
    Optional<Query> findBySenderIdAndReceiverIdAndResolveStatusFalse(int senderId, int receiverId);
    List<Query> findBySenderIdAndResolveStatusFalse(int senderId);
}
