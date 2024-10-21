export class Operador {
  /**
   * Construtor do operador
   * @param {string} nome
   */
  constructor(nome) {
    this.nome = nome;
    this.historicoNotificacoes = [];
  }

  /**
   * Recebe a notificação/mensagem enviada pelo servidor para o operador caso ocorra alguma falha.
   * @param {string} mensagem
   */
  receberNotificacao(mensagem, id) {
    console.log(`Notificação: ${mensagem}`);
    if (this.historicoNotificacoes.length >= 15) {
      this.historicoNotificacoes.pop(); // Remove o elemento mais antigo
    }
    this.historicoNotificacoes.unshift({ mensagem, id }); // Adiciona o novo valor ao início do array
  }

  getNome() {
    return this.nome;
  }
}
