"use client";

import { useState } from "react";
import Link from "next/link";

type Question = {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      question: "Which cognitive function is primarily responsible for holding and manipulating information over short periods?",
      options: [
        "Long-term memory",
        "Working memory",
        "Semantic memory",
        "Procedural memory"
      ],
      correct: 1,
      explanation: "Working memory acts as the brain's mental sticky note, allowing us to temporarily hold and process information in active awareness."
    },
    {
      id: 2,
      question: "What term describes the brain's ability to reorganize itself by forming new neural connections throughout life?",
      options: [
        "Neurogenesis",
        "Neurotransmission",
        "Neuroplasticity",
        "Cognitive reserve"
      ],
      correct: 2,
      explanation: "Neuroplasticity is the brain's malleable ability to adapt, learn, and recover function by restructuring its neural pathways."
    },
    {
      id: 3,
      question: "Which of these lifestyle factors has been shown to have the most immediate positive effect on cognitive clarity and focus?",
      options: [
        "Sedentary mental puzzles",
        "A high-sugar diet",
        "Regular physical aerobic exercise",
        "Social isolation"
      ],
      correct: 2,
      explanation: "Aerobic exercise increases heart rate, promoting oxygen and blood flow to the brain, which stimulates the release of growth factors like BDNF."
    },
    {
      id: 4,
      question: "During which sleep stage does the brain primarily consolidate declarative and spatial memories?",
      options: [
        "Stage 1 Light Sleep",
        "Deep Slow-Wave Sleep (N3)",
        "REM Sleep",
        "Stage 2 Sleep Spindles"
      ],
      correct: 1,
      explanation: "Deep slow-wave sleep (N3) is critical for transferring memories from the temporary hippocampus storage to the permanent prefrontal cortex."
    },
    {
      id: 5,
      question: "Which mental strategy involves focusing awareness on the present moment while calmly acknowledging thoughts and feelings?",
      options: [
        "Cognitive reframing",
        "Mindfulness meditation",
        "Analytical deduction",
        "Creative visualization"
      ],
      correct: 1,
      explanation: "Mindfulness helps reduce cortisol levels, shrinking the stress-reactive amygdala and thickening the focus-oriented prefrontal cortex."
    }
  ];

  const handleAnswerClick = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);

    if (index === questions[currentQuestion].correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setIsAnswered(false);
  };

  return (
    <div style={{
      backgroundColor: "#0b0813",
      color: "#ffffff",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      minHeight: "100vh",
      backgroundImage: "radial-gradient(circle at 10% 20%, rgba(139, 92, 246, 0.12) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(217, 70, 239, 0.08) 0%, transparent 45%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}>

      {/* Header */}
      <header style={{
        padding: "20px 8%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        background: "rgba(11, 8, 19, 0.8)",
        backdropFilter: "blur(20px)",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <Link href="/" style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", textDecoration: "none", letterSpacing: "-0.5px" }}>
          dotheneeds <span style={{ color: "#a78bfa", fontWeight: 500, fontSize: "14px" }}>/ quiz</span>
        </Link>
        <Link href="/" style={{ fontSize: "13px", color: "#94a3b8", textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)", padding: "6px 14px", borderRadius: "20px" }}>
          Back to home
        </Link>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: "680px", width: "100%", margin: "0 auto", padding: "60px 4% 80px" }}>
        
        {!showResult ? (
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "20px",
            padding: "40px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
          }}>
            {/* Progress bar */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#94a3b8", marginBottom: "12px" }}>
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>Score: {score}</span>
            </div>
            <div style={{ width: "100%", height: "4px", backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "2px", marginBottom: "30px", overflow: "hidden" }}>
              <div style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%`, height: "100%", backgroundColor: "#8b5cf6", transition: "width 0.3s ease" }}></div>
            </div>

            {/* Question title */}
            <h2 style={{ fontSize: "20px", fontWeight: "700", lineHeight: "1.4", color: "#ffffff", marginBottom: "24px" }}>
              {questions[currentQuestion].question}
            </h2>

            {/* Options list */}
            <div style={{ display: "grid", gap: "12px", marginBottom: "24px" }}>
              {questions[currentQuestion].options.map((option, idx) => {
                let btnBg = "rgba(255, 255, 255, 0.02)";
                let btnBorder = "rgba(255, 255, 255, 0.08)";
                let textColor = "#e2e8f0";

                if (isAnswered) {
                  if (idx === questions[currentQuestion].correct) {
                    btnBg = "rgba(16, 185, 129, 0.15)";
                    btnBorder = "#10b981";
                    textColor = "#10b981";
                  } else if (idx === selectedAnswer) {
                    btnBg = "rgba(239, 68, 68, 0.15)";
                    btnBorder = "#ef4444";
                    textColor = "#ef4444";
                  } else {
                    textColor = "#64748b";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerClick(idx)}
                    disabled={isAnswered}
                    style={{
                      width: "100%",
                      padding: "16px 20px",
                      background: btnBg,
                      border: `1px solid ${btnBorder}`,
                      borderRadius: "10px",
                      color: textColor,
                      fontSize: "14px",
                      fontWeight: "500",
                      textAlign: "left",
                      cursor: isAnswered ? "not-allowed" : "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {isAnswered && (
              <div style={{
                background: "rgba(139, 92, 246, 0.05)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                borderRadius: "10px",
                padding: "20px",
                fontSize: "13px",
                lineHeight: "1.6",
                color: "#cbd5e1",
                marginBottom: "24px",
                animation: "fadeIn 0.3s ease"
              }}>
                <strong style={{ color: "#a78bfa", display: "block", marginBottom: "4px" }}>Did you know?</strong>
                {questions[currentQuestion].explanation}
              </div>
            )}

            {/* Next button */}
            {isAnswered && (
              <button
                onClick={handleNext}
                className="ahana-button primary"
                style={{ width: "100%", padding: "14px" }}
              >
                {currentQuestion === questions.length - 1 ? "Finish Quiz ➜" : "Next Question ➜"}
              </button>
            )}

          </div>
        ) : (
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "20px",
            padding: "40px",
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            animation: "fadeIn 0.4s ease"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏆</div>
            <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#ffffff", marginBottom: "10px" }}>Quiz Completed!</h2>
            <p style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "30px" }}>
              You scored <strong>{score}</strong> out of <strong>{questions.length}</strong> on the Cognitive Wellness Quiz.
            </p>

            <div style={{ display: "grid", gap: "10px" }}>
              <button onClick={resetQuiz} className="ahana-button primary" style={{ width: "100%" }}>
                Try Again
              </button>
              <Link href="/" className="ahana-button secondary" style={{ width: "100%", textDecoration: "none", display: "block" }}>
                Back to Home Portal
              </Link>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{
        padding: "30px 8%",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        textAlign: "center",
        fontSize: "12px",
        color: "#94a3b8"
      }}>
        <p>© 2026 DoTheNeeds. Cognitive health check-ins.</p>
      </footer>

    </div>
  );
}
