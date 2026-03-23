import { useEffect, useState } from "react";
import socket from "../socket/socket";
import ChatBox from "../components/ChatBox";
import Controls from "../components/Controls";
import StatusBar from "../components/StatusBar";

const Home = () => {
      const [status, setStatus] = useState("Idle");
      const [messages, setMessages] = useState([]);
      const [isTyping, setIsTyping] = useState(false);

      useEffect(() => {
            socket.off("searching");
            socket.off("matched");
            socket.off("partner_disconnected");
            socket.off("receive_message");
            socket.off("error");
            socket.off("typing");
            socket.off("stop_typing");

            socket.on("searching", () => setStatus("Searching..."));

            socket.on("matched", () => setStatus("Connected"));

            socket.on("partner_disconnected", () => {
                  setStatus("Partner disconnected");
                  setMessages([]);
                  setIsTyping(false); 
            });

            socket.on("typing", () => setIsTyping(true));

            socket.on("stop_typing", () => setIsTyping(false));

            socket.on("receive_message", (data) => {
                  setIsTyping(false);

                  setMessages((prev) => [
                        ...prev,
                        {
                              text: data.message,
                              type: "partner",
                              timestamp: data.timestamp,
                        },
                  ]);
            });

            socket.on("error", (msg) => alert(msg));

            return () => {
                  socket.off();
            };
      }, []);

      const startChat = () => {
            setMessages([]);
            setStatus("Searching...");
            setIsTyping(false);
            socket.emit("start");
      };

      const sendMessage = (msg) => {
            if (!msg.trim()) return;

            socket.emit("send_message", { message: msg });

            socket.emit("stop_typing"); 

            setMessages((prev) => [
                  ...prev,
                  {
                        text: msg,
                        type: "self",
                        timestamp: new Date().toISOString(),
                  },
            ]);
      };

      const skipChat = () => {
            socket.emit("skip");
            setMessages([]);
            setStatus("Searching...");
            setIsTyping(false);
      };

      return (
            <div className="container">
                  <h1>Anonymous World</h1>

                  <StatusBar status={status} />

                  {isTyping && <p className="typing">Partner is typing...</p>}

                  <ChatBox messages={messages} />

                  <Controls
                        onStart={startChat}
                        onSend={sendMessage}
                        onSkip={skipChat}
                        disabled={status !== "Connected"}
                  />
            </div>
      );
};

export default Home;