package team4.quizify.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team4.quizify.entity.Chat;
import team4.quizify.entity.Query;
import team4.quizify.repository.ChatRepository;
import team4.quizify.repository.QueryRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QueryService {

    private final QueryRepository queryRepository;
    private final ChatRepository chatRepository;

    public List<Query> getUnresolvedQueriesForTeacher(int teacherId) {
        return queryRepository.findByReceiverIdAndResolveStatusFalse(teacherId);
    }

    @Transactional
    public boolean resolveQueryAndDeleteChats(Long queryId) {
        Optional<Query> optionalQuery = queryRepository.findById(queryId);
        if (optionalQuery.isEmpty()) {
            return false;
        }

        Query query = optionalQuery.get();

        // Delete all chats linked to this query
        Long[] chatIds = query.getChatIds();
        List<Chat> chatsToDelete = chatRepository.findAllById(Arrays.asList(chatIds));
        chatRepository.deleteAll(chatsToDelete);

        // Finally delete the query itself
        queryRepository.delete(query);

        return true;
    }
}
