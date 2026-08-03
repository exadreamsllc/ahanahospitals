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

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase configuration in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const USERS = [
  {
    email: "patient@youmecareall.com",
    password: "AhanaStaff2026!",
    fullName: "Sample Patient",
    accountType: "Member",
  },
  {
    email: "provider@youmecareall.com",
    password: "AhanaStaff2026!",
    fullName: "Sample Provider",
    accountType: "Professional",
  },
  {
    email: "staff@youmecareall.com",
    password: "AhanaStaff2026!",
    fullName: "Sample Staff",
    accountType: "Staff",
  },
  {
    email: "management@youmecareall.com",
    password: "AhanaStaff2026!",
    fullName: "Sample Management",
    accountType: "Management",
  },
  {
    email: "admin@youmecareall.com",
    password: "AhanaStaff2026!",
    fullName: "Sample Admin",
    accountType: "Administrator",
  },
];

async function registerAll() {
  for (const user of USERS) {
    console.log(`Registering ${user.email}...`);
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          full_name: user.fullName,
          preferred_language: "English",
          account_type: user.accountType,
          tenant_id: "a7b3c2d4-1a2b-3c4d-5e6f-7a8b9c0d1e2f", // Ahana Hospitals
        },
      },
    });

    if (error) {
      console.error(`Failed for ${user.email}:`, error.message);
    } else {
      console.log(`Success for ${user.email}! User ID: ${data.user.id}`);
    }
  }
}

registerAll();
