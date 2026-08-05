import Link from "next/link";

export default function RootPage() {
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0b0813",
      color: "#ffffff",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      backgroundImage: "radial-gradient(circle at 10% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(217, 70, 239, 0.1) 0%, transparent 45%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}>
      
      {/* Header */}
      <header style={{
        padding: "30px 8%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        backgroundColor: "rgba(11, 8, 19, 0.4)",
        backdropFilter: "blur(12px)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{
            fontSize: "24px",
            fontWeight: 800,
            background: "linear-gradient(135deg, #8b5cf6, #d946ef)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>dotheneeds</span>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/quiz" style={{
            fontSize: "13px",
            color: "#a78bfa",
            textDecoration: "none",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            padding: "8px 18px",
            borderRadius: "20px",
            background: "rgba(139, 92, 246, 0.08)"
          }}>
            ✍ Declaration Board
          </Link>
        </div>
      </header>

      {/* Main Content Hero */}
      <main style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "80px 4% 60px",
        textAlign: "center"
      }}>
        <span style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "#a78bfa",
          textTransform: "uppercase",
          letterSpacing: "2px",
          background: "rgba(139, 92, 246, 0.1)",
          padding: "6px 14px",
          borderRadius: "20px",
          border: "1px solid rgba(139, 92, 246, 0.2)"
        }}>✦ unified platform ecosystems ✦</span>

        <h1 style={{
          fontSize: "52px",
          fontWeight: 800,
          margin: "24px 0 16px",
          background: "linear-gradient(to right, #ffffff, #cbd5e1, #a78bfa)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>DoTheNeeds Stack</h1>
        <p style={{
          fontSize: "17px",
          color: "#94a3b8",
          maxWidth: "700px",
          margin: "0 auto 60px",
          lineHeight: 1.6
        }}>
          Explore our branching software solutions tailored for healthcare facilities, wellness checking, cognitive training, and sports leagues.
        </p>

        {/* Verticals Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          textAlign: "left"
        }}>
          
          {/* Health & Wellbeing */}
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "20px",
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <div>
              <span style={{ fontSize: "28px" }}>🏥</span>
              <h3 style={{ fontSize: "19px", fontWeight: 700, color: "#ffffff", margin: "16px 0 10px" }}>
                Health (YouMeCare)
              </h3>
              <p style={{ fontSize: "13.5px", color: "#94a3b8", lineHeight: 1.6, marginBottom: "30px" }}>
                Centralized multitenant SaaS onboarding portal to register new clinics and locate portal landing pages.
              </p>
            </div>
            <Link 
              href="/saas"
              style={{
                display: "block",
                textAlign: "center",
                background: "rgba(255, 255, 255, 0.05)",
                color: "#ffffff",
                padding: "12px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "13.5px",
                textDecoration: "none",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            >
              Open SaaS Stack
            </Link>
          </div>

          {/* Fitness (Ahana) */}
          <div style={{
            background: "linear-gradient(145deg, rgba(139, 92, 246, 0.08), rgba(15, 10, 30, 0.6))",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 10px 30px rgba(139, 92, 246, 0.15)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <div>
              <span style={{ fontSize: "28px" }}>🧘</span>
              <h3 style={{ fontSize: "19px", fontWeight: 700, color: "#ffffff", margin: "16px 0 10px" }}>
                Fitness (Ahana Rehab)
              </h3>
              <p style={{ fontSize: "13.5px", color: "#94a3b8", lineHeight: 1.6, marginBottom: "30px" }}>
                Private hospital clinic portal for neuropsychiatric rehabilitation, daily therapy charts, and clinician consoles.
              </p>
            </div>
            <Link 
              href="/LSHC/Ahana.com/auth/login"
              style={{
                display: "block",
                textAlign: "center",
                background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                color: "#ffffff",
                padding: "12px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "13.5px",
                textDecoration: "none",
                boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)"
              }}
            >
              Launch Ahana Portal ➜
            </Link>
          </div>

          {/* Quiz (Declaration Board) */}
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "20px",
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <div>
              <span style={{ fontSize: "28px" }}>✍</span>
              <h3 style={{ fontSize: "19px", fontWeight: 700, color: "#ffffff", margin: "16px 0 10px" }}>
                Quiz (Declarations)
              </h3>
              <p style={{ fontSize: "13.5px", color: "#94a3b8", lineHeight: 1.6, marginBottom: "30px" }}>
                The original global declaration board. Commit to action, hash declarations, and match with peers.
              </p>
            </div>
            <Link 
              href="/quiz"
              style={{
                display: "block",
                textAlign: "center",
                background: "rgba(255, 255, 255, 0.05)",
                color: "#ffffff",
                padding: "12px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "13.5px",
                textDecoration: "none",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            >
              Open Declaration Board
            </Link>
          </div>

          {/* Sports (Coming Soon) */}
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "20px",
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            opacity: 0.5
          }}>
            <div>
              <span style={{ fontSize: "28px" }}>⚽</span>
              <h3 style={{ fontSize: "19px", fontWeight: 700, color: "#ffffff", margin: "16px 0 10px" }}>
                Sports & Play
              </h3>
              <p style={{ fontSize: "13.5px", color: "#94a3b8", lineHeight: 1.6, marginBottom: "30px" }}>
                Recreational scheduling and activity coordination modules.
              </p>
            </div>
            <button 
              disabled
              style={{
                width: "100%",
                background: "rgba(255, 255, 255, 0.02)",
                color: "#94a3b8",
                padding: "12px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "13.5px",
                border: "none",
                cursor: "not-allowed"
              }}
            >
              Coming Soon
            </button>
          </div>

        </div>

        {/* Small sublink to MindGym Game */}
        <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "40px" }}>
          Looking for the cognitive training assessments? <Link href="/quiz/game" style={{ color: "#a78bfa", textDecoration: "none", fontWeight: "600" }}>Start MindGym Game 🧠</Link>
        </p>

      </main>

      {/* Footer */}
      <footer style={{
        padding: "40px 8%",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        textAlign: "center",
        fontSize: "13px",
        color: "#94a3b8"
      }}>
        <p>© 2026 dotheneeds. All rights reserved.</p>
      </footer>

    </div>
  );
}
