# 🔔 Push Notifications com OneSignal - Guia Completo

## ✅ Implementação Concluída!

O sistema de Push Notifications com OneSignal foi implementado com sucesso no seu PWA ARVIN!

---

## 📋 Arquivos Criados

### 1. **Configuração do OneSignal**
- ✅ `src/services/oneSignalConfig.js` - Configuração e funções do OneSignal
- ✅ `src/hooks/useOneSignal.js` - Hook React customizado
- ✅ `src/Components/NotificationManager.jsx` - Componente visual de gerenciamento

### 2. **Integração**
- ✅ `src/main.jsx` - Inicialização automática do OneSignal
- ✅ `src/App.tsx` - Componente NotificationManager adicionado

---

## 🚀 Configuração no OneSignal Dashboard

### Passo 1: Criar Conta
1. Acesse [onesignal.com](https://onesignal.com)
2. Crie uma conta gratuita (grátis até 10k usuários)
3. Clique em **"New App/Website"**

### Passo 2: Configurar Web Push
1. Selecione **"Web Push"** como plataforma
2. Configure:
   - **Site Name**: ARVIN - Inglês de Negócios
   - **Site URL**: `https://seudominio.com` (seu domínio em produção)
   - **Auto Resubscribe**: ON
   - **Default Notification Icon**: Upload do seu logo (192x192)
   - **Large Notification Icon**: Upload do seu logo (512x512)

### Passo 3: Obter Credenciais
Após criar o app, você receberá:
- **App ID** (exemplo: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
- **REST API Key** (para envio de notificações via backend)

### Passo 4: Configurar no Código
Abra o arquivo `src/services/oneSignalConfig.js` e substitua:

```javascript
const ONESIGNAL_APP_ID = 'SEU_APP_ID_AQUI'; // Cole seu App ID aqui
```

---

## 📦 Instalação

Execute no terminal:

```bash
pnpm add react-onesignal
```

---

## 🎯 Como Funciona

### 1. **Inicialização Automática**
O OneSignal é inicializado automaticamente 2 segundos após o carregamento da página.

### 2. **Prompt Visual**
Após 5 segundos, um banner bonito aparece solicitando permissão para notificações.

### 3. **Gerenciamento**
- ✅ Usuário pode aceitar ou dispensar
- ✅ Se dispensar, não aparece por 7 dias
- ✅ Badge verde mostra quando está inscrito
- ✅ Botão de configurações para desativar

---

## 💡 Uso Avançado

### Integrar com Sistema de Login

Adicione no seu componente de Login (após login bem-sucedido):

```javascript
import { OneSignalService } from '../services/oneSignalConfig';

const handleLogin = async (userData) => {
  // ... seu código de login ...
  
  // Associar usuário ao OneSignal
  await OneSignalService.setExternalUserId(userData.id);
  
  // Adicionar tags para segmentação
  await OneSignalService.setTags({
    userId: userData.id,
    nome: userData.nome,
    email: userData.email,
    curso: userData.curso || 'não definido',
    nivel: userData.nivel || 'iniciante',
    plano: userData.plano || 'free',
    ultimoAcesso: new Date().toISOString()
  });
  
  console.log('✅ Usuário associado ao OneSignal');
};
```

### Exemplo no Logout

```javascript
import { OneSignalService } from '../services/oneSignalConfig';

const handleLogout = async () => {
  // Remover associação do usuário
  await OneSignalService.removeExternalUserId();
  
  // ... resto do código de logout ...
};
```

### Usar o Hook em Qualquer Componente

```javascript
import { useOneSignal } from '../hooks/useOneSignal';

function MeuComponente() {
  const { 
    isSubscribed, 
    userId, 
    subscribe, 
    addTags 
  } = useOneSignal();

  const handleAtivar = async () => {
    const success = await subscribe();
    if (success) {
      await addTags({ 
        origem: 'botao-manual',
        pagina: 'perfil' 
      });
    }
  };

  return (
    <div>
      {isSubscribed ? (
        <p>✅ Notificações ativadas!</p>
      ) : (
        <button onClick={handleAtivar}>
          🔔 Ativar Notificações
        </button>
      )}
    </div>
  );
}
```

---

## 📤 Enviar Notificações

### 1. **Via Dashboard do OneSignal** (Mais Fácil)

1. Acesse o Dashboard do OneSignal
2. Vá em **"Messages"** → **"New Push"**
3. Configure:
   - **Audience**: Todos ou segmentado
   - **Message**: Título e conteúdo
   - **Launch URL**: URL de destino
   - **Schedule**: Enviar agora ou agendar

### 2. **Via API (Backend)**

Crie um arquivo `backend/onesignalService.js`:

```javascript
const axios = require('axios');

const ONESIGNAL_APP_ID = 'SEU_APP_ID';
const ONESIGNAL_REST_API_KEY = 'SUA_REST_API_KEY';

async function enviarNotificacao(opcoes) {
  const {
    titulo = 'ARVIN',
    mensagem,
    url = 'https://seusite.com',
    usuariosExternos = [], // IDs dos seus usuários
    segmentos = ['All'], // Ou ['All'] para todos
    tags = null // { key: 'curso', value: 'react' }
  } = opcoes;

  const notification = {
    app_id: ONESIGNAL_APP_ID,
    headings: { en: titulo },
    contents: { en: mensagem },
    url: url,
    chrome_web_icon: 'https://seusite.com/pwa-192x192.png',
    chrome_web_image: 'https://seusite.com/pwa-512x512.png',
    
    // Escolha UMA das opções abaixo:
    
    // Opção 1: Enviar para usuários específicos
    ...(usuariosExternos.length > 0 && {
      include_external_user_ids: usuariosExternos
    }),
    
    // Opção 2: Enviar para todos
    ...(usuariosExternos.length === 0 && !tags && {
      included_segments: segmentos
    }),
    
    // Opção 3: Enviar por tags (segmentação)
    ...(tags && {
      filters: [
        { field: "tag", key: tags.key, relation: "=", value: tags.value }
      ]
    })
  };

  try {
    const response = await axios.post(
      'https://onesignal.com/api/v1/notifications',
      notification,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
        }
      }
    );
    
    console.log('✅ Notificação enviada:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Erro ao enviar notificação:', error.response?.data || error);
    return { success: false, error: error.response?.data || error.message };
  }
}

module.exports = { enviarNotificacao };
```

### Exemplos de Uso no Backend:

```javascript
const { enviarNotificacao } = require('./onesignalService');

// Exemplo 1: Notificar todos os usuários
app.post('/api/notify-all', async (req, res) => {
  const resultado = await enviarNotificacao({
    titulo: 'Nova Aula Disponível! 🎓',
    mensagem: 'Aprenda inglês de negócios agora',
    url: 'https://seusite.com/aulas/nova'
  });
  
  res.json(resultado);
});

// Exemplo 2: Notificar usuário específico
app.post('/api/notify-user/:userId', async (req, res) => {
  const { userId } = req.params;
  const { titulo, mensagem } = req.body;
  
  const resultado = await enviarNotificacao({
    titulo,
    mensagem,
    usuariosExternos: [userId]
  });
  
  res.json(resultado);
});

// Exemplo 3: Notificar por curso
app.post('/api/notify-course/:course', async (req, res) => {
  const { course } = req.params;
  
  const resultado = await enviarNotificacao({
    titulo: 'Nova aula de ' + course,
    mensagem: 'Confira o novo conteúdo!',
    tags: { key: 'curso', value: course }
  });
  
  res.json(resultado);
});
```

---

## 🎨 Exemplos de Notificações

### Lembrete de Aula
```javascript
await enviarNotificacao({
  titulo: '⏰ Sua aula começa em 15 minutos!',
  mensagem: 'Business English - Módulo 3',
  url: 'https://seusite.com/aula/123',
  usuariosExternos: ['user123']
});
```

### Novo Conteúdo
```javascript
await enviarNotificacao({
  titulo: '🎉 Novo conteúdo disponível!',
  mensagem: '10 expressões essenciais para reuniões',
  url: 'https://seusite.com/conteudos/novo',
  tags: { key: 'nivel', value: 'intermediario' }
});
```

### Motivacional
```javascript
await enviarNotificacao({
  titulo: '💪 Continue sua jornada!',
  mensagem: 'Você não acessa há 3 dias. Que tal praticar hoje?',
  url: 'https://seusite.com/exercicios'
});
```

---

## 📊 Segmentação Avançada

### Por Tags
As tags podem ser adicionadas quando o usuário se inscreve ou faz login:

```javascript
await OneSignalService.setTags({
  curso: 'react',
  nivel: 'avancado',
  plano: 'premium',
  interesseEmGramatica: true,
  ultimaAula: '2024-01-15'
});
```

### Enviar para Segmento Específico:
```javascript
// Apenas usuários premium do curso de React
filters: [
  { field: "tag", key: "plano", relation: "=", value: "premium" },
  { field: "tag", key: "curso", relation: "=", value: "react" }
]
```

---

## 🧪 Testar Localmente

1. **Instale o pacote:**
   ```bash
   pnpm add react-onesignal
   ```

2. **Configure o App ID** em `src/services/oneSignalConfig.js`

3. **Execute o projeto:**
   ```bash
   pnpm dev
   ```

4. **Abra no navegador** (localhost funciona!)

5. **Aceite as notificações** quando o prompt aparecer

6. **Teste enviando** uma notificação pelo Dashboard do OneSignal

---

## ✅ Checklist de Implementação

- [ ] Instalar `pnpm add react-onesignal`
- [ ] Criar conta no OneSignal
- [ ] Configurar Web Push no OneSignal
- [ ] Obter App ID
- [ ] Substituir App ID no código
- [ ] Testar localmente
- [ ] Integrar com sistema de login
- [ ] Adicionar tags relevantes
- [ ] Testar envio de notificações
- [ ] Deploy em produção (HTTPS obrigatório!)

---

## 🎯 Recursos do OneSignal (Grátis)

✅ Até 10.000 inscritos  
✅ Notificações ilimitadas  
✅ Segmentação por tags  
✅ Analytics completo  
✅ A/B Testing  
✅ Templates de mensagens  
✅ Agendamento  
✅ APIs completas  

---

## 📱 Compatibilidade

| Plataforma | Suporte |
|------------|---------|
| Chrome (Desktop) | ✅ Completo |
| Edge | ✅ Completo |
| Firefox | ✅ Completo |
| Safari (Desktop) | ✅ macOS 13+ |
| Chrome (Android) | ✅ Completo |
| Safari (iOS) | ✅ iOS 16.4+ |
| Opera | ✅ Completo |

---

## 🐛 Troubleshooting

### Notificações não aparecem
- ✅ Certifique-se de estar usando HTTPS (ou localhost)
- ✅ Verifique se o App ID está correto
- ✅ Confira o console por erros
- ✅ Verifique permissões do navegador

### Service Worker não registra
- ✅ Limpe o cache do navegador
- ✅ Verifique conflitos com outros SWs
- ✅ Confira o console do DevTools

### Usuário não recebe notificações
- ✅ Verifique se o usuário está inscrito
- ✅ Confira se o External User ID está correto
- ✅ Verifique os filtros/tags de segmentação

---

## 🎊 Pronto!

Seu PWA agora tem **Push Notifications completas** com OneSignal!

Para mais informações:
- [Documentação OneSignal](https://documentation.onesignal.com/docs/web-push-quickstart)
- [API Reference](https://documentation.onesignal.com/reference/create-notification)
- [Dashboard OneSignal](https://onesignal.com/)

