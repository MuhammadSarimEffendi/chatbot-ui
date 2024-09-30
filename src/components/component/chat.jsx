"use client";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function Chat() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuestion = async () => {
    if (!question.trim()) {
      alert("Please type a question before sending.");
      return;
    }

    try {
      setLoading(true);

      setChatHistory((prev) => [...prev, { role: "user", content: question }]);
      setQuestion("");

      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: question }),
      });

      if (!response.ok) {
        throw new Error("Chatbot response failed");
      }

      const result = await response.text();

      setChatHistory((prev) => [...prev, { role: "bot", content: result }]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      alert("Failed to get chatbot response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-background">
      <div className="w-full max-w-4xl p-6 bg-card rounded-lg shadow-lg h-auto flex flex-col"> 
        <div className="flex flex-col gap-6 h-full"> 
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-card-foreground">
              Chat with our AI Assistant
            </h1>
            <p className="text-muted-foreground">
              Ask a question and attach a JSON or TXT file for more context.
            </p>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                id="file-upload"
                accept=".json,.txt"
                className="flex-1 p-3 text-card-foreground bg-muted rounded-md border border-input focus:border-primary focus:ring-primary"
                onChange={handleFileChange}
              />
              <Button
                onClick={handleFileUpload}
                disabled={loading || !file}
                className="px-4 py-2 text-sm font-medium text-card-foreground bg-primary rounded-md cursor-pointer hover:bg-primary/90"
              >
                {loading ? "Uploading..." : "Upload File"}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 h-full"> 
            <div className="flex items-center gap-2">
              <Textarea
                placeholder="Type your question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-1 p-3 text-card-foreground bg-muted rounded-md border border-input focus:border-primary focus:ring-primary"
              />
              <Button onClick={handleSendQuestion} disabled={loading || !question.trim()}>
                <SendIcon className="w-5 h-5 text-card-foreground" />
                <span className="sr-only">Send</span>
              </Button>
            </div>

            {/* Chat History Container */}
            <div className="flex flex-col gap-4 flex-grow overflow-hidden"> 
              <h2 className="text-2xl font-bold text-card-foreground">Conversation</h2>
              <div className="flex flex-col gap-2 p-4 bg-muted rounded-md overflow-y-auto flex-grow max-h-64">
                
              {chatHistory.map((chat, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Avatar className="w-8 h-8 border">
                      <AvatarImage src={chat.role === "user" ? "/placeholder-user.jpg" : "/bot-avatar.jpg"} alt={`${chat.role} Avatar`} />
                      <AvatarFallback>{chat.role === "user" ? "U" : "AI"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 prose text-card-foreground">
                      <p>{chat.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8 border">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 prose text-card-foreground">
                      <LoadingDots />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function SendIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function LoadingDots() {
  return (
    <div className="flex space-x-1">
      <div
        className="w-2 h-2 bg-card-foreground rounded-full animate-bounce"
        style={{
          animationName: "bounce",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationDelay: "0s",
        }}
      ></div>
      <div
        className="w-2 h-2 bg-card-foreground rounded-full animate-bounce"
        style={{
          animationName: "bounce",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationDelay: "0.2s",
        }}
      ></div>
      <div
        className="w-2 h-2 bg-card-foreground rounded-full animate-bounce"
        style={{
          animationName: "bounce",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationDelay: "0.4s",
        }}
      ></div>
    </div>
  );
}
