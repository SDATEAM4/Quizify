package team4.quizify.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team4.quizify.entity.Chat;
import team4.quizify.entity.Query;
import team4.quizify.entity.User;
import team4.quizify.repository.ChatRepository;
import team4.quizify.repository.QueryRepository;
import team4.quizify.repository.UserRepository;

import java.util.*;

@Service
@RequiredArgsConstructor
public class QueryService {

    private final QueryRepository queryRepository;
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;

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

        Long[] chatIds = query.getChatIds();
        List<Chat> chatsToDelete = chatRepository.findAllById(Arrays.asList(chatIds));
        chatRepository.deleteAll(chatsToDelete);

        queryRepository.delete(query);
        return true;
    }

    public List<Map<String, Object>> getUnresolvedUsersByRole(int userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) throw new RuntimeException("User not found");

        User user = userOpt.get();
        List<Query> queries;
        List<Integer> relatedUserIds;

        if ("student".equalsIgnoreCase(user.getRole())) {
            queries = queryRepository.findBySenderIdAndResolveStatusFalse(userId);
            relatedUserIds = queries.stream().map(Query::getReceiverId).distinct().toList();
        } else if ("teacher".equalsIgnoreCase(user.getRole())) {
            queries = queryRepository.findByReceiverIdAndResolveStatusFalse(userId);
            relatedUserIds = queries.stream().map(Query::getSenderId).distinct().toList();
        } else {
            throw new RuntimeException("Invalid role");
        }

        List<User> relatedUsers = userRepository.findAllById(relatedUserIds);
        return relatedUsers.stream().map(u -> {
            Map<String, Object> map = new HashMap<>();
            map.put("userId", u.getUserId());
            map.put("fullName", u.getFname() + " " + u.getLname());
            return map;
        }).toList();
    }
}
