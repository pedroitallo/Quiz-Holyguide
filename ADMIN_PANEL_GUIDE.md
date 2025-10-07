# Guia do Painel Administrativo HolyMind

## Visão Geral

O painel administrativo é uma plataforma completa de gestão de quizzes, testes A/B, analytics, arquivos e configurações. Todas as funcionalidades estão centralizadas em `/admin`.

## Acesso ao Painel

**URL:** `/admin/login`

Após o login, você será redirecionado para o dashboard principal em `/admin`.

## Estrutura de Rotas

### Rotas Públicas
- `/funnel-[nome]` - Todos os seus quizzes públicos permanecem acessíveis

### Rotas Administrativas (Protegidas)
- `/admin` - Dashboard principal
- `/admin/funnels` - Gestão de Quizzes
- `/admin/funnels/:id/edit` - Editor de Quiz
- `/admin/analytics` - Analytics avançado
- `/admin/ab-tests` - Gestão de Testes A/B
- `/admin/files` - Gerenciador de Arquivos
- `/admin/settings` - Configurações Globais

## Funcionalidades Implementadas

### 1. Dashboard Principal (`/admin`)

**Métricas em tempo real:**
- Total de Quizzes ativos
- Sessões hoje
- Conversão média
- Testes A/B ativos

**Ações rápidas:**
- Ver Analytics
- Gerenciar Quizzes
- Upload de arquivos
- Criar Teste A/B

**Widgets:**
- Top 5 quizzes (últimos 7 dias)
- Atividade recente
- Alertas do sistema

### 2. Gestão de Quizzes (`/admin/funnels`)

**Funcionalidades:**
- Listagem de todos os quizzes com busca e filtros
- Filtrar por status (ativo, inativo, rascunho)
- Visualizar quiz em nova aba
- Editar informações do quiz
- Duplicar quiz completo (incluindo etapas)
- Ativar/Desativar quiz rapidamente
- Deletar quiz

**Informações exibidas:**
- Nome do quiz
- Slug (URL)
- Status
- Tags
- Descrição
- Sessões recentes

### 3. Editor de Quizzes (`/admin/funnels/:id/edit`)

**Edição de informações básicas:**
- Nome do quiz
- Slug (URL personalizada)
- Descrição
- Status (draft, active, inactive)
- Tags organizacionais

**Gestão de etapas:**
- Visualizar todas as etapas do quiz
- Reordenar etapas usando setas up/down
- Remover etapas individuais
- Ver nome e componente de cada etapa

**Ações:**
- Salvar alterações
- Visualizar quiz ao vivo
- Auto-save a cada 30 segundos

### 4. Analytics Avançado (`/admin/analytics`)

**Mantém todas as funcionalidades existentes:**
- Seleção de funil específico
- Filtro de período (hoje, 7 dias, 30 dias, personalizado)
- Métricas principais: sessões, start quiz, end quiz, retenção
- Funil de conversão visual com taxas de passagem
- Visualização por teste A/B

**Pronto para expansão futura:**
- Comparação entre períodos
- Exportação de relatórios
- Segmentação por UTM
- Análise de abandono detalhada

### 5. Gestão de Testes A/B (`/admin/ab-tests`)

**Funcionalidades:**
- Criar novos testes A/B
- Listar testes (ativos, pausados, concluídos)
- Visualizar hipótese e notas do teste
- Ver datas de início/fim
- Pausar/retomar testes ativos
- Declarar vencedor manualmente
- Deletar testes
- Ver resultados em Analytics

**Informações dos testes:**
- Nome e status
- Hipótese do teste
- Notas e observações
- Tags organizacionais
- Tamanho de amostra alvo
- Variante vencedora (quando finalizado)

### 6. Gerenciador de Arquivos (`/admin/files`)

**Mantém funcionalidades existentes do FileManager:**
- Upload de arquivos
- Galeria visual
- Preview de imagens
- Deletar arquivos
- Copiar URL pública

**Preparado para melhorias futuras:**
- Upload em lote
- Organização por pastas
- Sistema de tags
- Otimização automática de imagens

### 7. Configurações Globais (`/admin/settings`)

**Tabs de configuração:**

**Marca:**
- Nome da plataforma
- URL do logo
- Cor primária
- Cor secundária

**Usuários Admin:**
- Adicionar novo admin (email + senha)
- Listar todos os admins
- Deletar admins
- Ver data de criação

**Notificações:**
- Alertas por email
- Alertas de performance
- Alertas de testes A/B

**SEO:**
- Título padrão
- Descrição padrão
- URL do favicon

**Backup:**
- Exportar configurações em JSON
- Importar configurações de backup

**Auditoria:**
- Log de todas as atividades administrativas
- Quem fez o quê e quando
- Últimas 20 ações

## Banco de Dados

### Novas Tabelas Criadas

**`funnels`**
- Armazena todos os quizzes
- Campos: id, name, slug, description, status, tags, config, created_by, created_at, updated_at
- Status: draft, active, inactive
- Tags: array de strings para organização

**`funnel_steps`**
- Armazena etapas de cada funil
- Campos: id, funnel_id, step_order, step_name, component_name, config
- Permite reordenação e customização

**`admin_activity_logs`**
- Registra todas as ações administrativas
- Campos: id, admin_user_id, action, resource_type, resource_id, details, ip_address, created_at
- Auditoria completa do sistema

**`platform_settings`**
- Configurações globais da plataforma
- Campos: id, key, value (jsonb), updated_at, updated_by
- Estrutura flexível para qualquer configuração

**Melhorias em `ab_tests`**
- Novos campos: tags, notes, sample_size_target, winner_variant
- Melhor rastreamento e documentação dos testes

### Segurança (RLS Policies)

Todas as tabelas têm políticas RLS configuradas:
- Admins autenticados têm acesso total
- Usuários anônimos só podem ler funis ativos (para renderização pública)
- Logs e configurações restritos apenas para admins

## Como Criar um Novo Quiz

### Via IA do Bolt (Recomendado)

1. Peça à IA do Bolt para criar um novo quiz
2. A IA criará os arquivos de componentes e página
3. **Importante:** Peça também para a IA registrar o quiz no banco de dados:
   ```sql
   INSERT INTO funnels (name, slug, description, status, tags)
   VALUES ('Nome do Quiz', 'slug-do-quiz', 'Descrição', 'active', ARRAY['tag1', 'tag2']);
   ```
4. O quiz aparecerá automaticamente em `/admin/funnels`

### Registro Manual no Banco

Se o quiz já existe no código mas não aparece no admin:

```javascript
// Adicionar no arquivo src/config/funnels.config.js
{
  id: 'meu-novo-quiz',
  name: 'Meu Novo Quiz',
  slug: 'meu-novo-quiz',
  description: 'Descrição do quiz',
  status: 'active',
  tags: ['categoria1', 'categoria2']
}
```

Depois executar SQL no Supabase:
```sql
INSERT INTO funnels (name, slug, description, status, tags)
VALUES ('Meu Novo Quiz', 'meu-novo-quiz', 'Descrição do quiz', 'active', ARRAY['categoria1', 'categoria2']);
```

## Fluxo de Trabalho Recomendado

### Para Criar Novo Quiz:
1. Peça à IA do Bolt para criar o quiz via chat
2. Peça para registrar no banco de dados
3. Acesse `/admin/funnels` para ver o quiz
4. Clique em "Editar" para adicionar tags e descrição
5. Use "Visualizar" para testar o quiz

### Para Otimizar Conversão:
1. Acesse `/admin/ab-tests`
2. Crie um teste A/B com duas variantes do quiz
3. Configure hipótese e tamanho de amostra
4. Monitore resultados em `/admin/analytics`
5. Declare o vencedor quando atingir significância

### Para Gerenciar Conteúdo:
1. Acesse `/admin/files`
2. Faça upload de imagens, vídeos
3. Copie URLs públicas para usar nos quizzes
4. Organize com tags

### Para Monitorar Performance:
1. Acesse `/admin` (Dashboard)
2. Veja métricas gerais
3. Clique em "Ver Analytics" para detalhes
4. Analise funil de conversão por etapa
5. Identifique gargalos

## Componentes Reutilizáveis

### Layout
- `AdminLayout` - Layout padrão com sidebar e header
- `AdminSidebar` - Menu lateral colapsável
- `AdminHeader` - Header com breadcrumbs e menu de usuário
- `ProtectedRoute` - Proteção de rotas administrativas

### UI
- `StatCard` - Cards de métricas com ícones
- `EmptyState` - Estado vazio com ícone e ação

### Hooks
- `useFunnels` - CRUD completo de funis

## Próximos Passos Sugeridos

1. **Analytics Avançado:**
   - Implementar comparação entre períodos
   - Adicionar exportação de relatórios CSV/PDF
   - Criar gráficos de linha temporal

2. **Editor Visual:**
   - Arrastar e soltar etapas
   - Editar configurações de cada etapa
   - Preview em tempo real

3. **Gestão de Links:**
   - Criar tabela de checkout_links
   - Gerenciar links de pagamento
   - Rotação automática de links

4. **Gestão de Scripts:**
   - Criar tabela de scripts
   - Editor de código para pixels
   - Ativar/desativar por funil

## Suporte

Para questões técnicas ou bugs, verifique:
- Console do navegador para erros JavaScript
- Logs do Supabase para erros de banco de dados
- Tab "Auditoria" em Configurações para ver atividades recentes

## Notas Importantes

- Todos os funis existentes foram automaticamente importados para o sistema
- As rotas públicas dos quizzes (`/funnel-*`) continuam funcionando normalmente
- O sistema é 100% compatível com o código existente
- A autenticação usa o sistema existente de `AdminAuthContext`
- Backup regular das configurações é recomendado
