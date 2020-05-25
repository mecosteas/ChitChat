package demo;

import java.util.List;

public class LikeResponseDto {
    private final List<String> usersLiked;

    public LikeResponseDto(List<String> usersLiked) {
        this.usersLiked = usersLiked;
    }

    public List<String> getUsersLiked() {
        return usersLiked;
    }
}
