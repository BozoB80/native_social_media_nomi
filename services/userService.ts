import { Tables } from "@/helpers/types";
import { supabase } from "@/lib/supabase";

export const getUserData = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      return { success: false, msg: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.log("got error", error);
    return { success: false, msg: error.message };
  }
};

export const updateUser = async (
  userId: string,
  data: Partial<Tables<"users">>
) => {
  try {
    const { error } = await supabase
      .from("users")
      .update(data)
      .eq("id", userId);

    if (error) {
      return { success: false, msg: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.log("got error", error);
    return { success: false, msg: error.message };
  }
};
