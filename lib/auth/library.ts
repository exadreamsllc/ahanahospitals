import { createClient } from "@/utils/supabase/server";
import { getCurrentUser } from "@/lib/auth/guards";

export async function getSavedResourceIds(): Promise<string[]> {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("saved_resources")
      .select("resource_id")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching saved resource IDs:", error);
      return [];
    }

    return data.map((row) => row.resource_id);
  } catch (e) {
    console.error("Error in getSavedResourceIds:", e);
    return [];
  }
}
