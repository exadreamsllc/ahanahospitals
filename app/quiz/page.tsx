"use client";

import { useState } from "react";
import Link from "next/link";

export default function DoTheNeedsPage() {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [age, setAge] = useState("");
  const [nationality, setNationality] = useState("");
  const [residence, setResidence] = useState("");
  const [category, setCategory] = useState("");
  const [declaration, setDeclaration] = useState("");
  const [move, setMove] = useState("");
  const [agree, setAgree] = useState(false);

  const [countriesCount, setCountriesCount] = useState(48);
  const [declarationsCount, setDeclarationsCount] = useState(3842);
  const [committedCount, setCommittedCount] = useState(2914);

  const [certificate, setCertificate] = useState<{
    hash: string;
    timestamp: string;
  } | null>(null);

  const categories = [
    "Environment & Climate", "Education & Learning", "Health & Wellbeing",
    "Technology & AI", "Economy & Finance", "Social Justice & Equity",
    "Politics & Governance", "Science & Research", "Arts & Culture",
    "Local Community", "Human Rights", "Food & Agriculture",
    "Housing & Urban", "Transportation", "Animal Rights"
  ];

  const countries = [
    "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria",
    "Bangladesh", "Belgium", "Bolivia", "Brazil", "Cambodia", "Canada",
    "Chile", "China", "Colombia", "Croatia", "Czech Republic", "Denmark",
    "Ecuador", "Egypt", "Ethiopia", "Finland", "France", "Germany", "Ghana",
    "Greece", "Guatemala", "Haiti", "Honduras", "Hungary", "India", "Indonesia",
    "Iran", "Iraq", "Ireland", "Israel", "Italy", "Japan", "Jordan", "Kenya",
    "South Korea", "Lebanon", "Libya", "Malaysia", "Mexico", "Morocco", "Myanmar",
    "Nepal", "Netherlands", "New Zealand", "Nigeria", "Norway", "Pakistan", "Peru",
    "Philippines", "Poland", "Portugal", "Romania", "Russia", "Saudi Arabia",
    "Senegal", "Serbia", "Singapore", "South Africa", "Spain", "Sri Lanka", "Sweden",
    "Switzerland", "Syria", "Taiwan", "Tanzania", "Thailand", "Tunisia", "Turkey",
    "Uganda", "Ukraine", "United Kingdom", "United States", "Uruguay", "Venezuela",
    "Vietnam", "Zimbabwe", "Other"
  ];

  const handleDeclare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !age || !nationality || !residence || !declaration || !move || !agree) {
      alert("Please fill in all mandatory fields and accept the terms.");
      return;
    }

    const chars = "abcdef0123456789";
    let mockHash = "";
    for (let i = 0; i < 64; i++) {
      mockHash += chars[Math.floor(Math.random() * chars.length)];
    }

    setCertificate({
      hash: mockHash,
      timestamp: new Date().toUTCString()
    });

    setDeclarationsCount(prev => prev + 1);
    setCommittedCount(prev => prev + 1);
  };

  return (
    <div style={{
      backgroundColor: "#0b0813",
      color: "#ffffff",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      minHeight: "100vh",
      backgroundImage: "radial-gradient(circle at 10% 20%, rgba(139, 92, 246, 0.12) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(217, 70, 239, 0.08) 0%, transparent 45%)",
      overflowX: "hidden"
    }}>

      {/* Dynamic Ticker */}
      <div style={{
        background: "linear-gradient(90deg, #7c3aed, #db2777)",
        padding: "8px 0",
        fontSize: "12px",
        fontWeight: "bold",
        whiteSpace: "nowrap",
        overflow: "hidden",
        position: "relative"
      }}>
        <div style={{
          display: "inline-block",
          animation: "ticker 40s linear infinite"
        }}>
          <span>Trending → End everyday loneliness · 12.4k voices ✦ Safe streets for women · 10.8k voices ✦ Clean air for all cities · 9.7k voices ✦ Education that inspires · 7.8k voices ✦ AI for the overlooked · 5.9k voices ✦ Affordable housing as a right · 5.1k voices ✦ Living wage everywhere · 4.3k voices ✦ &nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span>Trending → End everyday loneliness · 12.4k voices ✦ Safe streets for women · 10.8k voices ✦ Clean air for all cities · 9.7k voices ✦ Education that inspires · 7.8k voices ✦ AI for the overlooked · 5.9k voices ✦ Affordable housing as a right · 5.1k voices ✦ Living wage everywhere · 4.3k voices ✦</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ticker {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      ` }} />

      {/* Header */}
      <header style={{
        padding: "24px 8%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(20px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(11, 8, 19, 0.8)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <Link href="/" style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", textDecoration: "none", letterSpacing: "-0.5px" }}>
            dotheneeds
          </Link>
          <nav style={{ display: "flex", gap: "20px" }}>
            <Link href="#trending" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "13.5px", fontWeight: "500" }}>Trending</Link>
            <Link href="#how-it-works" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "13.5px", fontWeight: "500" }}>How it works</Link>
          </nav>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link 
            href="/saas"
            style={{
              background: "rgba(139, 92, 246, 0.12)",
              color: "#a78bfa",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: "600",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <span>🏥 Healthcare stack</span>
          </Link>
          
          <Link 
            href="/LSHC/Ahana.com/auth/login"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              color: "#ffffff",
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: "600",
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)"
            }}
          >
            Ahana Hospital Portal ➜
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 4% 80px" }}>
        
        {/* Intro Hero Section */}
        <section style={{ textAlign: "center", marginBottom: "70px" }}>
          <h1 style={{
            fontSize: "44px",
            fontWeight: 800,
            marginBottom: "20px",
            lineHeight: 1.2,
            background: "linear-gradient(to right, #ffffff, #cbd5e1, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            This is not a place to complain.
          </h1>
          <p style={{
            fontSize: "16.5px",
            color: "#94a3b8",
            maxWidth: "750px",
            margin: "0 auto 30px",
            lineHeight: 1.6
          }}>
            It is a place to declare what you want to change — and to answer the harder question: <strong>what will you do about it?</strong>
          </p>
        </section>

        {/* Founder's Voice Callout Box */}
        <section style={{
          background: "linear-gradient(145deg, rgba(139, 92, 246, 0.08), rgba(217, 70, 239, 0.03))",
          border: "1px solid rgba(139, 92, 246, 0.2)",
          borderRadius: "16px",
          padding: "30px",
          marginBottom: "60px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px"
        }}>
          <div style={{ flex: "1 1 500px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#d946ef", textTransform: "uppercase", letterSpacing: "1px" }}>
              ✦ Founder's Voice
            </span>
            <p style={{ fontSize: "15px", fontStyle: "italic", marginTop: "8px", color: "#e2e8f0" }}>
              "If there is a patient and a doctor, why do we need so many middlemen? I want to find out — and this platform is my first move."
            </p>
          </div>
          <Link href="/LSHC/Ahana.com/auth/login" style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "10px 20px",
            borderRadius: "8px",
            color: "#ffffff",
            fontSize: "13.5px",
            fontWeight: "600",
            textDecoration: "none"
          }}>
            Read the declaration →
          </Link>
        </section>

        {/* Two-Column Form & Concept Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "50px", marginBottom: "80px" }}>
          
          {/* Instructions Column */}
          <div>
            <span style={{ fontSize: "11px", fontWeight: "bold", color: "#a78bfa", textTransform: "uppercase" }}>
              ✦ every industry · every cause · every nation ✦
            </span>
            <h2 style={{ fontSize: "32px", fontWeight: 800, margin: "16px 0", color: "#ffffff" }}>
              What is the one thing you want to change?
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: 1.6, marginBottom: "40px" }}>
              A global declaration board. Anonymous or named. Timestamped and hashed — your words are yours, forever. But before you declare, two questions.
            </p>

            <div style={{ display: "grid", gap: "24px" }}>
              <div>
                <div style={{ fontSize: "18px", fontWeight: "800", color: "#a78bfa", marginBottom: "6px" }}>01</div>
                <h4 style={{ fontSize: "15px", color: "#f1f5f9", marginBottom: "4px" }}>Is this need beyond just you?</h4>
                <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.5 }}>
                  Could others — strangers across the world — feel it independently? Systemic needs make meaningful declarations. Personal grievances do not.
                </p>
              </div>

              <div>
                <div style={{ fontSize: "18px", fontWeight: "800", color: "#a78bfa", marginBottom: "6px" }}>02</div>
                <h4 style={{ fontSize: "15px", color: "#f1f5f9", marginBottom: "4px" }}>What will you personally do about it?</h4>
                <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.5 }}>
                  You'll answer this after you declare. A declaration without a commitment is just an opinion. We ask for more.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Form Column */}
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
          }}>
            
            {!certificate ? (
              <form onSubmit={handleDeclare}>
                <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
                  <button type="button" onClick={() => setStep(1)} style={{
                    flex: 1, padding: "8px", background: step === 1 ? "rgba(139, 92, 246, 0.2)" : "transparent",
                    color: step === 1 ? "#a78bfa" : "#94a3b8", border: `1px solid ${step === 1 ? "#8b5cf6" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "12px"
                  }}>1. The Need</button>
                  <button type="button" onClick={() => setStep(2)} style={{
                    flex: 1, padding: "8px", background: step === 2 ? "rgba(139, 92, 246, 0.2)" : "transparent",
                    color: step === 2 ? "#a78bfa" : "#94a3b8", border: `1px solid ${step === 2 ? "#8b5cf6" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "12px"
                  }}>2. The Move</button>
                </div>

                {step === 1 ? (
                  <div style={{ display: "grid", gap: "14px", animation: "fadeIn 0.3s ease" }}>
                    <h3 style={{ fontSize: "16px", color: "#f8fafc" }}>Your declaration</h3>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <input 
                        type="text" 
                        placeholder="First name" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)}
                        style={{ padding: "10px", background: "#161127", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }}
                        required
                      />
                      <input 
                        type="number" 
                        placeholder="Age" 
                        value={age} 
                        onChange={(e) => setAge(e.target.value)}
                        style={{ padding: "10px", background: "#161127", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }}
                        required
                      />
                    </div>

                    <select 
                      value={nationality} 
                      onChange={(e) => setNationality(e.target.value)}
                      style={{ padding: "10px", background: "#161127", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }}
                      required
                    >
                      <option value="">Nationality Select...</option>
                      {countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <select 
                      value={residence} 
                      onChange={(e) => setResidence(e.target.value)}
                      style={{ padding: "10px", background: "#161127", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }}
                      required
                    >
                      <option value="">Country of residence...</option>
                      {countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <select 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)}
                      style={{ padding: "10px", background: "#161127", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }}
                    >
                      <option value="">Industry Category (Optional)...</option>
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>

                    <div style={{ position: "relative" }}>
                      <textarea 
                        placeholder="The one thing I want to change in this world is..."
                        value={declaration}
                        onChange={(e) => setDeclaration(e.target.value.slice(0, 400))}
                        maxLength={400}
                        rows={4}
                        style={{ width: "100%", padding: "12px", background: "#161127", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px", resize: "none" }}
                        required
                      />
                      <span style={{ fontSize: "11px", color: "#94a3b8", position: "absolute", bottom: "10px", right: "10px" }}>
                        {declaration.length} / 400
                      </span>
                    </div>

                    <button type="button" onClick={() => setStep(2)} className="ahana-button primary" style={{ width: "100%", marginTop: "10px" }}>
                      Next: Name Your Move ➜
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: "14px", animation: "fadeIn 0.3s ease" }}>
                    <h3 style={{ fontSize: "16px", color: "#f8fafc" }}>Now name your move</h3>
                    <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.4 }}>
                      Don't just declare the world's need — declare your role in meeting it. What will YOU personally do to make this change real?
                    </p>

                    <textarea 
                      placeholder="I will..."
                      value={move}
                      onChange={(e) => setMove(e.target.value)}
                      rows={3}
                      style={{ width: "100%", padding: "12px", background: "#161127", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px", resize: "none" }}
                      required
                    />

                    <label style={{ display: "flex", gap: "10px", fontSize: "11.5px", color: "#94a3b8", cursor: "pointer", marginTop: "10px" }}>
                      <input 
                        type="checkbox" 
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        required
                      />
                      <span>I agree to the Terms of Service, Privacy Policy, and Community Standards of DoTheNeeds.</span>
                    </label>

                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                      <button type="button" onClick={() => setStep(1)} style={{
                        padding: "10px 16px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "6px", color: "#fff", cursor: "pointer", fontSize: "13px"
                      }}>Back</button>
                      
                      <button type="submit" className="ahana-button primary" style={{ flex: 1 }}>
                        Declare it to the world ➔
                      </button>
                    </div>
                  </div>
                )}
              </form>
            ) : (
              <div style={{ textAlign: "center", animation: "fadeIn 0.5s ease" }}>
                <div style={{ fontSize: "36px", marginBottom: "14px" }}>🔏</div>
                <h3 style={{ fontSize: "18px", color: "#10b981", marginBottom: "10px" }}>Declaration Certificate Hashed</h3>
                <p style={{ fontSize: "12.5px", color: "#94a3b8", lineHeight: 1.5, marginBottom: "20px" }}>
                  Your declaration has been registered, timestamped, and cryptographically verified.
                </p>

                <div style={{
                  background: "#161127", padding: "16px", borderRadius: "8px", border: "1px solid rgba(139, 92, 246, 0.2)",
                  textAlign: "left", fontSize: "11px", fontFamily: "monospace", display: "grid", gap: "8px", color: "#cbd5e1"
                }}>
                  <div><strong style={{ color: "#a78bfa" }}>Name:</strong> {firstName}</div>
                  <div><strong style={{ color: "#a78bfa" }}>Timestamp (UTC):</strong> {certificate.timestamp}</div>
                  <div><strong style={{ color: "#a78bfa" }}>SHA-256 HASH:</strong> {certificate.hash}</div>
                </div>

                <button onClick={() => {
                  setCertificate(null);
                  setFirstName("");
                  setDeclaration("");
                  setMove("");
                  setStep(1);
                }} className="ahana-button secondary" style={{ width: "100%", marginTop: "20px" }}>
                  Add Another Declaration
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Real-time Statistics Ticker Panels */}
        <section style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "80px",
          textAlign: "center"
        }}>
          <div style={{ padding: "20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px" }}>
            <div style={{ fontSize: "36px", fontWeight: "800", color: "#a78bfa" }}>{countriesCount}</div>
            <div style={{ fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", marginTop: "4px" }}>countries represented</div>
          </div>
          <div style={{ padding: "20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px" }}>
            <div style={{ fontSize: "36px", fontWeight: "800", color: "#a78bfa" }}>{declarationsCount}</div>
            <div style={{ fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", marginTop: "4px" }}>declarations made</div>
          </div>
          <div style={{ padding: "20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px" }}>
            <div style={{ fontSize: "36px", fontWeight: "800", color: "#a78bfa" }}>{committedCount}</div>
            <div style={{ fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", marginTop: "4px" }}>committed to act</div>
          </div>
          <div style={{ padding: "20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px" }}>
            <div style={{ fontSize: "36px", fontWeight: "800", color: "#a78bfa" }}>0</div>
            <div style={{ fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", marginTop: "4px" }}>ads ever. this site is yours.</div>
          </div>
        </section>

        {/* Platform Ecosystem: Active Modules */}
        <section id="ecosystem" style={{ marginBottom: "80px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "60px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span style={{ fontSize: "11px", fontWeight: "bold", color: "#a78bfa", textTransform: "uppercase" }}>
              ✦ Platform Ecosystem ✦
            </span>
            <h2 style={{ fontSize: "32px", fontWeight: 800, marginTop: "10px" }}>Active Service Modules</h2>
            <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "10px" }}>
              Tailored applications branching out to support healthcare, wellness, and personal growth.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
            
            {/* Health Module */}
            <div style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              <div>
                <span style={{ fontSize: "24px" }}>🏥</span>
                <h4 style={{ fontSize: "16px", color: "#f8fafc", margin: "12px 0 6px" }}>Health (YouMeCare)</h4>
                <p style={{ fontSize: "12.5px", color: "#94a3b8", lineHeight: 1.5, marginBottom: "20px" }}>
                  Centralized multitenant SaaS onboarding portal to register new clinics and find existing medical portals.
                </p>
              </div>
              <Link href="/saas" style={{
                textAlign: "center", background: "rgba(139, 92, 246, 0.12)", color: "#a78bfa",
                border: "1px solid rgba(139, 92, 246, 0.3)", padding: "10px", borderRadius: "8px",
                fontSize: "13px", fontWeight: "600", textDecoration: "none"
              }}>
                Launch SaaS Stack
              </Link>
            </div>

            {/* Fitness Module */}
            <div style={{
              background: "linear-gradient(145deg, rgba(139, 92, 246, 0.05), rgba(15, 10, 30, 0.4))",
              border: "1px solid rgba(139, 92, 246, 0.2)",
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              <div>
                <span style={{ fontSize: "24px" }}>🧘</span>
                <h4 style={{ fontSize: "16px", color: "#f8fafc", margin: "12px 0 6px" }}>Fitness (Ahana Rehab)</h4>
                <p style={{ fontSize: "12.5px", color: "#94a3b8", lineHeight: 1.5, marginBottom: "20px" }}>
                  Neuropsychiatric rehabilitation portal, EMR records tracker, and active daily therapy planner.
                </p>
              </div>
              <Link href="/LSHC/Ahana.com/auth/login" style={{
                textAlign: "center", background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "#ffffff",
                padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: "600",
                textDecoration: "none", boxShadow: "0 4px 12px rgba(124, 58, 237, 0.2)"
              }}>
                Launch Ahana Portal
              </Link>
            </div>

            {/* Quiz Module */}
            <div style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              <div>
                <span style={{ fontSize: "24px" }}>🧠</span>
                <h4 style={{ fontSize: "16px", color: "#f8fafc", margin: "12px 0 6px" }}>Quiz (MindGym)</h4>
                <p style={{ fontSize: "12.5px", color: "#94a3b8", lineHeight: 1.5, marginBottom: "20px" }}>
                  Interactive mental-fitness and cognitive assessment games designed to track working memory.
                </p>
              </div>
              <Link href="/quiz/game" style={{
                textAlign: "center", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#ffffff", padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: "600",
                textDecoration: "none"
              }}>
                Start MindGym Quiz
              </Link>
            </div>

            {/* Sports Module */}
            <div style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              opacity: 0.5
            }}>
              <div>
                <span style={{ fontSize: "24px" }}>⚽</span>
                <h4 style={{ fontSize: "16px", color: "#f8fafc", margin: "12px 0 6px" }}>Sports & Play</h4>
                <p style={{ fontSize: "12.5px", color: "#94a3b8", lineHeight: 1.5, marginBottom: "20px" }}>
                  Recreational scheduling and activity coordination modules.
                </p>
              </div>
              <button disabled style={{
                textAlign: "center", background: "rgba(255, 255, 255, 0.02)", color: "#94a3b8",
                border: "none", padding: "10px", borderRadius: "8px", fontSize: "13px",
                fontWeight: "600", cursor: "not-allowed"
              }}>
                Coming Soon
              </button>
            </div>

          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" style={{ marginBottom: "80px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "60px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span style={{ fontSize: "11px", fontWeight: "bold", color: "#a78bfa", textTransform: "uppercase" }}>
              ✦ simple by design ✦
            </span>
            <h2 style={{ fontSize: "32px", fontWeight: 800, marginTop: "10px" }}>How it works</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "30px" }}>
            <div style={{ padding: "20px" }}>
              <div style={{ fontSize: "28px", marginBottom: "14px" }}>✍</div>
              <h4 style={{ fontSize: "16px", color: "#f8fafc", marginBottom: "8px" }}>1. You declare</h4>
              <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.5 }}>
                The one thing you want to change. Any industry. Any cause. 400 characters. One systemic need.
              </p>
            </div>

            <div style={{ padding: "20px" }}>
              <div style={{ fontSize: "28px", marginBottom: "14px" }}>🛡</div>
              <h4 style={{ fontSize: "16px", color: "#f8fafc", marginBottom: "8px" }}>2. We check it</h4>
              <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.5 }}>
                AI and human moderation removes personal targeting, hate, and harm. Only systemic, constructive needs make it through.
              </p>
            </div>

            <div style={{ padding: "20px" }}>
              <div style={{ fontSize: "28px", marginBottom: "14px" }}>🔏</div>
              <h4 style={{ fontSize: "16px", color: "#f8fafc", marginBottom: "8px" }}>3. It's signed</h4>
              <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.5 }}>
                SHA-256 hashed. UTC timestamped. Your Declaration Certificate is permanent proof that these words are yours.
              </p>
            </div>

            <div style={{ padding: "20px" }}>
              <div style={{ fontSize: "28px", marginBottom: "14px" }}>🤝</div>
              <h4 style={{ fontSize: "16px", color: "#f8fafc", marginBottom: "8px" }}>4. You're matched</h4>
              <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.5 }}>
                AI groups similar declarations. You're shown who else shares your need — locally and globally. You are not alone.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer style={{
        padding: "60px 8% 40px",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        backgroundColor: "rgba(11, 8, 19, 0.6)"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "40px",
          maxWidth: "1200px",
          margin: "0 auto 40px"
        }}>
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", marginBottom: "12px" }}>dotheneeds</h3>
            <p style={{ fontSize: "13px", color: "#94a3b8", maxWidth: "300px", lineHeight: 1.5 }}>
              "Not here to witness the world that needs changing. Here to be the change it needs."
            </p>
          </div>

          <div style={{ display: "flex", gap: "50px", flexWrap: "wrap" }}>
            <div style={{ display: "grid", gap: "10px" }}>
              <strong style={{ fontSize: "13px", color: "#cbd5e1" }}>Platform</strong>
              <Link href="#" style={{ fontSize: "13px", color: "#94a3b8", textDecoration: "none" }}>About</Link>
              <Link href="#" style={{ fontSize: "13px", color: "#94a3b8", textDecoration: "none" }}>Moderation Policy</Link>
              <Link href="#" style={{ fontSize: "13px", color: "#94a3b8", textDecoration: "none" }}>Contact</Link>
            </div>
            <div style={{ display: "grid", gap: "10px" }}>
              <strong style={{ fontSize: "13px", color: "#cbd5e1" }}>Legal</strong>
              <Link href="#" style={{ fontSize: "13px", color: "#94a3b8", textDecoration: "none" }}>Privacy</Link>
              <Link href="#" style={{ fontSize: "13px", color: "#94a3b8", textDecoration: "none" }}>Intellectual Property</Link>
              <Link href="#" style={{ fontSize: "13px", color: "#94a3b8", textDecoration: "none" }}>How matching works</Link>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          paddingTop: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
          fontSize: "12px",
          color: "#94a3b8"
        }}>
          <p>No advertising. No data selling. No algorithms optimising for outrage. Just human needs, declared honestly.</p>
        </div>
      </footer>

    </div>
  );
}
