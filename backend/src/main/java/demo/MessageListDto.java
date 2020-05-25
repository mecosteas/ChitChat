package demo;

import java.util.List;

public class MessageListDto {
    public final List<MessageDto> messages;

    public MessageListDto(List<MessageDto> messages) {
        this.messages = messages;
    }
}
