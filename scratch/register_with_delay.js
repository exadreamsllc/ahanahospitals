const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Read .env.local variables
const envPath = path.join(__dirname, "../.env.local");
const envContent = fs.readFileSync(envPath, "utf-8");

const getEnvVar = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.*)`));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnvVar("NEXT_PUBLIC_SUPABASE_URL");
const supabaseKey = getEnvVar("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");

const supabase = createClient(supabaseUrl, supabaseKey);

const USERS = [
  {
    email: "ahanapatient@gmail.com",
    password: "AhanaStaff2026!",
    fullName: "Sample Patient",
    accountType: "Member",
  },
  {
    email: "ahanaprovider@gmail.com",
    password: "AhanaStaff2026!",
    fullName: "Sample Provider",
    accountType: "Professional",
  },
  {
    email: "ahanastaff@gmail.com",
    password: "AhanaStaff2026!",
    fullName: "Sample Staff",
    accountType: "Staff",
  },
  {
    email: "ahanamanagement@gmail.com",
    password: "AhanaStaff2026!",
    fullName: "Sample Management",
    accountType: "Management",
  },
  {
    email: "ahanaadmin@gmail.com",
    password: "AhanaStaff2026!",
    fullName: "Sample Admin",
    accountType: "Administrator",
  },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  // Loop and register with 30s delays
  for (let i = 0; i < USERS.length; i++) {
    const user = USERS[i];
    console.log(`[${i + 1}/5] Registering ${user.email}...`);

    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          full_name: user.fullName,
          preferred_language: "en",
          account_type: user.accountType,
          tenant_id: "a7b3c2d4-1a2b-3c4d-5e6f-7a8b9c0d1e2f", // Ahana Hospitals
        },
      },
    });

    if (error) {
      console.error(`Sign up failed for ${user.email}:`, error);
      if (error.message && error.message.includes("rate limit")) {
        console.log("Rate limit hit! Waiting 60 seconds before retrying...");
        await sleep(60000);
        i--; // Retry this user
        continue;
      }
    } else {
      console.log(`Successfully registered ${user.email}! User ID: ${data.user.id}`);
    }

    if (i < USERS.length - 1) {
      console.log("Waiting 30 seconds to bypass rate limits...");
      await sleep(30000);
    }
  }

  console.log("All registrations finished!");
}

run();
