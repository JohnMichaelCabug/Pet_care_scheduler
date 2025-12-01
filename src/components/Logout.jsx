import { supabase } from '../lib/supabaseClient';

async function handleLogout() {
  await supabase.auth.signOut();
  // navigate to /login if needed
}
