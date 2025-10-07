import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_Bolt_Database_URL
const supabaseAnonKey = import.meta.env.VITE_Bolt_Database_ANON_KEY

console.log('🔍 Environment Variables Check:', {
  url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING',
  key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING',
  nodeEnv: import.meta.env.NODE_ENV,
  mode: import.meta.env.MODE
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ CRITICAL: Supabase environment variables not configured!', {
    url: supabaseUrl ? 'SET' : 'MISSING',
    key: supabaseAnonKey ? 'SET' : 'MISSING',
    instructions: 'Please create a .env file in the root directory with VITE_Bolt_Database_URL and VITE_Bolt_Database_ANON_KEY'
  })
  console.error('📋 To fix this:')
  console.error('1. Go to your Supabase project dashboard')
  console.error('2. Navigate to Settings > API')
  console.error('3. Copy your Project URL and anon public key')
  console.error('4. Create a .env file in the root directory with:')
  console.error('   VITE_Bolt_Database_URL=your_project_url')
  console.error('   VITE_Bolt_Database_ANON_KEY=your_anon_key')
  console.error('5. Restart your development server')
}

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
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
    console.error('📋 Please check your .env file and ensure VITE_Bolt_Database_URL and VITE_Bolt_Database_ANON_KEY are set correctly')
    return false
  }

  try {
    console.log('🔄 Testing Supabase connection...', {
      url: supabaseUrl?.substring(0, 30) + '...',
      keyLength: supabaseAnonKey?.length
    })
    
    // First test: Simple select to check basic connectivity
    const { data, error } = await supabase
      .from('Funnel01')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message)
      console.error('🔍 Full error details:', error)
      if (error.message.includes('Invalid API key')) {
        console.error('🔑 API Key Error: Please verify your VITE_Bolt_Database_ANON_KEY in the .env file')
        console.error('📋 Get your anon key from: Supabase Dashboard > Settings > API > anon public')
      }
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.error('🗄️ Table Error: The Funnel01 table does not exist in your Supabase database')
      }
      if (error.message.includes('permission denied') || error.message.includes('RLS')) {
        console.error('🔒 RLS Policy Error: Row Level Security policies may be blocking access')
        console.error('📋 Check your RLS policies for the Funnel01 table')
      }
      return false
    }
    
    console.log('✅ Supabase connection successful', { recordsFound: data?.length || 0 })
    
    // Second test: Try to insert a test record to verify permissions
    console.log('🔄 Testing INSERT permissions...')
    const testData = {
      funnel_type: 'connection-test',
      utm_source: 'test',
      utm_medium: 'test',
      utm_campaign: 'test',
      current_step: 1,
      started_at: new Date().toISOString()
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('Funnel01')
      .insert([testData])
      .select()
      .single()
    
    if (insertError) {
      console.error('❌ INSERT permission test failed:', insertError.message)
      console.error('🔍 Full INSERT error:', insertError)
      if (insertError.message.includes('permission denied') || insertError.message.includes('RLS')) {
        console.error('🔒 RLS Policy Error: INSERT operations are blocked by Row Level Security')
        console.error('📋 You need to create an RLS policy that allows INSERT for anon users')
      }
      return false
    } else {
      console.log('✅ INSERT permissions working correctly', { testRecordId: insertData.id })
      
      // Clean up test record
      await supabase.from('Funnel01').delete().eq('id', insertData.id)
      console.log('🧹 Test record cleaned up')
    }
    
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message)
    console.error('🔍 Full connection error:', error)
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