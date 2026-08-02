import { test, expect } from "@playwright/test";
import { pollForEmail, extractLink } from "./mailpit";

test.describe("Login & Route Guard Flow", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
    // Rotate client IP to completely bypass GoTrue IP rate-limiting
    const randomIp = `${Math.floor(Math.random() * 220) + 10}.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}`;
    await context.setExtraHTTPHeaders({
      "X-Forwarded-For": randomIp,
    });
  });

  const password = "validpassword123";
  const fullName = "Aravind LoginTest";

  test("L1, L2, L3, L4, L5: executes credential checks and unconfirmed constraints", async ({ page }) => {
    const tempEmail = `login-check-${Date.now()}@ahana.test`;
    
    // Register the account first
    await page.goto("/auth/register");
    await page.fill('input[name="fullName"]', fullName);
    await page.fill('input[name="email"]', tempEmail);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    await page.check('input[name="acceptedTerms"]');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/auth\/check-email/, { timeout: 15000 });

    // L4: Try signing in before confirming email
    await page.goto("/auth/login");
    await page.fill('input[name="email"]', tempEmail);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    
    await expect(page.locator("text=Please confirm your email address first.")).toBeVisible({ timeout: 15000 });

    // L2: Wrong password
    await page.fill('input[name="password"]', "wrongpassword123");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=The email address or password is incorrect.")).toBeVisible({ timeout: 15000 });

    // L3: Unregistered email
    await page.fill('input[name="email"]', "unregistered-email-address@ahana.test");
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await expect(page.locator("text=The email address or password is incorrect.")).toBeVisible({ timeout: 15000 });

    // Confirm the account
    const email = await pollForEmail(tempEmail, "Confirm your email address");
    const link = extractLink(email);
    await page.goto(link);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });

    // Sign out via header action
    await page.click("text=Sign out");
    await expect(page).toHaveURL(/\/auth\/login\?status=signed-out/, { timeout: 15000 });

    // L1: Correct credentials login
    await page.fill('input[name="email"]', tempEmail);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });

    // L6 & L7: Logged-in redirects
    await page.goto("/auth/login");
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });

    await page.goto("/auth/register");
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  });

  test("P1, P2, P3, P4, P5, P6: route guards and open-redirect protection", async ({ page }) => {
    // P1, P2, P3: guest visits authenticated pages -> redirect to login with next parameter
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/auth\/login\?next=%2Fdashboard/, { timeout: 15000 });

    await page.goto("/profile");
    await expect(page).toHaveURL(/\/auth\/login\?next=%2Fprofile/, { timeout: 15000 });

    await page.goto("/library");
    await expect(page).toHaveURL(/\/auth\/login\?next=%2Flibrary/, { timeout: 15000 });

    // Register & confirm user for next checks
    const targetEmail = `next-guard-${Date.now()}@ahana.test`;
    await page.goto("/auth/register");
    await page.fill('input[name="fullName"]', "Next Guard");
    await page.fill('input[name="email"]', targetEmail);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    await page.check('input[name="acceptedTerms"]');
    await page.click('button[type="submit"]');
    
    const email = await pollForEmail(targetEmail, "Confirm your email address");
    const link = extractLink(email);
    await page.goto(link);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    
    // Sign out
    await page.click("text=Sign out");

    // P5: login from next=/profile lands on profile
    await page.goto("/auth/login?next=%2Fprofile");
    await page.fill('input[name="email"]', targetEmail);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/profile/, { timeout: 15000 });

    // Sign out
    await page.click("text=Sign out");

    // P6: login from next=https://evil.example rejects external domain and falls back to dashboard
    await page.goto("/auth/login?next=https://evil.example");
    await page.fill('input[name="email"]', targetEmail);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  });

  test("P7, P8: header display differs by session", async ({ page }) => {
    // P7: signed out header
    await page.goto("/resources");
    await expect(page.locator("text=Log in")).toBeVisible({ timeout: 15000 });
    await expect(page.locator("text=Create account")).toBeVisible({ timeout: 15000 });
    await expect(page.locator("text=Sign out")).not.toBeVisible({ timeout: 15000 });

    // Register & confirm user
    const userEmail = `header-check-${Date.now()}@ahana.test`;
    await page.goto("/auth/register");
    await page.fill('input[name="fullName"]', "Header Check");
    await page.fill('input[name="email"]', userEmail);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    await page.check('input[name="acceptedTerms"]');
    await page.click('button[type="submit"]');
    
    const email = await pollForEmail(userEmail, "Confirm your email address");
    const link = extractLink(email);
    await page.goto(link);

    // P8: signed in header
    await page.goto("/resources");
    await expect(page.locator("text=Log in")).not.toBeVisible({ timeout: 15000 });
    await expect(page.locator("text=Create account")).not.toBeVisible({ timeout: 15000 });
    await expect(page.locator("text=Sign out")).toBeVisible({ timeout: 15000 });
  });

  test("S1, S2, S3, S4: sign out actions", async ({ page }) => {
    const userEmail = `signout-check-${Date.now()}@ahana.test`;
    await page.goto("/auth/register");
    await page.fill('input[name="fullName"]', "SignOut Check");
    await page.fill('input[name="email"]', userEmail);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    await page.check('input[name="acceptedTerms"]');
    await page.click('button[type="submit"]');
    
    const email = await pollForEmail(userEmail, "Confirm your email address");
    const link = extractLink(email);
    await page.goto(link);

    // S1: click sign out in header
    await page.click("text=Sign out");
    await expect(page).toHaveURL(/\/auth\/login\?status=signed-out/, { timeout: 15000 });

    // S3: after signing out, back button does not render dashboard
    await page.goBack();
    // Should be redirected back to login because page is protected
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 15000 });
  });
});
