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
    try {
      const { data: result, error } = await supabase
        .from('quiz_results')
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
        throw new Error(`Supabase error: ${error.message}`)
      }

      console.log('✅ Quiz result created in Supabase:', result.id)
      return result
    } catch (error) {
      console.error('❌ Error creating quiz result in Supabase:', error)
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
    try {
      const updateData = {
        ...data,
        updated_at: new Date().toISOString()
      }

      const { data: result, error } = await supabase
        .from('quiz_results')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(`Supabase error: ${error.message}`)
      }

      console.log('✅ Quiz result updated in Supabase:', id)
      return result
    } catch (error) {
      console.error('❌ Error updating quiz result in Supabase:', error)
      throw error
    }
  },

  /**
   * Get quiz result by ID
   * @param {string} id - The quiz result ID
   * @returns {Promise} - Promise that resolves with the quiz result
   */
  async getById(id) {
    try {
      const { data: result, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw new Error(`Supabase error: ${error.message}`)
      }

      return result
    } catch (error) {
      console.error('❌ Error fetching quiz result from Supabase:', error)
      throw error
    }
  },

  /**
   * Get all quiz results with optional filtering
   * @param {object} filters - Optional filters
   * @returns {Promise} - Promise that resolves with quiz results array
   */
  async getAll(filters = {}) {
    try {
      let query = supabase.from('quiz_results').select('*')

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
        throw new Error(`Supabase error: ${error.message}`)
      }

      return results || []
    } catch (error) {
      console.error('❌ Error fetching quiz results from Supabase:', error)
      throw error
    }
  }
}