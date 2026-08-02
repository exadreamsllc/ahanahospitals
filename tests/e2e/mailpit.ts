/**
 * Helper utilities to poll the local Mailpit API during E2E tests.
 */

interface MailpitMessageSummary {
  ID: string;
  Subject: string;
  To: { Name: string; Address: string }[];
  Created: string;
}

interface MailpitMessageDetail {
  ID: string;
  Subject: string;
  HTML: string;
  Text: string;
}

/**
 * Polls Mailpit messages until one is found matching the recipient and subject.
 */
export async function pollForEmail(
  toAddress: string,
  subject: string,
  timeoutMs = 15000,
  intervalMs = 500
): Promise<MailpitMessageDetail> {
  const startTime = Date.now();
  const lowercaseTo = toAddress.toLowerCase();

  while (Date.now() - startTime < timeoutMs) {
    try {
      const response = await fetch("http://127.0.0.1:54324/api/v1/messages");
      if (response.ok) {
        const data = await response.json();
        const messages: MailpitMessageSummary[] = data.messages || [];

        // Find matching message
        const match = messages.find(
          (msg) =>
            msg.Subject.includes(subject) &&
            msg.To.some((recipient) => recipient.Address.toLowerCase() === lowercaseTo)
        );

        if (match) {
          // Fetch the full message detail containing HTML/Text content
          const detailResponse = await fetch(`http://127.0.0.1:54324/api/v1/message/${match.ID}`);
          if (detailResponse.ok) {
            return await detailResponse.json();
          }
        }
      }
    } catch (e) {
      console.warn("Mailpit fetch failed, retrying...", e);
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(`Timeout waiting for email to ${toAddress} with subject "${subject}"`);
}

/**
 * Extracts the first link found in the email HTML content.
 */
export function extractLink(email: MailpitMessageDetail): string {
  // Extract link from HTML a tag
  const htmlMatch = email.HTML.match(/href="([^"]+)"/);
  if (htmlMatch && htmlMatch[1]) {
    // Unescape HTML entities like &amp;
    return htmlMatch[1].replace(/&amp;/g, "&");
  }

  // Fallback to text url extraction
  const textMatch = email.Text.match(/https?:\/\/[^\s\)]+/);
  if (textMatch && textMatch[0]) {
    return textMatch[0];
  }

  throw new Error(`No link found in email body for message ${email.ID}`);
}
