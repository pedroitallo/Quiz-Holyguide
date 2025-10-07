/*
  # Populate funnels table with existing funnels

  1. Purpose
    - Popula a tabela funnels com os funis já existentes no código
    - Permite que eles sejam gerenciados via admin panel

  2. Notes
    - Usa INSERT ... ON CONFLICT para evitar duplicatas
    - Todos os funis começam como 'active'
*/

-- Insert existing funnels
INSERT INTO funnels (name, slug, description, status, tags, config) VALUES
  ('Funnel 1', 'funnel-1', 'Funil com vídeo inicial', 'active', ARRAY['vídeo', 'quiz'], '{}'::jsonb),
  ('Funnel TT', 'funnel-tt', 'Funil TikTok', 'active', ARRAY['tiktok', 'vídeo'], '{}'::jsonb),
  ('Funnel VSL', 'funnel-vsl', 'Funil Video Sales Letter', 'active', ARRAY['vsl', 'vídeo'], '{}'::jsonb),
  ('Funnel ESP', 'funnelesp', 'Funil em Espanhol', 'active', ARRAY['espanhol', 'internacional'], '{}'::jsonb),
  ('Funil Star 2', 'funnel-star2', 'Funil Star variação 2', 'active', ARRAY['star', 'quiz'], '{}'::jsonb),
  ('Funil Star 3', 'funnel-star3', 'Funil Star variação 3', 'active', ARRAY['star', 'quiz'], '{}'::jsonb),
  ('Funil Star 4', 'funnel-star4', 'Funil Star variação 4', 'active', ARRAY['star', 'quiz'], '{}'::jsonb),
  ('Funil Star 5', 'funnel-star5', 'Funil Star variação 5', 'active', ARRAY['star', 'quiz'], '{}'::jsonb),
  ('Funnel Chat 1', 'funnel-chat1', 'Funil com interface de chat', 'active', ARRAY['chat', 'interativo'], '{}'::jsonb)
ON CONFLICT (slug) DO NOTHING;
