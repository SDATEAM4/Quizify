package team4.quizify.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import team4.quizify.entity.Chat;
import team4.quizify.entity.Query;
import team4.quizify.entity.User;
import team4.quizify.repository.ChatRepository;
import team4.quizify.repository.QueryRepository;
import team4.quizify.repository.UserRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final QueryRepository queryRepository;
    private final UserRepository userRepository;

    public void mapSenderReceiverToUserIds(Chat chat, int senderId, int receiverId) {
        chat.setSenderId(senderId);
        chat.setReceiverId(receiverId);
    }

    public List<Chat> getChatsForUser(int userId) {
        try {
            return chatRepository.findBySenderIdOrReceiverId(userId, userId);
        } catch (Exception e) {
            throw new RuntimeException("Request failed");
        }
    }
    public Chat sendMessage(Chat chat, Integer subjectId) {
        try {
            chat.setTimestamp(LocalDateTime.now());
            Chat savedChat = chatRepository.save(chat);

            int senderId = chat.getSenderId();
            int receiverId = chat.getReceiverId();

            // Find the existing query between the sender and receiver
            Query existingQuery = queryRepository
                    .findBySenderIdAndReceiverIdAndResolveStatusFalse(senderId, receiverId)
                    .orElse(queryRepository.findBySenderIdAndReceiverIdAndResolveStatusFalse(receiverId, senderId)
                            .orElse(null));  // Look for the query where the receiver is sender and sender is receiver

            // If no query exists, create a new one
            if (existingQuery == null) {
                Query newQuery = new Query();
                newQuery.setSenderId(senderId);
                newQuery.setReceiverId(receiverId);
                newQuery.setResolveStatus(false);
                newQuery.setSubjectId(subjectId);
                newQuery.setChatIds(new Long[]{savedChat.getChatId()});
                queryRepository.save(newQuery);
            } else {
                // If an existing query is found, update it with the new chat ID
                Long[] oldChatIds = existingQuery.getChatIds();
                Long[] newChatIds = Arrays.copyOf(oldChatIds, oldChatIds.length + 1);
                newChatIds[oldChatIds.length] = savedChat.getChatId();
                existingQuery.setChatIds(newChatIds);
                queryRepository.save(existingQuery);
            }

            return savedChat;
        } catch (Exception e) {
            throw new RuntimeException("Request failed: " + e.getMessage());
        }
    }

    public List<Chat> getMessagesBetweenUsers(int teacherId, int studentId) {
        try {
            int teacherUserId = userRepository.findById(teacherId)
                    .orElseThrow(() -> new RuntimeException("Request failed"))
                    .getUserId();
            int studentUserId = userRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Request failed"))
                    .getUserId();

            return chatRepository.findByTeacherAndStudent(teacherUserId, studentUserId);
        } catch (Exception e) {
            throw new RuntimeException("Request failed");
        }
    }

    public boolean deleteMessagesBetweenUsers(int teacherId, int studentId) {
        try {
            List<Chat> messages = getMessagesBetweenUsers(teacherId, studentId);
            if (messages.isEmpty()) {
                return false;
            }
            chatRepository.deleteAll(messages);
            return true;
        } catch (Exception e) {
            throw new RuntimeException("Request failed");
        }
    }

    public boolean isQueryUnresolved(int teacherId, int studentId) {
        try {
            int teacherUserId = userRepository.findById(teacherId)
                    .orElseThrow(() -> new RuntimeException("Request failed"))
                    .getUserId();
            int studentUserId = userRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Request failed"))
                    .getUserId();

            List<Query> queries = queryRepository.findByReceiverIdAndResolveStatusFalse(teacherUserId);
            return queries.stream().anyMatch(query -> query.getSenderId() == studentUserId);
        } catch (Exception e) {
            throw new RuntimeException("Request failed");
        }
    }

    public void markUnreadByTeacher(int teacherId, int studentId) {
        try {
            List<Chat> chats = getMessagesBetweenUsers(teacherId, studentId);
            for (Chat chat : chats) {
                chatRepository.save(chat);
            }
        } catch (Exception e) {
            throw new RuntimeException("Request failed");
        }
    }

    public void markUnreadByStudent(int teacherId, int studentId) {
        try {
            List<Chat> chats = getMessagesBetweenUsers(teacherId, studentId);
            for (Chat chat : chats) {
                chatRepository.save(chat);
            }
        } catch (Exception e) {
            throw new RuntimeException("Request failed");
        }
    }

    public List<String> getOppositePartyNames(int userId) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) throw new RuntimeException("Request failed");

            User user = userOpt.get();
            List<Chat> chats = chatRepository.findBySenderIdOrReceiverId(userId, userId);

            return chats.stream()
                    .map(chat -> {
                        int oppositeId = (chat.getSenderId() == userId) ? chat.getReceiverId() : chat.getSenderId();
                        return userRepository.findById(oppositeId)
                                .map(u -> u.getFname() + " " + u.getLname())
                                .orElse("Unknown");
                    })
                    .distinct()
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Request failed");
        }
    }
}