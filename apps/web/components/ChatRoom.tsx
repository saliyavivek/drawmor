"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Maximize2, Minimize2, Send, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ChatRoomProps, Message } from "@/types/types";
import axios from "axios";

export default function ChatRoom({
  roomId,
  userId,
  username,
  users,
  socket,
  onClose,
  isOpen,
  roomAdmin,
  token,
}: ChatRoomProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [fetching, setFetching] = useState(false);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    const fetchExistingMessages = async () => {
      setFetching(true);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/${roomId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const existingMessages = response.data.chats;
      setMessages(existingMessages);
      setFetching(false);
    };

    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }

    fetchExistingMessages();
  }, [isOpen]);

  // Handle incoming messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.type === "chat") {
        setMessages((prev) => [...prev, data.payload]);
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);
  };

  // Send message
  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage = {
      userId,
      roomId,
      text: message,
    };

    socket.send(
      JSON.stringify({
        type: "chat",
        payload: newMessage,
      })
    );

    setMessage("");
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
        flex flex-col border-l border-gray-200 bg-white dark:bg-background
        ${isFullscreen ? "fixed inset-0 z-50" : "h-full"} 
        transition-all duration-300
      `}
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center space-x-2">
          <h2 className="font-semibold">Chat</h2>
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
          {users.map((user, index) => (
            <Badge key={index} variant="outline" className="whitespace-nowrap">
              {user}
              {user === username ? " (you)" : ""}
              {user === roomAdmin && user !== username ? " (owner)" : ""}
            </Badge>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3 overflow-scroll">
        <div className="space-y-4">
          {fetching && (
            <div className="flex items-center justify-center h-20">
              <p className="text-sm text-muted-foreground">
                Fetching your chats...
              </p>
            </div>
          )}
          {!fetching && messages.length === 0 ? (
            <div className="flex items-center justify-center h-20">
              <p className="text-sm text-muted-foreground">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.userId === userId ? "justify-end" : "justify-start"}`}
              >
                <div className="flex items-end gap-2 max-w-[80%]">
                  {msg.userId !== userId && (
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {getInitials(msg.sender)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`flex flex-col ${msg.userId === userId ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {msg.userId === userId ? "You" : msg.sender}
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
                        {getInitials(msg.sender)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* {typingUsers.length > 0 && (
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
        )} */}
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
