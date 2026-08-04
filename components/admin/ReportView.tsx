"use client";

import { useActionState, useState } from "react";
import { updatePreferencesAction } from "@/lib/actions/profile";
import { updateCallbackAction } from "@/lib/actions/contact";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { EMPTY_FORM_STATE } from "@/lib/validation/auth";
import { CalendarView } from "./CalendarView";

type CallbackRequest = {
  id: string;
  full_name: string;
  phone_number: string;
  preferred_time: string;
  contact_channel: string;
  status: string;
  created_at: string;
};

type ReportViewProps = {
  callbacks: CallbackRequest[];
  initialColumns: string[];
};

const ALL_OPTIONAL_COLUMNS = [
  { value: "phone_number", label: "Contact Phone" },
  { value: "preferred_time", label: "Preferred Time" },
  { value: "contact_channel", label: "Contact Method" },
] as const;

export function ReportView({ callbacks, initialColumns }: ReportViewProps) {
  // Map old default column values if present to correct Supabase ones
  const mappedInitialColumns = initialColumns.map(col => {
    if (col === "phone") return "phone_number";
    if (col === "email" || col === "notes") return "preferred_time";
    return col;
  });

  const [columns, setColumns] = useState<string[]>(
    mappedInitialColumns.length > 0 ? mappedInitialColumns : ["phone_number", "preferred_time"]
  );
  const [localCallbacks, setLocalCallbacks] = useState<CallbackRequest[]>(callbacks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeTab, setActiveTab] = useState<"table" | "calendar">("table");
  
  // Reschedule & Edit Modal State
  const [editingCallback, setEditingCallback] = useState<CallbackRequest | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editTime, setEditTime] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [state, formAction] = useActionState(
    updatePreferencesAction,
    EMPTY_FORM_STATE
  );

  const openEditModal = (cb: CallbackRequest) => {
    setEditingCallback(cb);
    setEditName(cb.full_name);
    setEditPhone(cb.phone_number || "");
    setEditStatus(cb.status || "pending");
    setEditTime(cb.preferred_time || "morning");
    setSaveError("");
  };

  const closeEditModal = () => {
    setEditingCallback(null);
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCallback) return;

    setIsSaving(true);
    setSaveError("");

    try {
      const res = await updateCallbackAction(
        editingCallback.id,
        editName,
        editPhone,
        editStatus,
        editTime
      );

      if (res.success) {
        // Update local callbacks state
        setLocalCallbacks(prev =>
          prev.map(c =>
            c.id === editingCallback.id
              ? {
                  ...c,
                  full_name: editName,
                  phone_number: editPhone,
                  status: editStatus,
                  preferred_time: editTime,
                }
              : c
          )
        );
        closeEditModal();
      } else {
        setSaveError(res.message || "Failed to update record details.");
      }
    } catch (err: any) {
      setSaveError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  // Filter callback requests client-side
  const filteredCallbacks = localCallbacks.filter((c) => {
    const matchesSearch =
      (c.full_name && c.full_name.toLowerCase().includes(search.toLowerCase())) ||
      (c.phone_number && c.phone_number.includes(search));

    const matchesStatus = statusFilter === "All" || c.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "new":
      case "pending":
        return "#D97706"; // Amber
      case "contacted":
        return "#2563EB"; // Blue
      case "resolved":
        return "#16A34A"; // Green
      default:
        return "var(--ahana-muted)";
    }
  };

  return (
    <div className="report-container">
      {/* Tab Switcher */}
      <div className="tab-switcher no-print">
        <button
          type="button"
          onClick={() => setActiveTab("table")}
          className={`tab-btn ${activeTab === "table" ? "active" : ""}`}
        >
          📋 Inquiry Reports
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("calendar")}
          className={`tab-btn ${activeTab === "calendar" ? "active" : ""}`}
        >
          📅 Clinical Calendar
        </button>
      </div>

      {activeTab === "calendar" ? (
        <CalendarView />
      ) : (
        <>
          {/* 1. Configuration Panel */}
          <section className="config-section no-print">
            <h3 className="section-title">Customize Dashboard Report Columns</h3>
            <p className="section-desc">
              Mandatory fields (**Name**, **Inquiry Date**, and **Actions**) are always included. Choose which optional columns to display in your active session.
            </p>

            <form action={formAction} className="config-form">
              <div className="checkbox-group">
                {/* Mandatory placeholders */}
                <label className="checkbox-label disabled">
                  <input type="checkbox" checked disabled />
                  <span>Full Name (Mandatory)</span>
                </label>
                <label className="checkbox-label disabled">
                  <input type="checkbox" checked disabled />
                  <span>Inquiry Date (Mandatory)</span>
                </label>

                {/* Optional checkboxes */}
                {ALL_OPTIONAL_COLUMNS.map((col) => (
                  <label key={col.value} className="checkbox-label">
                    <input
                      type="checkbox"
                      name="reportColumns"
                      value={col.value}
                      checked={columns.includes(col.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setColumns([...columns, col.value]);
                        } else {
                          setColumns(columns.filter((c) => c !== col.value));
                        }
                      }}
                    />
                    <span>{col.label}</span>
                  </label>
                ))}
              </div>

              <div className="form-actions">
                <PrimaryButton type="submit" fullWidth={false}>
                  Save Column Preferences
                </PrimaryButton>
                <button type="button" onClick={handlePrint} className="print-btn">
                  🖨️ Print Custom Report
                </button>
              </div>

              {state.message && (
                <p className="success-msg">{state.message}</p>
              )}
            </form>
          </section>

          {/* 2. Search & Filter Bar */}
          <div className="filter-bar no-print">
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="Contacted">Contacted</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* 3. Output Table */}
          <div className="table-responsive">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Inquiry Date</th>
                  {columns.includes("phone_number") && <th>Contact Phone</th>}
                  {columns.includes("preferred_time") && <th>Preferred Time</th>}
                  {columns.includes("contact_channel") && <th>Method</th>}
                  <th>Status</th>
                  <th className="no-print">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCallbacks.length > 0 ? (
                  filteredCallbacks.map((cb) => (
                    <tr key={cb.id}>
                      <td className="bold">{cb.full_name}</td>
                      <td>{new Date(cb.created_at).toLocaleDateString()}</td>
                      {columns.includes("phone_number") && (
                        <td>{cb.phone_number || <span className="muted">N/A</span>}</td>
                      )}
                      {columns.includes("preferred_time") && (
                        <td style={{ textTransform: "capitalize" }}>{cb.preferred_time}</td>
                      )}
                      {columns.includes("contact_channel") && (
                        <td style={{ textTransform: "capitalize" }}>{cb.contact_channel}</td>
                      )}
                      <td>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: getStatusColor(cb.status),
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            display: "inline-block",
                            textTransform: "capitalize",
                          }}
                        >
                          {cb.status}
                        </span>
                      </td>
                      <td className="no-print">
                        <button
                          type="button"
                          onClick={() => openEditModal(cb)}
                          className="edit-action-btn"
                        >
                          ✏️ Edit / Reschedule
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center muted">
                      No records match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Edit / Reschedule Dialog Backdrop Modal */}
      {editingCallback && (
        <div className="modal-backdrop" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4 style={{ margin: 0, color: "var(--ahana-purple-dark)" }}>Edit Appointment / Meetup Details</h4>
              <button type="button" onClick={closeEditModal} className="close-btn">×</button>
            </div>
            <form onSubmit={handleSaveChanges} className="modal-body">
              {saveError && (
                <div style={{ backgroundColor: "#FEE2E2", color: "#DC2626", padding: "10px", borderRadius: "6px", marginBottom: "16px", fontSize: "13px" }}>
                  ⚠️ {saveError}
                </div>
              )}

              <div style={{ display: "grid", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Patient / Inquirer Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Contact Phone</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    required
                    style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Reschedule Meetup Window</label>
                  <select
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px", background: "white" }}
                  >
                    <option value="morning">Morning (09:00 AM - 12:00 PM)</option>
                    <option value="afternoon">Afternoon (12:00 PM - 04:00 PM)</option>
                    <option value="evening">Evening (04:00 PM - 07:00 PM)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Triage Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px", background: "white" }}
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                <button
                  type="button"
                  onClick={closeEditModal}
                  style={{ padding: "8px 16px", border: "1px solid var(--ahana-border)", background: "transparent", borderRadius: "6px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <PrimaryButton type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        /* Styles for config section */
        .report-container {
          display: flex;
          flex-direction: column;
          gap: var(--ahana-space-6);
          margin-top: var(--ahana-space-4);
        }

        .config-section {
          background-color: var(--ahana-white);
          border: 1px solid var(--ahana-border);
          border-radius: var(--ahana-radius-lg);
          padding: var(--ahana-space-6);
        }

        .section-title {
          font-family: var(--ahana-font-serif);
          color: var(--ahana-purple-dark);
          font-size: var(--ahana-font-size-lg);
          margin-bottom: var(--ahana-space-1);
        }

        .section-desc {
          color: var(--ahana-muted);
          font-size: var(--ahana-font-size-sm);
          margin-bottom: var(--ahana-space-4);
        }

        .checkbox-group {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ahana-space-4);
          margin-bottom: var(--ahana-space-4);
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: var(--ahana-space-2);
          cursor: pointer;
          font-size: var(--ahana-font-size-sm);
        }

        .checkbox-label.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-actions {
          display: flex;
          gap: var(--ahana-space-4);
        }

        .print-btn {
          border: 1px solid var(--ahana-purple);
          color: var(--ahana-purple);
          background: transparent;
          border-radius: var(--ahana-radius-md);
          padding: var(--ahana-space-2) var(--ahana-space-4);
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .print-btn:hover {
          background-color: var(--ahana-lavender);
        }

        .success-msg {
          color: var(--ahana-success);
          font-size: var(--ahana-font-size-sm);
          margin-top: var(--ahana-space-3);
        }

        /* Filter bar */
        .filter-bar {
          display: flex;
          gap: var(--ahana-space-4);
        }

        .search-input {
          flex-grow: 1;
          padding: var(--ahana-space-2) var(--ahana-space-3);
          border: 1px solid var(--ahana-border);
          border-radius: var(--ahana-radius-md);
        }

        .filter-select {
          padding: var(--ahana-space-2) var(--ahana-space-3);
          border: 1px solid var(--ahana-border);
          border-radius: var(--ahana-radius-md);
        }

        /* Table styles */
        .table-responsive {
          overflow-x: auto;
          background-color: var(--ahana-white);
          border: 1px solid var(--ahana-border);
          border-radius: var(--ahana-radius-lg);
        }

        .report-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .report-table th,
        .report-table td {
          padding: var(--ahana-space-3) var(--ahana-space-4);
          border-bottom: 1px solid var(--ahana-border);
          font-size: 14px;
        }

        .report-table th {
          background-color: var(--ahana-surface-soft);
          color: var(--ahana-purple-dark);
          font-weight: 600;
        }

        .bold {
          font-weight: bold;
        }

        .muted {
          color: var(--ahana-muted);
        }

        .text-center {
          text-align: center;
        }

        .edit-action-btn {
          background-color: var(--ahana-lavender);
          color: var(--ahana-purple-dark);
          border: 1px solid var(--ahana-border);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.15s;
        }

        .edit-action-btn:hover {
          background-color: var(--ahana-purple);
          color: white;
        }

        .tab-switcher {
          display: flex;
          gap: var(--ahana-space-2);
          border-bottom: 2px solid var(--ahana-border);
          padding-bottom: 8px;
        }

        .tab-btn {
          border: 0;
          background: transparent;
          color: var(--ahana-muted);
          font-weight: 700;
          font-size: var(--ahana-font-size-base);
          padding: 8px 16px;
          cursor: pointer;
          border-radius: var(--ahana-radius-md);
          transition: all 0.2s;
        }

        .tab-btn:hover {
          background-color: var(--ahana-surface-soft);
          color: var(--ahana-purple-dark);
        }

        .tab-btn.active {
          color: var(--ahana-purple-dark);
          background-color: var(--ahana-lavender);
          box-shadow: inset 0 -2px 0 var(--ahana-purple);
        }

        /* Modal backdrop & content */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: var(--ahana-radius-xl);
          width: 100%;
          max-width: 460px;
          box-shadow: var(--ahana-shadow-lift);
          border: 1px solid var(--ahana-border);
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: var(--ahana-surface-soft);
          padding: var(--ahana-space-4) var(--ahana-space-5);
          border-bottom: 1px solid var(--ahana-border);
        }

        .close-btn {
          background: transparent;
          border: 0;
          font-size: 24px;
          cursor: pointer;
          color: var(--ahana-muted);
        }

        .modal-body {
          padding: var(--ahana-space-5);
          font-size: 14px;
          line-height: 1.6;
        }

        /* Physical Page-Break Printing Styles */
        @media print {
          .no-print,
          header,
          footer,
          .ahana-skip-link,
          .form-actions {
            display: none !important;
          }

          body,
          .report-container,
          .table-responsive {
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .report-table {
            border: 1px solid #ccc !important;
          }

          .report-table th {
            background-color: #f0f0f0 !important;
            color: black !important;
            border-bottom: 2px solid #ccc !important;
          }

          /* Ensure table row breaks cleanly across physical pages */
          .report-table tr {
            page-break-inside: avoid !important;
            page-break-after: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
