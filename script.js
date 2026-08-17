// ==========================================
// CONFIGURAÇÃO DE AMBIENTE E ESTADO
// ==========================================
const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbzjY9CKxj_zorES0VldGOsQHel21q0qIEMZNFXZa2HjJL8R3dLueiLQQB3dT9sWd9TOwA/exec";
const CHAVE_SESSAO = 'kamiclock_sessao_email';
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
function entrarComoMembro(email) {
    membroLogado = email;
    const nomeMembro = membrosAutorizados[email];
    document.getElementById('welcomeUser').textContent = `Sessão ativa vinculada a: ${nomeMembro}`;
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('dashboardSection').classList.remove('hidden');
    renderHistorico();
}

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Captura e sanitiza o vetor de entrada
    const email = document.getElementById('emailMembro').value.trim().toLowerCase();

    // Validação de segurança primária via Whitelist
    // (isso roda no navegador, então é um filtro de conveniência, não uma
    // proteção real — qualquer pessoa com o console aberto veria a lista.
    // Para dados sensíveis, a autenticação de verdade precisaria acontecer
    // no backend, ex: Google OAuth via Apps Script.)
    if (!membrosAutorizados.hasOwnProperty(email)) {
        alert('Acesso negado. Credencial não consta na matriz de autorização do sistema.');
        return;
    }

    localStorage.setItem(CHAVE_SESSAO, email);
    entrarComoMembro(email);
});

// Restaura a sessão se o membro já tinha autenticado antes neste navegador
const sessaoSalva = localStorage.getItem(CHAVE_SESSAO);
if (sessaoSalva && membrosAutorizados.hasOwnProperty(sessaoSalva)) {
    entrarComoMembro(sessaoSalva);
}

// ==========================================
// 2. ENCERRAMENTO DE SESSÃO
// ==========================================
document.getElementById('btnLogout').addEventListener('click', function() {
    membroLogado = null;
    localStorage.removeItem(CHAVE_SESSAO);
    document.getElementById('loginForm').reset();

    document.getElementById('dashboardSection').classList.add('hidden');
    document.getElementById('loginSection').classList.remove('hidden');
});

// ==========================================
// 3. HISTÓRICO LOCAL DA SESSÃO (feedback visual apenas —
//    a fonte de verdade continua sendo a planilha, via Apps Script)
// ==========================================
let historicoSessao = [];

function renderHistorico() {
    const lista = document.getElementById('listaHistorico');
    if (!lista) return;
    lista.innerHTML = '';

    if (historicoSessao.length === 0) {
        const li = document.createElement('li');
        li.className = 'item-vazio';
        li.textContent = 'Nenhum registro ainda nesta sessão.';
        lista.appendChild(li);
        return;
    }

    historicoSessao.forEach((item) => {
        const li = document.createElement('li');

        const spanSetor = document.createElement('span');
        spanSetor.className = 'item-setor';
        spanSetor.textContent = item.sector;

        const spanTempo = document.createElement('span');
        spanTempo.className = 'item-tempo';
        spanTempo.textContent = item.durationMinutes + ' min';

        li.appendChild(spanSetor);
        li.appendChild(spanTempo);
        lista.appendChild(li);
    });
}

// ==========================================
// 4. PROCESSAMENTO TEMPORAL E TRANSMISSÃO HTTP
// ==========================================
document.getElementById('activityForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const btnSalvar = document.getElementById('btnSalvar');
    const statusDiv = document.getElementById('statusFeedback');

    const valorTempo = parseFloat(document.getElementById('tempoDedicado').value);
    const unidade = document.getElementById('unidadeTempo').value;
    const tempoEmMinutos = unidade === 'horas' ? (valorTempo * 60) : valorTempo;

    const payload = {
        memberEmail: membroLogado,
        sector: document.getElementById('setor').value.trim(),
        description: document.getElementById('descricaoServico').value.trim(),
        durationMinutes: tempoEmMinutos,
        timestamp: new Date().toISOString()
    };

    btnSalvar.textContent = "Processando transação...";
    btnSalvar.disabled = true;

    try {
        // Content-Type "text/plain" (em vez de "application/json") faz o
        // navegador tratar isso como "requisição simples", sem preflight
        // OPTIONS — que é exatamente o que o Apps Script Web App não sabe
        // responder e travava a chamada. Sem preflight, a chamada NÃO
        // precisa mais do modo 'no-cors', e dá pra ler a resposta de
        // verdade em vez de simplesmente assumir sucesso.
        const resposta = await fetch(URL_APPS_SCRIPT, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
        });

        const resultado = await resposta.json();

        if (!resultado || resultado.success !== true) {
            throw new Error((resultado && resultado.error) || 'O servidor não confirmou o salvamento.');
        }

        statusDiv.textContent = "Registro enviado com sucesso.";
        statusDiv.className = "feedback-box success";
        statusDiv.classList.remove('hidden');

        historicoSessao.unshift(payload);
        renderHistorico();
        document.getElementById('activityForm').reset();

    } catch (error) {
        statusDiv.textContent = "Não foi possível confirmar o envio: " + error.message;
        statusDiv.className = "feedback-box error";
        statusDiv.classList.remove('hidden');
    } finally {
        btnSalvar.textContent = "Registrar Atividade no Banco";
        btnSalvar.disabled = false;

        setTimeout(() => {
            statusDiv.classList.add('hidden');
        }, 5000);
    }
});
