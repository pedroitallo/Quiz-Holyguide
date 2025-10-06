# Configuração de Deploy na Vercel

## Variáveis de Ambiente Obrigatórias

Configure as seguintes variáveis de ambiente no painel da Vercel (Project Settings → Environment Variables):

### Supabase (Obrigatório)
```
VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw
```

### Base44 (Opcional - se estiver usando)
```
VITE_BASE44_APP_ID=68850befb229de9dd8e4dc73
VITE_BASE44_API_URL=https://base44.app/api
VITE_BASE44_FILES_URL=https://base44.app/api/apps/68850befb229de9dd8e4dc73/files
VITE_SUPABASE_BASE_URL=https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public
```

### Node Environment
```
NODE_ENV=production
```

## Configurações de Build

O arquivo `vercel.json` já está configurado com:
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## Problema Corrigido

O arquivo `.npmrc` estava configurado com um registry local que impedia o build na Vercel. Isso foi corrigido para usar o registry público do npm.

## Passo a Passo para Deploy

1. **Faça commit das mudanças**
   ```bash
   git add .npmrc
   git commit -m "fix: corrige configuração npm para deploy"
   git push origin main
   ```

2. **Configure as variáveis de ambiente na Vercel**
   - Acesse seu projeto na Vercel
   - Vá em Settings → Environment Variables
   - Adicione todas as variáveis listadas acima

3. **Force um novo deploy**
   - Vá em Deployments
   - Clique em "Redeploy" no último deployment

## Troubleshooting

### Se o build falhar:
1. Verifique os logs de build na Vercel
2. Confirme que todas as variáveis de ambiente estão configuradas
3. Teste localmente com `npm run build`

### Se as funcionalidades não funcionarem:
1. Abra o console do navegador e verifique erros
2. Confirme que as URLs do Supabase estão corretas
3. Verifique se o domínio da Vercel está autorizado no Supabase

### Bundle Size Warning:
O aviso sobre o tamanho do bundle (848 KB) é apenas um warning e não impede o funcionamento. Para otimizar:
- Considere implementar code splitting
- Use lazy loading para rotas menos usadas
- Separe bibliotecas grandes em chunks
