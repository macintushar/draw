import { NonDeletedExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { supabase } from "./supabase";
import { AuthError, PostgrestError } from "@supabase/supabase-js";

export type DBResponse = {
  data: any[] | null;
  error: PostgrestError | AuthError | null;
};

export async function getPages(): Promise<DBResponse> {
  const { data, error } = await supabase
    .from("draw")
    .select()
    .order("updated_at", { ascending: false })
    .eq("is_deleted", false);

  return { data, error };
}

export async function getDrawData(id: string): Promise<DBResponse> {
  const { data, error } = await supabase
    .from("draw")
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
  elements: readonly NonDeletedExcalidrawElement[],
  name: string
): Promise<DBResponse> {
  const updateTime = new Date().toISOString();
  const { data, error } = await supabase
    .from("draw")
    .update({ name: name, page_elements: { elements }, updated_at: updateTime })
    .eq("page_id", id)
    .select();

  return { data, error };
}

export async function deletePage(id: string): Promise<DBResponse> {
  const { error } = await supabase
    .from("draw")
    .update({ is_deleted: true })
    .eq("page_id", id);

  return { data: null, error };
}
