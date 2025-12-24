/**
 * HybridQuizResult Entity
 * 
 * Handles quiz result storage with dual backend support:
 * - Primary: Supabase (for analytics and dashboard)
 * - Secondary: Base44 (for existing integrations)
 * 
 * This ensures data redundancy and maintains compatibility with existing systems.
 */

import { SupabaseQuizResult } from './SupabaseQuizResult'
import { QuizResult as Base44QuizResult } from './QuizResult'

export const HybridQuizResult = {
  /**
   * Create a new quiz result in both Supabase and Base44
   * @param {object} data - The quiz result data
   * @returns {Promise} - Promise that resolves with the Supabase record (primary)
   */
  async create(data) {
    console.log('🚀 HybridQuizResult.create called with:', data)
    console.log('🔍 Environment check:', {
      supabaseUrl: import.meta.env.VITE_Bolt_Database_URL ? 'SET' : 'MISSING',
      supabaseKey: import.meta.env.VITE_Bolt_Database_ANON_KEY ? 'SET' : 'MISSING'
    })
    
    let supabaseResult = null
    let base44Result = null

    try {
      // Try Supabase first (primary storage)
      console.log('🔄 Attempting Supabase create...')
      supabaseResult = await SupabaseQuizResult.create(data)
      console.log('✅ Quiz result created in Supabase:', supabaseResult.id)
    } catch (supabaseError) {
      console.error('❌ CRITICAL: Failed to create in Supabase:', supabaseError.message, supabaseError)
      console.error('🔍 Supabase error stack:', supabaseError.stack)
      // Don't continue if Supabase fails - this is critical
      throw new Error(`Supabase creation failed: ${supabaseError.message}`)
    }

    try {
      // Try Base44 second (secondary storage)
      console.log('🔄 Attempting Base44 create...')
      base44Result = await Base44QuizResult.create(data)
      console.log('✅ Quiz result created in Base44:', base44Result.id)
    } catch (base44Error) {
      console.warn('⚠️ Failed to create in Base44:', base44Error.message)
      // Base44 failure is not critical, continue with Supabase result
    }

    // Return the primary result (Supabase) or fallback to Base44
    if (supabaseResult) {
      console.log('✅ HybridQuizResult.create successful:', supabaseResult.id)
      return { ...supabaseResult, base44_id: base44Result?.id }
    } else if (base44Result) {
      console.log('⚠️ Using Base44 fallback result:', base44Result.id)
      return { ...base44Result, source: 'base44' }
    } else {
      const error = new Error('CRITICAL: Failed to create quiz result in both Supabase and Base44')
      console.error('❌', error.message)
      throw error
    }
  },

  /**
   * Update a quiz result in both systems
   * @param {string} id - The quiz result ID
   * @param {object} data - The data to update
   * @param {string} base44Id - Optional Base44 ID for dual updates
   * @returns {Promise} - Promise that resolves with the updated record
   */
  async update(id, data, base44Id = null) {
    console.log('🔄 HybridQuizResult.update called:', { id, data, base44Id })
    
    const promises = []

    // Update in Supabase if we have a Supabase ID
    if (id && id !== 'offline-mode' && id !== 'admin-mode' && id !== 'bot-mode') {
      console.log('🔄 Adding Supabase update to promises...')
      promises.push(
        SupabaseQuizResult.update(id, data).catch(error => {
          console.error('❌ Failed to update in Supabase:', error.message, error)
          return null
        })
      )
    }

    // Update in Base44 if we have a Base44 ID
    if (base44Id && base44Id !== 'offline-mode' && base44Id !== 'admin-mode' && base44Id !== 'bot-mode') {
      console.log('🔄 Adding Base44 update to promises...')
      promises.push(
        Base44QuizResult.update(base44Id, data).catch(error => {
          console.warn('⚠️ Failed to update in Base44:', error.message)
          return null
        })
      )
    }

    if (promises.length === 0) {
      console.warn('⚠️ No valid IDs provided for update')
      return null
    }

    try {
      const results = await Promise.allSettled(promises)
      const successfulResults = results
        .filter(result => result.status === 'fulfilled' && result.value)
        .map(result => result.value)

      if (successfulResults.length > 0) {
        console.log(`✅ Quiz result updated in ${successfulResults.length} system(s)`)
        return successfulResults[0] // Return the first successful result
      } else {
        console.error('❌ CRITICAL: No systems were successfully updated')
        return null
      }
    } catch (error) {
      console.error('❌ Error in hybrid update:', error)
      throw error
    }
  },

  /**
   * Get quiz result from Supabase (primary) with Base44 fallback
   * @param {string} id - The quiz result ID
   * @returns {Promise} - Promise that resolves with the quiz result
   */
  async getById(id) {
    try {
      // Try Supabase first
      return await SupabaseQuizResult.getById(id)
    } catch (supabaseError) {
      console.warn('⚠️ Failed to fetch from Supabase, trying Base44:', supabaseError.message)
      
      try {
        // Fallback to Base44 (though Base44 doesn't have a getById method in the original code)
        throw new Error('Base44 getById not implemented')
      } catch (base44Error) {
        console.error('❌ Failed to fetch from both systems')
        throw new Error('Quiz result not found in any system')
      }
    }
  }
}