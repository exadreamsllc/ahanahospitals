import { test, expect } from "@playwright/test";
import { pollForEmail, extractLink } from "./mailpit";

test.describe("Doctor Patient EMR Console Workspace Flow", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
    // Bypass GoTrue rate limiting
    const randomIp = `10.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}`;
    await context.setExtraHTTPHeaders({
      "X-Forwarded-For": randomIp,
    });
  });

  test("should allow doctor to log in, search for patient Priya, view EMR tabs, and append new record", async ({ page }) => {
    const tempEmail = `doctor-test-${Date.now()}@ahana.test`;
    const password = "validpassword123";

    // 1. Register a professional account
    await page.goto("/tenants/ahana/auth/register");
    await page.fill('input[name="fullName"]', "Dr. E2E Tester");
    await page.fill('input[name="email"]', tempEmail);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    await page.selectOption('select[name="accountType"]', "Professional");
    await page.check('input[name="acceptedTerms"]');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/auth\/check-email/, { timeout: 15000 });

    // 2. Retrieve confirmation link and confirm account
    const email = await pollForEmail(tempEmail, "Confirm your email address");
    const link = extractLink(email);
    console.log("Original extracted link:", link);
    
    // Replace the link domain to localhost since Mailpit link might reference the platform origin
    const localLink = link
      .replace(/https?:\/\/[^\/]+/, "http://localhost:3000")
      .replace("/auth/confirm", "/tenants/ahana/auth/confirm");
    console.log("Rewritten confirmation link:", localLink);

    try {
      console.log("Navigating to localLink...");
      await page.goto(localLink);
      console.log("page.goto completed successfully!");
    } catch (err: any) {
      console.log("page.goto threw error:", err.message);
      if (!err.message.includes("net::ERR_ABORTED")) {
        throw err;
      }
    }

    // Confirm redirected to Operations Console
    console.log("Current page URL after confirm goto:", page.url());
    await expect(page).toHaveURL(/\/tenants\/ahana\/dashboard/, { timeout: 15000 });
    await expect(page.locator("text=Operations Console")).toBeVisible();

    // 3. Select the Patient EMR Workspace Tab
    await page.click('button:has-text("Patient EMR Workspace")');
    await expect(page.locator('h3:has-text("Search Patient EMR")')).toBeVisible();

    // 4. Search for Priya Dharshini (DOB: 2002-08-10)
    await page.fill('input[placeholder="e.g. Priya"]', "Priya");
    await page.fill('input[placeholder="e.g. Dharshini"]', "Dharshini");
    await page.locator('input[type="date"]').first().fill("2002-08-10");
    await page.click('button[type="submit"]:has-text("Search Patient EMR")');

    // 5. Verify demographics bar and clinical tabs render
    await expect(page.locator("text=Active Patient Workspace: Priya Dharshini")).toBeVisible({ timeout: 15000 });
    await expect(page.locator("text=Medical Record Status")).toBeVisible();
    await expect(page.locator("text=Active Resident")).toBeVisible();

    // 6. Navigate to "Daily Progress Reports" tab
    await page.click('button:has-text("Daily Progress Reports")');
    await expect(page.locator("text=Recovery Assessment:")).toBeVisible();

    // 7. Click Append New Entry and enter a new progress log
    await page.click('button:has-text("Append New Entry")');
    await expect(page.locator("text=Append Log: 📝 Daily Progress Reports")).toBeVisible();

    const uniqueNote = `Test observation log added at ${Date.now()}`;
    await page.fill('textarea', uniqueNote);
    await page.selectOption('select', 'Progressing');
    await page.click('button:has-text("Confirm Append")');

    // 8. Verify the new observation log is prepended to the clinical timeline stack instantly
    await expect(page.locator(`text=${uniqueNote}`)).toBeVisible({ timeout: 15000 });
    await expect(page.locator("text=Recovery Assessment:").first()).toBeVisible();
  });
});
