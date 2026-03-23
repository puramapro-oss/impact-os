import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hcakyfhrucyovdxvmnrr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjYWt5ZmhydWN5b3ZkeHZtbnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyOTAzNTAsImV4cCI6MjA4OTg2NjM1MH0.rcpauIpjR7BWppWQktrgtet0cI-TOBcP5FOgOGEflGU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
