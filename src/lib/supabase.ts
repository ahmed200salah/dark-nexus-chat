import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ahrjjymgziwyicttzhvb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFocmpqeW1neml3eWljdHR6aHZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTU3ODksImV4cCI6MjA3NTU3MTc4OX0.VgMo2XeXAWJOGYlPAf-HHK4NKatAk5CzSWTNzLTagiI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
