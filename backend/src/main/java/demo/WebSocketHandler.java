package demo;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.*;
import java.io.*;
import java.util.*;
import java.util.concurrent.*;
import com.google.gson.Gson;


@WebSocket
public class WebSocketHandler {
  // Store sessions if you want to, for example, broadcast a message to all users
  static Map<Session, Session> sessionMap = new ConcurrentHashMap<>();
  Gson gson = new Gson();

  public void broadcast(String message){
    sessionMap.keySet().forEach(session -> {
      try{
        session.getRemote().sendString(message); // send dame message to all
      } catch (Exception e){
        e.printStackTrace();
      }
    });
  }

  @OnWebSocketConnect
  public void connected(Session session) throws IOException {
    System.out.println("A client has connected");
    sessionMap.put(session, session);
  }

  @OnWebSocketClose
  public void closed(Session session, int statusCode, String reason) {
    System.out.println("A client has disconnected");
    sessionMap.remove(session);
  }

  @OnWebSocketMessage
  public void message(Session session, String message) throws IOException {
    MessageDto incomingMsg = gson.fromJson(message, MessageDto.class);
    System.out.println("message: " + message);
//    System.out.println("Date:" + incomingMsg.date +
//            "\tusername: " + incomingMsg.username +
//            "\tmessage: " + incomingMsg.message +
//            "\tusers liked: " + incomingMsg.users_liked.toString());   // Print message
    broadcast(message);
  }
}