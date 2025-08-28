import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ CRITICAL: Supabase environment variables not configured!', {
    url: supabaseUrl ? 'SET' : 'MISSING',
    key: supabaseAnonKey ? 'SET' : 'MISSING',
    instructions: 'Please create a .env file in the root directory with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  })
  console.error('📋 To fix this:')
  console.error('1. Go to your Supabase project dashboard')
  console.error('2. Navigate to Settings > API')
  console.error('3. Copy your Project URL and anon public key')
  console.error('4. Create a .env file in the root directory with:')
  console.error('   VITE_SUPABASE_URL=your_project_url')
  console.error('   VITE_SUPABASE_ANON_KEY=your_anon_key')
  console.error('5. Restart your development server')
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
    console.error('❌ Supabase client not initialized - environment variables missing or invalid')
    console.error('📋 Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set correctly')
    return false
  }

  try {
    console.log('🔄 Testing Supabase connection...', {
      url: supabaseUrl?.substring(0, 30) + '...',
      keyLength: supabaseAnonKey?.length
    })
    const { data, error } = await supabase
      .from('Funnel01')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message)
      if (error.message.includes('Invalid API key')) {
        console.error('🔑 API Key Error: Please verify your VITE_SUPABASE_ANON_KEY in the .env file')
        console.error('📋 Get your anon key from: Supabase Dashboard > Settings > API > anon public')
      }
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.error('🗄️ Table Error: The Funnel01 table does not exist in your Supabase database')
      }
      return false
    }
    
    console.log('✅ Supabase connection successful', { recordsFound: data?.length || 0 })
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message)
    if (error.message.includes('fetch')) {
      console.error('🌐 Network Error: Check your internet connection and Supabase URL')
    }
    return false
  }
}

// Initialize connection test on module load
if (typeof window !== 'undefined') {
  testSupabaseConnection()
}