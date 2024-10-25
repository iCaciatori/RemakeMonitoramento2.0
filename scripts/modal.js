export class Modal {
  constructor(servidor) {
    this.servidor = servidor;
  }

  mostrarModal(idMaquina) {
    const maquina = this.servidor.maquinas.find((m) => m.id === idMaquina);

    if (maquina) {
      const mediaTemperatura = this.calcularMedia(
        maquina.historicos.find((h) => h.chave === "temperatura").historico
      );
      const mediaRuido = this.calcularMedia(
        maquina.historicos.find((h) => h.chave === "ruido").historico
      );
      const mediaRpm = this.calcularMedia(
        maquina.historicos.find((h) => h.chave === "rpm").historico
      );
      const mediaUmidade = this.calcularMedia(
        maquina.historicos.find((h) => h.chave === "umidade").historico
      );

      document.getElementById("idMaq").innerText = `ID: ${maquina.id}`;
      document.getElementById("statusMaq").innerText = `Status: ${maquina.statusMaquina}`;
      document.getElementById("tempMaq").innerText = `Média Temperatura: ${mediaTemperatura.toFixed(2)} °C`;
      document.getElementById("ruidoMaq").innerText = `Média Ruído: ${mediaRuido.toFixed(2)} dB`;
      document.getElementById("rpmMaq").innerText = `Média RPM: ${mediaRpm.toFixed(2)}`;
      document.getElementById("umidMaq").innerText = `Média Umidade: ${mediaUmidade.toFixed(2)}%`;

      document.getElementById("modal").style.display = "block";
      this.renderizarGrafico(maquina.historicos);
    }
  }
  
  renderizarGrafico(historicos) {
    d3.select("#grafico").selectAll("*").remove();

    const data = historicos.map((h) => ({
      chave: h.chave,
      historico: h.historico,
    }));

    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3
      .select("#grafico")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data[0].historico, (_, i) => i)])
      .range([0, width]);

    const yScale = d3.scaleLinear().domain([0, 550]).range([height, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g").attr("transform", `translate(0,${height})`).call(xAxis);
    svg.append("g").call(yAxis);

    data.forEach((d, i) => {
      const line = d3
        .line()
        .x((_, index) => xScale(index))
        .y((value) => yScale(value));

      svg
        .append("path")
        .datum(d.historico)
        .attr("fill", "none")
        .attr("stroke", d3.schemeCategory10[i % 10])
        .attr("d", line);
    });

    this.adicionarLegenda(svg, data);
  }

  adicionarLegenda(svg, data) {
    const legend = svg
      .selectAll(".legend")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legend
      .append("rect")
      .attr("x", 400)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", (d, i) => d3.schemeCategory10[i % 10]);

    legend
      .append("text")
      .attr("x", 390)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text((d) => d.chave);
  }

  /**
   * Calcula a media do historico necessario
   * @param {object} historico
   * @returns media
   */
  calcularMedia(historico) {
    if (historico.length === 0) return 0;
    const soma = historico.reduce((acc, valor) => acc + valor, 0);
    return soma / historico.length;
  }

  /**
   * Botao de fechar o modal
   */
  fecharModal() {
    const btnClose = document.getElementById("modal-close");

    btnClose.addEventListener("click", (event) => {
      modal.style.display = "none";
    });
  }
}
