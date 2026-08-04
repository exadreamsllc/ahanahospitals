"use server";

import { createClient } from "@/utils/supabase/server";
import { formError, type FormState } from "@/lib/validation/auth";

export async function provisionTenantAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState & { tenantSlug?: string }> {
  const hospitalName = (formData.get("hospitalName") as string || "").trim();
  const slug = (formData.get("slug") as string || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  const primaryColor = (formData.get("primaryColor") as string || "#4C2E83").trim();
  const subscriptionTier = (formData.get("subscriptionTier") as string || "Growth").trim();
  
  const adminName = (formData.get("adminName") as string || "").trim();
  const adminEmail = (formData.get("adminEmail") as string || "").trim().toLowerCase();
  const adminPassword = formData.get("adminPassword") as string || "";

  // Basic validation
  if (!hospitalName || !slug || !adminName || !adminEmail || !adminPassword) {
    return {
      message: "Please fill out all required fields.",
      fieldErrors: {},
    };
  }

  if (slug.length < 3) {
    return {
      message: "Subdomain slug must be at least 3 characters.",
      fieldErrors: {},
    };
  }

  try {
    const supabase = await createClient();

    // 1. Check if subdomain slug is already taken
    const { data: existingTenant } = await supabase
      .from("tenants")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existingTenant) {
      return {
        message: `The subdomain slug '${slug}' is already taken. Please choose another one.`,
        fieldErrors: {},
      };
    }

    // 2. Insert new tenant
    const branding = {
      primary_color: primaryColor,
      logo_emoji: "🏥",
    };

    const { data: newTenant, error: tenantError } = await supabase
      .from("tenants")
      .insert({
        name: hospitalName,
        slug: slug,
        branding: branding,
        subscription_tier: subscriptionTier,
      })
      .select()
      .single();

    if (tenantError || !newTenant) {
      console.error("Database error creating tenant:", tenantError);
      return {
        message: `Database error: ${tenantError?.message || "Failed to create tenant profile."}`,
        fieldErrors: {},
      };
    }

    // 3. Register admin user on Supabase auth
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          full_name: adminName,
          account_type: "Administrator",
          tenant_id: newTenant.id,
          preferred_language: "en",
        },
      },
    });

    if (authError || !authUser.user) {
      console.error("Auth error registering admin:", authError);
      // Clean up newly created tenant to prevent orphan entries
      await supabase.from("tenants").delete().eq("id", newTenant.id);
      
      return {
        message: `User registration error: ${authError?.message || "Failed to sign up admin account."}`,
        fieldErrors: {},
      };
    }

    // Wait: Supabase triggers public.handle_new_user() to insert into profiles.
    // Let's explicitly double check or update user identity so login works
    const { error: identityError } = await supabase.from("auth.identities").insert({
      id: authUser.user.id,
      user_id: authUser.user.id,
      identity_data: { sub: authUser.user.id, email: adminEmail },
      provider: "email",
      last_sign_in_at: new Date().toISOString(),
    }).select().maybeSingle();

    // Force update user preferences to hold initial settings
    await supabase
      .from("profiles")
      .update({
        preferences: {
          report_columns: ["full_name", "phone", "status", "created_at"],
        },
      })
      .eq("id", authUser.user.id);

    return {
      message: "success",
      fieldErrors: {},
      tenantSlug: slug,
    };
  } catch (e: any) {
    console.error("Uncaught error in provisionTenantActionServer:", e);
    return {
      message: e.message || "An unexpected system error occurred during provisioning.",
      fieldErrors: {},
    };
  }
}
