import { useEffect, useRef } from "react";
const formatTime = (isoTime) => {
      const date = new Date(isoTime);
      return date.toLocaleTimeString([],{
            hour: "2-digit",
            minute: "2-digit"
      } )
}

const ChatBox = ({ messages }) => {
      const bottomRef = useRef();

      useEffect(() => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [messages]);

      return (
            <div className="chat-box">
                  {messages.map((msg, index) => (
                        <div
                              key={index}
                              className={`message ${msg.type === "self" ? "self" : "partner"}`}
                        >
                              <div>{msg.text}</div>
                              <div className="time">{formatTime(msg.timestamp)}</div>
                        </div>
                  ))}
            </div>
      );

};

export default ChatBox;