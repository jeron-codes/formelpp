// ============================================================
//  Supabase Konfiguration
//
//  1. Gehe zu https://supabase.com → neues Projekt erstellen
//  2. Settings → API → URL und anon public key kopieren
//  3. Beide Werte hier eintragen und Datei speichern
// ============================================================

const SUPABASE_URL      = 'https://arkwbrcpysseaentrdeg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFya3dicmNweXNzZWFlbnRyZGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3Mjk4OTAsImV4cCI6MjA5NTMwNTg5MH0.u-1omFy15krPw0h5dyai_dE3uH7FnSxa91guoTppVXQ';

// Admin-E-Mail: diese Person kann eingereichte Formeln bestätigen
const ADMIN_EMAIL    = '';  // lokal mit echter E-Mail ersetzen, nicht committen

// Supabase-Client (wird von supabase.js via CDN bereitgestellt)
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
