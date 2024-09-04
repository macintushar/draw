import { supabase } from "./supabase";

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  return { data, error };
}

export async function signUp(name: string, email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        name: name,
      },
    },
  });
  return { data, error };
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  return { error };
}

export async function getLocalUser() {
  const { data, error } = await supabase.auth.getSession();

  return { data, error };
}

export async function getUser() {
  const { data, error } = await supabase.auth.getUser();

  return { data, error };
}

export async function updateUser(name: string, email: string) {
  const { data, error } = await supabase.auth.updateUser({
    email: email,
    data: {
      name: name,
    },
  });
  return { data, error };
}
