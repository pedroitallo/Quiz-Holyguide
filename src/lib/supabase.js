import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Using offline mode.')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: false // We don't need user sessions for this use case
  }
})

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('Funnel01').select('count').limit(1)
    if (error) throw error
    console.log('✅ Supabase connection successful')
    return true
  } catch (error) {
    console.warn('❌ Supabase connection failed:', error.message)
    return false
  }
}