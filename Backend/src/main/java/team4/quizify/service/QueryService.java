package team4.quizify.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import team4.quizify.entity.Query;
import team4.quizify.repository.QueryRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QueryService {

    private final QueryRepository queryRepository;

    public List<Query> getUnresolvedQueriesForTeacher(int teacherId) {
        return queryRepository.findByReceiverIdAndResolveStatusFalse(teacherId);
    }
}
