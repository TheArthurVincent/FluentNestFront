/**
 * Exemplo de integração do OneSignal com o sistema de Login
 * Adicione este código no seu componente de Login
 */

import { OneSignalService } from '../services/oneSignalConfig';

// ========================================
// NO LOGIN - Após autenticação bem-sucedida
// ========================================

export const handleLoginSuccess = async (userData, subDomain) => {
  try {
    console.log('🔔 Configurando OneSignal para usuário:', userData.id);

    // 1. Associar o ID do usuário ao OneSignal
    await OneSignalService.setExternalUserId(userData.id.toString());

    // 2. Adicionar tags para segmentação
    const tags = {
      userId: userData.id.toString(),
      nome: userData.nome || userData.name || 'Usuário',
      email: userData.email || '',
      tipoUsuario: userData.permissions || userData.userType || 'aluno',

      // White Label específico
      whiteLabel: subDomain || 'geral',
      plano: userData.plano || userData.plan || 'free',

      // Metadata
      ultimoLogin: new Date().toISOString(),
      plataforma: 'web-pwa-' + subDomain,
      idioma: navigator.language || 'pt-BR',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    await OneSignalService.setTags(tags);

    // 3. Enviar evento de login
    await OneSignalService.sendOutcome('user_logged_in');

    console.log('✅ OneSignal configurado com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao configurar OneSignal:', error);
    // NÃO bloquear o login se houver erro no OneSignal
  }
};

// ========================================
// NO LOGOUT
// ========================================

export const handleLogout = async () => {
  try {
    console.log('🔔 Removendo associação do OneSignal');

    // Remover associação do usuário
    await OneSignalService.removeExternalUserId();

    // Enviar evento de logout
    await OneSignalService.sendOutcome('user_logged_out');

    console.log('✅ Usuário desvinculado do OneSignal');

  } catch (error) {
    console.error('❌ Erro ao desvincular OneSignal:', error);
  }
};

// ========================================
// EXEMPLO DE USO NO COMPONENTE DE LOGIN
// ========================================

/*
import { handleLoginSuccess, handleLogout } from './oneSignalLoginIntegration';

// No seu componente de Login
const Login = () => {
  const handleSubmit = async (credentials) => {
    try {
      // 1. Fazer login normal
      const response = await api.post('/login', credentials);
      const userData = response.data;

      // 2. Salvar no localStorage
      localStorage.setItem('authorization', userData.token);
      localStorage.setItem('loggedIn', JSON.stringify(userData));

      // 3. Configurar OneSignal (não-bloqueante)
      handleLoginSuccess(userData).catch(err => {
        console.warn('OneSignal setup failed:', err);
      });

      // 4. Redirecionar
      navigate('/');

    } catch (error) {
      console.error('Erro no login:', error);
      setError('Credenciais inválidas');
    }
  };

  return (
    // ... seu JSX
  );
};
*/

// ========================================
// EVENTOS ADICIONAIS (OPCIONAL)
// ========================================

// Quando usuário completa uma aula
export const handleAulaConcluida = async (aulaInfo) => {
  try {
    await OneSignalService.setTags({
      ultimaAula: aulaInfo.id,
      ultimaAulaData: new Date().toISOString(),
      totalAulasConcluidas: aulaInfo.totalConcluidas
    });

    await OneSignalService.sendOutcome('aula_concluida');
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
  }
};

// Quando usuário faz upgrade de plano
export const handleUpgradePlano = async (novoPlano) => {
  try {
    await OneSignalService.setTags({
      plano: novoPlano,
      dataUpgrade: new Date().toISOString()
    });

    await OneSignalService.sendOutcome('upgrade_plano', 1);
  } catch (error) {
    console.error('Erro ao atualizar plano:', error);
  }
};

// Quando usuário acessa um módulo específico
export const handleModuloAcessado = async (moduloNome) => {
  try {
    await OneSignalService.setTags({
      ultimoModulo: moduloNome,
      ultimoAcesso: new Date().toISOString()
    });

    await OneSignalService.sendOutcome('modulo_acessado');
  } catch (error) {
    console.error('Erro ao registrar acesso:', error);
  }
};

