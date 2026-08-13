"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { useAuth } from "@/components/AuthContext";

interface Message {
  id: number;
  sender: "guest" | "host";
  text: string;
  timestamp: string;
}

interface Thread {
  id: number;
  hostName: string;
  hostAvatar: string;
  propertyName: string;
  lastMessage: string;
  messages: Message[];
}

const INITIAL_THREADS: Thread[] = [
  {
    id: 1,
    hostName: "John Doe",
    hostAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    propertyName: "Luxury Heritage Flat in Varanasi",
    lastMessage: "Looking forward to hosting you! Let me know your arrival time.",
    messages: [
      { id: 1, sender: "guest", text: "Hi John! Is early check-in around 11 AM possible?", timestamp: "Yesterday 2:15 PM" },
      { id: 2, sender: "host", text: "Hello Arun! Yes, we can arrange early bag drop and check-in by 11:30 AM.", timestamp: "Yesterday 2:30 PM" },
      { id: 3, sender: "host", text: "Looking forward to hosting you! Let me know your arrival time.", timestamp: "Today 10:05 AM" }
    ]
  },
  {
    id: 2,
    hostName: "Sarah Jenkins",
    hostAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    propertyName: "Beachfront Coconut Grove Villa (Goa)",
    lastMessage: "The pool temperature is set to warm. Enjoy your trip!",
    messages: [
      { id: 1, sender: "guest", text: "Hello Sarah, does the villa have high-speed wifi for remote work?", timestamp: "3 days ago" },
      { id: 2, sender: "host", text: "Hi! Yes, fiber broadband 200 Mbps is active across the property.", timestamp: "3 days ago" },
      { id: 3, sender: "host", text: "The pool temperature is set to warm. Enjoy your trip!", timestamp: "2 days ago" }
    ]
  }
];

export default function MessagesPage() {
  const { currentUser } = useAuth();
  const [threads, setThreads] = useState<Thread[]>(INITIAL_THREADS);
  const [activeThreadId, setActiveThreadId] = useState(1);
  const [inputText, setInputText] = useState("");

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      sender: currentUser.role === "host" ? "host" : "guest",
      text: inputText.trim(),
      timestamp: "Just now"
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            lastMessage: newMessage.text,
            messages: [...t.messages, newMessage]
          };
        }
        return t;
      })
    );

    setInputText("");
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#121212] flex flex-col transition-colors">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 w-full flex-1 flex flex-col py-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-neutral-900 dark:text-white">Messages</h1>

        <div className="flex-1 border border-gray-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row bg-white dark:bg-[#1c1c1c] min-h-[550px]">
          
          {/* Left Sidebar: Threads List */}
          <div className="w-full md:w-80 border-r border-gray-200 dark:border-neutral-800 flex flex-col">
            <div className="p-4 border-b border-gray-100 dark:border-neutral-800 font-bold text-sm text-neutral-500 uppercase tracking-wider">
              Conversations ({threads.length})
            </div>
            
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-neutral-800">
              {threads.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setActiveThreadId(t.id)}
                  className={`p-4 flex items-center gap-3.5 cursor-pointer transition ${
                    activeThreadId === t.id
                      ? "bg-neutral-100 dark:bg-[#282828]"
                      : "hover:bg-neutral-50 dark:hover:bg-[#222]"
                  }`}
                >
                  <img src={t.hostAvatar} alt={t.hostName} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-neutral-900 dark:text-white">{t.hostName}</span>
                    </div>
                    <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 truncate">{t.propertyName}</p>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">{t.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Area: Active Chat Window */}
          <div className="flex-1 flex flex-col justify-between bg-neutral-50/50 dark:bg-[#181818]">
            
            {/* Chat Header */}
            <div className="p-4 bg-white dark:bg-[#1c1c1c] border-b border-gray-200 dark:border-neutral-800 flex items-center gap-3">
              <img src={activeThread.hostAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">{activeThread.hostName}</h3>
                <p className="text-xs text-neutral-500">{activeThread.propertyName}</p>
              </div>
            </div>

            {/* Messages Body */}
            <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-4">
              {activeThread.messages.map((m) => {
                const isMe = (currentUser.role === "guest" && m.sender === "guest") || (currentUser.role === "host" && m.sender === "host");
                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? "bg-[#FF385C] text-white rounded-br-xs"
                          : "bg-white dark:bg-[#252525] text-neutral-900 dark:text-white border border-gray-200 dark:border-neutral-700 rounded-bl-xs shadow-xs"
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-1 px-1">{m.timestamp}</span>
                  </div>
                );
              })}
            </div>

            {/* Chat Send Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-[#1c1c1c] border-t border-gray-200 dark:border-neutral-800 flex items-center gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activeThread.hostName}...`}
                className="flex-1 border border-gray-300 dark:border-neutral-700 rounded-full px-5 py-3 text-sm outline-none bg-transparent text-neutral-900 dark:text-white focus:border-black dark:focus:border-white"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="bg-[#FF385C] hover:bg-[#E00B41] text-white p-3 rounded-full shadow transition cursor-pointer disabled:opacity-40"
              >
                <svg viewBox="0 0 32 32" className="w-4 h-4 fill-current">
                  <path d="M4 28l24-12L4 4v9.333l17.143 2.667L4 18.667z" />
                </svg>
              </button>
            </form>

          </div>

        </div>
      </div>
    </main>
  );
}
