// Exemplo de como integrar OneSignal no sistema de Login do ARVIN
// Adicione este código no seu componente de Login após o login bem-sucedido

import { OneSignalService } from '../services/oneSignalConfig';

// Exemplo 1: Após login bem-sucedido
const handleLoginSuccess = async (userData) => {
  try {
    // Associar o ID do usuário ao OneSignal
    await OneSignalService.setExternalUserId(userData.id);

    // Adicionar tags para segmentação de notificações
    await OneSignalService.setTags({
      userId: userData.id,
      nome: userData.nome,
      email: userData.email,
      tipoUsuario: userData.tipo || 'aluno', // 'aluno', 'professor', 'responsavel'
      curso: userData.curso || 'ingles-negocios',
      nivel: userData.nivel || 'iniciante',
      plano: userData.plano || 'free',
      ultimoLogin: new Date().toISOString(),
      idioma: navigator.language || 'pt-BR'
    });

    // Enviar evento de conversão
    await OneSignalService.sendOutcome('user_logged_in');

    console.log('✅ Usuário vinculado ao OneSignal para notificações');
  } catch (error) {
    console.error('Erro ao configurar OneSignal:', error);
    // Não bloquear o login se houver erro
  }
};

// Exemplo 2: No Logout
const handleLogout = async () => {
  try {
    // Remover associação do usuário
    await OneSignalService.removeExternalUserId();
    console.log('✅ Usuário desvinculado do OneSignal');
  } catch (error) {
    console.error('Erro ao desvincular OneSignal:', error);
  }

  // ... resto do código de logout
};

// Exemplo 3: Quando usuário completa uma aula
const handleAulaConcluida = async (aulaId, moduloId) => {
  try {
    // Atualizar tags
    await OneSignalService.setTags({
      ultimaAula: aulaId,
      ultimoModulo: moduloId,
      ultimaAtividade: new Date().toISOString(),
      totalAulasConcluidas: userData.aulasConcluidasCount
    });

    // Enviar outcome
    await OneSignalService.sendOutcome('aula_concluida');
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
  }
};

// Exemplo 4: Quando usuário faz upgrade de plano
const handleUpgradePlano = async (novoPlano) => {
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

export {
  handleLoginSuccess,
  handleLogout,
  handleAulaConcluida,
  handleUpgradePlano
};

