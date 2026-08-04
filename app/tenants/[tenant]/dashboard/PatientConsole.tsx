"use client";

import { useState } from "react";
import Image from "next/image";

type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  dob: string;
  gender: string;
  phone_number: string;
};

type PatientRecord = {
  id: string;
  record_type: string;
  recorded_at: string;
  clinical_data: any;
  attachment_urls: string[];
};

type PatientConsoleProps = {
  patient: Patient;
  records: PatientRecord[];
};

const CHART_TABS = [
  { id: "progress_report", label: "📝 Daily Progress Reports" },
  { id: "drug_chart", label: "💊 Medical Drug Chart" },
  { id: "non_drug_chart", label: "🧘 Non-Drug Therapy Chart" },
  { id: "nurse_notes", label: "📋 Nursing Inspection Notes" },
  { id: "lab_report", label: "🔬 Diagnostic Lab Reports" },
  { id: "nurse_handover", label: "🔄 Nurse Shift Handovers" },
  { id: "movement_status", label: "🚪 Security Gate Checkpoints" },
  { id: "discharge_summary", label: "📄 Discharge Summary" },
];

export function PatientConsole({ patient, records }: PatientConsoleProps) {
  const [activeTab, setActiveTab] = useState("progress_report");

  // Filter records matching the active tab type
  const activeRecords = records.filter(r => r.record_type === activeTab);

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "in_ward":
        return "#16A34A"; // Green
      case "left_campus":
        return "#DC2626"; // Red
      default:
        return "#D97706"; // Amber
    }
  };

  return (
    <div className="console-root">
      {/* 1. Demographics Bar */}
      <div className="demographics-panel">
        <div>
          <span className="label">Patient Name</span>
          <p className="val">{patient.first_name} {patient.last_name}</p>
        </div>
        <div>
          <span className="label">Date of Birth (DOB)</span>
          <p className="val">{new Date(patient.dob).toLocaleDateString()}</p>
        </div>
        <div>
          <span className="label">Gender / Phone</span>
          <p className="val">{patient.gender} / {patient.phone_number || "N/A"}</p>
        </div>
        <div>
          <span className="label">Medical Record Status</span>
          <p className="val" style={{ color: "var(--ahana-orange)", fontWeight: "bold" }}>Active Resident</p>
        </div>
      </div>

      {/* 2. Main EMR Workspace Grid */}
      <div className="emr-grid">
        {/* Left Sidebar tabs selection */}
        <aside className="sidebar-tabs">
          <ul className="ahana-list-reset tab-list">
            {CHART_TABS.map(tab => (
              <li key={tab.id}>
                <button
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-link-btn ${activeTab === tab.id ? "active" : ""}`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Right workspace details panel */}
        <main className="workspace-panel">
          <h3 className="workspace-title">
            {CHART_TABS.find(t => t.id === activeTab)?.label}
          </h3>

          {activeRecords.length > 0 ? (
            <div className="records-stack">
              {activeRecords.map(rec => (
                <div key={rec.id} className="record-card">
                  <div className="record-header">
                    <span className="date">Date Logged: {new Date(rec.recorded_at).toLocaleString()}</span>
                  </div>

                  <div className="record-body">
                    {/* Render custom layouts depending on EMR record type */}
                    {rec.record_type === "progress_report" && (
                      <div className="notes-view">
                        <p className="notes-text">&ldquo;{rec.clinical_data.notes}&rdquo;</p>
                        <div className="badge-row">
                          <strong>Recovery Assessment:</strong>
                          <span className="recovery-badge">{rec.clinical_data.condition_status || "Stable"}</span>
                        </div>
                      </div>
                    )}

                    {rec.record_type === "drug_chart" && (
                      <div className="chart-item">
                        <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold", color: "var(--ahana-purple-dark)" }}>
                          💊 {rec.clinical_data.medicine}
                        </p>
                        <p className="desc-text">
                          <strong>Dosage:</strong> {rec.clinical_data.dosage} | <strong>Frequency:</strong> {rec.clinical_data.frequency}
                        </p>
                        <div className="slots">
                          <strong>Daily Timings:</strong>{" "}
                          {rec.clinical_data.time_slots?.map((slot: string) => (
                            <span key={slot} className="time-badge">{slot}</span>
                          )) || <span className="time-badge">As needed</span>}
                        </div>
                      </div>
                    )}

                    {rec.record_type === "non_drug_chart" && (
                      <div className="chart-item">
                        <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold", color: "var(--ahana-orange)" }}>
                          🧘 {rec.clinical_data.therapy_type}
                        </p>
                        <p className="desc-text">
                          <strong>Schedule:</strong> {rec.clinical_data.frequency}
                        </p>
                        {rec.clinical_data.special_instructions && (
                          <div className="gate-note">
                            <strong>Instructions:</strong> {rec.clinical_data.special_instructions}
                          </div>
                        )}
                      </div>
                    )}

                    {rec.record_type === "nurse_notes" && (
                      <div className="notes-view">
                        <p className="notes-text">&ldquo;{rec.clinical_data.observation}&rdquo;</p>
                        <div className="badge-row" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                          <span>🩸 <strong>Blood Pressure:</strong> {rec.clinical_data.vitals_bp || "Normal"}</span>
                          <span>🫀 <strong>Pulse Rate:</strong> {rec.clinical_data.vitals_pulse || "Stable"}</span>
                        </div>
                      </div>
                    )}

                    {rec.record_type === "lab_report" && (
                      <div className="chart-item">
                        <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold", color: "var(--ahana-purple-dark)" }}>
                          🔬 {rec.clinical_data.test_name}
                        </p>
                        <p className="desc-text" style={{ marginTop: "6px" }}>
                          {rec.clinical_data.result_summary}
                        </p>
                        {rec.clinical_data.reference_range && (
                          <p style={{ margin: "4px 0 12px", fontSize: "13px", color: "var(--ahana-muted)" }}>
                            <strong>Ref Range:</strong> {rec.clinical_data.reference_range}
                          </p>
                        )}
                        {rec.attachment_urls && rec.attachment_urls.length > 0 && (
                          <div className="attachments-section">
                            <strong>Lab Report Files:</strong>
                            <div style={{ marginTop: "6px" }}>
                              {rec.attachment_urls.map(url => (
                                <a
                                  key={url}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="download-link"
                                >
                                  📄 Download PDF Lab Result
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {rec.record_type === "nurse_handover" && (
                      <div className="notes-view">
                        <div className="handover-block">
                          <strong>Outgoing Shift Report:</strong>
                          <p>&ldquo;{rec.clinical_data.outgoing_shift_notes}&rdquo;</p>
                        </div>
                        <div className="handover-block" style={{ marginTop: "12px", borderTop: "1px dashed var(--ahana-border)", paddingTop: "12px" }}>
                          <strong>Action Plan for Incoming Shift:</strong>
                          <p>&ldquo;{rec.clinical_data.incoming_instructions}&rdquo;</p>
                        </div>
                      </div>
                    )}

                    {rec.record_type === "movement_status" && (
                      <div className="chart-item">
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                          <strong>Gate Checkpoint Status:</strong>
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor: getStatusBadgeColor(rec.clinical_data.location_status),
                              color: "white",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: "bold",
                              textTransform: "uppercase"
                            }}
                          >
                            {rec.clinical_data.location_status?.replace("_", " ")}
                          </span>
                        </div>
                        {rec.clinical_data.gate_notes && (
                          <div className="gate-note">
                            <strong>Security Remarks:</strong> {rec.clinical_data.gate_notes}
                          </div>
                        )}
                      </div>
                    )}

                    {rec.record_type === "discharge_summary" && (
                      <div className="notes-view">
                        <p><strong>Discharge Target:</strong> {rec.clinical_data.discharge_date}</p>
                        <p><strong>Clinical Follow-up Plan:</strong> {rec.clinical_data.follow_up_advice}</p>
                        <p><strong>Social Rehab Project:</strong> {rec.clinical_data.rehabilitation_plan}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              No logged records found for this category.
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .console-root {
          display: flex;
          flex-direction: column;
          gap: var(--ahana-space-6);
        }

        .demographics-panel {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--ahana-space-4);
          background-color: var(--ahana-white);
          border: 1px solid var(--ahana-border);
          border-radius: var(--ahana-radius-xl);
          padding: var(--ahana-space-5);
          box-shadow: var(--ahana-shadow-sm);
        }

        .label {
          font-size: var(--ahana-font-size-sm);
          color: var(--ahana-muted);
          display: block;
          margin-bottom: 2px;
        }

        .val {
          font-weight: bold;
          font-size: 16px;
          margin: 0;
        }

        .emr-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: var(--ahana-space-6);
        }

        .sidebar-tabs {
          background-color: var(--ahana-white);
          border: 1px solid var(--ahana-border);
          border-radius: var(--ahana-radius-xl);
          padding: var(--ahana-space-4);
          height: fit-content;
        }

        .tab-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .tab-link-btn {
          width: 100%;
          text-align: left;
          background: transparent;
          border: 0;
          padding: 10px 14px;
          font-weight: bold;
          font-size: 14px;
          color: var(--ahana-muted);
          border-radius: var(--ahana-radius-md);
          cursor: pointer;
          transition: all 0.15s;
        }

        .tab-link-btn:hover {
          background-color: var(--ahana-surface-soft);
          color: var(--ahana-purple-dark);
        }

        .tab-link-btn.active {
          background-color: var(--ahana-lavender);
          color: var(--ahana-purple-dark);
          box-shadow: inset 4px 0 0 var(--ahana-purple);
        }

        .workspace-panel {
          background-color: var(--ahana-white);
          border: 1px solid var(--ahana-border);
          border-radius: var(--ahana-radius-xl);
          padding: var(--ahana-space-6);
          box-shadow: var(--ahana-shadow-sm);
        }

        .workspace-title {
          font-family: var(--ahana-font-serif);
          color: var(--ahana-purple-dark);
          border-bottom: 2px solid var(--ahana-orange);
          padding-bottom: var(--ahana-space-2);
          margin: 0 0 var(--ahana-space-5);
          font-size: var(--ahana-font-size-xl);
        }

        .records-stack {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .record-card {
          border: 1px solid var(--ahana-border);
          border-radius: var(--ahana-radius-lg);
          overflow: hidden;
          background-color: var(--ahana-white);
        }

        .record-header {
          background-color: var(--ahana-surface-soft);
          padding: 8px 16px;
          border-bottom: 1px solid var(--ahana-border);
          font-size: 12px;
          color: var(--ahana-muted);
          font-weight: 600;
        }

        .record-body {
          padding: var(--ahana-space-5);
        }

        .notes-text {
          font-size: 15px;
          font-style: italic;
          color: var(--ahana-text);
          line-height: 1.6;
          margin: 0 0 12px;
        }

        .badge-row {
          font-size: 13px;
        }

        .recovery-badge {
          background-color: var(--ahana-lavender);
          color: var(--ahana-purple-dark);
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: bold;
          margin-left: 8px;
        }

        .chart-item {
          display: flex;
          flex-direction: column;
        }

        .desc-text {
          margin: 4px 0;
          font-size: 14px;
          color: var(--ahana-text);
        }

        .slots {
          margin-top: 8px;
          font-size: 13px;
        }

        .time-badge {
          background-color: var(--ahana-surface-soft);
          border: 1px solid var(--ahana-border);
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: bold;
          margin-left: 6px;
          color: var(--ahana-purple-dark);
        }

        .download-link {
          display: inline-block;
          background-color: var(--ahana-white);
          border: 1px solid var(--ahana-purple);
          color: var(--ahana-purple);
          padding: 6px 12px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
          font-size: 13px;
          transition: background-color 0.15s;
        }

        .download-link:hover {
          background-color: var(--ahana-lavender);
          color: var(--ahana-purple-dark);
        }

        .handover-block p {
          margin: 4px 0 0;
          font-style: italic;
          color: var(--ahana-muted);
        }

        .gate-note {
          background-color: var(--ahana-surface-soft);
          border-left: 4px solid var(--ahana-purple);
          padding: 8px 12px;
          border-radius: 4px;
          margin-top: 8px;
          font-size: 13px;
        }

        .empty-state {
          text-align: center;
          color: var(--ahana-muted);
          padding: var(--ahana-space-8) 0;
          font-size: var(--ahana-font-size-base);
          border: 2px dashed var(--ahana-border);
          border-radius: var(--ahana-radius-lg);
        }

        @media (max-width: 900px) {
          .emr-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
