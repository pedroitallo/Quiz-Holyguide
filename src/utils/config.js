// Configurações da aplicação baseadas em variáveis de ambiente

export const config = {
  // URLs base para APIs e recursos
  base44ApiUrl: import.meta.env.VITE_BASE44_API_URL || 'https://base44.app/api',
  base44FilesUrl: import.meta.env.VITE_BASE44_FILES_URL || 'https://base44.app/api/apps/68850befb229de9dd8e4dc73/files',
  supabaseBaseUrl: import.meta.env.VITE_SUPABASE_BASE_URL || 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public',
  
  // ID da aplicação
  appId: import.meta.env.VITE_BASE44_APP_ID || '68850befb229de9dd8e4dc73',
  
  // Ambiente
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
};

// Utilitários para construir URLs
export const getImageUrl = (filename) => {
  // Se for uma URL completa, retorna como está
  if (filename.startsWith('http')) {
    return filename;
  }
  
  // Se contém supabase na URL atual, usa supabase
  if (filename.includes('supabase')) {
    return filename;
  }
  
  // Senão, constrói a URL usando o Base44
  return `${config.base44FilesUrl}/${filename}`;
};

export const getSupabaseImageUrl = (filename) => {
  return `${config.supabaseBaseUrl}/${filename}`;
};

export default config;
