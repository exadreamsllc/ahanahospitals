"use client";

import { useState, startTransition, useEffect } from "react";
import Link from "next/link";
import { provisionTenantAction } from "@/lib/actions/saas";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import styles from "./register.module.css";

export default function SaasRegisterPage() {
  const [hospitalName, setHospitalName] = useState("");
  const [slug, setSlug] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#4C2E83");
  const [subscriptionTier, setSubscriptionTier] = useState("Growth");

  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [isProvisioning, setIsProvisioning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [provisionedSlug, setProvisionedSlug] = useState<string | null>(null);
  const [hostSuffix, setHostSuffix] = useState("youmecareall.com");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.host;
      if (host.includes("xproevolve.com")) {
        setHostSuffix("xproevolve.com");
      } else if (host.includes("youmecareall.com")) {
        setHostSuffix("youmecareall.com");
      } else {
        setHostSuffix(host);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProvisioning(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("hospitalName", hospitalName);
    formData.append("slug", slug);
    formData.append("primaryColor", primaryColor);
    formData.append("subscriptionTier", subscriptionTier);
    formData.append("adminName", adminName);
    formData.append("adminEmail", adminEmail);
    formData.append("adminPassword", adminPassword);

    try {
      startTransition(async () => {
        const res = await provisionTenantAction(
          { message: null, fieldErrors: {} },
          formData
        );

        if (res.message === "success" && res.tenantSlug) {
          setProvisionedSlug(res.tenantSlug);
        } else {
          setErrorMessage(res.message || "Failed to provision portal.");
        }
        setIsProvisioning(false);
      });
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setIsProvisioning(false);
    }
  };

  const handleSuggestSlug = (nameVal: string) => {
    setHospitalName(nameVal);
    // Auto-generate clean lowercase alphanumeric slug suggestion
    const suggested = nameVal
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 16);
    setSlug(suggested);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link href="/saas" className={styles.logo}>
            YouMeCareAll
          </Link>
          <Link href="/saas#pricing" style={{ color: "var(--ahana-muted)", fontWeight: "bold", textDecoration: "none" }}>
            ← Back to Pricing
          </Link>
        </div>
      </header>

      <main className={styles.container}>
        {provisionedSlug ? (
          <div className={styles.successCard}>
            <span style={{ fontSize: "54px", display: "block", marginBottom: "16px" }}>🎉</span>
            <h2 className={styles.successTitle}>Portal Provisioned successfully!</h2>
            <p className={styles.successText}>
              Congratulations! Your secure custom-branded patient portal is set up and ready.
            </p>

            <div className={styles.credentialsBox}>
              <h4 style={{ margin: "0 0 8px", color: "var(--ahana-purple-dark)" }}>Your Setup Configuration</h4>
              <p><strong>Hospital Name:</strong> {hospitalName}</p>
              <p><strong>Subscription Tier:</strong> {subscriptionTier} Edition</p>
              <p><strong>Primary Color Theme:</strong> <span style={{ display: "inline-block", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: primaryColor, marginRight: "4px" }} /> {primaryColor}</p>
              <p style={{ marginTop: "12px", borderTop: "1px dashed var(--ahana-border)", paddingTop: "8px" }}>
                <strong>Dynamic Domain Link:</strong>
              </p>
              <p style={{ color: "var(--ahana-purple)", fontWeight: "bold", fontSize: "14px" }}>
                https://{provisionedSlug}.{hostSuffix}/auth/login
              </p>
              <p style={{ fontSize: "12px", color: "var(--ahana-muted)", marginTop: "4px" }}>
                (Testing Local Route: /tenants/{provisionedSlug}/auth/login)
              </p>
            </div>

            <Link
              href={`/tenants/${provisionedSlug}/auth/login`}
              className="ahana-button primary"
              style={{ display: "inline-block", textDecoration: "none", width: "100%", textAlign: "center", padding: "12px" }}
            >
              🚀 Launch Portal & Log In
            </Link>
          </div>
        ) : (
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Register Hospital Portal</h2>
            <p className={styles.formSubtitle}>
              Empower your clinical staff and patients with a secure, custom-branded EMR portal.
            </p>

            {errorMessage && (
              <div className={styles.alert}>
                ⚠️ {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <h3 style={{ borderBottom: "1px solid var(--ahana-border)", paddingBottom: "6px", color: "var(--ahana-purple-dark)", fontSize: "16px", marginBottom: "16px" }}>
                1. Institutional Brand Identity
              </h3>

              <div className={styles.group}>
                <label className={styles.label}>Hospital / Clinic Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ahana Hospitals"
                  value={hospitalName}
                  onChange={(e) => handleSuggestSlug(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.grid}>
                <div className={styles.group}>
                  <label className={styles.label}>Subdomain Slug</label>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ahana"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      className={styles.input}
                      style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                    />
                    <span style={{ backgroundColor: "var(--ahana-surface-soft)", border: "1px solid var(--ahana-border)", borderLeft: 0, padding: "10px 12px", borderTopRightRadius: "6px", borderBottomRightRadius: "6px", fontSize: "13px", color: "var(--ahana-muted)" }}>
                      .{hostSuffix}
                    </span>
                  </div>
                </div>

                <div className={styles.group}>
                  <label className={styles.label}>Branding Theme Color</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      style={{ width: "42px", height: "42px", border: "1px solid var(--ahana-border)", borderRadius: "6px", cursor: "pointer", padding: 0 }}
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.group}>
                <label className={styles.label}>Subscription Tier</label>
                <select
                  value={subscriptionTier}
                  onChange={(e) => setSubscriptionTier(e.target.value)}
                  className={styles.input}
                  style={{ background: "white" }}
                >
                  <option value="Starter">Starter Clinic ($49 / Month)</option>
                  <option value="Growth">Growth Hospital ($199 / Month)</option>
                  <option value="Enterprise">Enterprise Network (Custom Billing)</option>
                </select>
              </div>

              <h3 style={{ borderBottom: "1px solid var(--ahana-border)", paddingBottom: "6px", color: "var(--ahana-purple-dark)", fontSize: "16px", marginTop: "24px", marginBottom: "16px" }}>
                2. Administrator Account Registration
              </h3>

              <div className={styles.group}>
                <label className={styles.label}>Admin Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. C. Ramasubramanian"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.grid}>
                <div className={styles.group}>
                  <label className={styles.label}>Admin Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. admin@ahanahospitals.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.group}>
                  <label className={styles.label}>Choose Admin Password</label>
                  <input
                    type="password"
                    required
                    placeholder="At least 8 characters"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              <div style={{ marginTop: "24px" }}>
                <PrimaryButton type="submit" disabled={isProvisioning} fullWidth>
                  {isProvisioning ? "Provisioning Portal Workspace..." : "💳 Provision Custom branded Portal"}
                </PrimaryButton>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
