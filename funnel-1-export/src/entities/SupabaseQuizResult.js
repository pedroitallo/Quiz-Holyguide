/**
 * SupabaseQuizResult Entity
 * 
 * Handles interactions with Supabase for quiz result records.
 * This entity provides methods to create and update quiz results in Supabase.
 */

import { supabase } from '@/lib/supabase'

export const SupabaseQuizResult = {
  /**
   * Create a new quiz result record in Supabase
   * @param {object} data - The quiz result data
   * @returns {Promise} - Promise that resolves with the created record
   */
  async create(data) {
    if (!supabase) {
      throw new Error('Supabase client not initialized - check environment variables')
    }

    try {
      console.log('🔄 Creating quiz result in Supabase...', data)
      console.log('🔍 Supabase client status:', { 
        clientExists: !!supabase,
        url: supabase?.supabaseUrl?.substring(0, 30) + '...',
        keyExists: !!supabase?.supabaseKey
      })
      
      const { data: result, error } = await supabase
        .from('Funnel01')
        .insert([{
          funnel_type: data.funnel_type || '',
          utm_source: data.utm_source || 'direct',
          utm_medium: data.utm_medium || 'organic',
          utm_campaign: data.utm_campaign || 'none',
          src: data.src || '',
          current_step: data.current_step || 1,
          started_at: data.started_at || new Date().toISOString()
        }])
        .select()
        .single()

      if (error) {
        console.error('❌ Supabase INSERT error:', error)
        console.error('🔍 Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        throw new Error(`Supabase INSERT error: ${error.message} (Code: ${error.code})`)
      }

      console.log('✅ Quiz result created in Supabase:', result.id, result)
      return result
    } catch (error) {
      console.error('❌ Error creating quiz result in Supabase:', error.message, error)
      throw error
    }
  },

  /**
   * Update a quiz result record in Supabase
   * @param {string} id - The quiz result ID
   * @param {object} data - The data to update
   * @returns {Promise} - Promise that resolves with the updated record
   */
  async update(id, data) {
    if (!supabase) {
      throw new Error('Supabase client not initialized - check environment variables')
    }

    try {
      console.log('🔄 Updating quiz result in Supabase:', id, data)
      
      const updateData = {
        ...data,
        updated_at: new Date().toISOString()
      }

      const { data: result, error } = await supabase
        .from('Funnel01')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('❌ Supabase UPDATE error:', error)
        throw new Error(`Supabase UPDATE error: ${error.message} (Code: ${error.code})`)
      }

      console.log('✅ Quiz result updated in Supabase:', id, result)
      return result
    } catch (error) {
      console.error('❌ Error updating quiz result in Supabase:', error.message, error)
      throw error
    }
  },

  /**
   * Get quiz result by ID
   * @param {string} id - The quiz result ID
   * @returns {Promise} - Promise that resolves with the quiz result
   */
  async getById(id) {
    if (!supabase) {
      throw new Error('Supabase client not initialized - check environment variables')
    }

    try {
      const { data: result, error } = await supabase
        .from('Funnel01')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw new Error(`Supabase SELECT error: ${error.message} (Code: ${error.code})`)
      }

      return result
    } catch (error) {
      console.error('❌ Error fetching quiz result from Supabase:', error.message, error)
      throw error
    }
  },

  /**
   * Get all quiz results with optional filtering
   * @param {object} filters - Optional filters
   * @returns {Promise} - Promise that resolves with quiz results array
   */
  async getAll(filters = {}) {
    if (!supabase) {
      throw new Error('Supabase client not initialized - check environment variables')
    }

    try {
      let query = supabase.from('Funnel01').select('*')

      // Apply filters
      if (filters.funnel_type) {
        query = query.eq('funnel_type', filters.funnel_type)
      }
      if (filters.current_step) {
        query = query.eq('current_step', filters.current_step)
      }
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from)
      }
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to)
      }

      // Order by creation date (newest first)
      query = query.order('created_at', { ascending: false })

      const { data: results, error } = await query

      if (error) {
        throw new Error(`Supabase SELECT error: ${error.message} (Code: ${error.code})`)
      }

      return results || []
    } catch (error) {
      console.error('❌ Error fetching quiz results from Supabase:', error.message, error)
      throw error
    }
  }
}