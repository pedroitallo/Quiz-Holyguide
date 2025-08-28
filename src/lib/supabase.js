import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ CRITICAL: Supabase environment variables not found!', {
    url: supabaseUrl ? 'SET' : 'MISSING',
    key: supabaseAnonKey ? 'SET' : 'MISSING'
  })
}

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-client-info': 'holymind-quiz@1.0.0'
    }
  }
}) : null

// Test connection function
export const testSupabaseConnection = async () => {
  if (!supabase) {
    console.error('❌ Supabase client not initialized - missing environment variables')
    return false
  }

  try {
    console.log('🔄 Testing Supabase connection...')
    const { data, error } = await supabase
      .from('Funnel01')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error)
      return false
    }
    
    console.log('✅ Supabase connection successful', { recordsFound: data?.length || 0 })
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message, error)
    return false
  }
}

// Initialize connection test on module load
if (typeof window !== 'undefined') {
  testSupabaseConnection()
}