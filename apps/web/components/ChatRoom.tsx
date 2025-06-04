"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Maximize2, Minimize2, Send, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
}

interface ChatRoomProps {
  roomId: string;
  userId: string;
  users: { id: string; username: string }[];
  socket: WebSocket;
  onClose: () => void;
  isOpen: boolean;
}

export default function ChatRoom({
  roomId,
  userId,
  users,
  socket,
  onClose,
  isOpen,
}: ChatRoomProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle incoming messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.type === "chat") {
        setMessages((prev) => [...prev, data.payload]);
      } else if (data.type === "typing") {
        if (data.payload.userId !== userId) {
          if (data.payload.isTyping) {
            setTypingUsers((prev) => [
              ...prev.filter((id) => id !== data.payload.username),
              data.payload.username,
            ]);
          } else {
            setTypingUsers((prev) =>
              prev.filter((id) => id !== data.payload.username)
            );
          }
        }
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, userId]);

  // Handle typing indicator
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    socket.send(
      JSON.stringify({
        type: "typing",
        payload: {
          roomId,
          userId,
          isTyping: value.length > 0,
        },
      })
    );
  };

  // Send message
  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: `${userId}-${Date.now()}`,
      userId,
      username: users.find((u) => u.id === userId)?.username || "Anonymous",
      text: message,
      timestamp: Date.now(),
    };

    socket.send(
      JSON.stringify({
        type: "chat",
        payload: newMessage,
      })
    );

    setMessage("");

    // Clear typing indicator
    socket.send(
      JSON.stringify({
        type: "typing",
        payload: {
          roomId,
          userId,
          isTyping: false,
        },
      })
    );
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Format timestamp
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`
        flex flex-col border-l border-gray-200 bg-white dark:bg-gray-950 
        ${isFullscreen ? "fixed inset-0 z-50" : "h-full"} 
        transition-all duration-300
      `}
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center space-x-2">
          <h2 className="font-semibold">Room Chat</h2>
          <Badge variant="secondary" className="text-xs">
            {users.length} online
          </Badge>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-8 w-8"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Online Users */}
      <div className="p-2 border-b">
        <div className="flex items-center space-x-1 overflow-x-auto pb-1">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            Online:
          </span>
          {users.map((user) => (
            <Badge
              key={user.id}
              variant="outline"
              className="whitespace-nowrap"
            >
              {user.username}
            </Badge>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-20">
              <p className="text-sm text-muted-foreground">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.userId === userId ? "justify-end" : "justify-start"}`}
              >
                <div className="flex items-end gap-2 max-w-[80%]">
                  {msg.userId !== userId && (
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {getInitials(msg.username)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`flex flex-col ${msg.userId === userId ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {msg.userId === userId ? "You" : msg.username}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <div
                      className={`rounded-lg px-3 py-2 text-sm ${
                        msg.userId === userId
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-muted rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                  {msg.userId === userId && (
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {getInitials(msg.username)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground italic">
            <div className="flex space-x-1">
              <span className="animate-bounce">•</span>
              <span
                className="animate-bounce"
                style={{ animationDelay: "0.2s" }}
              >
                •
              </span>
              <span
                className="animate-bounce"
                style={{ animationDelay: "0.4s" }}
              >
                •
              </span>
            </div>
            <span>
              {typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"}{" "}
              typing...
            </span>
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <div className="p-3 border-t">
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button size="icon" onClick={handleSend} disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
