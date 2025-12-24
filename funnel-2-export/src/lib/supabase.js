import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_Bolt_Database_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_Bolt_Database_ANON_KEY

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
      'x-client-info': 'appyon-quiz@1.0.0'
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
      .from('funnels')
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
        console.error('🗄️ Table Error: The funnels table does not exist in your Supabase database')
      }
      if (error.message.includes('permission denied') || error.message.includes('RLS')) {
        console.error('🔒 RLS Policy Error: Row Level Security policies may be blocking access')
        console.error('📋 Check your RLS policies for the funnels table')
      }
      return false
    }

    console.log('✅ Supabase connection successful', { recordsFound: data?.length || 0 })
    
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

// Storage helper functions
export const storage = {
  BUCKET_NAME: 'user-uploads',

  async uploadFile(file, folder = 'images') {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!file) {
      throw new Error('No file provided')
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      throw error
    }

    return {
      path: data.path,
      fullPath: data.fullPath,
      url: this.getPublicUrl(data.path)
    }
  },

  async uploadMultiple(files, folder = 'images') {
    if (!Array.isArray(files)) {
      throw new Error('Files must be an array')
    }

    const uploadPromises = files.map(file => this.uploadFile(file, folder))
    return Promise.all(uploadPromises)
  },

  getPublicUrl(path) {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    const { data } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(path)

    return data.publicUrl
  },

  async deleteFile(path) {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .remove([path])

    if (error) {
      console.error('Delete error:', error)
      throw error
    }

    return data
  },

  async deleteMultiple(paths) {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    if (!Array.isArray(paths)) {
      throw new Error('Paths must be an array')
    }

    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .remove(paths)

    if (error) {
      console.error('Delete multiple error:', error)
      throw error
    }

    return data
  },

  async listFiles(folder = '') {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (error) {
      console.error('List files error:', error)
      throw error
    }

    return data.map(file => ({
      ...file,
      url: this.getPublicUrl(`${folder}${folder ? '/' : ''}${file.name}`)
    }))
  }
}