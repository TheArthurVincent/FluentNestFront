import { useState, useEffect } from 'react';
import { OneSignalService } from '../services/oneSignalConfig';

/**
 * Hook customizado para gerenciar Push Notifications com OneSignal
 *
 * @example
 * const { isSubscribed, subscribe, userId } = useOneSignal();
 */
export const useOneSignal = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userId, setUserId] = useState(null);
  const [permission, setPermission] = useState('default');
  const [loading, setLoading] = useState(false);

  // Verificar status inicial
  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const subscribed = await OneSignalService.isSubscribed();
    const id = await OneSignalService.getUserId();
    const perm = await OneSignalService.getNotificationPermission();

    setIsSubscribed(subscribed);
    setUserId(id);
    setPermission(perm);
  };

  // Inscrever usuário
  const subscribe = async () => {
    setLoading(true);
    try {
      const success = await OneSignalService.requestPermission();
      await checkStatus();
      return success;
    } catch (error) {
      console.error('Erro ao inscrever:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Desinscrever usuário
  const unsubscribe = async () => {
    setLoading(true);
    try {
      const success = await OneSignalService.unsubscribe();
      await checkStatus();
      return success;
    } catch (error) {
      console.error('Erro ao desinscrever:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Adicionar tags
  const addTags = async (tags) => {
    await OneSignalService.setTags(tags);
  };

  // Associar ID do usuário
  const setExternalUserId = async (externalId) => {
    await OneSignalService.setExternalUserId(externalId);
  };

  return {
    isSubscribed,
    userId,
    permission,
    loading,
    subscribe,
    unsubscribe,
    addTags,
    setExternalUserId,
    checkStatus
  };
};

export default useOneSignal;

