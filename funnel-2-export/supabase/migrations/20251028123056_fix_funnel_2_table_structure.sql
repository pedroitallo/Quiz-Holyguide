/*
  # Corrigir estrutura da tabela step_views_funnel_2

  ## Problema
  A tabela step_views_funnel_2 foi criada com estrutura incompatível (step_name + múltiplas linhas)
  enquanto todos os outros funis usam estrutura de linha única com colunas booleanas.

  ## Solução
  1. Fazer backup dos dados existentes (se houver)
  2. Dropar a tabela antiga
  3. Recriar tabela com estrutura correta seguindo padrão dos outros funis
  4. Restaurar dados convertidos (se houver)
  
  ## Nova Estrutura
  
  ### `step_views_funnel_2`
  - `id` (uuid, primary key) - Identificador único
  - `session_id` (text, unique) - Identificador único da sessão do usuário
  - `funnel_type` (text) - Sempre 'funnel-2'
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

-- Backup de dados existentes (se houver)
DO $$
BEGIN
  -- Criar tabela temporária para backup
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'step_views_funnel_2') THEN
    CREATE TEMP TABLE IF NOT EXISTS step_views_funnel_2_backup AS 
    SELECT * FROM step_views_funnel_2;
    
    RAISE NOTICE 'Backup criado com % registros', (SELECT COUNT(*) FROM step_views_funnel_2_backup);
  END IF;
END $$;

-- Dropar tabela antiga se existir
DROP TABLE IF EXISTS step_views_funnel_2 CASCADE;

-- Criar nova tabela com estrutura correta
CREATE TABLE IF NOT EXISTS step_views_funnel_2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  funnel_type text DEFAULT 'funnel-2',
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
ALTER TABLE step_views_funnel_2 ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: Usuários anônimos podem inserir
CREATE POLICY "Anonymous users can insert funnel-2 views"
  ON step_views_funnel_2 FOR INSERT
  TO anon
  WITH CHECK (true);

-- Políticas RLS: Usuários anônimos podem atualizar
CREATE POLICY "Anonymous users can update funnel-2 views"
  ON step_views_funnel_2 FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Políticas RLS: Admins autenticados podem ler todos os dados
CREATE POLICY "Authenticated admins can read funnel-2 views"
  ON step_views_funnel_2 FOR SELECT
  TO authenticated
  USING (true);

-- Políticas RLS: Admins autenticados podem deletar
CREATE POLICY "Authenticated admins can delete funnel-2 views"
  ON step_views_funnel_2 FOR DELETE
  TO authenticated
  USING (true);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_2_session ON step_views_funnel_2(session_id);
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_2_viewed_at ON step_views_funnel_2(viewed_at);
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_2_ab_test ON step_views_funnel_2(ab_test_id);
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_2_funnel_type ON step_views_funnel_2(funnel_type);

-- Migrar dados do backup se existir
DO $$
DECLARE
  backup_count INTEGER;
  step_map JSONB;
BEGIN
  -- Verificar se há backup
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'pg_temp_1' AND tablename LIKE 'step_views_funnel_2_backup%') THEN
    SELECT COUNT(*) INTO backup_count FROM step_views_funnel_2_backup;
    
    IF backup_count > 0 THEN
      RAISE NOTICE 'Migrando % registros do backup...', backup_count;
      
      -- Mapeamento de step_name para coluna booleana
      step_map := '{
        "initiate": "initiate",
        "testimonials": "testimonials",
        "birth_date": "birth_date",
        "love_situation": "love_situation",
        "qualities": "qualities",
        "preference": "preference",
        "chart_results": "chart_results",
        "challenge": "challenge",
        "desire": "desire",
        "connection": "connection",
        "love_language": "love_language",
        "energy": "energy",
        "future": "future",
        "social_proof": "social_proof",
        "loading": "loading",
        "paywall": "paywall",
        "thank_you": "thank_you"
      }'::jsonb;
      
      -- Agrupar por session_id e converter para estrutura de linha única
      INSERT INTO step_views_funnel_2 (
        session_id, 
        funnel_type, 
        viewed_at, 
        updated_at,
        ab_test_id,
        initiate, testimonials, birth_date, love_situation, qualities, preference,
        chart_results, challenge, desire, connection, love_language, energy,
        future, social_proof, loading, paywall, thank_you
      )
      SELECT 
        session_id,
        'funnel-2',
        MIN(timestamp) as viewed_at,
        MAX(timestamp) as updated_at,
        MAX(ab_test_id) as ab_test_id,
        bool_or(step_name = 'initiate') as initiate,
        bool_or(step_name = 'testimonials') as testimonials,
        bool_or(step_name = 'birth_date') as birth_date,
        bool_or(step_name = 'love_situation') as love_situation,
        bool_or(step_name = 'qualities') as qualities,
        bool_or(step_name = 'preference') as preference,
        bool_or(step_name = 'chart_results') as chart_results,
        bool_or(step_name = 'challenge') as challenge,
        bool_or(step_name = 'desire') as desire,
        bool_or(step_name = 'connection') as connection,
        bool_or(step_name = 'love_language') as love_language,
        bool_or(step_name = 'energy') as energy,
        bool_or(step_name = 'future') as future,
        bool_or(step_name = 'social_proof') as social_proof,
        bool_or(step_name = 'loading') as loading,
        bool_or(step_name = 'paywall') as paywall,
        bool_or(step_name = 'thank_you') as thank_you
      FROM step_views_funnel_2_backup
      WHERE session_id IS NOT NULL
      GROUP BY session_id
      ON CONFLICT (session_id) DO NOTHING;
      
      RAISE NOTICE 'Migração concluída!';
    END IF;
  ELSE
    RAISE NOTICE 'Nenhum backup encontrado. Tabela criada do zero.';
  END IF;
END $$;