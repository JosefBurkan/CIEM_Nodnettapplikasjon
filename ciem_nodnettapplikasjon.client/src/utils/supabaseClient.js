import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vigjqzuqrnxapqxhkwds.supabase.co/';
const SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpZ2pxenVxcm54YXBxeGhrd2RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NzU2MjksImV4cCI6MjA1NzM1MTYyOX0.4vS7Yh-dgCEDacxGL8lz4Zp47lq28Xa3lfWV8NsiNyM';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
