import { test, expect } from "@playwright/test";
import { pollForEmail, extractLink } from "./mailpit";

test.describe("Registration & Confirmation Flow", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
    // Rotate client IP to completely bypass GoTrue IP rate-limiting
    const randomIp = `${Math.floor(Math.random() * 220) + 10}.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}`;
    await context.setExtraHTTPHeaders({
      "X-Forwarded-For": randomIp,
    });
  });

  test("R2, R3, R4: rejects invalid password, mismatched passwords, and unchecked terms", async ({ page }) => {
    await page.goto("/auth/register");

    // 1. Password shorter than 8 chars (R2)
    await page.fill('input[name="fullName"]', "Valid Name");
    await page.fill('input[name="email"]', "test-validation@ahana.test");
    await page.fill('input[name="password"]', "short");
    await page.fill('input[name="confirmPassword"]', "short");
    await page.check('input[name="acceptedTerms"]');
    
    // Disable native HTML validation and submit
    await page.evaluate(() => document.querySelector("form")?.setAttribute("novalidate", "true"));
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Password must contain at least 8 characters.")).toBeVisible({ timeout: 15000 });

    // 2. Mismatched passwords (R3)
    await page.fill('input[name="password"]', "validpassword123");
    await page.fill('input[name="confirmPassword"]', "differentpassword123");
    await page.check('input[name="acceptedTerms"]');
    
    // Disable native HTML validation and submit
    await page.evaluate(() => document.querySelector("form")?.setAttribute("novalidate", "true"));
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Passwords do not match.")).toBeVisible({ timeout: 15000 });

    // 3. Unchecked terms (R4)
    await page.fill('input[name="confirmPassword"]', "validpassword123");
    await page.uncheck('input[name="acceptedTerms"]');
    
    // Disable native HTML validation and submit
    await page.evaluate(() => document.querySelector("form")?.setAttribute("novalidate", "true"));
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Please accept the Privacy Notice and Terms of Use.")).toBeVisible({ timeout: 15000 });
  });

  test("R1, C1, C2: completes valid signup, captures confirmation email, logs in, and detects link reuse", async ({ page }) => {
    const uniqueEmail = `signup-${Date.now()}@ahana.test`;
    await page.goto("/auth/register");

    await page.fill('input[name="fullName"]', "Full Name Test");
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', "validpassword123");
    await page.fill('input[name="confirmPassword"]', "validpassword123");
    await page.check('input[name="acceptedTerms"]');
    
    // Click submit to register
    await page.click('button[type="submit"]');

    // Should redirect to check-email (R1)
    await expect(page).toHaveURL(/\/auth\/check-email/, { timeout: 15000 });
    await expect(page.locator(`text=${uniqueEmail}`)).toBeVisible({ timeout: 15000 });

    // Poll Mailpit for the email
    const email = await pollForEmail(uniqueEmail, "Confirm your email address");
    const link = extractLink(email);

    // C1: Open link, should sign in and redirect to dashboard
    await page.goto(link);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    await expect(page.locator("text=Full Name Test")).toBeVisible({ timeout: 15000 });

    // C2: Open same link a second time, should show invalid code error
    await page.goto(link);
    await expect(page).toHaveURL(/\/auth\/auth-code-error/, { timeout: 15000 });
    await expect(page.locator("text=The link is expired or invalid")).toBeVisible({ timeout: 15000 });
  });

  test("R5: email case normalisation", async ({ page }) => {
    const mixedEmail = `MixedCase-${Date.now()}@AHANA.test`;
    const lowercaseEmail = mixedEmail.toLowerCase();

    await page.goto("/auth/register");
    await page.fill('input[name="fullName"]', "Case Test");
    await page.fill('input[name="email"]', mixedEmail);
    await page.fill('input[name="password"]', "validpassword123");
    await page.fill('input[name="confirmPassword"]', "validpassword123");
    await page.check('input[name="acceptedTerms"]');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/auth\/check-email/, { timeout: 15000 });
    // Address rendered on check-email page is the normalised lowercase email
    await expect(page.locator(`text=${lowercaseEmail}`)).toBeVisible({ timeout: 15000 });
  });

  test("R6: register with an address that already exists does not reveal existence", async ({ page }) => {
    const duplicateEmail = `duplicate-${Date.now()}@ahana.test`;

    // 1st signup
    await page.goto("/auth/register");
    await page.fill('input[name="fullName"]', "Original Account");
    await page.fill('input[name="email"]', duplicateEmail);
    await page.fill('input[name="password"]', "validpassword123");
    await page.fill('input[name="confirmPassword"]', "validpassword123");
    await page.check('input[name="acceptedTerms"]');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/auth\/check-email/, { timeout: 15000 });

    // Wait 1.5 seconds to bypass same-email SMTP frequency rate limit
    await page.waitForTimeout(1500);

    // 2nd signup (duplicate)
    await page.goto("/auth/register");
    await page.fill('input[name="fullName"]', "Duplicate Account");
    await page.fill('input[name="email"]', duplicateEmail);
    await page.fill('input[name="password"]', "validpassword123");
    await page.fill('input[name="confirmPassword"]', "validpassword123");
    await page.check('input[name="acceptedTerms"]');
    await page.click('button[type="submit"]');

    // Should still redirect to check-email with no error message (R6)
    await expect(page).toHaveURL(/\/auth\/check-email/, { timeout: 15000 });
    await expect(page.locator(`text=${duplicateEmail}`)).toBeVisible({ timeout: 15000 });
  });
});
