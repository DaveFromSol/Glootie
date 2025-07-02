import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://gvbxordftidkpgxbbyhp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2YnhvcmRmdGlka3BneGJieWhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0ODEwODQsImV4cCI6MjA2NzA1NzA4NH0.5wX7AougtHwM9D8h--TZeLnPwJUzBq2Un6DL5j1lZfs"
);
