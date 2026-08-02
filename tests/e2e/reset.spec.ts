import { test, expect } from "@playwright/test";
import { pollForEmail, extractLink } from "./mailpit";

test.describe("Password Reset & Recovery Flow", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
    // Rotate client IP to completely bypass GoTrue IP rate-limiting
    const randomIp = `${Math.floor(Math.random() * 220) + 10}.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}`;
    await context.setExtraHTTPHeaders({
      "X-Forwarded-For": randomIp,
    });
  });

  const oldPassword = "oldpassword123";
  const newPassword = "newpassword123";
  const fullName = "Recovery Test";

  test("F1-F10: completes password reset request, changes password, and checks credential updates", async ({ page }) => {
    const userEmail = `recovery-${Date.now()}@ahana.test`;

    // 1. Sign up and confirm account first
    await page.goto("/auth/register");
    await page.fill('input[name="fullName"]', fullName);
    await page.fill('input[name="email"]', userEmail);
    await page.fill('input[name="password"]', oldPassword);
    await page.fill('input[name="confirmPassword"]', oldPassword);
    await page.check('input[name="acceptedTerms"]');
    await page.click('button[type="submit"]');

    const signupEmail = await pollForEmail(userEmail, "Confirm your email address");
    const signupLink = extractLink(signupEmail);
    await page.goto(signupLink);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    
    // Sign out
    await page.click("text=Sign out");

    // F1: Request password reset
    await page.goto("/auth/forgot-password");
    await page.fill('input[name="email"]', userEmail);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/auth\/check-email\?mode=reset/, { timeout: 15000 });
    await expect(page.locator(`text=${userEmail}`)).toBeVisible({ timeout: 15000 });

    // Fetch recovery mail from Mailpit
    const recoveryEmail = await pollForEmail(userEmail, "Reset your password");
    const recoveryLink = extractLink(recoveryEmail);

    // F3: Open recovery link -> should land on reset-password page
    await page.goto(recoveryLink);
    await expect(page).toHaveURL(/\/auth\/reset-password/, { timeout: 15000 });

    // F4: Password shorter than 8 chars
    await page.fill('input[name="password"]', "short");
    await page.fill('input[name="confirmPassword"]', "short");
    
    // Disable native HTML validation and submit
    await page.evaluate(() => document.querySelector("form")?.setAttribute("novalidate", "true"));
    await page.click('button[type="submit"]');
    
    await expect(page.locator("text=Password must contain at least 8 characters.")).toBeVisible({ timeout: 15000 });

    // F5: Mismatched passwords
    await page.fill('input[name="password"]', newPassword);
    await page.fill('input[name="confirmPassword"]', "mismatchpassword123");
    
    // Disable native HTML validation and submit
    await page.evaluate(() => document.querySelector("form")?.setAttribute("novalidate", "true"));
    await page.click('button[type="submit"]');
    
    await expect(page.locator("text=Passwords do not match.")).toBeVisible({ timeout: 15000 });

    // F6: Valid matching password
    await page.fill('input[name="password"]', newPassword);
    await page.fill('input[name="confirmPassword"]', newPassword);
    await page.click('button[type="submit"]');

    // Should redirect to login page with password-updated status
    await expect(page).toHaveURL(/\/auth\/login\?status=password-updated/, { timeout: 15000 });
    await expect(page.locator("text=Your password has been updated.")).toBeVisible({ timeout: 15000 });

    // F7: Sign in with old password (rejected)
    await page.fill('input[name="email"]', userEmail);
    await page.fill('input[name="password"]', oldPassword);
    await page.click('button[type="submit"]');
    await expect(page.locator("text=The email address or password is incorrect.")).toBeVisible({ timeout: 15000 });

    // F8: Sign in with new password (succeeds)
    await page.fill('input[name="password"]', newPassword);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    
    // Sign out
    await page.click("text=Sign out");

    // F9: Visit /auth/reset-password directly with no session -> redirect to forgot-password
    await page.goto("/auth/reset-password");
    await expect(page).toHaveURL(/\/auth\/forgot-password\?status=link-expired/, { timeout: 15000 });
    await expect(page.locator("text=Your reset link has expired")).toBeVisible({ timeout: 15000 });

    // F10: Reopen the used reset link -> should show code error page
    await page.goto(recoveryLink);
    await expect(page).toHaveURL(/\/auth\/auth-code-error/, { timeout: 15000 });
    await expect(page.locator("text=The link is expired or invalid")).toBeVisible({ timeout: 15000 });
  });
});
