document.getElementById('contractForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const contratante = document.getElementById('contratante').value;
    const cnpj = document.getElementById('cnpj').value;
    const valor = document.getElementById('valor').value;
    const btn = document.getElementById('btnGerar');
    const statusDiv = document.getElementById('statusMessage');

    // Desativa o botão para evitar envio duplicado
    btn.disabled = true;
    btn.textContent = 'Transmitindo para a nuvem...';

    const payload = {
        client: contratante,
        taxId: cnpj,
        amount: valor,
        timestamp: new Date().toISOString()
    };

    // URL gerada após publicar o seu Google Apps Script como Web App
    const WEB_APP_URL = 'COLOQUE_AQUI_A_URL_DO_SEU_WEB_APP_DO_APPS_SCRIPT';

    fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors', // Necessário para requisições cross-origin simples do GitHub Pages para o Google
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(() => {
        statusDiv.textContent = "Dados transmitidos com sucesso. Minuta enfileirada no motor de geração.";
        statusDiv.classList.remove('hidden');

        document.getElementById('contractForm').reset();
        btn.disabled = false;
        btn.textContent = 'Gerar Minuta no Sistema';
    })
    .catch(error => {
        console.error("Erro na transmissão:", error);
        statusDiv.textContent = "Erro crítico na comunicação com o servidor.";
        statusDiv.classList.remove('hidden');
        statusDiv.style.backgroundColor = "#ffeeef";
        statusDiv.style.color = "#990000";
        
        btn.disabled = false;
        btn.textContent = 'Gerar Minuta no Sistema';
    });
});
