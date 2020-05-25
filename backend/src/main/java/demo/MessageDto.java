package demo;

import java.util.List;

public class MessageDto {
    public final String message;
    public final String username;
    public final String date;
    public final String id;
    public final List<String> users_liked;

    public MessageDto(String message, String username, String date, String id, List<String> users_liked) {
        this.message = message;
        this.username = username;
        this.date = date;
        this.id = id;
        this.users_liked = users_liked;
    }

}
