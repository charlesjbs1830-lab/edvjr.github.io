// ==========================================
// CONFIGURAÇÃO DE AMBIENTE E ESTADO
// ==========================================
const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbzjY9CKxj_zorES0VldGOsQHel21q0qIEMZNFXZa2HjJL8R3dLueiLQQB3dT9sWd9TOwA/exec";
let membroLogado = null;

// Matriz de Controle de Acesso Estrito (Whitelist)
const membrosAutorizados = {
    "charles.junior@edvjr.com.br": "Charles",
    "alice.mizuki@edvjr.com.br": "Alice Mizuki",
    "alice.ney@edvjr.com.br": "Alice Ney",
    "alicia.athayde@edvjr.com.br": "Alicia",
    "aline.tartaglia@edvjr.com.br": "Aline",
    "amanda.bede@edvjr.com.br": "Amanda",
    "karolina.krause@edvjr.com.br": "Ana Karolina",
    "estevao.coutinho@edvjr.com.br": "Estevão",
    "evelyn.roldi@edvjr.com.br": "Evelyn",
    "gabriel.orienrac@edvjr.com.br": "Cachorrão",
    "giulia.moulin@edvjr.com.br": "Giulia",
    "guilherme.borges@edvjr.com.br": "Guilherme",
    "isadora.epichin@edvjr.com.br": "Isadora",
    "joaop.lecco@edvjr.com.br": "Chillibão",
    "marialice.bacelar@edvjr.com.br": "Maria Alice",
    "mariaeduarda.dias@edvjr.com.br": "Maria Eduarda",
    "maria.teixeira@edvjr.com.br": "Maria Luyza",
    "marina.moretto@edvjr.com.br": "Marina",
    "marllon.oliveira@edvjr.com.br": "Marllon",
    "pedro.barros@edvjr.com.br": "Pedro Barros",
    "renato.moura@edvjr.com.br": "Renato",
    "samuel.garcia@edvjr.com.br": "Samuel",
    "thais.junger@edvjr.com.br": "Thais"
};

// ==========================================
// 1. SISTEMA DE AUTENTICAÇÃO E CONTROLE DE ACESSO
// ==========================================
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Captura e sanitiza o vetor de entrada
    const email = document.getElementById('emailMembro').value.trim().toLowerCase();

    // Validação de segurança primária via Whitelist
    if (!membrosAutorizados.hasOwnProperty(email)) {
        alert('Acesso negado. Credencial não consta na matriz de autorização do sistema.');
        return;
    }

    // Definição do estado de sessão com injeção do nome mapeado
    membroLogado = email;
    const nomeMembro = membrosAutorizados[email];
    document.getElementById('welcomeUser').textContent = `Sessão ativa vinculada a: ${nomeMembro}`;
    
    // Transição de interface
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('dashboardSection').classList.remove('hidden');
});

// ==========================================
// 2. ENCERRAMENTO DE SESSÃO
// ==========================================
document.getElementById('btnLogout').addEventListener('click', function() {
    membroLogado = null;
    document.getElementById('loginForm').reset();
    
    document.getElementById('dashboardSection').classList.add('hidden');
    document.getElementById('loginSection').classList.remove('hidden');
});

// ==========================================
// 3. PROCESSAMENTO TEMPORAL E TRANSMISSÃO HTTP (CORRIGIDO)
// ==========================================
document.getElementById('activityForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const btnSalvar = document.getElementById('btnSalvar');
    const statusDiv = document.getElementById('statusFeedback');
    
    // Extração e normalização temporal
    const valorTempo = parseFloat(document.getElementById('tempoDedicado').value);
    const unidade = document.getElementById('unidadeTempo').value;
    const tempoEmMinutos = unidade === 'horas' ? (valorTempo * 60) : valorTempo;

    // Payload estruturado
    const payload = {
        memberEmail: membroLogado,
        sector: document.getElementById('setor').value.trim(),
        description: document.getElementById('descricaoServico').value.trim(),
        durationMinutes: tempoEmMinutos,
        timestamp: new Date().toISOString()
    };

    // Bloqueio de interface para prevenção de concorrência
    btnSalvar.textContent = "Processando transação...";
    btnSalvar.disabled = true;

    try {
        // Disparo assíncrono compatível com Google Apps Script
        const response = await fetch(URL_APPS_SCRIPT, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8' // Compatível com redirecionamento do Google sem quebrar CORS
            },
            body: JSON.stringify(payload)
        });

        // Feedback de consolidação
        statusDiv.textContent = "Registro consolidado e injetado na base de dados.";
        statusDiv.style.backgroundColor = "#f0fdf4";
        statusDiv.style.color = "#16a34a";
        statusDiv.classList.remove('hidden');
        document.getElementById('activityForm').reset();

    } catch (error) {
        console.error("Exceção crítica na camada de transporte:", error);
        statusDiv.textContent = "Erro ao registrar. Tente novamente.";
        statusDiv.style.backgroundColor = "#fef2f2";
        statusDiv.style.color = "#dc2626";
        statusDiv.classList.remove('hidden');
    } finally {
        // Restauração do estado neutro da interface
        btnSalvar.textContent = "Registrar Atividade no Banco";
        btnSalvar.disabled = false;
        
        setTimeout(() => {
            statusDiv.classList.add('hidden');
        }, 4000);
    }
});
