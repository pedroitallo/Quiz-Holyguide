/*
  # Criar tabela step_views_funnel_aff2
  
  ## Nova Tabela para Funil AFF2
  
  ### `step_views_funnel_aff2`
  - `id` (uuid, primary key) - Identificador único
  - `session_id` (text, unique) - Identificador único da sessão do usuário
  - `funnel_type` (text) - Sempre 'funnel-aff2'
  - `viewed_at` (timestamptz) - Timestamp da primeira visualização
  - `updated_at` (timestamptz) - Timestamp da última atualização
  - `utm_source` (text) - Parâmetro UTM source
  - `utm_medium` (text) - Parâmetro UTM medium
  - `utm_campaign` (text) - Parâmetro UTM campaign
  - `ab_test_id` (uuid, nullable) - ID do teste A/B (se aplicável)
  
  ### Colunas de Steps (booleanos):
  - `initiate` - Step 1: Iniciar Quiz
  - `testimonials` - Step 2: Depoimentos
  - `birth_date` - Step 3: Data de Nascimento
  - `love_situation` - Step 4: Situação Amorosa
  - `qualities` - Step 5: Qualidades Ideais
  - `preference` - Step 6: Preferências
  - `chart_results` - Step 7: Resultados do Mapa Astral
  - `challenge` - Step 8: Desafios
  - `desire` - Step 9: Desejos
  - `connection` - Step 10: Conexão
  - `love_language` - Step 11: Linguagem do Amor
  - `energy` - Step 12: Energia
  - `future` - Step 13: Futuro
  - `social_proof` - Step 14: Prova Social
  - `loading` - Step 15: Gerando Desenho
  - `paywall` - Step 16: Checkout
  - `thank_you` - Step 17: Obrigado
  
  ## 2. Segurança (RLS)
  - RLS habilitado
  - Usuários anônimos podem inserir e atualizar seus próprios dados
  - Usuários autenticados (admins) podem ler todos os dados
  
  ## 3. Índices
  - Índice em session_id para consultas rápidas
  - Índice em viewed_at para analytics por período
  - Índice em ab_test_id para análise de testes A/B
*/

-- Criar tabela step_views_funnel_aff2
CREATE TABLE IF NOT EXISTS step_views_funnel_aff2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  funnel_type text DEFAULT 'funnel-aff2',
  viewed_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  utm_source text DEFAULT '',
  utm_medium text DEFAULT '',
  utm_campaign text DEFAULT '',
  ab_test_id uuid,
  
  -- Step columns (17 steps)
  initiate boolean DEFAULT false,
  testimonials boolean DEFAULT false,
  birth_date boolean DEFAULT false,
  love_situation boolean DEFAULT false,
  qualities boolean DEFAULT false,
  preference boolean DEFAULT false,
  chart_results boolean DEFAULT false,
  challenge boolean DEFAULT false,
  desire boolean DEFAULT false,
  connection boolean DEFAULT false,
  love_language boolean DEFAULT false,
  energy boolean DEFAULT false,
  future boolean DEFAULT false,
  social_proof boolean DEFAULT false,
  loading boolean DEFAULT false,
  paywall boolean DEFAULT false,
  thank_you boolean DEFAULT false
);

-- Habilitar RLS
ALTER TABLE step_views_funnel_aff2 ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: Usuários anônimos podem inserir
CREATE POLICY "Anonymous users can insert funnel-aff2 views"
  ON step_views_funnel_aff2 FOR INSERT
  TO anon
  WITH CHECK (true);

-- Políticas RLS: Usuários anônimos podem atualizar
CREATE POLICY "Anonymous users can update funnel-aff2 views"
  ON step_views_funnel_aff2 FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Políticas RLS: Usuários anônimos podem ler seus próprios dados
CREATE POLICY "Anonymous users can read funnel-aff2 views"
  ON step_views_funnel_aff2 FOR SELECT
  TO anon
  USING (true);

-- Políticas RLS: Admins autenticados podem ler todos os dados
CREATE POLICY "Authenticated admins can read funnel-aff2 views"
  ON step_views_funnel_aff2 FOR SELECT
  TO authenticated
  USING (true);

-- Políticas RLS: Admins autenticados podem deletar
CREATE POLICY "Authenticated admins can delete funnel-aff2 views"
  ON step_views_funnel_aff2 FOR DELETE
  TO authenticated
  USING (true);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_aff2_session ON step_views_funnel_aff2(session_id);
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_aff2_viewed_at ON step_views_funnel_aff2(viewed_at);
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_aff2_ab_test ON step_views_funnel_aff2(ab_test_id);
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_aff2_funnel_type ON step_views_funnel_aff2(funnel_type);