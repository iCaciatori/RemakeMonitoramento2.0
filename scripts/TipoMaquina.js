export class TipoMaquina {
    constructor(nome) {
        this.nome = nome;
        this.atributos = [];
    }

    adicionarAtributo(nome, valorInicial) {
        this.atributos.push({ nome: nome, valorInicial: valorInicial });
        console.log(this.atributos); ///////////////////////////////////////////////////
    }

    obterLimite(chave) {
        for (const atributo of this.atributos) {
            if (atributo.nome === chave) {
                return atributo.valorInicial * 2;
            }
        }
        return null; // Retorna null se o atributo não for encontrado
    }

    atributosValidos() {
        return this.atributos.length > 0;
    }

    mostrarAtributos() {
        console.log(`Tipo de Máquina: ${this.nome}, Atributos:`, this.atributos);
    }
}
