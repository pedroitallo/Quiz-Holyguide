/*
  # Adicionar política de SELECT para usuários anônimos no funnel-2

  ## Problema
  A tabela step_views_funnel_2 só permite SELECT para usuários authenticated,
  mas o Analytics Dashboard precisa que usuários anônimos (usando anon key)
  também possam ler os dados.

  ## Solução
  Adicionar política RLS permitindo que usuários anônimos façam SELECT na tabela.

  ## Segurança
  - Mantém RLS habilitado
  - Permite leitura pública dos dados de analytics (sem informações sensíveis)
  - Mantém restrição de INSERT/UPDATE apenas para sessões próprias
*/

-- Adicionar política para permitir que usuários anônimos leiam dados
CREATE POLICY "Anonymous users can read funnel-2 views"
  ON step_views_funnel_2 FOR SELECT
  TO anon
  USING (true);