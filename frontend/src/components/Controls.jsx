import { useState, useRef } from "react";
import socket from "../socket/socket";

const Controls = ({ onStart, onSend, onSkip, disabled }) => {
      const [input, setInput] = useState("");
      const typingTimeoutRef = useRef(null);

      const handleChange = (e) => {
            const value = e.target.value;
            setInput(value);

            socket.emit("typing");

            if (typingTimeoutRef.current) {
                  clearTimeout(typingTimeoutRef.current);
            }

            typingTimeoutRef.current = setTimeout(() => {
                  socket.emit("stop_typing");
            }, 1000);
      };

      const handleSend = () => {
            if (!input.trim()) return;

            onSend(input);
            setInput("");

            socket.emit("stop_typing");
      };

     
      const handleKeyDown = (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); 
                  handleSend();
            }
      };

      return (
            <div className="controls">
                  <div className="buttons">
                        <button onClick={onStart}>Start</button>
                        <button onClick={onSkip}>Skip</button>
                  </div>

                  <div className="input-area">
                        <input
                              value={input}
                              onChange={handleChange}
                              onKeyDown={handleKeyDown}  
                              placeholder="Type a message..."
                        />

                        <button onClick={handleSend} disabled={disabled}>
                              Send
                        </button>
                  </div>
            </div>
      );
};

export default Controls;