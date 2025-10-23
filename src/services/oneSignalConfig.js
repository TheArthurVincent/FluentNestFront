import OneSignal from 'react-onesignal';

// Configuração do OneSignal
const ONESIGNAL_APP_ID = 'e8118605-2b3d-470c-b53b-999e6bfd5ecf'; // Substituir pelo seu App ID do OneSignal

export const initializeOneSignal = async () => {
  try {
    await OneSignal.init({
      appId: ONESIGNAL_APP_ID,
      allowLocalhostAsSecureOrigin: true, // Para desenvolvimento local

      // Desabilitar botão padrão (vamos usar nosso componente customizado)
      notifyButton: {
        enable: false,
      },

      // Mensagem de boas-vindas após inscrição
      welcomeNotification: {
        title: "Bem-vindo ao ARVIN! 🎉",
        message: "Você receberá notificações sobre novas aulas e conteúdos exclusivos"
      },

      // Configuração do prompt nativo
      promptOptions: {
        slidedown: {
          enabled: false, // Desabilitar, usaremos nosso componente customizado
          actionMessage: "Quer receber notificações sobre novas aulas e conteúdos?",
          acceptButtonText: "Sim, quero!",
          cancelButtonText: "Agora não",
        }
      },

      // Service Worker do OneSignal
      serviceWorkerParam: {
        scope: '/'
      },
      serviceWorkerPath: 'OneSignalSDKWorker.js'
    });

    console.log('✅ OneSignal inicializado com sucesso!');

    // Evento quando usuário se inscreve
    OneSignal.on('subscriptionChange', (isSubscribed) => {
      console.log('Status de inscrição mudou:', isSubscribed);
    });

    // Evento quando notificação é exibida
    OneSignal.on('notificationDisplay', (event) => {
      console.log('Notificação exibida:', event);
    });

  } catch (error) {
    console.error('❌ Erro ao inicializar OneSignal:', error);
  }
};

// Serviço com funções úteis do OneSignal
export const OneSignalService = {
  // Obter ID do usuário no OneSignal
  getUserId: async () => {
    try {
      const userId = await OneSignal.getUserId();
      return userId;
    } catch (error) {
      console.error('Erro ao obter user ID:', error);
      return null;
    }
  },

  // Verificar se está inscrito para notificações
  isSubscribed: async () => {
    try {
      const isPushEnabled = await OneSignal.isPushNotificationsEnabled();
      return isPushEnabled;
    } catch (error) {
      console.error('Erro ao verificar inscrição:', error);
      return false;
    }
  },

  // Solicitar permissão para notificações
  requestPermission: async () => {
    try {
      await OneSignal.registerForPushNotifications();
      return true;
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      return false;
    }
  },

  // Adicionar tags ao usuário (para segmentação)
  setTags: async (tags) => {
    try {
      await OneSignal.sendTags(tags);
      console.log('Tags adicionadas:', tags);
    } catch (error) {
      console.error('Erro ao adicionar tags:', error);
    }
  },

  // Remover tags do usuário
  deleteTags: async (tagKeys) => {
    try {
      await OneSignal.deleteTags(tagKeys);
      console.log('Tags removidas:', tagKeys);
    } catch (error) {
      console.error('Erro ao remover tags:', error);
    }
  },

  // Associar ID externo do usuário (seu sistema)
  setExternalUserId: async (userId) => {
    try {
      await OneSignal.setExternalUserId(userId);
      console.log('External User ID configurado:', userId);
    } catch (error) {
      console.error('Erro ao configurar external user ID:', error);
    }
  },

  // Remover ID externo
  removeExternalUserId: async () => {
    try {
      await OneSignal.removeExternalUserId();
      console.log('External User ID removido');
    } catch (error) {
      console.error('Erro ao remover external user ID:', error);
    }
  },

  // Cancelar inscrição de notificações
  unsubscribe: async () => {
    try {
      await OneSignal.setSubscription(false);
      console.log('Inscrição cancelada');
      return true;
    } catch (error) {
      console.error('Erro ao cancelar inscrição:', error);
      return false;
    }
  },

  // Reinscrever para notificações
  resubscribe: async () => {
    try {
      await OneSignal.setSubscription(true);
      console.log('Reinscrito com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao reinscrever:', error);
      return false;
    }
  },

  // Obter estado de permissão
  getNotificationPermission: async () => {
    try {
      const permission = await OneSignal.getNotificationPermission();
      return permission; // 'default', 'granted', 'denied'
    } catch (error) {
      console.error('Erro ao obter permissão:', error);
      return 'default';
    }
  },

  // Enviar evento customizado (para analytics)
  sendOutcome: async (outcomeName, value = null) => {
    try {
      if (value) {
        await OneSignal.sendOutcomeWithValue(outcomeName, value);
      } else {
        await OneSignal.sendOutcome(outcomeName);
      }
      console.log('Outcome enviado:', outcomeName);
    } catch (error) {
      console.error('Erro ao enviar outcome:', error);
    }
  },

  // Abrir prompt padrão do OneSignal (slidedown)
  showSlidedownPrompt: async () => {
    try {
      await OneSignal.showSlidedownPrompt();
    } catch (error) {
      console.error('Erro ao mostrar slidedown:', error);
    }
  }
};

export default OneSignalService;

