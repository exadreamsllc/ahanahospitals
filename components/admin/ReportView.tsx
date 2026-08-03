"use client";

import { useActionState, useState } from "react";
import { updatePreferencesAction } from "@/lib/actions/profile";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { EMPTY_FORM_STATE } from "@/lib/validation/auth";

type CallbackRequest = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string;
  status: string;
  notes: string | null;
  created_at: string;
};

type ReportViewProps = {
  callbacks: CallbackRequest[];
  initialColumns: string[];
};

const ALL_OPTIONAL_COLUMNS = [
  { value: "email", label: "Email Address" },
  { value: "phone", label: "Contact Phone" },
  { value: "status", label: "Status" },
  { value: "notes", label: "Operational Notes" },
] as const;

export function ReportView({ callbacks, initialColumns }: ReportViewProps) {
  const [columns, setColumns] = useState<string[]>(initialColumns);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [state, formAction] = useActionState(
    updatePreferencesAction,
    EMPTY_FORM_STATE
  );

  // Filter callback requests client-side
  const filteredCallbacks = callbacks.filter((c) => {
    const matchesSearch =
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
      c.phone.includes(search);

    const matchesStatus = statusFilter === "All" || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
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
      {/* 1. Configuration Panel */}
      <section className="config-section no-print">
        <h3 className="section-title">Customize Dashboard Report Columns</h3>
        <p className="section-desc">
          Mandatory fields (**Name** & **Inquiry Date**) are always included. Choose which optional columns to display in your active session.
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
          placeholder="Search by name, email or phone..."
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
          <option value="New">New</option>
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
              {columns.includes("email") && <th>Email Address</th>}
              {columns.includes("phone") && <th>Contact Phone</th>}
              {columns.includes("status") && <th>Status</th>}
              {columns.includes("notes") && <th>Operational Notes</th>}
            </tr>
          </thead>
          <tbody>
            {filteredCallbacks.length > 0 ? (
              filteredCallbacks.map((cb) => (
                <tr key={cb.id}>
                  <td className="bold">{cb.full_name}</td>
                  <td>{new Date(cb.created_at).toLocaleDateString()}</td>
                  {columns.includes("email") && (
                    <td>{cb.email || <span className="muted">N/A</span>}</td>
                  )}
                  {columns.includes("phone") && <td>{cb.phone}</td>}
                  {columns.includes("status") && (
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
                        }}
                      >
                        {cb.status}
                      </span>
                    </td>
                  )}
                  {columns.includes("notes") && (
                    <td>{cb.notes || <span className="muted">No notes</span>}</td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center muted">
                  No records match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
