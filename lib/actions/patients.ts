"use server";

import { createClient } from "@/utils/supabase/server";

export async function findPatientAction(
  firstName: string,
  lastName: string,
  dob: string
) {
  try {
    const supabase = await createClient();

    // Verify current user session to protect query path
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, message: "Unauthorized. Please log in." };
    }

    const tenantId = user.user_metadata?.tenant_id;
    if (!tenantId) {
      return { success: false, message: "No tenant context found for user." };
    }

    // Lookup patient
    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("first_name", firstName.trim())
      .eq("last_name", lastName.trim())
      .eq("dob", dob)
      .maybeSingle();

    if (patientError) {
      return { success: false, message: `Database error: ${patientError.message}` };
    }

    if (!patient) {
      return { success: false, message: "Patient not found." };
    }

    // Load records
    const { data: records, error: recordsError } = await supabase
      .from("patient_records")
      .select("*")
      .eq("patient_id", patient.id)
      .order("recorded_at", { ascending: false });

    if (recordsError) {
      return { success: false, message: `Records load error: ${recordsError.message}` };
    }

    return { success: true, patient, records: records || [] };
  } catch (err: any) {
    return { success: false, message: err.message || "An unexpected error occurred." };
  }
}

export async function createPatientAction(
  firstName: string,
  lastName: string,
  dob: string,
  gender: string,
  phone: string
) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, message: "Unauthorized." };
    }

    const tenantId = user.user_metadata?.tenant_id;
    if (!tenantId) {
      return { success: false, message: "No tenant context found." };
    }

    // Check if duplicate exists
    const { data: existing } = await supabase
      .from("patients")
      .select("id")
      .eq("tenant_id", tenantId)
      .eq("first_name", firstName.trim())
      .eq("last_name", lastName.trim())
      .eq("dob", dob)
      .maybeSingle();

    if (existing) {
      return { success: false, message: "A patient record with this name and DOB already exists." };
    }

    // Insert patient
    const { data: newPatient, error: insertError } = await supabase
      .from("patients")
      .insert({
        tenant_id: tenantId,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        dob: dob,
        gender: gender,
        phone_number: phone.trim(),
      })
      .select()
      .single();

    if (insertError || !newPatient) {
      return { success: false, message: `Failed to insert patient: ${insertError?.message}` };
    }

    return { success: true, patient: newPatient };
  } catch (err: any) {
    return { success: false, message: err.message || "An unexpected error occurred." };
  }
}

export async function appendPatientRecordAction(
  patientId: string,
  recordType: string,
  clinicalData: any
) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, message: "Unauthorized." };
    }

    // Insert record entry
    const { data: newRecord, error: insertError } = await supabase
      .from("patient_records")
      .insert({
        patient_id: patientId,
        record_type: recordType,
        clinical_data: clinicalData,
        recorded_by: user.id,
      })
      .select()
      .single();

    if (insertError || !newRecord) {
      return { success: false, message: `Failed to append record: ${insertError?.message}` };
    }

    return { success: true, record: newRecord };
  } catch (err: any) {
    return { success: false, message: err.message || "An unexpected error occurred." };
  }
}
