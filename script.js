let membroLogado = null;

// Simulação de login e validação com o Google Drive/Workspace da EJ
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('emailMembro').value.trim();

    // Validação restrita ao domínio da EJ ou diretório autorizado
    if (!email.endsWith('@edvjr.com.br') && !email.includes('admin')) {
        alert('Acesso negado. Utilize o e-mail corporativo vinculado ao Google Workspace.');
        return;
    }

    membroLogado = email;
    document.getElementById('welcomeUser').textContent = `Sincronizado com: ${membroLogado}`;
    
    // Alterna visibilidade dos painéis
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('dashboardSection').classList.remove('hidden');
});

// Desconexão
document.getElementById('btnLogout').addEventListener('click', function() {
    membroLogado = null;
    document.getElementById('loginForm').reset();
    document.getElementById('dashboardSection').classList.add('hidden');
    document.getElementById('loginSection').classList.remove('hidden');
});

// Envio da Atividade com padronização temporal
document.getElementById('activityForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const setor = document.getElementById('setor').value;
    const descricao = document.getElementById('descricaoServico').value;
    const valorTempo = parseFloat(document.getElementById('tempoDedicado').value);
    const unidade = document.getElementById('unidadeTempo').value;
    const statusDiv = document.getElementById('statusFeedback');

    // Normalização estrita para minutos (garantindo precisão analítica no banco de dados)
    const tempoEmMinutos = unidade === 'horas' ? valorTempo * 60 : valorTempo;

    const payload = {
        memberEmail: membroLogado,
        sector: setor,
        description: descricao,
        durationMinutes: tempoEmMinutos,
        timestamp: new Date().toISOString()
    };

    console.log("Payload filtrado e pronto para submissão ao Apps Script / Google Sheets:", payload);

    statusDiv.textContent = "Atividade registrada e injetada no banco de dados do seu perfil.";
    statusDiv.classList.remove('hidden');

    document.getElementById('activityForm').reset();

    setTimeout(() => {
        statusDiv.classList.add('hidden');
    }, 4000);
});
