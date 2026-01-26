"use client";

import { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { aboutUsData, ourServices } from "../data";

interface Message {
  role: "bot" | "user";
  text: string;
}

const SERVICE_ID = "service_kjd43s2";
const TEMPLATE_ID = "template_lew7hye";
const PUBLIC_KEY = "Qn6NLMmkaLabSyyZR";

const BotIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const SendIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChatIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function MahabirChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"form" | "chat">("form");
  const [userData, setUserData] = useState({ name: "", email: "", contact: "" });
  const [errors, setErrors] = useState({ name: "", email: "", contact: "" });
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Namaste! 👋 I am Mahabir, your dedicated Nepatronix AI assistant. Please provide your details to start the conversation." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Automatically send summary when chat is closed if some data exists
    if (!isOpen && (userData.name || userData.email || userData.contact)) {
      sendSummary();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const validate = () => {
    const newErrors = { name: "", email: "", contact: "" };
    let isValid = true;

    if (!userData.name.trim()) {
      newErrors.name = "Full name is required";
      isValid = false;
    }
    if (!userData.email.trim() || !/^\S+@\S+\.\S+$/.test(userData.email)) {
      newErrors.email = "Valid email is required";
      isValid = false;
    }
    if (!userData.contact.trim() || !/^\+?[0-9]{10,15}$/.test(userData.contact)) {
      newErrors.contact = "Valid contact number is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setStep("chat");
      setIsTyping(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: `Namaste, ${userData.name.split(' ')[0]}! 🙏 I'm thrilled to assist you. I've been briefed on all our services—from STEM Lab tiers to R&D. \n\nWhat brings you here today? Are you looking to innovate your school, or perhaps start a certified engineering course?` }
        ]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleSend = async (e?: React.FormEvent, preset?: string) => {
    if (e) e.preventDefault();
    const userMessage = preset || input.trim();
    if (!userMessage) return;

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setIsTyping(true);

    try {
      // Send to our enhanced API that contains the full website knowledge base
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage,
          history: messages.slice(-5) 
        }),
      });
      const data = await response.json();
      
      // Simulate natural thinking delay
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "bot", text: data.text }]);
        setIsTyping(false);
      }, 800);
      
    } catch (error) {
      console.error("Chat API error:", error);
      setMessages((prev) => [...prev, { role: "bot", text: "I'm having a small bit of technical interference, but I'm still listening! Could you try that again?" }]);
      setIsTyping(false);
    }
  };

  // Keep local logic as a backup or for very specific triggers (removed redundant logic here as API handles it)
  const generateAIResponse = (input: string): string => {
     // This is now primarily handled by the API for a more "Beautiful and Effective" conversation
     return "Thinking..."; 
  };


  const sendSummary = async () => {
    // Only send if there is at least name or email to identify
    if (!userData.name && !userData.email) return;

    const chatHistory = messages
      .map((m) => `${m.role === "bot" ? "Mahabir" : userData.name || "Visitor"}: ${m.text}`)
      .join("\n");

    try {
      emailjs.init(PUBLIC_KEY);
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name: "Mahabir Chatbot",
        from_email: userData.email || "no-email@nepatronix.com",
        user_name: userData.name || "N/A",
        user_email: userData.email || "N/A",
        user_contact: userData.contact || "N/A",
        message: `### MAHABIR CHAT SUMMARY ###\n\nDATE: ${new Date().toLocaleString()}\n\nCUSTOMER INFO:\nName: ${userData.name}\nEmail: ${userData.email}\nContact: ${userData.contact}\n\nSESSION LOG:\n${chatHistory}`,
      });

      // Also push to contact API
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: userData.contact,
          message: `Digital Lead from Mahabir Chat. History:\n${chatHistory.substring(0, 1000)}`
        })
      });
    } catch (error) {
      console.error("Chat summary failed", error);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans flex flex-col items-end gap-3 pointer-events-none sm:bottom-6 sm:right-6 bottom-0 right-0 w-full">
      {/* Messenger / AI Chat System */}
      <div className="relative pointer-events-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(193,18,31,0.3)] transition-all duration-500 transform hover:scale-110 active:scale-95 border-2 border-white/50 ${
            isOpen ? "bg-[#020617] rotate-90" : "bg-[#C1121F]"
          }`}
        >
          {isOpen ? <XIcon className="text-white w-6 h-6" /> : <ChatIcon className="text-white w-6 h-6 animate-pulse" />}
        </button>

        {isOpen && (
          <div 
            ref={chatRef}
            className="fixed inset-0 sm:inset-auto sm:absolute sm:bottom-20 sm:right-0 w-full h-full sm:w-[90vw] sm:max-w-md sm:h-[80vh] md:w-[420px] md:h-[600px] lg:w-[400px] lg:h-[600px] bg-white rounded-none sm:rounded-[2.5rem] shadow-[0_25px_70px_rgba(0,0,0,0.25)] border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 fade-in duration-500 z-[200]"
          >
            {/* Header */}
            <div className="p-5 sm:p-7 bg-[#020617] text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C1121F]/10 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full"></div>
              <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#C1121F] to-red-600 flex items-center justify-center border border-white/10 shadow-lg">
                    <BotIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.25em]">Mahabir AI</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
                      <span className="text-[9px] font-bold text-slate-400">Deep Learning Enabled</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all text-white absolute right-2 top-2 sm:static"
                  style={{ zIndex: 10 }}
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {step === "form" ? (
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 bg-slate-50/50">
                <div className="text-center space-y-2 mb-4">
                  <h4 className="text-xl font-bold text-slate-800">Let's Get Started!</h4>
                  <p className="text-xs text-slate-500 font-medium">Please enter your details to start chatting with Mahabir.</p>
                </div>

                <form onSubmit={handleStartChat} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1">Full Name</label>
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      className={`w-full bg-white border ${errors.name ? 'border-red-400' : 'border-slate-100'} rounded-2xl px-4 py-3 text-base sm:px-5 sm:py-3.5 font-bold text-slate-900 shadow-sm focus:ring-2 focus:ring-[#C1121F]/10 transition-all outline-none`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.name}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1">Email Address</label>
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      className={`w-full bg-white border ${errors.email ? 'border-red-400' : 'border-slate-100'} rounded-2xl px-4 py-3 text-base sm:px-5 sm:py-3.5 font-bold text-slate-900 shadow-sm focus:ring-2 focus:ring-[#C1121F]/10 transition-all outline-none`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.email}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1">Contact Number</label>
                    <input
                      type="tel"
                      value={userData.contact}
                      onChange={(e) => setUserData({ ...userData, contact: e.target.value })}
                      className={`w-full bg-white border ${errors.contact ? 'border-red-400' : 'border-slate-100'} rounded-2xl px-4 py-3 text-base sm:px-5 sm:py-3.5 font-bold text-slate-900 shadow-sm focus:ring-2 focus:ring-[#C1121F]/10 transition-all outline-none`}
                      placeholder="+977 98XXXXXXXX"
                    />
                    {errors.contact && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.contact}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#C1121F] text-white rounded-2xl py-4 text-xs font-black uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-700 hover:scale-[1.02] active:scale-95 transition-all mt-4"
                    style={{ fontSize: '1rem' }}
                  >
                    Start Conversation
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-6 bg-slate-50/50">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[88%] flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${m.role === "user" ? "bg-white border border-slate-200" : "bg-[#C1121F]"}`}>
                          {m.role === "user" ? <UserIcon className="w-4 h-4 text-slate-400" /> : <BotIcon className="w-4 h-4 text-white" />}
                        </div>
                        <div className={`p-4 rounded-[1.5rem] text-[12.5px] font-medium leading-relaxed shadow-[0_2px_10px_rgba(0,0,0,0.02)] ${
                          m.role === "user" ? "bg-[#020617] text-white rounded-tr-none" : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                        }`}>
                          {m.text.split('\n').map((line, idx) => (
                            <p key={idx} className={idx > 0 ? "mt-2" : ""}>{line}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start pl-11">
                      <div className="flex gap-1.5 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
                          <span className="w-1.5 h-1.5 bg-[#C1121F] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="w-1.5 h-1.5 bg-[#C1121F] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="w-1.5 h-1.5 bg-[#C1121F] rounded-full animate-bounce"></span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-2 sm:p-4 bg-white border-t border-slate-50">
                  <div className="flex flex-wrap gap-2 mb-4 px-1 sm:px-2">
                    {["Our Services", "STEM Training", "Lab Setup", "Contact Details"].map((chip) => (
                      <button 
                        key={chip} 
                        onClick={() => handleSend(undefined, chip)}
                        className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-slate-100 bg-slate-50 text-slate-500 hover:bg-[#C1121F] hover:text-white hover:border-[#C1121F] transition-all"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                  
                  <form onSubmit={handleSend} className="relative group">
                    <input
                      type="text"
                      placeholder="Message Mahabir AI..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-4 pr-12 text-base font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-[#C1121F]/10 focus:bg-white transition-all text-slate-900"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[#C1121F] text-white flex items-center justify-center hover:bg-red-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-900/20"
                    >
                      <SendIcon className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/9779803661701" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_8px_30px_rgba(37,211,102,0.3)] hover:scale-110 active:scale-95 transition-all pointer-events-auto border-2 border-white/50 sm:fixed sm:bottom-6 sm:right-24 fixed bottom-6 left-6 z-[101]"
        title="Chat on WhatsApp"
      >
        <WhatsAppIcon className="text-white w-8 h-8" />
      </a>
    </div>
  );
}
