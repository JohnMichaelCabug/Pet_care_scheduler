import { createClient } from "@supabase/supabase-js";


// Replace these with your actual Supabase values
const SUPABASE_URL = "https://zeflvksjyhyykmleosmw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplZmx2a3NqeWh5eWttbGVvc213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4OTU1NjQsImV4cCI6MjA3NzQ3MTU2NH0.tyb07Vew3h5oZzjU2wEJRB31YZJCbq-zp2HQ6BMAN4o";

// Create a single supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
