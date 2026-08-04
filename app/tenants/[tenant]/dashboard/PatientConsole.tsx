"use client";

import { useState } from "react";
import Image from "next/image";
import { appendPatientRecordAction } from "@/lib/actions/patients";

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
  isWritable?: boolean;
  onRecordAdded?: (record: PatientRecord) => void;
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

export function PatientConsole({ patient, records, isWritable = false, onRecordAdded }: PatientConsoleProps) {
  const [activeTab, setActiveTab] = useState("progress_report");

  // Append Form State
  const [showAppendModal, setShowAppendModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Generic and specific form input states
  const [progressNotes, setProgressNotes] = useState("");
  const [progressStatus, setProgressStatus] = useState("Stable");

  const [drugMedicine, setDrugMedicine] = useState("");
  const [drugDosage, setDrugDosage] = useState("");
  const [drugFrequency, setDrugFrequency] = useState("");
  const [drugTimings, setDrugTimings] = useState("");

  const [therapyType, setTherapyType] = useState("");
  const [therapyFrequency, setTherapyFrequency] = useState("");
  const [therapyInstructions, setTherapyInstructions] = useState("");

  const [nurseObservation, setNurseObservation] = useState("");
  const [nurseBp, setNurseBp] = useState("");
  const [nursePulse, setNursePulse] = useState("");

  const [labTestName, setLabTestName] = useState("");
  const [labResultSummary, setLabResultSummary] = useState("");
  const [labRefRange, setLabRefRange] = useState("");
  const [labAttachmentUrl, setLabAttachmentUrl] = useState("");

  const [handoverOutgoing, setHandoverOutgoing] = useState("");
  const [handoverIncoming, setHandoverIncoming] = useState("");

  const [gateStatus, setGateStatus] = useState("in_ward");
  const [gateRemarks, setGateRemarks] = useState("");

  const [dischargeTarget, setDischargeTarget] = useState("");
  const [dischargeFollowUp, setDischargeFollowUp] = useState("");
  const [dischargeRehab, setDischargeRehab] = useState("");

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

  const resetFormFields = () => {
    setProgressNotes("");
    setProgressStatus("Stable");
    setDrugMedicine("");
    setDrugDosage("");
    setDrugFrequency("");
    setDrugTimings("");
    setTherapyType("");
    setTherapyFrequency("");
    setTherapyInstructions("");
    setNurseObservation("");
    setNurseBp("");
    setNursePulse("");
    setLabTestName("");
    setLabResultSummary("");
    setLabRefRange("");
    setLabAttachmentUrl("");
    setHandoverOutgoing("");
    setHandoverIncoming("");
    setGateStatus("in_ward");
    setGateRemarks("");
    setDischargeTarget("");
    setDischargeFollowUp("");
    setDischargeRehab("");
    setSaveError("");
  };

  const handleOpenAppend = () => {
    resetFormFields();
    setShowAppendModal(true);
  };

  const handleAppendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError("");

    let clinicalData: any = {};
    let attachmentUrls: string[] = [];

    // Compile clinical JSON data based on active tab type
    if (activeTab === "progress_report") {
      clinicalData = { notes: progressNotes, condition_status: progressStatus };
    } else if (activeTab === "drug_chart") {
      clinicalData = {
        medicine: drugMedicine,
        dosage: drugDosage,
        frequency: drugFrequency,
        time_slots: drugTimings ? drugTimings.split(",").map(t => t.trim()) : ["As needed"],
      };
    } else if (activeTab === "non_drug_chart") {
      clinicalData = {
        therapy_type: therapyType,
        frequency: therapyFrequency,
        special_instructions: therapyInstructions,
      };
    } else if (activeTab === "nurse_notes") {
      clinicalData = {
        observation: nurseObservation,
        vitals_bp: nurseBp,
        vitals_pulse: nursePulse,
      };
    } else if (activeTab === "lab_report") {
      clinicalData = {
        test_name: labTestName,
        result_summary: labResultSummary,
        reference_range: labRefRange,
      };
      if (labAttachmentUrl) {
        attachmentUrls.push(labAttachmentUrl);
      }
    } else if (activeTab === "nurse_handover") {
      clinicalData = {
        outgoing_shift_notes: handoverOutgoing,
        incoming_instructions: handoverIncoming,
      };
    } else if (activeTab === "movement_status") {
      clinicalData = {
        location_status: gateStatus,
        gate_notes: gateRemarks,
      };
    } else if (activeTab === "discharge_summary") {
      clinicalData = {
        discharge_date: dischargeTarget,
        follow_up_advice: dischargeFollowUp,
        rehabilitation_plan: dischargeRehab,
      };
    }

    try {
      const res = await appendPatientRecordAction(patient.id, activeTab, clinicalData);
      if (res.success && res.record) {
        const fullRecord: PatientRecord = {
          id: res.record.id,
          record_type: res.record.record_type,
          recorded_at: res.record.recorded_at,
          clinical_data: res.record.clinical_data,
          attachment_urls: attachmentUrls,
        };
        if (onRecordAdded) {
          onRecordAdded(fullRecord);
        }
        setShowAppendModal(false);
      } else {
        setSaveError(res.message || "Failed to append record.");
      }
    } catch (err: any) {
      setSaveError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid var(--ahana-orange)", paddingBottom: "12px", margin: "0 0 20px" }}>
            <h3 className="workspace-title" style={{ border: 0, margin: 0, padding: 0 }}>
              {CHART_TABS.find(t => t.id === activeTab)?.label}
            </h3>

            {isWritable && (
              <button
                type="button"
                onClick={handleOpenAppend}
                className="ahana-button primary small"
                style={{ padding: "8px 16px", fontSize: "13px" }}
              >
                ✍️ Append New Entry
              </button>
            )}
          </div>

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

      {/* Append EMR Record Modal Backdrop */}
      {showAppendModal && (
        <div className="modal-backdrop" onClick={() => setShowAppendModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4 style={{ margin: 0, color: "var(--ahana-purple-dark)" }}>
                Append Log: {CHART_TABS.find(t => t.id === activeTab)?.label}
              </h4>
              <button type="button" onClick={() => setShowAppendModal(false)} className="close-btn">×</button>
            </div>
            <form onSubmit={handleAppendSubmit} className="modal-body">
              {saveError && (
                <div style={{ backgroundColor: "#FEE2E2", color: "#DC2626", padding: "10px", borderRadius: "6px", marginBottom: "16px", fontSize: "13px" }}>
                  ⚠️ {saveError}
                </div>
              )}

              <div style={{ display: "grid", gap: "16px" }}>
                {activeTab === "progress_report" && (
                  <>
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Clinical Progress Notes</label>
                      <textarea
                        required
                        value={progressNotes}
                        onChange={(e) => setProgressNotes(e.target.value)}
                        placeholder="Write details of the session/recovery status..."
                        rows={4}
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Assessment Status</label>
                      <select
                        value={progressStatus}
                        onChange={(e) => setProgressStatus(e.target.value)}
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px", background: "white" }}
                      >
                        <option value="Stable">Stable</option>
                        <option value="Progressing">Progressing</option>
                        <option value="Needs Attention">Needs Attention</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </>
                )}

                {activeTab === "drug_chart" && (
                  <>
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Medicine Name</label>
                      <input
                        type="text"
                        required
                        value={drugMedicine}
                        onChange={(e) => setDrugMedicine(e.target.value)}
                        placeholder="e.g. Thyronorm 50mcg"
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                      />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Dosage</label>
                        <input
                          type="text"
                          required
                          value={drugDosage}
                          onChange={(e) => setDrugDosage(e.target.value)}
                          placeholder="e.g. 1 tablet"
                          style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Frequency</label>
                        <input
                          type="text"
                          required
                          value={drugFrequency}
                          onChange={(e) => setDrugFrequency(e.target.value)}
                          placeholder="e.g. Once daily (Morning)"
                          style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Timings (comma-separated)</label>
                      <input
                        type="text"
                        value={drugTimings}
                        onChange={(e) => setDrugTimings(e.target.value)}
                        placeholder="e.g. 08:00 AM, 09:00 PM"
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                      />
                    </div>
                  </>
                )}

                {activeTab === "non_drug_chart" && (
                  <>
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Therapy Type / Activity</label>
                      <input
                        type="text"
                        required
                        value={therapyType}
                        onChange={(e) => setTherapyType(e.target.value)}
                        placeholder="e.g. Cognitive Behavioral Therapy (CBT)"
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Frequency Schedule</label>
                      <input
                        type="text"
                        required
                        value={therapyFrequency}
                        onChange={(e) => setTherapyFrequency(e.target.value)}
                        placeholder="e.g. Twice weekly"
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Special Instructions</label>
                      <textarea
                        value={therapyInstructions}
                        onChange={(e) => setTherapyInstructions(e.target.value)}
                        placeholder="Additional details for treatment..."
                        rows={3}
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                      />
                    </div>
                  </>
                )}

                {activeTab === "nurse_notes" && (
                  <>
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Observations</label>
                      <textarea
                        required
                        value={nurseObservation}
                        onChange={(e) => setNurseObservation(e.target.value)}
                        placeholder="Details of physical health assessment..."
                        rows={4}
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                      />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Blood Pressure</label>
                        <input
                          type="text"
                          required
                          value={nurseBp}
                          onChange={(e) => setNurseBp(e.target.value)}
                          placeholder="e.g. 120/80 mmHg"
                          style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Pulse Rate</label>
                        <input
                          type="text"
                          required
                          value={nursePulse}
                          onChange={(e) => setNursePulse(e.target.value)}
                          placeholder="e.g. 72 bpm"
                          style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                        />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "lab_report" && (
                  <>
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Diagnostic Test Name</label>
                      <input
                        type="text"
                        required
                        value={labTestName}
                        onChange={(e) => setLabTestName(e.target.value)}
                        placeholder="e.g. Thyroid Panel"
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Result Summary</label>
                      <textarea
                        required
                        value={labResultSummary}
                        onChange={(e) => setLabResultSummary(e.target.value)}
                        placeholder="TSH level is 2.4..."
                        rows={3}
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Reference Range</label>
                      <input
                        type="text"
                        value={labRefRange}
                        onChange={(e) => setLabRefRange(e.target.value)}
                        placeholder="e.g. TSH: 0.45 - 4.5 uIU/mL"
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Lab Document PDF File URL</label>
                      <input
                        type="text"
                        value={labAttachmentUrl}
                        onChange={(e) => setLabAttachmentUrl(e.target.value)}
                        placeholder="e.g. /assets/brochures/dr-c-ramasubramanian-profile.pdf"
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                      />
                    </div>
                  </>
                )}

                {activeTab === "nurse_handover" && (
                  <>
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Outgoing Shift Notes</label>
                      <textarea
                        required
                        value={handoverOutgoing}
                        onChange={(e) => setHandoverOutgoing(e.target.value)}
                        placeholder="Summary of patient status during shift..."
                        rows={3}
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Incoming Shift Instructions</label>
                      <textarea
                        required
                        value={handoverIncoming}
                        onChange={(e) => setHandoverIncoming(e.target.value)}
                        placeholder="Reminders for incoming shift staff..."
                        rows={3}
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                      />
                    </div>
                  </>
                )}

                {activeTab === "movement_status" && (
                  <>
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Security Position State</label>
                      <select
                        value={gateStatus}
                        onChange={(e) => setGateStatus(e.target.value)}
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px", background: "white" }}
                      >
                        <option value="in_ward">In Ward Rooms</option>
                        <option value="left_campus">Left Campus / Exited</option>
                        <option value="on_lawn">Out on Lawn Activity</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Security Officer Remarks</label>
                      <textarea
                        required
                        value={gateRemarks}
                        onChange={(e) => setGateRemarks(e.target.value)}
                        placeholder="Logged checkpoint notes..."
                        rows={3}
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                      />
                    </div>
                  </>
                )}

                {activeTab === "discharge_summary" && (
                  <>
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Discharge Target Date</label>
                      <input
                        type="text"
                        required
                        value={dischargeTarget}
                        onChange={(e) => setDischargeTarget(e.target.value)}
                        placeholder="e.g. 2026-09-01 or N/A (Active Resident)"
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Clinical Follow-up Advice</label>
                      <textarea
                        required
                        value={dischargeFollowUp}
                        onChange={(e) => setDischargeFollowUp(e.target.value)}
                        placeholder="Medication compliance instructions..."
                        rows={3}
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Rehabilitation / Vocational Plan</label>
                      <textarea
                        required
                        value={dischargeRehab}
                        onChange={(e) => setDischargeRehab(e.target.value)}
                        placeholder="Social therapy progression details..."
                        rows={3}
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                      />
                    </div>
                  </>
                )}
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
                <button
                  type="button"
                  onClick={() => setShowAppendModal(false)}
                  className="ahana-button secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="ahana-button primary"
                >
                  {isSaving ? "Saving Entry..." : "Confirm Append"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

        /* Modal styling */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 16px;
        }

        .modal-content {
          background-color: white;
          border-radius: 12px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid var(--ahana-border);
        }

        .close-btn {
          background: transparent;
          border: 0;
          font-size: 24px;
          color: var(--ahana-muted);
          cursor: pointer;
        }

        .modal-body {
          padding: 24px;
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
