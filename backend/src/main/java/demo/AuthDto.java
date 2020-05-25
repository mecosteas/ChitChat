package demo;

public class AuthDto {
    public final String newUsername;
    public final String password;

    public AuthDto(String newUsername, String password){
        this.newUsername = newUsername;
        this.password = password;
    }
}
