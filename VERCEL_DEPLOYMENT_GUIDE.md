# Guia Completo de Deploy no Vercel

## Por que Vercel?

Para projetos com **alto volume de tráfego**, o Vercel oferece:
- Edge Network global com 300+ regiões
- Build e runtime otimizados para React/Vite
- Performance superior para SPAs
- Escalabilidade automática
- Analytics integrado

---

## Passo 1: Preparar o Projeto

### 1.1 Verificar Arquivos de Configuração

Seu projeto já está pronto com:
- `vercel.json` - Configuração otimizada
- `build.sh` - Script de build com validações
- `.gitignore` - Arquivos que não devem ir para o Git

### 1.2 Commit das Mudanças (se necessário)

```bash
git add .
git commit -m "chore: otimizar configuração para Vercel"
git push origin main
```

---

## Passo 2: Criar Conta e Projeto no Vercel

### 2.1 Criar Conta

1. Acesse: https://vercel.com/signup
2. Escolha uma opção:
   - **Hobby (Gratuito)** - 100 GB bandwidth/mês
   - **Pro** - Se precisar de mais recursos

3. Conecte sua conta do GitHub/GitLab/Bitbucket

### 2.2 Importar Projeto

1. No dashboard da Vercel, clique em: **Add New... → Project**

2. Selecione o repositório do seu projeto

3. Configure as opções de build:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (deixe como está)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **NÃO clique em Deploy ainda!** Primeiro, configure as variáveis de ambiente.

---

## Passo 3: Configurar Variáveis de Ambiente

### 3.1 Acessar Configurações

No painel de configuração do projeto (antes do primeiro deploy), procure por:
**Environment Variables**

### 3.2 Adicionar Variáveis Obrigatórias

Adicione as seguintes variáveis **UMA POR UMA**:

#### Variável 1: VITE_SUPABASE_URL
```
Name: VITE_SUPABASE_URL
Value: https://0ec90b57d6e95fcbda19832f.supabase.co
Environment: Production, Preview, Development (marque todas)
```

#### Variável 2: VITE_SUPABASE_ANON_KEY
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw
Environment: Production, Preview, Development (marque todas)
```

#### Variável 3: NODE_ENV
```
Name: NODE_ENV
Value: production
Environment: Production, Preview, Development (marque todas)
```

### 3.3 Confirmar Variáveis

Verifique se todas as 3 variáveis aparecem na lista com o ícone de "check" verde.

---

## Passo 4: Fazer o Deploy

### 4.1 Primeiro Deploy

1. Clique no botão: **Deploy**

2. Aguarde o processo (2-5 minutos):
   - Installing dependencies...
   - Building...
   - Deploying...

3. Se tudo ocorrer bem, você verá:
   - **Status**: Ready
   - Um link para o seu site (ex: `seu-projeto.vercel.app`)

### 4.2 Verificar Deploy

Clique no link do site e verifique:
1. O site carrega corretamente
2. Abra o Console do navegador (F12)
3. Procure por mensagens de sucesso do Supabase:
   ```
   ✅ Supabase connection successful
   ```

---

## Passo 5: Configurar Domínio (Opcional)

### 5.1 Usar Domínio Próprio

Se você tem um domínio personalizado:

1. No projeto da Vercel, vá em: **Settings → Domains**

2. Clique em: **Add Domain**

3. Digite seu domínio (ex: `meusite.com`)

4. Siga as instruções para configurar:
   - **A Record**: aponta para o IP da Vercel
   - **CNAME**: aponta para `cname.vercel-dns.com`

5. Aguarde propagação DNS (pode levar até 24h)

### 5.2 Domínio Gratuito da Vercel

O Vercel já fornece um domínio gratuito:
```
seu-projeto.vercel.app
```

Você pode personalizá-lo:
1. Settings → Domains
2. Clique no domínio existente
3. Edit → Digite novo nome
4. Salvar

---

## Passo 6: Configurar Deploys Automáticos

### 6.1 Deploys Automáticos do Git

Por padrão, o Vercel já está configurado para deploy automático:

- **Push para `main`** → Deploy em Production
- **Push para outras branches** → Preview Deploy
- **Pull Requests** → Preview Deploy automático

### 6.2 Configurar Branch de Produção

Se sua branch principal não é `main`:

1. Settings → Git
2. **Production Branch**: Selecione sua branch (ex: `master`, `production`)
3. Salvar

---

## Passo 7: Otimizações para Alto Tráfego

### 7.1 Configurar Região Preferencial

O `vercel.json` já está configurado para:
```json
"regions": ["iad1"]
```

**iad1** = Washington D.C., EUA (ótimo para tráfego global)

Se seu público é majoritariamente de outra região, altere:
- **gru1** - São Paulo, Brasil
- **sfo1** - São Francisco, EUA
- **fra1** - Frankfurt, Alemanha
- **hnd1** - Tóquio, Japão

### 7.2 Cache de Assets

Já configurado no `vercel.json`:
```json
"headers": [
  {
    "source": "/assets/(.*)",
    "headers": [
      {
        "key": "Cache-Control",
        "value": "public, max-age=31536000, immutable"
      }
    ]
  }
]
```

Isso garante que assets (CSS, JS, imagens) sejam cacheados por 1 ano.

### 7.3 Analytics (Recomendado)

1. No projeto da Vercel, vá em: **Analytics**

2. Clique em: **Enable Analytics**

3. Escolha o plano:
   - **Gratuito**: Até 100k visualizações/mês
   - **Pro**: Ilimitado

4. Você terá acesso a:
   - Page views
   - Unique visitors
   - Top pages
   - Performance metrics (Web Vitals)

---

## Passo 8: Monitoramento e Logs

### 8.1 Ver Logs de Deploy

1. No projeto, clique em: **Deployments**

2. Clique em qualquer deploy para ver:
   - Build logs
   - Runtime logs
   - Erros (se houver)

### 8.2 Logs em Tempo Real

1. No projeto, clique em: **Functions** (se usar Edge Functions)

2. Clique em: **Logs**

3. Veja logs em tempo real das requisições

### 8.3 Alertas de Erro

Configure notificações:

1. Settings → Notifications

2. Ative:
   - **Build Failed** - Notifica quando o build falha
   - **Deployment Failed** - Notifica quando o deploy falha
   - **Build Succeeded** - Opcional

3. Configure onde receber (Email, Slack, etc)

---

## Comparação: Vercel vs Netlify

| Recurso | Vercel | Netlify |
|---------|--------|---------|
| **Build Speed** | Mais rápido | Mais lento |
| **Edge Network** | 300+ regiões | 190+ regiões |
| **Performance SPA** | Otimizado | Bom |
| **Bandwidth (Free)** | 100 GB/mês | 100 GB/mês |
| **Build Time (Free)** | Ilimitado | 300 min/mês |
| **Analytics** | Sim (pago) | Sim (limitado) |
| **Facilidade** | Médio | Fácil |

---

## Troubleshooting

### Problema 1: Build Falha

**Sintomas:**
```
Error: Build failed with exit code 1
```

**Soluções:**
1. Verifique os logs de build no Vercel
2. Teste localmente: `npm run build`
3. Verifique se todas as dependências estão no `package.json`
4. Confirme que as variáveis de ambiente estão configuradas

---

### Problema 2: Site Carrega, mas Supabase Não Funciona

**Sintomas:**
```
❌ CRITICAL: Supabase environment variables not configured!
```

**Soluções:**
1. Verifique se as variáveis foram adicionadas:
   - Settings → Environment Variables
2. Confirme que os nomes estão corretos:
   - `VITE_SUPABASE_URL` (não `SUPABASE_URL`)
   - `VITE_SUPABASE_ANON_KEY` (não `SUPABASE_KEY`)
3. Force um novo deploy:
   - Deployments → Redeploy

---

### Problema 3: Rotas 404 (Not Found)

**Sintomas:**
- Homepage funciona
- Rotas como `/analytics` retornam 404

**Soluções:**
1. Verifique o `vercel.json`:
   ```json
   "rewrites": [
     {
       "source": "/(.*)",
       "destination": "/index.html"
     }
   ]
   ```
2. Se não existir, adicione e faça redeploy

---

### Problema 4: Performance Ruim

**Sintomas:**
- Site lento
- Tempo de carregamento alto

**Soluções:**
1. Verifique Web Vitals no Analytics
2. Otimize imagens:
   - Use formato WebP
   - Comprima imagens grandes
3. Implemente lazy loading:
   ```jsx
   const Analytics = lazy(() => import('./pages/Analytics'))
   ```
4. Considere code splitting
5. Ative Edge Functions para APIs

---

### Problema 5: CORS Errors

**Sintomas:**
```
Access to fetch at '...' has been blocked by CORS policy
```

**Soluções:**
1. Configure headers no `vercel.json` (já configurado)
2. No Supabase, adicione seu domínio Vercel:
   - Settings → API → Site URL
   - Adicione: `https://seu-projeto.vercel.app`
3. Verifique se está usando `VITE_SUPABASE_ANON_KEY` (não service_role)

---

## Checklist Final

Antes de considerar o deploy completo, verifique:

### Configuração
- [ ] `vercel.json` existe e está correto
- [ ] `build.sh` tem permissão de execução
- [ ] `.gitignore` inclui `node_modules` e `.env`

### Variáveis de Ambiente
- [ ] `VITE_SUPABASE_URL` está configurada
- [ ] `VITE_SUPABASE_ANON_KEY` está configurada
- [ ] `NODE_ENV=production` está configurada
- [ ] Todas as variáveis estão em: Production, Preview, Development

### Deploy
- [ ] Primeiro deploy foi bem-sucedido
- [ ] Site está acessível via URL da Vercel
- [ ] Console do navegador não mostra erros críticos
- [ ] Supabase está conectado (veja logs no console)

### Funcionalidades
- [ ] Páginas carregam corretamente
- [ ] Rotas funcionam (ex: /analytics, /admin-login)
- [ ] Formulários salvam dados no Supabase
- [ ] Analytics está sendo registrado

### Performance
- [ ] Web Vitals estão bons (se Analytics ativado)
- [ ] Assets estão sendo cacheados (verificar Network tab)
- [ ] Imagens carregam rápido
- [ ] Não há warnings críticos no console

### Monitoramento
- [ ] Notificações de deploy estão ativas
- [ ] Analytics está configurado (se necessário)
- [ ] Logs estão acessíveis

---

## Próximos Passos

Após o deploy bem-sucedido:

1. **Configure um Domínio Personalizado** (opcional)
   - Mais profissional
   - Melhor para SEO
   - Mais fácil de lembrar

2. **Ative o Analytics**
   - Monitore tráfego real
   - Identifique páginas mais acessadas
   - Otimize com base em dados reais

3. **Configure Alertas**
   - Seja notificado de falhas
   - Monitore tempo de inatividade
   - Receba relatórios de performance

4. **Implemente CI/CD**
   - Testes automáticos antes do deploy
   - Staging environment para testes
   - Rollback automático em caso de erro

5. **Otimize Performance**
   - Implemente lazy loading
   - Otimize imagens
   - Reduza bundle size
   - Use Edge Functions para APIs

---

## Suporte e Recursos

### Documentação Oficial
- Vercel Docs: https://vercel.com/docs
- Vite Docs: https://vitejs.dev/guide/
- Supabase Docs: https://supabase.com/docs

### Comunidade
- Vercel Discord: https://vercel.com/discord
- Vercel Discussions: https://github.com/vercel/vercel/discussions

### Status
- Vercel Status: https://vercel-status.com
- Supabase Status: https://status.supabase.com

---

## Resumo Rápido

```bash
# 1. Criar conta na Vercel
https://vercel.com/signup

# 2. Importar projeto do GitHub

# 3. Configurar variáveis:
VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
NODE_ENV=production

# 4. Deploy!

# 5. Verificar:
https://seu-projeto.vercel.app
```

Seu site estará no ar em menos de 5 minutos!
