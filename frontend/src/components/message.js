import React from 'react';
import axios from 'axios';
/*
Renders: the message
 */
const Message = ({ message, userName }) => {
    const [likedBy, setLikedBy] = React.useState(message.users_liked);
    const [isClicked, setIsClicked] = React.useState(likedBy.includes(userName));
    const [likeCount, setLikeCount] = React.useState(message.users_liked.length);
    var badgeClass = isClicked ? "badge badge-pill badge-success" : "badge badge-pill badge-primary";
    const handleLike = () => {
        let body = {
            userName: userName,
            messageId: message.id,
        }
        if (!isClicked) {
            axios.post("/api/like-message", body).then((res) => {
                let likesList = res.data.usersLiked;
                setLikedBy(likesList);
                setLikeCount(likesList.length);
            });
        } else {
            axios.post("api/unlike-message", body).then((res) => {
                let likesList = res.data.usersLiked;
                setLikedBy(likesList);
                setLikeCount(likesList.length);
            });
        }
        setIsClicked(!isClicked);
    }

    return (
        <div className="message shadow-sm p-3 mb-1 bg-white rounded">
            <p className="message-signature">
                <b>{message.username}</b>
                <small className="date-time">&emsp;[{message.date}]&emsp;</small>
                <button onClick={handleLike} type="button" className={badgeClass}>
                    <span className="badge badge-light">{likeCount}</span>
                    &nbsp; Likes: {likedBy.toString()}
                </button>
            </p>
            <p className="message-signature">{message.message}</p>
            {/* <button className={cn} onClick={handleLike}>:+1:</button> */}
        </div>
    );
}
export default Message;