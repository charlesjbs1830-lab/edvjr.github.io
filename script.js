document.getElementById('timeLogForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const membro = document.getElementById('membro').value;
    const projeto = document.getElementById('projeto').value;
    const executadas = parseFloat(document.getElementById('horasExecutadas').value);
    const esperadas = parseFloat(document.getElementById('horasEsperadas').value);
    const containerMetricas = document.getElementById('resultadoMetricas');

    // Validação matemática de ociosidade
    // Ociosidade (%) = (1 - (Executadas / Esperadas)) * 100
    let ociosidade = 0;
    if (esperadas > 0) {
        ociosidade = (1 - (executadas / esperadas)) * 100;
        if (ociosidade < 0) ociosidade = 0; // Se entregou mais do que o esperado
    }

    const payload = {
        member: membro,
        project: projeto,
        executedHours: executadas,
        expectedHours: esperadas,
        idlenessRate: ociosidade.toFixed(2),
        timestamp: new Date().toISOString()
    };

    console.log("Payload computado:", payload);

    // Renderiza o resultado visual dinamicamente no painel lateral
    containerMetricas.innerHTML = `
        <div style="width: 100%; text-align: left;">
            <div class="metric-box">
                <span>Membro Analisado</span>
                <strong>${membro}</strong>
            </div>
            <div class="metric-box">
                <span>Frente Atendida</span>
                <strong>${projeto}</strong>
            </div>
            <div class="metric-box" style="border-color: ${ociosidade > 20 ? '#fca5a5' : '#bbf7d0'}; background-color: ${ociosidade > 20 ? '#fef2f2' : '#f0fdf4'};">
                <span>Índice de Capacidade Ociosa</span>
                <strong style="color: ${ociosidade > 20 ? '#dc2626' : '#16a34a'};">${ociosidade.toFixed(1)}%</strong>
            </div>
        </div>
    `;

    // Reseta formulário mantendo dados prontos para integração com Google Sheets via Apps Script
    document.getElementById('timeLogForm').reset();
});
