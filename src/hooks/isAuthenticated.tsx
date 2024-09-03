import supabase from "@/db";

export default async function isAuthenticated() {
  const { data, error } = await supabase.auth.getUser();
  if (data.user) return true;
  if (error) return false;

  return false;
}
