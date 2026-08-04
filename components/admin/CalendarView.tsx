"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

type CalendarEvent = {
  id: string;
  title: string;
  date: number; // Day of the month (August 2026)
  creator: string;
  assignee: string;
  color: string;
  time: string;
  description: string;
};

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "Morning Shift Triage Handover",
    date: 10,
    creator: "Staff (Nurse Lakshmi)",
    assignee: "Staff (Nurse Lakshmi)",
    color: "#8B5CF6", // Purple
    time: "08:00 AM",
    description: "Shift changeover reporting and incoming callback queue review.",
  },
  {
    id: "2",
    title: "Patient 4 EMR Triage Review",
    date: 12,
    creator: "Staff (Nurse Lakshmi)",
    assignee: "Dr. Karthik (Psychiatrist)",
    color: "#2563EB", // Blue
    time: "10:30 AM",
    description: "Triage call review of Patient 4 (Priya) with thyroid symptoms.",
  },
  {
    id: "3",
    title: "Weekly Ward Sanitization Audit",
    date: 14,
    creator: "Management (Meena)",
    assignee: "Staff (Nurse Lakshmi)",
    color: "#16A34A", // Green
    time: "11:00 AM",
    description: "Compliance safety audit of rehabilitation block C sanitation logs.",
  },
  {
    id: "4",
    title: "Cognitive Rehabilitation Planning",
    date: 15,
    creator: "Dr. Karthik (Psychiatrist)",
    assignee: "Counselor Anand",
    color: "#D97706", // Amber
    time: "02:00 PM",
    description: "Planning CBT schedules and milestone reports for adolescent patients.",
  },
  {
    id: "5",
    title: "Hospital Operations Alignment",
    date: 18,
    creator: "Management (Meena)",
    assignee: "All Staff & Clinicians",
    color: "#DC2626", // Red
    time: "04:00 PM",
    description: "Discussion on callback latencies, database triggers, and client onboarding.",
  },
];

export function CalendarView() {
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [roleFilter, setRoleFilter] = useState("All");

  // Modal / Editing states
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState(1);
  const [formTime, setFormTime] = useState("");
  const [formCreator, setFormCreator] = useState("Staff");
  const [formAssignee, setFormAssignee] = useState("");
  const [formDescription, setFormDescription] = useState("");

  // Color mapping based on selected creator group
  const getColorForCreator = (creatorPrefix: string) => {
    switch (creatorPrefix) {
      case "Staff":
        return "#8B5CF6"; // Purple
      case "Doctor":
      case "Provider":
        return "#2563EB"; // Blue
      case "Management":
        return "#16A34A"; // Green
      default:
        return "#D97706"; // Amber
    }
  };

  // Filter events based on selected Creator Role
  const filteredEvents = events.filter((e) => {
    if (roleFilter === "All") return true;
    if (roleFilter === "Staff") return e.creator.startsWith("Staff");
    if (roleFilter === "Provider") return e.creator.startsWith("Doctor") || e.creator.startsWith("Dr.");
    if (roleFilter === "Management") return e.creator.startsWith("Management");
    return true;
  });

  // Calendar parameters for August 2026
  // August 1, 2026 starts on a Saturday (index 6)
  const startingDayOfWeek = 6; 
  const totalDays = 31;
  
  // Build calendar day cells
  const dayCells = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    dayCells.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    dayCells.push(d);
  }

  const handleOpenEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEditing(false);
    setIsCreating(false);
    
    // Populate form
    setFormTitle(event.title);
    setFormDate(event.date);
    setFormTime(event.time);
    setFormCreator(event.creator.startsWith("Staff") ? "Staff" : event.creator.startsWith("Management") ? "Management" : "Doctor");
    setFormAssignee(event.assignee);
    setFormDescription(event.description);
  };

  const handleOpenCreate = (day: number) => {
    setSelectedEvent(null);
    setIsEditing(false);
    setIsCreating(true);
    
    // Clear / Prepopulate form
    setFormTitle("");
    setFormDate(day);
    setFormTime("09:00 AM");
    setFormCreator("Doctor");
    setFormAssignee("Staff (Nurse Lakshmi)");
    setFormDescription("");
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) {
      // Append a new event
      const newEvent: CalendarEvent = {
        id: Math.random().toString(),
        title: formTitle,
        date: Number(formDate),
        creator: formCreator === "Staff" ? "Staff (Nurse Lakshmi)" : formCreator === "Management" ? "Management (Meena)" : "Dr. Karthik (Psychiatrist)",
        assignee: formAssignee,
        color: getColorForCreator(formCreator),
        time: formTime,
        description: formDescription,
      };
      setEvents(prev => [...prev, newEvent]);
    } else if (selectedEvent) {
      // Update existing event
      setEvents(prev =>
        prev.map(item =>
          item.id === selectedEvent.id
            ? {
                ...item,
                title: formTitle,
                date: Number(formDate),
                creator: formCreator === "Staff" ? "Staff (Nurse Lakshmi)" : formCreator === "Management" ? "Management (Meena)" : "Dr. Karthik (Psychiatrist)",
                assignee: formAssignee,
                color: getColorForCreator(formCreator),
                time: formTime,
                description: formDescription,
              }
            : item
        )
      );
    }
    handleCloseModal();
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    setEvents(prev => prev.filter(item => item.id !== selectedEvent.id));
    handleCloseModal();
  };

  return (
    <div className="calendar-root">
      {/* Filters & Actions */}
      <div className="calendar-header-row no-print">
        <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <label style={{ marginRight: "12px", fontWeight: "bold", fontSize: "14px" }}>Filter by Creator:</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Roles</option>
              <option value="Staff">Staff / Nurses Only</option>
              <option value="Provider">Doctors / Clinicians Only</option>
              <option value="Management">Management Only</option>
            </select>
          </div>
          <span style={{ fontSize: "12px", color: "var(--ahana-muted)" }}>
            💡 Tip: Click any blank cell grid box to schedule a new meetup event directly.
          </span>
        </div>

        <div className="legend">
          <span className="legend-item"><span className="dot" style={{ backgroundColor: "#8B5CF6" }} /> Staff</span>
          <span className="legend-item"><span className="dot" style={{ backgroundColor: "#2563EB" }} /> Doctors</span>
          <span className="legend-item"><span className="dot" style={{ backgroundColor: "#16A34A" }} /> Management</span>
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
          const dayEvents = day ? filteredEvents.filter((e) => e.date === day) : [];

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
                        style={{ borderLeftColor: event.color }}
                      >
                        <span className="event-time">{event.time}</span>
                        <span className="event-title">{event.title}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Modal for viewing, editing or creating */}
      {(selectedEvent || isCreating) && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4 style={{ margin: 0, color: "var(--ahana-purple-dark)" }}>
                {isCreating ? "Schedule New Meetup" : isEditing ? "Reschedule / Edit Event" : "Meetup Details"}
              </h4>
              <button type="button" onClick={handleCloseModal} className="close-btn">×</button>
            </div>
            
            {isEditing || isCreating ? (
              <form onSubmit={handleSaveChanges} className="modal-body">
                <div style={{ display: "grid", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Event / Meetup Title</label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      required
                      placeholder="e.g. Triage call or audit"
                      style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Day of Month (August)</label>
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
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Scheduled Time</label>
                      <input
                        type="text"
                        value={formTime}
                        onChange={(e) => setFormTime(e.target.value)}
                        required
                        placeholder="e.g. 10:30 AM"
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Creator Category</label>
                      <select
                        value={formCreator}
                        onChange={(e) => setFormCreator(e.target.value)}
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px", background: "white" }}
                      >
                        <option value="Staff">Staff (Purple)</option>
                        <option value="Doctor">Doctors (Blue)</option>
                        <option value="Management">Management (Green)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Assigned Colleague</label>
                      <input
                        type="text"
                        value={formAssignee}
                        onChange={(e) => setFormAssignee(e.target.value)}
                        required
                        placeholder="e.g. Lakshmi or Anand"
                        style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "13px" }}>Description</label>
                    <textarea
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      rows={3}
                      style={{ width: "100%", padding: "8px", border: "1px solid var(--ahana-border)", borderRadius: "6px" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "24px" }}>
                  <div>
                    {!isCreating && (
                      <button
                        type="button"
                        onClick={handleDeleteEvent}
                        style={{ padding: "8px 16px", background: "#FEE2E2", color: "#DC2626", border: "1px solid #FCA5A5", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                      >
                        🗑️ Delete Event
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      type="button"
                      onClick={() => isCreating ? handleCloseModal() : setIsEditing(false)}
                      style={{ padding: "8px 16px", border: "1px solid var(--ahana-border)", background: "transparent", borderRadius: "6px", cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                    <PrimaryButton type="submit">
                      {isCreating ? "Schedule Event" : "Save Changes"}
                    </PrimaryButton>
                  </div>
                </div>
              </form>
            ) : (
              selectedEvent && (
                <div className="modal-body">
                  <p><strong>Scheduled Time:</strong> August {selectedEvent.date}, 2026 at {selectedEvent.time}</p>
                  <p><strong>Created By:</strong> {selectedEvent.creator}</p>
                  <p><strong>Assigned To:</strong> {selectedEvent.assignee}</p>
                  <div style={{ borderLeft: `4px solid ${selectedEvent.color}`, paddingLeft: "12px", margin: "16px 0", color: "var(--ahana-muted)", fontSize: "14px" }}>
                    {selectedEvent.description}
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
                      ✏️ Reschedule / Edit Event
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
