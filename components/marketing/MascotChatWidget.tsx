"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./MascotChatWidget.module.css";

type Message = {
  sender: "bot" | "user";
  text: string;
  time: string;
  options?: string[];
};

const SUGGESTED_QUESTIONS = [
  { id: "about", text: "🏥 About Ahana & M.S. Chellamuthu Trust" },
  { id: "topics", text: "🧠 Top 10 Mental Fitness Topics" },
  { id: "rehab", text: "Tell me about psychiatric rehab" },
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

    // Simulate bot thinking and responding with a snappy 750ms delay
    setTimeout(() => {
      let replyText = "Thank you for reaching out. For specific clinical questions, please connect directly with our medical officers. I'm here to share general information!";
      let replyOptions: string[] | undefined = undefined;
      const normalized = text.toLowerCase();

      // 1. Institutional FAQ Option & Sub-questions
      if (normalized.includes("about ahana") || normalized.includes("chellamuthu trust") || normalized.includes("about") || normalized.includes("legacy")) {
        replyText = "I can answer your questions about our facilities, services, and legacy. Select any question below to learn more:";
        replyOptions = [
          "Why choose Ahana Hospitals?",
          "What is the connection to the M.S. Chellamuthu Trust?",
          "What kinds of treatments are offered here?",
          "How is the quality of care overall?",
          "What in-house services are available?",
          "Is the hospital open round-the-clock?"
        ];
      } else if (normalized.includes("why choose ahana")) {
        replyText = "Ahana Hospitals is South India's leading neuropsychiatric and rehabilitation center. We combine world-class clinical expertise with compassionate care, focusing on holistic recovery rather than just symptom management.";
      } else if (normalized.includes("connection to the") || normalized.includes("connection to") || (normalized.includes("m.s. chellamuthu") && normalized.includes("connection"))) {
        replyText = "Ahana is the clinical arm of the M.S. Chellamuthu Trust & Research Foundation, which has pioneered mental health care and psychiatric rehabilitation since 1992. This partnership ensures that clinical treatments are backed by decades of community rehabilitation expertise.";
      } else if (normalized.includes("treatments are offered") || normalized.includes("kinds of treatments")) {
        replyText = "We offer comprehensive psychiatric care, clinical psychology, child and adolescent guidance, addiction medicine, geriatric psychiatry, and specialized long-term rehabilitation programs.";
      } else if (normalized.includes("quality of care") || normalized.includes("care overall")) {
        replyText = "Our care model is holistic and family-centric. We believe in treating patients with dignity, involving family members in therapy, and focusing on long-term wellness, vocational training, and social re-integration.";
      } else if (normalized.includes("in-house services") || normalized.includes("inhouse services") || normalized.includes("in-house")) {
        replyText = "We provide in-patient wards, out-patient consultations, diagnostic laboratories, a fully stocked in-house pharmacy, emergency stabilization units, and specialized rehabilitation therapy centers.";
      } else if (normalized.includes("round-the-clock") || normalized.includes("round the clock") || normalized.includes("24/7") || normalized.includes("open round")) {
        replyText = "Yes, Ahana Hospitals operates 24/7. We provide round-the-clock emergency psychiatric services, inpatient nursing care, and emergency helpline support (+91-9006006000).";
      }
      
      // 2. Mental Fitness Q&A Option & Sub-questions
      else if (normalized.includes("mental fitness") || normalized.includes("topics")) {
        replyText = "Here is a list of 10 key mental fitness topics. Select any topic below to learn more, or type a keyword (e.g. 'sleep'):";
        replyOptions = [
          "1. Stress & Burnout",
          "2. Anxiety & Panic",
          "3. Depression & Mood",
          "4. Sleep & Insomnia",
          "5. Mindfulness & Meditation",
          "6. Caregiver Support",
          "7. Substance De-addiction",
          "8. Child & Teen Stress",
          "9. Emotional Resilience",
          "10. Social Re-integration"
        ];
      } else if (normalized.includes("stress") || normalized.includes("burnout")) {
        replyText = "Stress and burnout are best managed by scheduling micro-breaks, practicing deep breathing, and setting firm boundaries. Daily active physical walking in nature helps lower cortisol levels.";
      } else if (normalized.includes("anxiety") || normalized.includes("panic") || normalized.includes("grounding")) {
        replyText = "During a panic attack, try the 5-4-3-2-1 grounding method: identify 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste. Breathe slowly, extending your exhale.";
      } else if (normalized.includes("depression") || normalized.includes("mood")) {
        replyText = "Depression affects energy, sleep, and interest. Simple daily actions—like 15 minutes of morning sunlight, simple routines, and sharing your feelings with a loved one—help activate recovery.";
      } else if (normalized.includes("sleep") || normalized.includes("insomnia")) {
        replyText = "Good sleep hygiene involves maintaining a fixed sleep schedule, keeping screens away 1 hour before bedtime, and keeping your room cool and dark. Avoid heavy meals close to sleep.";
      } else if (normalized.includes("mindfulness") || normalized.includes("meditation")) {
        replyText = "Mindfulness is paying attention to the present moment without judgment. Spend 5 minutes daily observing your breath or doing a body scan to calm the nervous system.";
      } else if (normalized.includes("caregiver")) {
        replyText = "Caring for a loved one with mental illness can be exhausting. Remember, self-care is not selfish. Join caregiver support groups, delegate tasks, and seek respite care.";
      } else if (normalized.includes("substance") || normalized.includes("de-addiction") || normalized.includes("addiction")) {
        replyText = "De-addiction requires a combination of medical detoxification, counseling, and long-term relapse prevention programs. Our rehabilitation pathways help rebuild healthy routines.";
      } else if (normalized.includes("child") || normalized.includes("teen") || normalized.includes("academic") || normalized.includes("student")) {
        replyText = "Youth face unique pressures like academic stress, screen addiction, and peer anxiety. Open, non-judgmental communication at home combined with early counseling is key.";
      } else if (normalized.includes("resilience") || normalized.includes("coping")) {
        replyText = "Resilience is the ability to bounce back from adversity. It is built by developing problem-solving skills, accepting change as part of life, and nurturing positive self-belief.";
      } else if (normalized.includes("integration") || normalized.includes("vocational")) {
        replyText = "Recovery is complete when a patient successfully rejoins society. Our trust offers vocational training and community housing to support the transition back to work and family life.";
      } else if (normalized.includes("rehab") || normalized.includes("psychiatric")) {
        replyText = "Ahana Hospitals runs specialized psychiatric rehabilitation and de-addiction centers in Madurai, supported by the M.S. Chellamuthu Trust. We focus on therapy, vocational rehabilitation, and cognitive training.";
      } else if (normalized.includes("resources")) {
        replyText = "Yes! Caregivers can find support guides in our 'Resources' tab, including specialized training, counselling, and local support network details.";
      } else if (normalized.includes("founder") || normalized.includes("ramasubramanian")) {
        replyText = "Our founder, Dr. C. Ramasubramanian, is a pioneer in South Indian community psychiatry and established the M.S. Chellamuthu Trust in 1992 to make mental health support accessible to all.";
      } else if (normalized.includes("callback") || normalized.includes("contact") || normalized.includes("talk")) {
        replyText = "You can request a callback by clicking 'Let's Talk' in the navigation bar. Our duty nurses will call you back during your preferred window.";
      }

      const botTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages((prev) => [...prev, { sender: "bot", text: replyText, time: botTime, options: replyOptions }]);
    }, 750);
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
                  
                  {msg.options && msg.options.length > 0 && (
                    <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      {msg.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSendMessage(opt)}
                          style={{
                            background: "white",
                            border: "1px solid var(--ahana-purple)",
                            borderRadius: "6px",
                            padding: "8px 12px",
                            fontSize: "12.5px",
                            color: "var(--ahana-purple)",
                            textAlign: "left",
                            cursor: "pointer",
                            width: "100%",
                            fontWeight: "600",
                            lineHeight: "1.4",
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

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
