"use client";

import { useState } from "react";

type CalendarEvent = {
  id: string;
  title: string;
  date: number; // Day of the month
  creator: string;
  assignee: string;
  color: string;
  time: string;
  description: string;
};

const MOCK_EVENTS: CalendarEvent[] = [
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
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [roleFilter, setRoleFilter] = useState("All");

  // Filter events based on selected Creator Role
  const filteredEvents = MOCK_EVENTS.filter((e) => {
    if (roleFilter === "All") return true;
    return e.creator.startsWith(roleFilter);
  });

  // Calendar parameters for August 2026
  // August 1, 2026 starts on a Saturday (index 6)
  const startingDayOfWeek = 6; 
  const totalDays = 31;
  
  // Build calendar day cells
  const dayCells = [];
  // Empty slots for preceding month days
  for (let i = 0; i < startingDayOfWeek; i++) {
    dayCells.push(null);
  }
  // Days of current month
  for (let d = 1; d <= totalDays; d++) {
    dayCells.push(d);
  }

  const handleCloseModal = () => setSelectedEvent(null);

  return (
    <div className="calendar-root">
      {/* Filters & Legend */}
      <div className="calendar-controls no-print">
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
            <div key={idx} className={`day-cell ${day ? "" : "empty"}`}>
              {day && (
                <>
                  <span className="day-number">{day}</span>
                  <div className="events-container">
                    {dayEvents.map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => setSelectedEvent(event)}
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

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4 style={{ margin: 0, color: "var(--ahana-purple-dark)" }}>{selectedEvent.title}</h4>
              <button type="button" onClick={handleCloseModal} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <p><strong>Scheduled Time:</strong> August {selectedEvent.date}, 2026 at {selectedEvent.time}</p>
              <p><strong>Created By:</strong> {selectedEvent.creator}</p>
              <p><strong>Assigned To:</strong> {selectedEvent.assignee}</p>
              <div style={{ borderLeft: `4px solid ${selectedEvent.color}`, paddingLeft: "12px", margin: "16px 0", color: "var(--ahana-muted)" }}>
                {selectedEvent.description}
              </div>
            </div>
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

        .calendar-controls {
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
