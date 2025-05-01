package team4.quizify.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import team4.quizify.entity.Chat;
import team4.quizify.entity.Query;
import team4.quizify.entity.User;
import team4.quizify.repository.ChatRepository;
import team4.quizify.repository.QueryRepository;
import team4.quizify.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService
{

    private final ChatRepository chatRepository;
    private final QueryRepository queryRepository;
    private final UserRepository userRepository;

    public void mapSenderReceiverToUserIds(Chat chat, int senderId, int receiverId) {
        chat.setSenderId(senderId);
        chat.setReceiverId(receiverId);
    }

    public List<Chat> getChatsForUser(int userId) {
        return chatRepository.findBySenderIdOrReceiverId(userId, userId);
    }

    public Chat sendMessage(Chat chat) {
        chat.setTimestamp(java.time.LocalDateTime.now());
        Chat savedChat = chatRepository.save(chat);

        // After chat is saved, handle query
        int senderId = chat.getSenderId();
        int receiverId = chat.getReceiverId();

        // Check if a query already exists (unresolved)
        Query existingQuery = queryRepository
                .findBySenderIdAndReceiverIdAndResolveStatusFalse(senderId, receiverId)
                .orElse(null);

        if (existingQuery == null) {
            // Create a new Query
            Query newQuery = new Query();
            newQuery.setSenderId(senderId);
            newQuery.setReceiverId(receiverId);
            newQuery.setResolveStatus(false);
            newQuery.setChatIds(new Long[]{savedChat.getChatId()}); // 🔥 array
            queryRepository.save(newQuery);
        } else {
            // Query already exists, update chatIds
            Long[] oldChatIds = existingQuery.getChatIds();
            Long[] newChatIds = new Long[oldChatIds.length + 1];

            System.arraycopy(oldChatIds, 0, newChatIds, 0, oldChatIds.length);
            newChatIds[oldChatIds.length] = savedChat.getChatId();

            existingQuery.setChatIds(newChatIds);
            queryRepository.save(existingQuery);
        }


        return savedChat;
    }


    public List<Chat> getMessagesBetweenUsers(int teacherId, int studentId) {
        int teacherUserId = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"))
                .getUserId();
        int studentUserId = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"))
                .getUserId();

        return chatRepository.findByTeacherAndStudent(teacherUserId, studentUserId);
    }

    public boolean deleteMessagesBetweenUsers(int teacherId, int studentId) {
        List<Chat> messages = getMessagesBetweenUsers(teacherId, studentId);
        if (messages.isEmpty()) {
            return false;
        }
        chatRepository.deleteAll(messages);
        return true;
    }


    public boolean isQueryUnresolved(int teacherId, int studentId) {
        int teacherUserId = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"))
                .getUserId();
        int studentUserId = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"))
                .getUserId();

        List<Query> queries = queryRepository.findByReceiverIdAndResolveStatusFalse(teacherUserId);
        return queries.stream().anyMatch(query -> query.getSenderId() == studentUserId);
    }

    public List<String> getTeachersBySubject(Integer subjectId) {
        List<Chat> chats = chatRepository.findBySubjectId(subjectId);
        return chats.stream()
                .map(chat -> userRepository.findById(chat.getReceiverId())
                        .map(user -> user.getFname() + " " + user.getLname())
                        .orElse("Unknown"))
                .distinct()
                .collect(Collectors.toList());
    }

    public void markUnreadByTeacher(int teacherId, int studentId) {
        List<Chat> chats = getMessagesBetweenUsers(teacherId, studentId);
        for (Chat chat : chats) {
            // pretend updating unreadByTeacher
            chatRepository.save(chat);
        }
    }

    public void markUnreadByStudent(int teacherId, int studentId) {
        List<Chat> chats = getMessagesBetweenUsers(teacherId, studentId);
        for (Chat chat : chats) {
            // pretend updating unreadByStudent
            chatRepository.save(chat);
        }
    }
    public List<String> getOppositePartyNames(int userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) throw new RuntimeException("User not found");

        userOpt.get();
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
    }


}
