export class Maquina {
  /**
   * Construtor da classe máquina. Define o status da maquina como "desligada" para todas começarem desligadas
   * @param {string} id
   */
  constructor(id, tipoMaquina) {
    this.id = id;
    this.statusMaquina = "desligada";
    this.tipoMaquina = tipoMaquina;
    this.valoresAntigos = {};
    this.atributos = {};
    this.historicos = {};

    this.tipoMaquina.atributos.forEach((atributo) => {
      this.valoresAntigos[atributo.nome] = atributo.valorInicial;
      this.atributos[atributo.nome] = atributo.valorInicial;
      this.historicos[atributo.nome] = [];
    });

    this.criada = true;
  }

  /**
   * Faz a "coleta" (geração de números aleatórios) da máquina.
   * Envia ao painel de controle responsável. Pode enviar para mais de um painel.
   * @returns id, status, temperatura, ruido, rpm, umidade
   */
  coletarDados() {
    /**
     * Gera números aleatórios arredondados para duas casas decimais.
     */
    if (this.statusMaquina === "ligada") {
      Object.keys(this.atributos).forEach((chave) => {
        let valorAtual = this.atributos[chave];
        let novoValor = Math.random() <= 0.5 ? valorAtual - Math.random() : valorAtual + Math.random();
        this.atributos[chave] = parseFloat(novoValor.toFixed(2));
        this.historicos[chave].unshift(this.atributos[chave]); 
      });
    } else {
      Object.keys(this.atributos).forEach((chave) => {
        this.atributos[chave] = this.valoresAntigos[chave];
      });
    }

    /**
     * Retorna os números gerados.
     */
    return {
      id: this.id,
      status: this.statusMaquina,
      ...this.atributos
    };
  }
}
