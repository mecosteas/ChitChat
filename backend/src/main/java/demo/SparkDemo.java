package demo;
import com.google.gson.Gson;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Updates;
import org.bson.Document;
import org.bson.types.ObjectId;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import static com.mongodb.client.model.Filters.eq;
import static spark.Spark.*;

public class SparkDemo {
  public static void main(String[] args) {
    port(1235);

    //open connection to mongo
    MongoClient mongoClient = new MongoClient("localhost", 27017);
    //get refrence to DB
    MongoDatabase db = mongoClient.getDatabase("MyDatabase");
    //get refrence to collections being used
    MongoCollection<Document> userCollection = db.getCollection("Users");
    MongoCollection<Document> messageCollection = db.getCollection("Messages");

    Gson gson = new Gson();
    webSocket("/ws", WebSocketHandler.class);

    //This is a method to post a new message into the DB
    //Expects an req object with [message, username, date]
    post("/api/post-message", (req, res)->{
      //take body of req and make into String
      String bodyString = req.body();
      //create a messageDTO out of the request's body
      MessageDto msgDTO = gson.fromJson(bodyString, MessageDto.class);
      //make a new post document to store in DB
      List<String> UsersLiked = new ArrayList<>();
      Document newMessage = new Document("username", msgDTO.username)
              .append("message", msgDTO.message)
              .append("date", msgDTO.date)
              .append("users_liked", UsersLiked);
      //insert the document into the DB
      messageCollection.insertOne(newMessage);
      //Return a successful response
      MessageResponseDto responseDto = new MessageResponseDto(true, null, newMessage.get("_id").toString());
      return gson.toJson(responseDto);
    });

    //Takes messagaeID and username as params
    //Searches DB for message matching messageID then adds the username to the list of users liked
    post("/api/like-message", (req, res)->{
      String bodyString = req.body();
      LikeDto likeDto = gson.fromJson(bodyString, LikeDto.class);
      ObjectId obID = new ObjectId(likeDto.messageId);
      Document fetched_message = messageCollection.find(eq("_id", obID)).first();
      messageCollection.updateOne(eq("_id", obID), Updates.push("users_liked", likeDto.userName));
      // need to fetch updated message
      fetched_message = messageCollection.find(eq("_id", obID)).first();
      LikeResponseDto responseDto = new LikeResponseDto((List<String>)fetched_message.get("users_liked"));
      return gson.toJson(responseDto);
    });

    post("/api/unlike-message", (req, res)->{
      String bodyString = req.body();
      LikeDto likeDto = gson.fromJson(bodyString, LikeDto.class);
      // ObjectId is used to search by ID
      ObjectId obID = new ObjectId(likeDto.messageId);
      Document fetched_message = messageCollection.find(eq("_id", obID)).first();
      // Updates.pull is used to delete all instances matching given value from an existing array
      messageCollection.updateOne(eq("_id", obID), Updates.pull("users_liked", likeDto.userName));
      // need to fetch updated message
      fetched_message = messageCollection.find(eq("_id", obID)).first();
      LikeResponseDto responseDto = new LikeResponseDto((List<String>)fetched_message.get("users_liked"));
      return gson.toJson(responseDto);
    });

    //This is a method to get all the messages from the DB
    //Will retun a list of MessageDtos
    //MessageDto has [message, username, date]
    get("/api/get-all-messages", (req, res) ->{
      //get a list of all the messages
      //stream it and create a messageDto for each
      //create a list of message dtos and return it
      List<MessageDto> messages = messageCollection.find()
              .into(new ArrayList<>())
              .stream()
              .map(document -> {
                System.out.println(document);
                return new MessageDto(
                        document.getString("message"),
                        document.getString("username"),
                        document.getString("date"),
                        document.getObjectId("_id").toString(),
                        (List<String>)document.get("users_liked"));
              }).collect(Collectors.toList());
      MessageListDto theMessages = new MessageListDto(messages);
      return gson.toJson(theMessages);
    });

    post("/api/register", (req, res) -> {
      String bodyString = req.body();
      AuthDto authDto = gson.fromJson(bodyString, AuthDto.class);
      System.out.println(authDto.newUsername);
      List<Document> potentialUser = userCollection.find(new Document("username", authDto.newUsername))
              .into(new ArrayList<>());
      if(!potentialUser.isEmpty()){
        AuthResponseDto responseDto = new AuthResponseDto(false, "user already exists");
        return gson.toJson(responseDto);
      }
      Document newUser = new Document()
              .append("username", authDto.newUsername)
              .append("password", authDto.password);
      userCollection.insertOne(newUser);
      AuthResponseDto authResponseDto = new AuthResponseDto(true, null);
      return gson.toJson(authResponseDto);
    });

    post("/api/authenticate", (req, res) -> {
      String bodyString = req.body();
      AuthDto authDto = gson.fromJson(bodyString, AuthDto.class);
      List<Document> potentialUser = userCollection.find(new Document("username", authDto.newUsername))
              .into(new ArrayList<>());
      if(potentialUser.size() != 1) {
        AuthResponseDto responseDto =
                new AuthResponseDto(false, "User not found");
        return gson.toJson(responseDto);
      }
      Document userDocument = potentialUser.get(0);
      if(!userDocument.getString("password").equals(authDto.password)) {
        AuthResponseDto responseDto =
                new AuthResponseDto(false, "Password is incorrect");
        return gson.toJson(responseDto);
      }
      AuthResponseDto responseDto =
              new AuthResponseDto(true, null);
      return gson.toJson(responseDto);
    });
  }
}