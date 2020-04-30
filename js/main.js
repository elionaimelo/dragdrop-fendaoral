window.onload = () => {
  const conteudos = document.querySelectorAll(".empty");
  const titulos = document.querySelectorAll(".title-card");
  const panel_titulo = document.querySelector(".titulos");
  //Array que armazenará os títulos incorretos
  var erros = [];
  // DOM do evento dragstart
  var currentDOM;
  // Eventos de interaçôes
  for (const titulo of titulos) {
    titulo.addEventListener("dragstart", dragStart);
    titulo.addEventListener("dragend", dragEnd);
  }
  for (const conteudo of conteudos) {
    conteudo.addEventListener("dragover", dragOver);
    conteudo.addEventListener("dragenter", dragEnter);
    conteudo.addEventListener("dragleave", dragLeave);
    conteudo.addEventListener("drop", dragDrop);
  }

  //Eventos de devolucao cards para o painel
  panel_titulo.addEventListener("dragover", dragOver_Panel);
  panel_titulo.addEventListener("dragenter", dragEnter_Panel);
  panel_titulo.addEventListener("dragleave", dragLeave_Panel);
  panel_titulo.addEventListener("drop", dragDrop_Panel);

  // Funçôes dos eventos

  function dragStart() {
    setTimeout(() => (this.className = "invisible"), 0);
    currentDOM = this;
  }

  function dragEnd() {
    this.className = "title-card";
  }

  function dragOver(e) {
    e.preventDefault();
  }
  function dragEnter(e) {
    e.preventDefault();
    if (this.className) {
      this.className += " hovered";
    }
  }
  function dragLeave() {
    if (this.className) {
      this.className = "empty";
    }
  }

  function dragDrop() {
    countCards();
    if (this.childNodes.length < 4) {
      this.id = "removeSpan";
      this.className = "";
      this.append(currentDOM);
      checkConteudos();
    }
    setTimeout(() => {
      if (
        !checarResp() &&
        !document.querySelector(".titulos").childElementCount
      ) {
        let modal = document.querySelector("#myModal-again");
        modal.className += " show";
        modal.setAttribute("aria-hidden", "false");
        modal.setAttribute("style", "display: flex");
      } else if (checarResp()) {
        isComplete();
      }
    }, 250);
    if (document.querySelector(".titulos").childElementCount < 5) {
      document.querySelector(".titulos").className += " centralize";
    }
  }

  function corrigirPainel(wrong_cards, id_acertos) {
    if (erros.length) {
      let vazios = document.querySelectorAll("#removeSpan");
      let cnt_acertos = 10;
      wrong_cards.forEach(card => {
        document.querySelector(".titulos").prepend(card);
      });
      vazios.forEach(element => {
        if (id_acertos.indexOf(element.attributes[1].value) < 0) {
          element.id = "";
          element.className = "empty";
          cnt_acertos--;
        }
      });
      document.querySelector(
        "span#actual-score"
      ).textContent = `${cnt_acertos}`;
      document
        .querySelector(".score")
        .setAttribute("style", "visibility: visible");
      let n_cards = document.querySelector(".titulos").childElementCount;
      document.querySelector("#number-card").textContent = `${n_cards}`;
      document.querySelector(".titulos").className = "titulos col-3";
      erros = [];
    }
  }

  function countCards() {
    let n_cards = document.querySelector(".titulos").childElementCount - 1;
    document.querySelector("#number-card").textContent = `${n_cards}`;
  }

  function checarResp() {
    if (!document.querySelector(".titulos").childElementCount) {
      let alternativas = document.querySelectorAll("#removeSpan");
      let respostas = document.querySelectorAll(".title-card");
      let alt = [];
      let resp = [];
      let acertos = [];
      alternativas.forEach(element => {
        alt.push(element.attributes[1].value);
      });
      respostas.forEach(element => {
        resp.push(element.attributes[2].value);
      });  
      for (let index = 0; index < resp.length; index++) {
        console.log(resp[index]);
        
        setTimeout(() => {
          if (resp[index] != alt[index] || resp[3] == alt[3]) {
            erros.push(respostas[index]);
            if (respostas.length > 0) {
              respostas[index].remove();
            }
            
          } else if (resp[index] == alt[index]) {
            acertos.push(alternativas[index].attributes[1].value);
          }
        }, 0);
      }
      if (!(alt.toString() == resp.toString())) {
        setTimeout(() => corrigirPainel(erros, acertos)), 300;
      }
      return alt.toString() == resp.toString();
    } else {
      return false;
    }
  }
  //Verifica se o usuário ganhou o jogo
  function isComplete() {
    setTimeout(() => {
      let titulos = document.querySelectorAll(".title-card");
      titulos.forEach(element => {
        element.removeAttribute("draggable");
      });
      let modal = document.querySelector("#myModal");
      modal.className += " show";
      modal.setAttribute("aria-hidden", "false");
      modal.setAttribute("style", "display: flex");
    }, 300);
  }

  function checkConteudos() {
    conteudos.forEach(conteudo => {
      if (!conteudo.className && !conteudo.childNodes[3]) {
        conteudo.className = "empty";
        conteudo.id = "";
      }
    });
  }

  //Funcoes de eventos painel de titulos
  function dragOver_Panel(e) {
    e.preventDefault();
    if (this.className === "titulos col-3") {
      this.className += " hoverTitulos";
    }
  }

  function dragEnter_Panel(e) {
    e.preventDefault();
  }
  function dragLeave_Panel() {
    this.className = "titulos col-3";
    if (document.querySelector(".titulos").childElementCount < 5) {
      document.querySelector(".titulos").className += " centralize";
    }
  }
  function dragDrop_Panel() {
    if (document.querySelector(".titulos").childElementCount < 4) {
      document.querySelector(".titulos").className += " centralize";
    } else {
      this.className = "titulos col-3";
    }
    this.prepend(currentDOM);
    checkConteudos();
  }
};
