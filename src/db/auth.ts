import supabase from ".";

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
