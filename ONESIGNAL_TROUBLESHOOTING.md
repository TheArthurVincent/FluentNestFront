# 🔧 Problemas Resolvidos - OneSignal + PWA

## ✅ O que foi corrigido:

### 1. **Notificações não chegavam do painel**

**Problema:** O Service Worker do PWA estava interceptando as requisições do OneSignal.

**Solução aplicada:**

- ✅ Atualizado `public/sw.js` para NÃO interceptar:
  - Requisições do OneSignal (`onesignal.com`)
  - Requisições de API/backend (login, auth)
  - Requisições POST/PUT/DELETE
  - Caminhos com `/push/`

### 2. **Login não funcionava no PWA**

**Problema:** Service Worker estava cacheando requisições de autenticação.

**Solução aplicada:**

- ✅ Service Worker agora ignora requisições de login/auth
- ✅ Apenas requisições GET de assets são cacheadas
- ✅ APIs passam direto sem cache

---

## 🚀 Próximos Passos:

### 1. **Limpar cache e recarregar**

Execute no console do navegador:

```javascript
// Limpar tudo
indexedDB.deleteDatabase("ONE_SIGNAL_SDK_DB");
localStorage.clear();
caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
navigator.serviceWorker.getRegistrations().then((regs) => {
  regs.forEach((r) => r.unregister());
});
setTimeout(() => location.reload(), 1000);
```

**Ou simplesmente:**

- DevTools (F12) → Application → Storage → **Clear site data**
- Recarregar: `Ctrl + Shift + R`

### 2. **Integrar OneSignal com Login**

Localize seu componente de Login e adicione:

```javascript
import { OneSignalService } from "../services/oneSignalConfig";

// Após login bem-sucedido:
const handleLoginSuccess = async (userData) => {
  // Seu código de login existente...

  // Adicionar isto:
  try {
    await OneSignalService.setExternalUserId(userData.id.toString());
    await OneSignalService.setTags({
      userId: userData.id.toString(),
      nome: userData.nome,
      email: userData.email,
      whiteLabel: "arvin",
      tipoUsuario: userData.tipo || "aluno",
      plano: userData.plano || "free",
    });
  } catch (err) {
    console.warn("OneSignal setup falhou:", err);
  }
};
```

### 3. **Testar Notificações**

1. **Via Dashboard OneSignal:**
   - Vá em **Messages** → **New Push**
   - **Audience**: All Users (para testar)
   - **Message**:
     - Title: "Teste ARVIN"
     - Content: "Esta é uma notificação de teste"
   - **Launch URL**: `https://arvin.rafascripts.dev.br`
   - Clique em **Send Message**

2. **Verificar se chegou:**
   - Notificação deve aparecer no desktop/mobile
   - Console deve mostrar: `Push notification recebida`

### 4. **Segmentação (após integrar com login):**

No dashboard OneSignal, você pode enviar notificações específicas:

**Para usuários específicos:**

- Audience → **Filter by User Tag**
- Key: `userId`, Value: `123`

**Para um white label específico:**

- Key: `whiteLabel`, Value: `arvin`

**Para um plano específico:**

- Key: `plano`, Value: `premium`

---

## 🐛 Troubleshooting:

### ❌ Notificações ainda não chegam

**Verifique no DevTools:**

1. **Application → Service Workers**
   - Deve ter 2 registrados:
     - `/sw.js` (PWA)
     - `/OneSignalSDKWorker.js` (OneSignal)

2. **Console → Filtrar por "OneSignal"**
   - Deve mostrar: `✅ OneSignal inicializado com sucesso!`

3. **Application → Push Messaging**
   - Status: "Granted"
   - Subscription ID deve existir

**Se ainda não funcionar:**

```javascript
// No console, verificar:
OneSignal.User.PushSubscription.id;
// Deve retornar um ID

OneSignal.Notifications.permission;
// Deve retornar true ou "granted"
```

### ❌ Login não funciona

**Verificar no Network tab:**

- Requisições de login devem passar (status 200/401, não de cache)
- Se aparecer "(from ServiceWorker)", o cache ainda está interferindo

**Solução:**

1. Desregistrar todos os Service Workers:

```javascript
navigator.serviceWorker.getRegistrations().then((regs) => {
  regs.forEach((r) => r.unregister());
});
location.reload();
```

2. Verificar se requisições de login não estão sendo cacheadas

### ❌ Erro "MIME type text/html"

**Causa:** Service Worker do OneSignal não está sendo servido corretamente.

**Solução:**

1. Verificar se existe: `public/OneSignalSDKWorker.js`
2. Conteúdo deve ser:

```javascript
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
```

3. Limpar cache do Cloudflare
4. Recarregar página

---

## 📊 Como Verificar se está Tudo OK:

### ✅ Checklist:

- [ ] Console mostra: `✅ OneSignal inicializado com sucesso!`
- [ ] Console mostra: `ServiceWorker registration successful`
- [ ] Banner de notificações aparece após 5 segundos
- [ ] Ao clicar "Sim, quero!", navegador pede permissão
- [ ] Login funciona normalmente
- [ ] Notificação de teste do painel OneSignal chega
- [ ] Ao clicar na notificação, abre o site

---

## 📱 Enviar Notificações do Backend:

```javascript
// Node.js exemplo
const axios = require("axios");

async function enviarNotificacao(titulo, mensagem, userIds = []) {
  const response = await axios.post(
    "https://onesignal.com/api/v1/notifications",
    {
      app_id: "ac15da54-4225-4872-940a-3fb0b8d37d62",
      headings: { en: titulo },
      contents: { en: mensagem },
      include_external_user_ids: userIds, // IDs dos seus usuários
      url: "https://arvin.rafascripts.dev.br",
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic SUA_REST_API_KEY",
      },
    },
  );

  return response.data;
}

// Uso:
await enviarNotificacao(
  "Nova Aula Disponível!",
  "Business English - Módulo 3",
  ["user123", "user456"],
);
```

---

## 🎯 Arquivos Importantes:

| Arquivo                                     | Função                            |
| ------------------------------------------- | --------------------------------- |
| `public/sw.js`                              | Service Worker do PWA (corrigido) |
| `public/OneSignalSDKWorker.js`              | Service Worker do OneSignal       |
| `src/services/oneSignalConfig.js`           | Configuração OneSignal            |
| `src/services/oneSignalLoginIntegration.js` | Exemplos de integração com login  |
| `src/Components/NotificationManager.jsx`    | Banner visual                     |

---

## ✨ Recursos Extras:

### A/B Testing no OneSignal:

1. Dashboard → Messages → New Push
2. Antes de enviar, clique em **Create A/B Test**
3. Configure 2 versões diferentes
4. OneSignal mostra qual performa melhor

### Automações:

1. Dashboard → Automations
2. Criar triggers automáticos:
   - Novo usuário → Mensagem de boas-vindas
   - Inativo por X dias → Lembrete
   - Completou módulo → Parabéns

---

**🎊 Tudo deve estar funcionando agora! 🎊**

Se ainda houver problemas, verifique o checklist acima.
