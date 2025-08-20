import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Get configuration from environment variables
const BASE44_APP_ID = import.meta.env.VITE_BASE44_APP_ID || "68850befb229de9dd8e4dc73";

// Create a client with authentication required
export const base44 = createClient({
  appId: BASE44_APP_ID, 
  requiresAuth: true // Ensure authentication is required for all operations
});
