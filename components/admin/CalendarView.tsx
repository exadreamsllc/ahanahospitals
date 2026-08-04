"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import {
  updateCallbackAction,
  createCallbackAction,
  deleteCallbackAction,
} from "@/lib/actions/contact";

type CallbackRequest = {
  id: string;
  full_name: string;
  phone_number: string;
  preferred_time: string;
  contact_channel: string;
  status: string;
  created_at: string;
};

type CalendarViewProps = {
  callbacks: CallbackRequest[];
  onUpdateCallback: (cb: CallbackRequest) => void;
  onDeleteCallback: (id: string) => void;
  onCreateCallback: (cb: CallbackRequest) => void;
};

export function CalendarView({
  callbacks,
  onUpdateCallback,
  onDeleteCallback,
  onCreateCallback,
}: CalendarViewProps) {
  const [roleFilter, setRoleFilter] = useState("All");

  // Modal / Editing states
  const [selectedEvent, setSelectedEvent] = useState<CallbackRequest | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState(1);
  const [formPhone, setFormPhone] = useState("");
  const [formTime, setFormTime] = useState("morning");
  const [formChannel, setFormChannel] = useState("whatsapp");
  const [formStatus, setFormStatus] = useState("pending");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Color mapping based on status
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "new":
        return "#D97706"; // Amber
      case "contacted":
        return "#2563EB"; // Blue
      case "resolved":
        return "#16A34A"; // Green
      default:
        return "#6B7280"; // Gray
    }
  };

  // Filter callback events based on filter dropdown selection
  const filteredCallbacks = callbacks.filter((c) => {
    if (roleFilter === "All") return true;
    return c.status?.toLowerCase() === roleFilter.toLowerCase();
  });

  // Calendar parameters for August 2026
  // August 1, 2026 starts on a Saturday (index 6)
  const startingDayOfWeek = 6; 
  const totalDays = 31;
  
  // Build calendar day cells
  const dayCells: (number | null)[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    dayCells.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    dayCells.push(d);
  }

  const handleOpenEvent = (cb: CallbackRequest) => {
    setSelectedEvent(cb);
    setIsEditing(false);
    setIsCreating(false);
    setSaveError("");
    
    // Populate form
    setFormTitle(cb.full_name);
    // Extract date number from created_at ISO string
    const dateNum = new Date(cb.created_at).getDate() || 1;
    setFormDate(dateNum);
    setFormPhone(cb.phone_number || "");
    setFormTime(cb.preferred_time || "morning");
    setFormChannel(cb.contact_channel || "whatsapp");
    setFormStatus(cb.status || "pending");
  };

  const handleOpenCreate = (day: number) => {
    setSelectedEvent(null);
    setIsEditing(false);
    setIsCreating(true);
    setSaveError("");
    
    // Clear / Prepopulate form
    setFormTitle("");
    setFormDate(day);
    setFormPhone("");
    setFormTime("morning");
    setFormChannel("whatsapp");
    setFormStatus("pending");
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError("");

    // Generate ISO timestamp string for the selected day in August 2026
    const paddedDay = String(formDate).padStart(2, "0");
    const dateStr = `2026-08-${paddedDay}T12:00:00.000Z`;

    try {
      if (isCreating) {
        // Call create action
        const res = await createCallbackAction(
          formTitle,
          formPhone,
          formTime,
          formChannel,
          dateStr
        );

        if (res.success && res.data) {
          onCreateCallback(res.data);
          handleCloseModal();
        } else {
          setSaveError(res.message || "Failed to create callback meetup.");
        }
      } else if (selectedEvent) {
        // Call update action
        const res = await updateCallbackAction(
          selectedEvent.id,
          formTitle,
          formPhone,
          formStatus,
          formTime,
          dateStr
        );

        if (res.success) {
          onUpdateCallback({
            ...selectedEvent,
            full_name: formTitle,
            phone_number: formPhone,
            status: formStatus,
            preferred_time: formTime,
            created_at: dateStr,
          });
          handleCloseModal();
        } else {
          setSaveError(res.message || "Failed to save updates.");
        }
      }
    } catch (err: any) {
      setSaveError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    setIsSaving(true);
    setSaveError("");

    try {
      const res = await deleteCallbackAction(selectedEvent.id);
      if (res.success) {
        onDeleteCallback(selectedEvent.id);
        handleCloseModal();
      } else {
        setSaveError(res.message || "Failed to delete callback meetup.");
      }
    } catch (err: any) {
      setSaveError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="calendar-root">
      {/* Filters & Actions */}
      <div className="calendar-header-row no-print">
        <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <label style={{ marginRight: "12px", fontWeight: "bold", fontSize: "14px" }}>Filter by Status:</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending Only</option>
              <option value="contacted">Contacted Only</option>
              <option value="resolved">Resolved Only</option>
            </select>
          </div>
          <span style={{ fontSize: "12px", color: "var(--ahana-muted)" }}>
            💡 Click any grid box cell to schedule a new triage meetup date directly.
          </span>
        </div>

        <div className="legend">
          <span className="legend-item"><span className="dot" style={{ backgroundColor: "#D97706" }} /> Pending</span>
          <span className="legend-item"><span className="dot" style={{ backgroundColor: "#2563EB" }} /> Contacted</span>
          <span className="legend-item"><span className="dot" style={{ backgroundColor: "#16A34A" }} /> Resolved</span>
        </div>
      </div>

      {/* Month Header */}
      <div className="calendar-month-title">
        <h3>August 2026</h3>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {/* Week Days */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="grid-header">
            {day}
          </div>
        ))}

        {/* Days cells */}
        {dayCells.map((day, idx) => {
          // Filter events falling on this specific day of month in August 2026
          const dayEvents = day
            ? filteredCallbacks.filter((c) => {
                const d = new Date(c.created_at);
                return d.getFullYear() === 2026 && d.getMonth() === 7 && d.getDate() === day;
              })
            : [];

          return (
            <div
              key={idx}
              onClick={() => day && handleOpenCreate(day)}
              className={`day-cell ${day ? "clickable-cell" : "empty"}`}
            >
              {day && (
                <>
                  <span className="day-number">{day}</span>
                  <div className="events-container" onClick={(e) => e.stopPropagation()}>
                    {dayEvents.map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => handleOpenEvent(event)}
                        className="event-badge"
                        style={{ borderLeftColor: getStatusColor(event.status) }}
                      >
                        <span className="event-time" style={{ textTransform: "capitalize" }}>
                          {event.preferred_time}
                        </span>
                        <span className="event-title">{event.full_name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Edit / Create Dialog Modal */}
      {(selectedEvent || isCreating) && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4 style={{ margin: 0, color: "var(--ahana-purple-dark)" }}>
                {isCreating ? "Schedule Triage Meetup" : isEditing ? "Reschedule / Edit Meetup" : "Meetup Details"}
              </h4>
              <button type="button" onClick={handleCloseModal} className="close-btn">×</button>
            </div>
            
            {isEditing || isCreating ? (
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
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      required
                      placeholder="e.g. Priyadharshini R"
                      style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Day of Month (August 2026)</label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={formDate}
                        onChange={(e) => setFormDate(Number(e.target.value))}
                        required
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Contact Phone</label>
                      <input
                        type="text"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        required
                        placeholder="e.g. 9876543210"
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Preferred Time</label>
                      <select
                        value={formTime}
                        onChange={(e) => setFormTime(e.target.value)}
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px", background: "white" }}
                      >
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                        <option value="evening">Evening</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Contact Channel</label>
                      <select
                        value={formChannel}
                        onChange={(e) => setFormChannel(e.target.value)}
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px", background: "white" }}
                      >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="phone">Regular Call</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Triage Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px", background: "white" }}
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "24px" }}>
                  <div>
                    {!isCreating && (
                      <button
                        type="button"
                        onClick={handleDeleteEvent}
                        disabled={isSaving}
                        style={{ padding: "8px 16px", background: "#FEE2E2", color: "#DC2626", border: "1px solid #FCA5A5", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                      >
                        {isSaving ? "Deleting..." : "🗑️ Delete Meetup"}
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => isCreating ? handleCloseModal() : setIsEditing(false)}
                      style={{ padding: "8px 16px", border: "1px solid var(--ahana-border)", background: "transparent", borderRadius: "6px", cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                    <PrimaryButton type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : isCreating ? "Schedule" : "Save Changes"}
                    </PrimaryButton>
                  </div>
                </div>
              </form>
            ) : (
              selectedEvent && (
                <div className="modal-body">
                  <p><strong>Patient Name:</strong> {selectedEvent.full_name}</p>
                  <p><strong>Contact Phone:</strong> {selectedEvent.phone_number || "N/A"}</p>
                  <p><strong>Preferred Meetup Window:</strong> <span style={{ textTransform: "capitalize" }}>{selectedEvent.preferred_time}</span> via <span style={{ textTransform: "capitalize" }}>{selectedEvent.contact_channel}</span></p>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "16px 0" }}>
                    <strong>Triage Status:</strong>
                    <span
                      style={{
                        backgroundColor: getStatusColor(selectedEvent.status),
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {selectedEvent.status}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      style={{ padding: "8px 16px", border: "1px solid var(--ahana-border)", background: "transparent", borderRadius: "6px", cursor: "pointer" }}
                    >
                      Close
                    </button>
                    <PrimaryButton onClick={() => setIsEditing(true)}>
                      ✏️ Reschedule / Edit Meetup
                    </PrimaryButton>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .calendar-root {
          background: var(--ahana-white);
          border: 1px solid var(--ahana-border);
          border-radius: var(--ahana-radius-lg);
          padding: var(--ahana-space-5);
          box-shadow: var(--ahana-shadow-sm);
        }

        .calendar-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: var(--ahana-space-5);
        }

        .filter-select {
          padding: 6px 12px;
          border: 1px solid var(--ahana-border);
          border-radius: var(--ahana-radius-md);
          font-size: 14px;
        }

        .legend {
          display: flex;
          gap: 16px;
          font-size: 13px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
        }

        .calendar-month-title {
          text-align: center;
          color: var(--ahana-purple-dark);
          margin-bottom: var(--ahana-space-4);
        }

        .calendar-month-title h3 {
          font-family: var(--ahana-font-serif);
          font-size: 20px;
          margin: 0;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          border-left: 1px solid var(--ahana-border);
          border-top: 1px solid var(--ahana-border);
        }

        .grid-header {
          background-color: var(--ahana-surface-soft);
          text-align: center;
          font-weight: 700;
          padding: 8px;
          border-right: 1px solid var(--ahana-border);
          border-bottom: 1px solid var(--ahana-border);
          color: var(--ahana-purple-dark);
          font-size: 14px;
        }

        .day-cell {
          min-height: 110px;
          padding: 6px;
          border-right: 1px solid var(--ahana-border);
          border-bottom: 1px solid var(--ahana-border);
          position: relative;
          background: var(--ahana-white);
        }

        .clickable-cell {
          cursor: pointer;
          transition: background-color 0.15s;
        }

        .clickable-cell:hover {
          background-color: var(--ahana-surface-soft);
        }

        .day-cell.empty {
          background-color: var(--ahana-surface-soft);
          opacity: 0.5;
        }

        .day-number {
          font-size: 12px;
          font-weight: bold;
          color: var(--ahana-muted);
          position: absolute;
          top: 6px;
          right: 8px;
        }

        .events-container {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 20px;
        }

        .event-badge {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          background-color: var(--ahana-surface-soft);
          border: 0;
          border-left: 4px solid #ccc;
          padding: 4px 6px;
          border-radius: var(--ahana-radius-sm);
          font-size: 11px;
          cursor: pointer;
          transition: transform 0.1s;
        }

        .event-badge:hover {
          transform: scale(1.02);
          background-color: var(--ahana-lavender);
        }

        .event-time {
          font-weight: bold;
          color: var(--ahana-purple-dark);
        }

        .event-title {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
          color: var(--ahana-text);
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
      `}</style>
    </div>
  );
}
