export class Maquina {
  /**
   * Construtor da classe máquina. Define o status da maquina como "desligada" para todas começarem desligadas
   * @param {string} id
   */
  constructor(id, tipoMaquina) {
    this.id = id;
    this.statusMaquina = "desligada";
    this.tipoMaquina = tipoMaquina;


    console.log(this);
    

    this.tipoMaquina.atributos.forEach((atributo) => {
      console.log(atributo.nome);
      console.log(atributo.valorInicial);
      this.atributos[atributo.nome] = atributo.valorInicial;
      this.historicos[atributo.nome] = []; // Inicializa o histórico como um array vazio
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
      Object.keys(this.atributos).forEach(chave => {
        let valorAtual = this.atributos[chave];
        let novoValor = Math.random() <= 0.5 ? valorAtual - Math.random() : valorAtual + Math.random();
        this.atributos[chave] = parseFloat(novoValor.toFixed(2)); // Atualiza o valor arredondado
        this.historicos[chave].unshift(this.atributos[chave]); // Adiciona o novo valor ao histórico
      });
    } else {
      Object.keys(this.atributos).forEach(chave => {
        this.atributos[chave] = 0; // Atualiza o valor arredondado
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
