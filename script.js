document.getElementById('contractForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const contratante = document.getElementById('contratante').value;
    const cnpj = document.getElementById('cnpj').value;
    const valor = document.getElementById('valor').value;
    const btn = document.getElementById('btnGerar');
    const statusDiv = document.getElementById('statusMessage');

    // Desativa o botão temporariamente para evitar cliques duplos
    btn.disabled = true;
    btn.textContent = 'Processando dados...';

    // Objeto contendo os dados coletados (Payload para a API do Google Sheets / Apps Script)
    const payload = {
        client: contratante,
        taxId: cnpj,
        amount: valor,
        timestamp: new Date().toISOString()
    };

    // Simulação de comunicação assíncrona com o back-end do Apps Script
    setTimeout(() => {
        console.log("Payload pronto para envio ao Google Sheets:", payload);
        
        statusDiv.textContent = "Dados transmitidos com sucesso. Minuta enfileirada no motor de geração.";
        statusDiv.classList.remove('hidden');

        // Reseta o formulário
        document.getElementById('contractForm').reset();
        btn.disabled = false;
        btn.textContent = 'Gerar Minuta no Sistema';
    }, 1200);
});
