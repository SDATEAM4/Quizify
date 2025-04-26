package team4.quizify.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import team4.quizify.entity.Chat;
import team4.quizify.service.ChatService;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    @MessageMapping("/chat/send")
    public void sendMessage(@Payload Chat chat) {
        Chat saved = chatService.sendMessage(chat);
        messagingTemplate.convertAndSend("/topic/messages/" + chat.getReceiverId(), saved);
        messagingTemplate.convertAndSend("/topic/messages/" + chat.getSenderId(), saved);
    }

    @MessageMapping("/chat/delete")
    public void deleteMessage(@Payload Chat chat) {
        chatService.deleteChat(chat.getChatId());
        messagingTemplate.convertAndSend("/topic/delete/" + chat.getReceiverId(), chat.getChatId());
        messagingTemplate.convertAndSend("/topic/delete/" + chat.getSenderId(), chat.getChatId());
    }
}
