import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let parsedUrl = supabaseUrl ? supabaseUrl.trim() : '';

// Remove accidental leading colon or quotes some users occasionally paste
if (parsedUrl.startsWith(':')) parsedUrl = parsedUrl.substring(1);
parsedUrl = parsedUrl.replace(/^["']/, '').replace(/["']$/, '');

// If they included /rest/v1, typically Supabase just wants the origin URL
if (parsedUrl.includes('/rest/v1')) {
  parsedUrl = parsedUrl.split('/rest/v1')[0];
}

if (parsedUrl && !parsedUrl.startsWith('http')) {
  // If they just entered the project ID, format it
  if (parsedUrl.includes('.')) {
    parsedUrl = `https://${parsedUrl}`;
  } else {
    parsedUrl = `https://${parsedUrl}.supabase.co`;
  }
}

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

let client = null;
try {
  console.log("Supabase URL var:", supabaseUrl ? "Present" : "Missing");
  console.log("Parsed URL:", parsedUrl);
  console.log("Supabase Key:", supabaseAnonKey ? "Present" : "Missing");
  
  if (parsedUrl && supabaseAnonKey && isValidUrl(parsedUrl)) {
    client = createClient(parsedUrl, supabaseAnonKey);
  } else {
    console.log("Supabase initialization skipped. isValidUrl:", isValidUrl(parsedUrl));
  }
} catch (e) {
  console.error("Failed to initialize Supabase client", e);
}

export const supabase = client;
