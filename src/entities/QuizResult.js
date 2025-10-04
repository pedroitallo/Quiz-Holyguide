/**
 * QuizResult Entity - Base44 Backend
 *
 * Legacy entity for compatibility with existing Base44 integrations.
 * Used by HybridQuizResult for dual backend support.
 */

const BASE_URL = 'https://base44-production.up.railway.app';

export const QuizResult = {
  async create(data) {
    try {
      const response = await fetch(`${BASE_URL}/api/quiz-results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating quiz result in Base44:', error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const response = await fetch(`${BASE_URL}/api/quiz-results/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating quiz result in Base44:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await fetch(`${BASE_URL}/api/quiz-results/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching quiz result from Base44:', error);
      throw error;
    }
  }
};
