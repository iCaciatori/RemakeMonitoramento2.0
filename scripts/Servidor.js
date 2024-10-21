export class Servidor {
  constructor(operador) {
    this.maquinas = [];
    this.operador = operador;
  }

  adicionarMaquina(maquina) {
    this.maquinas.push(maquina);
  }

  atualizarStatusMaquina(id, status) {
    const maquina = this.maquinas.find((maq) => maq.id === id);
    if (maquina) {
      maquina.statusMaquina = status;
      console.log(`Máquina ${id} status: ${status}`);
      return;
    }
  }

  getNomeOperador() {
    return this.operador.getNome();
  }

  notificarUsuario(mensagem, id) {
    this.operador.receberNotificacao(mensagem, id);
  }
}
