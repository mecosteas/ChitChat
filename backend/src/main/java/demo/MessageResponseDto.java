package demo;

public class MessageResponseDto {
    public final boolean success;
    public final String error;
    public final String messageID;

    public MessageResponseDto(boolean success, String error, String messageID) {
        this.success = success;
        this.error = error;
        this.messageID = messageID;
    }
}
