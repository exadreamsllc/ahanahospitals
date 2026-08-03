"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { FormField } from "@/components/ui/FormField";

export function PortalFinder() {
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanedSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");

    if (!cleanedSlug) {
      setError("Please enter a valid portal name.");
      return;
    }

    // Determine current environment to route correctly
    const currentHost = window.location.host; // e.g. "localhost:3000" or "youmecareall.com"

    if (currentHost.includes("localhost") || currentHost.includes("127.0.0.1")) {
      // Local development routing
      window.location.href = `http://${cleanedSlug}.localhost:3000`;
    } else if (currentHost.includes("youmecareall.com")) {
      // Production SaaS routing
      window.location.href = `https://${cleanedSlug}.youmecareall.com`;
    } else {
      // Fallback staging environments (Vercel previews like ahanahospitals.vercel.app)
      if (cleanedSlug === "ahana") {
        window.location.href = `https://ahanahospitals.vercel.app/`;
      } else {
        setError(`Portal "${cleanedSlug}" is not connected to this staging domain.`);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "480px",
        margin: "0 auto var(--ahana-space-6)",
        textAlign: "left",
        backgroundColor: "var(--ahana-white)",
        padding: "var(--ahana-space-6)",
        borderRadius: "var(--ahana-radius-lg)",
        border: "1px solid var(--ahana-border)",
        boxShadow: "var(--ahana-shadow-sm)",
      }}
    >
      <h3
        style={{
          fontFamily: "var(--ahana-font-serif)",
          color: "var(--ahana-purple-dark)",
          fontSize: "var(--ahana-font-size-lg)",
          marginBottom: "var(--ahana-space-4)",
          textAlign: "center",
        }}
      >
        Find Your Hospital Portal
      </h3>
      <div style={{ display: "flex", gap: "var(--ahana-space-3)", alignItems: "flex-end" }}>
        <div style={{ flexGrow: 1 }}>
          <FormField
            label="Hospital Portal Name"
            id="portal-slug"
            name="portal-slug"
            type="text"
            placeholder="e.g., ahana"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: "2px" }}>
          <PrimaryButton type="submit" fullWidth={false}>
            Go to Portal
          </PrimaryButton>
        </div>
      </div>
      {error && (
        <p
          style={{
            color: "var(--ahana-error)",
            fontSize: "var(--ahana-font-size-sm)",
            marginTop: "var(--ahana-space-2)",
            textAlign: "center",
          }}
        >
          {error}
        </p>
      )}
    </form>
  );
}
