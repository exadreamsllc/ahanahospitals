"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./MascotChatWidget.module.css";

type Message = {
  sender: "bot" | "user";
  text: string;
  time: string;
};

const SUGGESTED_QUESTIONS = [
  { id: "rehab", text: "Tell me about psychiatric rehab" },
  { id: "caregiver", text: "Helpful caregiver resources" },
  { id: "founder", text: "Who is Dr. C. Ramasubramanian?" },
  { id: "callback", text: "How can I request a callback?" },
];

export function MascotChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I am Uskabuska, your Ahana Hospitals wellness guide. How can I support you today? Feel free to ask about our clinical care pathways or rehabilitation services.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide notification tooltip after 8 seconds
    const timer = setTimeout(() => setShowTooltip(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = { sender: "user", text, time: userTime };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    // Simulate bot thinking and responding
    setTimeout(() => {
      let replyText = "Thank you for reaching out. For specific clinical questions, please connect directly with our medical officers. I'm here to share general information!";
      const normalized = text.toLowerCase();

      if (normalized.includes("rehab") || normalized.includes("psychiatric")) {
        replyText = "Ahana Hospitals runs specialized psychiatric rehabilitation and de-addiction centers in Madurai, supported by the M.S. Chellamuthu Trust. We focus on therapy, vocational rehabilitation, and cognitive training.";
      } else if (normalized.includes("caregiver") || normalized.includes("resources")) {
        replyText = "Yes! Caregivers can find support guides in our 'Resources' tab, including specialized training, counselling, and local support network details.";
      } else if (normalized.includes("founder") || normalized.includes("ramasubramanian")) {
        replyText = "Our founder, Dr. C. Ramasubramanian, is a pioneer in South Indian community psychiatry and established the M.S. Chellamuthu Trust in 1992 to make mental health support accessible to all.";
      } else if (normalized.includes("callback") || normalized.includes("contact") || normalized.includes("talk")) {
        replyText = "You can request a callback by clicking 'Let's Talk' in the navigation bar. Our duty nurses will call you back during your preferred window.";
      }

      const botTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages((prev) => [...prev, { sender: "bot", text: replyText, time: botTime }]);
    }, 8000);
  };

  return (
    <div className={`${styles.widgetContainer} no-print`}>
      {/* Tooltip Alert */}
      {showTooltip && !isOpen && (
        <div className={styles.tooltip} role="alert">
          <p>Hi! I'm Uskabuska. Click here to chat! 👋</p>
          <button
            type="button"
            className={styles.tooltipClose}
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        type="button"
        className={`${styles.chatTrigger} ${isOpen ? styles.activeTrigger : ""}`}
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        aria-label="Open support chat"
      >
        <div className={styles.avatarWrapper}>
          <Image
            src="/assets/mascot.jpg"
            alt="Uskabuska Mascot avatar"
            fill
            sizes="128px"
            className={styles.avatarImage}
            priority
          />
        </div>
        <span className={styles.pulseDot} />
      </button>

      {/* Expandable Chat Console */}
      {isOpen && (
        <section className={styles.chatConsole} aria-labelledby="chat-heading">
          <div className={styles.chatHeader}>
            <div className={styles.headerMascot}>
              <div className={styles.headerAvatar}>
                <Image
                  src="/assets/mascot.jpg"
                  alt="Uskabuska Avatar"
                  width={40}
                  height={40}
                  className={styles.headerAvatarImg}
                />
              </div>
              <div>
                <h3 id="chat-heading" className={styles.mascotName}>Uskabuska</h3>
                <span className={styles.statusIndicator}>● Online Wellness Guide</span>
              </div>
            </div>
            <button
              type="button"
              className={styles.closeConsole}
              onClick={() => setIsOpen(false)}
              aria-label="Minimize chat window"
            >
              ✕
            </button>
          </div>

          <div className={styles.messagesList}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.messageWrapper} ${
                  msg.sender === "bot" ? styles.botMessage : styles.userMessage
                }`}
              >
                <div className={styles.messageBubble}>
                  <p className={styles.messageText}>{msg.text}</p>
                  <span className={styles.messageTime}>{msg.time}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Preset Helper Options */}
          <div className={styles.suggestionsContainer}>
            <ul className={styles.suggestionsList}>
              {SUGGESTED_QUESTIONS.map((q) => (
                <li key={q.id}>
                  <button
                    type="button"
                    className={styles.suggestionBtn}
                    onClick={() => handleSendMessage(q.text)}
                  >
                    {q.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Text Input Panel */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className={styles.inputArea}
          >
            <input
              type="text"
              placeholder="Ask Uskabuska a question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={styles.chatInput}
              aria-label="Type message here"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className={styles.sendButton}
              aria-label="Send message"
            >
              ➔
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
