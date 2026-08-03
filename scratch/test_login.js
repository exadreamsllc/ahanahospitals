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

async function test() {
  const EMAILS = [
    "patient@youmecareall.com",
    "provider@youmecareall.com",
    "staff@youmecareall.com",
    "management@youmecareall.com",
    "admin@youmecareall.com"
  ];
  const password = "AhanaStaff2026!";
  
  for (const email of EMAILS) {
    console.log(`Testing login for ${email}...`);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      console.error(`Login failed for ${email} with error:`, error.message);
    } else {
      console.log(`Login succeeded for ${email}! User ID:`, data.user.id);
    }
  }
}

test();
