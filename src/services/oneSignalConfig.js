import OneSignal from 'react-onesignal';

// Configuração do OneSignal
const ONESIGNAL_APP_ID = "ac15da54-4225-4872-940a-3fb0b8d37d62";

export const initializeOneSignal = async () => {
  try {
    await OneSignal.init({
      appId: ONESIGNAL_APP_ID,
      allowLocalhostAsSecureOrigin: true,

      notifyButton: {
        enable: false,
      },

      welcomeNotification: {
        title: "Bem-vindo ao ARVIN! 🎉",
        message: "Você receberá notificações sobre novas aulas e conteúdos exclusivos"
      },

      promptOptions: {
        slidedown: {
          enabled: false,
          actionMessage: "Quer receber notificações sobre novas aulas e conteúdos?",
          acceptButtonText: "Sim, quero!",
          cancelButtonText: "Agora não",
        }
      }
    });

    console.log('✅ OneSignal inicializado com sucesso!');

    // Evento quando usuário se inscreve
    OneSignal.User.PushSubscription.addEventListener('change', (event) => {
      console.log('Status de inscrição mudou:', event);
    });

    // Evento quando notificação é exibida
    OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event) => {
      console.log('Notificação exibida:', event);
    });

  } catch (error) {
    console.error('❌ Erro ao inicializar OneSignal:', error);
  }
};

// Serviço com funções úteis do OneSignal (atualizado para nova API)
export const OneSignalService = {
  // Obter ID do usuário no OneSignal
  getUserId: async () => {
    try {
      const userId = await OneSignal.User.PushSubscription.id;
      return userId;
    } catch (error) {
      console.error('Erro ao obter user ID:', error);
      return null;
    }
  },

  // Verificar se está inscrito para notificações
  isSubscribed: async () => {
    try {
      const permission = await OneSignal.Notifications.permission;
      return permission === true || permission === 'granted';
    } catch (error) {
      console.error('Erro ao verificar inscrição:', error);
      return false;
    }
  },

  // Solicitar permissão para notificações
  requestPermission: async () => {
    try {
      const result = await OneSignal.Notifications.requestPermission();
      return result === true || result === 'granted';
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      return false;
    }
  },

  // Adicionar tags ao usuário (para segmentação)
  setTags: async (tags) => {
    try {
      await OneSignal.User.addTags(tags);
      console.log('Tags adicionadas:', tags);
    } catch (error) {
      console.error('Erro ao adicionar tags:', error);
    }
  },

  // Remover tags do usuário
  deleteTags: async (tagKeys) => {
    try {
      await OneSignal.User.removeTags(tagKeys);
      console.log('Tags removidas:', tagKeys);
    } catch (error) {
      console.error('Erro ao remover tags:', error);
    }
  },

  // Associar ID externo do usuário (seu sistema)
  setExternalUserId: async (userId) => {
    try {
      await OneSignal.login(userId);
      console.log('External User ID configurado:', userId);
    } catch (error) {
      console.error('Erro ao configurar external user ID:', error);
    }
  },

  // Remover ID externo
  removeExternalUserId: async () => {
    try {
      await OneSignal.logout();
      console.log('External User ID removido');
    } catch (error) {
      console.error('Erro ao remover external user ID:', error);
    }
  },

  // Cancelar inscrição de notificações
  unsubscribe: async () => {
    try {
      await OneSignal.User.PushSubscription.optOut();
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
      await OneSignal.User.PushSubscription.optIn();
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
      const permission = await OneSignal.Notifications.permission;
      if (permission === true || permission === 'granted') return 'granted';
      if (permission === false || permission === 'denied') return 'denied';
      return 'default';
    } catch (error) {
      console.error('Erro ao obter permissão:', error);
      return 'default';
    }
  },

  // Enviar evento customizado (para analytics)
  sendOutcome: async (outcomeName, value = null) => {
    try {
      if (value) {
        await OneSignal.Session.sendOutcome(outcomeName, value);
      } else {
        await OneSignal.Session.sendOutcome(outcomeName);
      }
      console.log('Outcome enviado:', outcomeName);
    } catch (error) {
      console.error('Erro ao enviar outcome:', error);
    }
  },

  // Abrir prompt padrão do OneSignal (slidedown)
  showSlidedownPrompt: async () => {
    try {
      await OneSignal.Slidedown.promptPush();
    } catch (error) {
      console.error('Erro ao mostrar slidedown:', error);
    }
  }
};

export default OneSignalService;
