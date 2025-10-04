/**
 * QuizResult Entity
 * 
 * Handles interactions with the Base44 API for quiz result records.
 * This entity provides methods to create and update quiz results.
 */

const API_BASE_URL = import.meta.env.VITE_BASE44_API_URL;
const APP_ID = import.meta.env.VITE_BASE44_APP_ID;

export const QuizResult = {
  /**
   * Update a quiz result record
   * @param {string} id - The quiz result ID
   * @param {object} data - The data to update
   * @returns {Promise} - Promise that resolves with the updated record
   */
  async update(id, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/apps/${APP_ID}/records/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating quiz result:', error);
      throw error;
    }
  },

  /**
   * Create a new quiz result record
   * @param {object} data - The quiz result data
   * @returns {Promise} - Promise that resolves with the created record
   */
  async create(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/apps/${APP_ID}/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating quiz result:', error);
      throw error;
    }
  }
};