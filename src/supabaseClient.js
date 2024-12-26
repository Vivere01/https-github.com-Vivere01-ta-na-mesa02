import { createClient } from '@supabase/supabase-js';

    // Informações do Supabase
    const SUPABASE_URL = 'https://zkcoonhynkogmtqozvxt.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprY29vbmh5bmtvZ210cW96dnh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwNjE3NDksImV4cCI6MjA1MDYzNzc0OX0.n72ANJFbacw3dHEY4uFnildo1fqY2ma3antN6VJCLwg';

    // Inicializa o cliente do Supabase
    export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
