/*
  # Criar tabela de rastreamento para Funnel-2 (Soulmate Map Quiz)

  ## Descrição
  Cria tabela step_views_funnel_2 para rastreamento de visualizações, respostas
  e eventos do quiz Soulmate Map com 10 etapas.

  ## 1. Nova Tabela
  
  ### `step_views_funnel_2`
  - `id` (uuid, primary key) - ID único do registro
  - `session_id` (text, not null) - Token único da sessão do usuário
  - `step_name` (text, not null) - Nome da etapa visualizada
  - `timestamp` (timestamptz) - Quando a visualização ocorreu
  - `user_agent` (text) - Informações do navegador
  - `ab_test_id` (uuid, nullable) - ID do teste A/B se aplicável
  
  ## 2. Segurança (RLS)
  - RLS habilitado
  - Acesso público para inserção (rastreamento anônimo)
  - Leitura restrita a usuários autenticados
  
  ## 3. Índices
  - Índice em session_id para consultas rápidas
  - Índice em timestamp para analytics por período
  - Índice em ab_test_id para análise de testes A/B
*/

-- Criar tabela de visualizações de etapas para funnel-2
CREATE TABLE IF NOT EXISTS step_views_funnel_2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  step_name text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  user_agent text,
  ab_test_id uuid REFERENCES ab_tests(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_2_session ON step_views_funnel_2(session_id);
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_2_timestamp ON step_views_funnel_2(timestamp);
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_2_ab_test ON step_views_funnel_2(ab_test_id);
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_2_step ON step_views_funnel_2(step_name);

-- Habilitar RLS
ALTER TABLE step_views_funnel_2 ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer um pode inserir visualizações (rastreamento anônimo)
CREATE POLICY "Permitir inserção pública de visualizações"
  ON step_views_funnel_2 FOR INSERT
  TO public
  WITH CHECK (true);

-- Política: Apenas usuários autenticados podem ler
CREATE POLICY "Usuários autenticados podem ler visualizações"
  ON step_views_funnel_2 FOR SELECT
  TO authenticated
  USING (true);
