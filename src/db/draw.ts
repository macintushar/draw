import { NonDeletedExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import supabase from ".";
import { AuthError, PostgrestError } from "@supabase/supabase-js";

export type DBResponse = {
  data: any[] | null;
  error: PostgrestError | AuthError | null;
};

export async function getPages(): Promise<DBResponse> {
  const { data, error } = await supabase.from("draw").select();

  return { data, error };
}

export async function getDrawData(id: string): Promise<DBResponse> {
  const { data, error } = await supabase
    .from("countries")
    .select()
    .eq("page_id", id);

  return { data, error };
}

export async function createNewPage(): Promise<DBResponse> {
  const { data: profile, error: profileError } = await supabase.auth.getUser();
  if (profile) {
    const { data, error } = await supabase
      .from("draw")
      .insert({ user_id: profile.user?.id })
      .select();
    return { data, error };
  }
  return { data: null, error: profileError };
}

export async function setDrawData(
  id: string,
  elements: NonDeletedExcalidrawElement[]
): Promise<DBResponse> {
  const { data, error } = await supabase
    .from("draw")
    .update({ page_elements: { elements } })
    .eq("page_id", id)
    .select();

  return { data, error };
}
