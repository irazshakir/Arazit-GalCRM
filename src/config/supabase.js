import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zsevtdxpifiamnmbevci.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZXZ0ZHhwaWZpYW1ubWJldmNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NDAyMjcsImV4cCI6MjA1MTIxNjIyN30.ni1n9MP5Kf7zvKejiHmNtJ3ml-m35xrmY4MFBS3EgxM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
