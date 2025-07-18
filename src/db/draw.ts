import { NonDeletedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { BinaryFiles } from "@excalidraw/excalidraw/types";
import { supabase } from "./supabase";
import { AuthError, PostgrestError } from "@supabase/supabase-js";

export type DBResponse = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[] | null;
  error: PostgrestError | AuthError | null;
};

export type ExcalidrawData = {
  elements: readonly NonDeletedExcalidrawElement[];
  appState?: Record<string, unknown>;
  files?: BinaryFiles;
};

export const DB_NAME = "draw";

export async function getPages(user_id: string): Promise<DBResponse> {
  const { data, error } = await supabase
    .from(DB_NAME)
    .select("page_id, name, created_at, updated_at")
    .order("updated_at", { ascending: false })
    .eq("user_id", user_id)
    .eq("is_deleted", false);

  return { data, error };
}

export async function getDrawData(id: string): Promise<DBResponse> {
  const { data, error } = await supabase
    .from(DB_NAME)
    .select()
    .eq("page_id", id);

  return { data, error };
}

export async function createNewPage(
  elements?: readonly NonDeletedExcalidrawElement[],
  files?: BinaryFiles,
): Promise<DBResponse> {
  const { data: profile, error: profileError } = await supabase.auth.getUser();
  if (profile) {
    const excalidrawData: ExcalidrawData = { 
      elements: elements || [],
      files: files || {}
    };
    const { data, error } = await supabase
      .from(DB_NAME)
      .insert({ user_id: profile.user?.id, page_elements: excalidrawData })
      .select();
    return { data, error };
  }
  return { data: null, error: profileError };
}

export async function setDrawData(
  id: string,
  elements: readonly NonDeletedExcalidrawElement[],
  name: string,
  files?: BinaryFiles,
): Promise<DBResponse> {
  const updateTime = new Date().toISOString();
  const excalidrawData: ExcalidrawData = { 
    elements,
    files: files || {}
  };
  const { data, error } = await supabase
    .from(DB_NAME)
    .update({ name: name, page_elements: excalidrawData, updated_at: updateTime })
    .eq("page_id", id)
    .select();

  return { data, error };
}

export async function deletePage(id: string): Promise<DBResponse> {
  const { error } = await supabase
    .from(DB_NAME)
    .update({ is_deleted: true })
    .eq("page_id", id);

  return { data: null, error };
}
