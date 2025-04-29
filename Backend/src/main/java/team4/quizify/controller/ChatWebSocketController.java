package team4.quizify.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import team4.quizify.entity.Chat;
import team4.quizify.service.ChatService;
import team4.quizify.service.QueryService;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;
    private final QueryService queryService;

    @MessageMapping("/chat/send")
    public void sendMessage(@Payload Chat chat) {
        Chat saved = chatService.sendMessage(chat);
        messagingTemplate.convertAndSend("/topic/messages/" + chat.getReceiverId(), saved);
        messagingTemplate.convertAndSend("/topic/messages/" + chat.getSenderId(), saved);
    }

    @MessageMapping("/chat/delete")
    public void deleteMessage(@Payload Chat chat) {
        chatService.deleteMessagesBetweenUsers(chat.getSenderId(), chat.getReceiverId());
        messagingTemplate.convertAndSend("/topic/delete/" + chat.getReceiverId(), chat);
        messagingTemplate.convertAndSend("/topic/delete/" + chat.getSenderId(), chat);
    }

    @MessageMapping("/query/resolve")
    public void resolveQuery(@Payload Long queryId) {
        boolean resolved = queryService.resolveQueryAndDeleteChats(queryId);
        if (resolved) {
            messagingTemplate.convertAndSend("/topic/query/resolve", queryId);
        }
    }
}