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
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{
            fontSize: "24px",
            fontWeight: 800,
            background: "linear-gradient(135deg, #8b5cf6, #d946ef)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>DoTheNeeds</span>
        </div>
        <div>
          <span style={{
            fontSize: "12px",
            color: "#94a3b8",
            background: "rgba(255, 255, 255, 0.04)",
            padding: "6px 12px",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.08)"
          }}>Multi-Service Portal</span>
        </div>
      </header>

      {/* Main Content Hero */}
      <main style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "80px 4% 60px",
        textAlign: "center"
      }}>
        <h1 style={{
          fontSize: "52px",
          fontWeight: 800,
          marginBottom: "16px",
          background: "linear-gradient(to right, #ffffff, #cbd5e1, #a78bfa)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>Unified Business Ecosystems</h1>
        <p style={{
          fontSize: "17px",
          color: "#94a3b8",
          maxWidth: "700px",
          margin: "0 auto 60px",
          lineHeight: 1.6
        }}>
          Explore our tailored vertical software stacks designed to optimize clinical management, retail operations, and educational spaces.
        </p>

        {/* Verticals Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "30px",
          textAlign: "left"
        }}>
          
          {/* Healthcare Card */}
          <div style={{
            background: "linear-gradient(145deg, rgba(139, 92, 246, 0.08), rgba(15, 10, 30, 0.6))",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            borderRadius: "20px",
            padding: "32px",
            boxShadow: "0 10px 30px rgba(139, 92, 246, 0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <div>
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                background: "rgba(139, 92, 246, 0.15)",
                color: "#a78bfa",
                marginBottom: "20px"
              }}>🏥</div>
              <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", marginBottom: "10px" }}>
                Healthcare Portal (YouMeCare)
              </h3>
              <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.6, marginBottom: "30px" }}>
                Secure patient EMR records tracking, dynamic clinician callback queues, color-coded appointments calendar, and custom staff reporting layouts.
              </p>
            </div>
            <Link 
              href="/saas"
              style={{
                display: "block",
                textAlign: "center",
                background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                color: "#ffffff",
                padding: "14px",
                borderRadius: "10px",
                fontWeight: "600",
                fontSize: "14px",
                textDecoration: "none",
                boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)",
                transition: "all 0.3s ease"
              }}
            >
              Launch Healthcare Stack →
            </Link>
          </div>

          {/* Retail & Logistics (Coming Soon) */}
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "20px",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            opacity: 0.65
          }}>
            <div>
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                background: "rgba(255, 255, 255, 0.04)",
                color: "#94a3b8",
                marginBottom: "20px"
              }}>📦</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                  Retail & Logistics
                </h3>
                <span style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  color: "#cbd5e1"
                }}>Planned</span>
              </div>
              <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.6, marginBottom: "30px" }}>
                Point of sale grids, synchronized inventory audits, and logistics fleet monitoring systems custom tailored for local delivery networks.
              </p>
            </div>
            <button 
              disabled
              style={{
                width: "100%",
                background: "rgba(255, 255, 255, 0.05)",
                color: "#94a3b8",
                padding: "14px",
                borderRadius: "10px",
                fontWeight: "600",
                fontSize: "14px",
                border: "none",
                cursor: "not-allowed"
              }}
            >
              Under Construction
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: "40px 8%",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        textAlign: "center",
        fontSize: "13px",
        color: "#94a3b8"
      }}>
        <p>© 2026 DoTheNeeds. All rights reserved.</p>
      </footer>

    </div>
  );
}
