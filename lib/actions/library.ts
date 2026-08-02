"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/guards";

export async function toggleSaveResourceAction(
  resourceId: string,
  isSaved: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "You must be logged in to save resources." };
    }

    const supabase = await createClient();

    if (isSaved) {
      // Unsave the resource: delete from saved_resources
      const { error } = await supabase
        .from("saved_resources")
        .delete()
        .eq("user_id", user.id)
        .eq("resource_id", resourceId);

      if (error) {
        console.error("Failed to delete bookmark:", error);
        return { success: false, error: "Failed to unsave resource. Please try again." };
      }
    } else {
      // Save the resource: insert into saved_resources
      const { error } = await supabase
        .from("saved_resources")
        .insert({
          user_id: user.id,
          resource_id: resourceId,
        });

      if (error) {
        console.error("Failed to insert bookmark:", error);
        return { success: false, error: "Failed to save resource. Please try again." };
      }
    }

    revalidatePath("/resources");
    revalidatePath("/library");
    return { success: true };
  } catch (e) {
    console.error("Error in toggleSaveResourceAction:", e);
    return { success: false, error: "An unexpected error occurred." };
  }
}
