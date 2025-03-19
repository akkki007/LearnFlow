const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://zuczgiyugmokivectvrc.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1Y3pnaXl1Z21va2l2ZWN0dnJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwMjU2NDksImV4cCI6MjA1NDYwMTY0OX0.RAl_qrjwlKbW2fEllIx2MbyV-T_cAptY8mkMOjVUJ9A";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
