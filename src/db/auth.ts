import { supabase } from "./supabase";
import type { Provider, UserIdentity } from "@supabase/supabase-js";

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
      emailRedirectTo: `${window.location.origin}/pages`,
    },
  });
  return { data, error };
}

export async function resendVerificationEmail(email: string) {
  const { data, error } = await supabase.auth.resend({
    type: "signup",
    email: email,
    options: {
      emailRedirectTo: `${window.location.origin}/pages`,
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

export async function updatePassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: password,
  });
  return { data, error };
}

export async function sendPasswordReset(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/update-password`,
  });
  return { data, error };
}

export async function signInWithOAuth(provider: Provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: `${window.location.origin}/pages`,
    },
  });
  return { data, error };
}

export async function getUserIdentities() {
  const { data, error } = await supabase.auth.getUserIdentities();
  return { data, error };
}

export async function linkIdentity(provider: Provider) {
  const { data, error } = await supabase.auth.linkIdentity({
    provider: provider,
    options: {
      redirectTo: `${window.location.origin}/profile`,
    },
  });
  return { data, error };
}

export async function unlinkIdentity(identity: UserIdentity) {
  const { data, error } = await supabase.auth.unlinkIdentity(identity);
  return { data, error };
}
