# Como Ativar o Botão "Modo Edição"

## 🎯 Problema: Botão "Modo Edição" não aparece?

O botão **"Modo Edição"** (canto inferior direito) só aparece quando você está **autenticado como administrador**. Existem duas formas de ativar:

---

## Método 1: Login Admin (Produção) ✅ Recomendado

### Passo 1: Fazer Login

1. Acesse a página de login admin:
   ```
   http://localhost:5173/admin/login
   ```

2. Faça login com suas credenciais de administrador

3. Após login bem-sucedido, um token será salvo no `localStorage`

### Passo 2: Acessar o Funil

1. Navegue até qualquer funil (ex: `/funnel-1`)

2. O botão **"Modo Edição"** aparecerá automaticamente no canto inferior direito

3. Clique no botão ou pressione `Ctrl+E` (Windows/Linux) ou `Cmd+E` (Mac)

### Verificar se está autenticado

Abra o console do navegador (`F12`) e digite:

```javascript
localStorage.getItem('admin_token')
```

Se retornar um token JWT, você está autenticado! ✅

---

## Método 2: Modo Desenvolvimento (Apenas para Testes) 🛠️

**Use apenas em ambiente local para facilitar testes!**

### Ativar Modo Dev

Abra o console do navegador (`F12`) e digite:

```javascript
localStorage.setItem('visual_editor_dev_mode', 'true');
location.reload();
```

Agora o botão **"Modo Edição"** aparecerá automaticamente em qualquer funil!

### Desativar Modo Dev

```javascript
localStorage.removeItem('visual_editor_dev_mode');
location.reload();
```

---

## 🔍 Diagnóstico: Por que o botão não aparece?

Abra o console do navegador e verifique as mensagens:

### ✅ Mensagens de Sucesso

```
🎨 Visual Editor: Modo de desenvolvimento ativado
```
ou
```
✅ Visual Editor: Admin autenticado
```

**→ Botão deve aparecer!**

### ❌ Mensagens de Erro

```
ℹ️ Visual Editor: Nenhum token admin encontrado
```
**→ Faça login em `/admin/login`**

```
⚠️ Visual Editor: Token admin expirado
```
**→ Faça login novamente**

```
❌ Visual Editor: Erro ao verificar token admin
```
**→ Limpe o localStorage e faça login novamente:**
```javascript
localStorage.removeItem('admin_token');
```

---

## 🎨 Onde fica o Botão?

Quando autenticado, o botão aparece assim:

```
┌──────────────────────────────────────┐
│                                      │
│         Conteúdo do Funil            │
│                                      │
│                                      │
│                                      │
│                          ┌─────────┐ │
│                          │  🖊️     │ │
│                          │  Modo   │ │
│                          │  Edição │ │
│                          └─────────┘ │
└──────────────────────────────────────┘
```

**Localização**: Canto inferior direito, botão azul flutuante

---

## 📝 Checklist Rápido

- [ ] Estou em ambiente de desenvolvimento local? (`npm run dev` rodando)
- [ ] Fiz login em `/admin/login` **OU** ativei o modo dev
- [ ] Recarreguei a página após fazer login
- [ ] Console mostra mensagem de sucesso (`✅` ou `🎨`)
- [ ] Estou em uma página de funil (ex: `/funnel-1`, `/funnel-2`)

Se todos os itens acima estão ✅, o botão **deve aparecer**!

---

## 🚀 Guia Rápido de Teste

### Para testar rapidamente o editor:

1. **Console do navegador** (`F12`):
   ```javascript
   localStorage.setItem('visual_editor_dev_mode', 'true');
   location.reload();
   ```

2. **Acesse qualquer funil**:
   ```
   http://localhost:5173/funnel-1
   ```

3. **Clique no botão azul** no canto inferior direito

4. **Pronto!** Agora você pode clicar em qualquer elemento para editar

---

## ⚙️ Configurações Avançadas

### Criar Admin no Banco de Dados

Se ainda não tem um usuário admin, você pode criar via Supabase CLI ou SQL:

```sql
INSERT INTO admin_users (email, password_hash, name, role)
VALUES (
  'admin@example.com',
  crypt('sua-senha-segura', gen_salt('bf')),
  'Admin Principal',
  'super_admin'
);
```

**Importante**: Use a edge function `create-admin` para criar admins com segurança!

---

## 🆘 Ainda não funciona?

1. **Verifique o console** do navegador para erros
2. **Limpe o cache** do navegador
3. **Limpe o localStorage**:
   ```javascript
   localStorage.clear();
   location.reload();
   ```
4. **Reinicie o servidor** de desenvolvimento:
   ```bash
   # Parar o servidor (Ctrl+C)
   npm run dev
   ```

---

## 📚 Documentação Adicional

- **Guia Completo**: `VISUAL_EDITOR_GUIDE.md`
- **Início Rápido**: `VISUAL_EDITOR_QUICKSTART.md`
- **Exemplos**: `src/components/editor/INTEGRATION_EXAMPLES.md`
