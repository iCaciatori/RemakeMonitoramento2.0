import { Modal } from "./modal.js";

export class PainelControle {
  constructor(id, servidor) {
    this.idNum = id;
    this.servidor = servidor;
    this.notificacaoFlags = {};
    this.modalAberto = false;
    this.jaTemp = false;
    this.jaRpm = false;
    this.jaRuido = false;
    this.jaUmid = false;
    this.modal = new Modal(servidor, id);
    this.painelInicializado = false;
    this.somErro = new Audio("../errorSound.mp3");
    this.inicializarPainel();
    
    this.atualizarDadosNoPainel();
  }

  inicializarPainel() {
    const panelId = `panel${this.idNum}`;
    if (!document.getElementById(panelId)) {
      document.body.innerHTML += `
            <div id="${panelId}">
              <h2 class="tituloPainel">PAINEL ${this.idNum}</h2>
              <div id="maquinas${this.idNum}" class="grid"></div>
              <h2 class="resp">Operador responsável: ${this.servidor.getNomeOperador()}</h2>
              <div id="notifications${this.servidor.getNomeOperador()}${
        this.idNum
      }"></div>
            </div>`;
    }
  }

  atualizarDadosNoPainel() {
    const panelElement = document.getElementById(`panel${this.idNum}`);
    const nome = this.servidor.getNomeOperador();
    const maquinasElement = document.getElementById(`maquinas${this.idNum}`);

    if (panelElement && maquinasElement) {
      const notificationsElement = document.getElementById(
        `notifications${nome}${this.idNum}`
      );

      notificationsElement.style.cssText =
        "display: flex; flex-direction: column; align-items: center;";

      this.servidor.maquinas.forEach((maquina) => {
        let dados = maquina.coletarDados();
        const idMaquina = dados.id;

        if (!this.notificacaoFlags[idMaquina]) {
          this.notificacaoFlags[idMaquina] = {
            jaTemp: false,
            jaRpm: false,
            jaRuido: false,
            jaUmid: false,
          };
        }

        const flags = this.notificacaoFlags[idMaquina];

        let maquinaElement = document.getElementById(`maquina-${idMaquina}`);

        const condicoes = [
          {
            chave: "temperatura",
            limite: 120.0,
            mensagem: `Superaquecimento na máquina ${idMaquina}`,
            flag: "jaTemp",
          },
          {
            chave: "rpm",
            limite: 1100.0,
            mensagem: `RPM altíssimo na máquina ${idMaquina}`,
            flag: "jaRpm",
          },
          {
            chave: "ruido",
            limite: 85.0,
            mensagem: `Ruído alto na máquina ${idMaquina}`,
            flag: "jaRuido",
          },
          {
            chave: "umidade",
            limite: 80.0,
            mensagem: `Umidade alta na máquina ${idMaquina}`,
            flag: "jaUmid",
          },
        ];

        condicoes.forEach(({ chave, limite, mensagem, flag }) => {
          const valor = dados[chave];
          if (valor > limite && !flags[flag]) {
            toastr.error(mensagem);
            this.somErro.play();
            this.servidor.notificarUsuario(mensagem, this.idNum);
            flags[flag] = true;
          } else if (valor <= limite) {
            flags[flag] = false;
          }
        });

        if (!maquinaElement) {
          maquinasElement.innerHTML += `
            <div class="maquina" id="maquina-${idMaquina}">
              <h2>Máquina ${dados.id}:</h2>
              <p class="status">Status: ${dados.status}</p>
              <label class="switch">
                <input type="checkbox" ${
                  dados.status === "ligada" ? "checked" : ""
                } data-id="${dados.id}" class="switch-status">
                <span class="slider round"></span>
              </label>
              <p class="temperatura">Temperatura: ${dados.temperatura} °C</p>
              <p class="ruido">Ruído: ${dados.ruido} dB</p>
              <p class="rpm">RPM: ${dados.rpm}</p>
              <p class="umidade">Umidade: ${dados.umidade}%</p>
              <button class="btn" data-id="${dados.id}">Verificar Dados</button>
            </div>
            `;
        } else {
          maquinaElement.querySelector(
            ".status"
          ).innerText = `Status: ${dados.status}`;
          maquinaElement.querySelector(
            ".temperatura"
          ).innerText = `Temperatura: ${dados.temperatura} °C`;
          maquinaElement.querySelector(
            ".ruido"
          ).innerText = `Ruído: ${dados.ruido} dB`;
          maquinaElement.querySelector(".rpm").innerText = `RPM: ${dados.rpm}`;
          maquinaElement.querySelector(
            ".umidade"
          ).innerText = `Umidade: ${dados.umidade}%`;
        }
      });

      notificationsElement.innerHTML =
        this.servidor.operador.historicoNotificacoes
          .filter((notif) => notif.id === this.idNum)
          .map((notif) => `<p class="notificacao">${notif.mensagem}</p>`)
          .join("");

      this.adicionarEventos();
    } else {
      console.error(`Elemento com ID "panel${this.idNum}" não foi encontrado.`);
    }
  }

  adicionarEventos() {
    const maquinasElement = document.getElementById(`maquinas${this.idNum}`);

    if (!maquinasElement) {
      console.error(`Elemento com ID "maquinas${this.idNum}" não encontrado.`);
      return;
    }

    /**
     * Usado para remover event listeners anteriores
     */
    maquinasElement.replaceWith(maquinasElement.cloneNode(true));

    
    const novoMaquinasElement = document.getElementById(
      `maquinas${this.idNum}`
    );

    novoMaquinasElement.addEventListener("change", (event) => {
      if (event.target.classList.contains("switch-status")) {
        const id = event.target.getAttribute("data-id");
        const status = event.target.checked ? "ligada" : "desligada";
        console.log(`Status da máquina ${id}: ${status}`);
        this.servidor.atualizarStatusMaquina(id, status);
        this.atualizarDadosNoPainel();
      }
    });

    novoMaquinasElement.addEventListener("click", (event) => {
      if (event.target.classList.contains("btn")) {
        const idMaquina = event.target.getAttribute("data-id");
        this.modal.mostrarModal(idMaquina);
      }
    });

    this.modal.fecharModal();
  }
}
