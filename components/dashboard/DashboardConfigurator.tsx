"use client";

import { useActionState, useState, useEffect } from "react";
import { updatePreferencesAction } from "@/lib/actions/profile";
import { EMPTY_FORM_STATE } from "@/lib/validation/auth";

type ConfiguratorProps = {
  initialWidgets: string[];
};

export function DashboardConfigurator({ initialWidgets }: ConfiguratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Read client-side network online status for PWA offline indicator support
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const [state, formAction] = useActionState(
    updatePreferencesAction,
    EMPTY_FORM_STATE
  );

  const availableWidgets = [
    { id: "video", label: "Featured Video Presentation" },
    { id: "explore", label: "Explore Quick-Links Grid" },
    { id: "account", label: "Your Account Details Summary" },
    { id: "coming_soon", label: "Coming Soon Release Track" }
  ];

  return (
    <div style={{ marginBottom: "var(--ahana-space-6)", position: "relative" }}>
      {/* PWA Network Status Badge */}
      <div style={{
        position: "absolute",
        top: "-45px",
        right: 0,
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "bold",
        backgroundColor: isOnline ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
        color: isOnline ? "#10b981" : "#ef4444",
        border: `1px solid ${isOnline ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
        transition: "all 0.3s ease"
      }}>
        <span style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: isOnline ? "#10b981" : "#ef4444",
          boxShadow: `0 0 8px ${isOnline ? "#10b981" : "#ef4444"}`
        }}></span>
        <span>{isOnline ? "Online (PWA Cached)" : "Offline Mode (Reading Offline Cache)"}</span>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="ahana-button secondary"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 18px",
          fontSize: "14px",
          fontWeight: "600",
          borderRadius: "10px"
        }}
      >
        <span>⚙️ Customize Dashboard Widgets</span>
        <span>{isOpen ? "▲ Hide Configurator" : "▼ Show Configurator"}</span>
      </button>

      {isOpen && (
        <div style={{
          marginTop: "12px",
          padding: "20px",
          backgroundColor: "var(--ahana-surface-soft)",
          border: "1px solid var(--ahana-border)",
          borderRadius: "12px",
          animation: "slideDown 0.3s ease"
        }}>
          <h4 style={{ margin: "0 0 8px", color: "var(--ahana-purple-dark)", fontSize: "15px" }}>
            Select Active Dashboard Widgets
          </h4>
          <p style={{ margin: "0 0 16px", fontSize: "12.5px", color: "var(--ahana-muted)" }}>
            Select the sections you want to keep visible on your main panel workspace. Changes persist to your account.
          </p>

          <form action={formAction}>
            <input type="hidden" name="hasDashboardWidgets" value="true" />
            
            <div style={{ display: "grid", gap: "10px", marginBottom: "16px" }}>
              {availableWidgets.map(widget => (
                <label
                  key={widget.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    background: "#ffffff",
                    border: "1px solid var(--ahana-border)",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px"
                  }}
                >
                  <input
                    type="checkbox"
                    name="dashboardWidgets"
                    value={widget.id}
                    defaultChecked={initialWidgets.includes(widget.id)}
                  />
                  <span>{widget.label}</span>
                </label>
              ))}
            </div>

            {state.message && (
              <div style={{
                color: "#16A34A",
                backgroundColor: "#DCFCE7",
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "13px",
                marginBottom: "12px",
                border: "1px solid #BBF7D0"
              }}>
                ✓ {state.message}
              </div>
            )}

            <button type="submit" className="ahana-button primary" style={{ width: "100%" }}>
              ✓ Save Layout Preferences
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
