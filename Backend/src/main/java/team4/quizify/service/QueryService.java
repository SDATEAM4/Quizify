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

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class QueryService {    private final QueryRepository queryRepository;
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

        if ("student".equalsIgnoreCase(user.getRole())) {
            queries = queryRepository.findBySenderIdAndResolveStatusFalse(userId);
        } else if ("teacher".equalsIgnoreCase(user.getRole())) {
            queries = queryRepository.findByReceiverIdAndResolveStatusFalse(userId);
        } else {
            throw new RuntimeException("Invalid role");
        }

        List<Map<String, Object>> result = new ArrayList<>();

        for (Query query : queries) {            int oppositeUserId = ("student".equalsIgnoreCase(user.getRole())) ? query.getReceiverId() : query.getSenderId();
            Optional<User> oppositeUserOpt = userRepository.findById(oppositeUserId);
            if (oppositeUserOpt.isEmpty()) continue;

            User oppositeUser = oppositeUserOpt.get();

            // Fetch chats and get latest timestamp
            List<Chat> chats = chatRepository.findAllById(Arrays.asList(query.getChatIds()));
            LocalDateTime latestTimestamp = chats.stream()
                    .map(Chat::getTimestamp)
                    .max(LocalDateTime::compareTo)
                    .orElse(null);

            Map<String, Object> map = new HashMap<>();
            map.put("userId", oppositeUser.getUserId());
            map.put("fullName", oppositeUser.getFname() + " " + oppositeUser.getLname());
            map.put("latestTimestamp", latestTimestamp);

            result.add(map);
        }

        return result;
    }

    @Transactional
    public boolean resolveQueryByUsers(Integer senderId, Integer receiverId) {
        Optional<Query> optionalQuery = queryRepository.findBySenderIdAndReceiverIdAndResolveStatusFalse(senderId, receiverId);
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
}