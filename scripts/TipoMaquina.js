export class TipoMaquina {
    constructor(nome) {
        this.nome = nome;
        this.atributos = [];
    }

    adicionarAtributo(nome, valorInicial) {
        this.atributos.push({ nome: nome, valorInicial: valorInicial});
        console.log(this.atributos); ///////////////////////////////////////////////////
    }

    atributosValidos() {
        return this.atributos.length > 0;
    }

    mostrarAtributos() {
        console.log(`Tipo de Máquina: ${this.nome}, Atributos:`, this.atributos);
    }
}
