const supabaseUrl = 'https://bcivsvuzvjjajmfrahuf.supabase.co';
const supabaseAnonKey = 'sb_publishable_PFZ4zVL-PyvKq3UVIfS6jQ_msLbxVUc';

// create variable to store client globally
let supabaseClient = null;

// return supabase client object
export function getSupabaseClient() {
    if (!supabaseClient) {
        supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);
    }
    return supabaseClient;
}

