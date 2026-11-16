document.addEventListener("DOMContentLoaded", () => {
  const grade = document.getElementById("gradeProdutos");
  const busca = document.getElementById("campoBusca");
  const filtro = document.getElementById("filtroCategoria");
  const mensagemVazia = document.getElementById("mensagemVazia");
  const contador = document.getElementById("contadorCarrinho");
  const fundoModal = document.getElementById("fundoModal");
  const itensCarrinho = document.getElementById("itensCarrinho");
  const totalCarrinho = document.getElementById("totalCarrinho");
  const toast = document.getElementById("toast");
  let carrinho = JSON.parse(localStorage.getItem("bellaCarrinho") || "[]");

  const dinheiro = valor => valor.toLocaleString("pt-BR", {style:"currency",currency:"BRL"});
  const salvarCarrinho = () => localStorage.setItem("bellaCarrinho", JSON.stringify(carrinho));
  function aviso(texto) {
    toast.textContent = texto;
    toast.classList.add("visivel");
    clearTimeout(aviso.timer);
    aviso.timer = setTimeout(() => toast.classList.remove("visivel"), 2300);
  }

  function renderizarProdutos(lista = produtos) {
    grade.innerHTML = lista.map(p => `
      <article class="produto-card">
        ${p.promocao ? '<span class="etiqueta">EM DESTAQUE</span>' : ""}
        <div class="produto-imagem"><img src="${p.imagem}" alt="${p.nome}" loading="lazy"></div>
        <div class="produto-info">
          <span class="produto-marca">${p.marca} · ${p.categoria}</span>
          <h3>${p.nome}</h3>
          <p class="produto-descricao">${p.descricao}</p>
          <p class="preco">${dinheiro(p.preco)}</p>
          <div class="acoes-produto">
            <button type="button" data-detalhe="${p.id}">Detalhes</button>
            <button type="button" data-adicionar="${p.id}">Adicionar</button>
          </div>
        </div>
      </article>`).join("");
    mensagemVazia.hidden = lista.length !== 0;
  }

  function filtrar() {
    const termo = busca.value.trim().toLocaleLowerCase("pt-BR");
    const categoria = filtro.value;
    const resultado = produtos.filter(p =>
      (categoria === "Todos" || p.categoria === categoria) &&
      (p.nome.toLocaleLowerCase("pt-BR").includes(termo) ||
       p.marca.toLocaleLowerCase("pt-BR").includes(termo) ||
       p.descricao.toLocaleLowerCase("pt-BR").includes(termo))
    );
    renderizarProdutos(resultado);
  }

  function atualizarCarrinho() {
    contador.textContent = carrinho.reduce((s, item) => s + item.quantidade, 0);
    if (!carrinho.length) {
      itensCarrinho.innerHTML = '<p class="mensagem-vazia">Seu carrinho está vazio.</p>';
    } else {
      itensCarrinho.innerHTML = carrinho.map(item => {
        const p = produtos.find(prod => prod.id === item.id);
        if (!p) return "";
        return `<div class="item-carrinho">
          <img src="${p.imagem}" alt="">
          <div><h3>${p.nome}</h3><p>${dinheiro(p.preco)}</p>
          <div class="controles-qtd">
            <button data-menos="${p.id}" aria-label="Diminuir">−</button>
            <span>${item.quantidade}</span>
            <button data-mais="${p.id}" aria-label="Aumentar">+</button>
          </div></div>
          <button class="remover" data-remover="${p.id}">Remover</button>
        </div>`;
      }).join("");
    }
    const total = carrinho.reduce((s, item) => {
      const p = produtos.find(prod => prod.id === item.id);
      return s + (p ? p.preco * item.quantidade : 0);
    }, 0);
    totalCarrinho.textContent = dinheiro(total);
    salvarCarrinho();
  }

  grade.addEventListener("click", e => {
    const adicionar = e.target.closest("[data-adicionar]");
    const detalhe = e.target.closest("[data-detalhe]");
    if (adicionar) {
      const id = Number(adicionar.dataset.adicionar);
      const existente = carrinho.find(i => i.id === id);
      existente ? existente.quantidade++ : carrinho.push({id,quantidade:1});
      atualizarCarrinho();
      aviso("Produto adicionado ao carrinho!");
    }
    if (detalhe) {
      const p = produtos.find(prod => prod.id === Number(detalhe.dataset.detalhe));
      if (p) aviso(`${p.nome} — ${p.descricao}`);
    }
  });

  itensCarrinho.addEventListener("click", e => {
    const mais = e.target.closest("[data-mais]");
    const menos = e.target.closest("[data-menos]");
    const remover = e.target.closest("[data-remover]");
    if (mais) carrinho.find(i => i.id === Number(mais.dataset.mais)).quantidade++;
    if (menos) {
      const item = carrinho.find(i => i.id === Number(menos.dataset.menos));
      item.quantidade--;
      if (item.quantidade <= 0) carrinho = carrinho.filter(i => i.id !== item.id);
    }
    if (remover) carrinho = carrinho.filter(i => i.id !== Number(remover.dataset.remover));
    atualizarCarrinho();
  });

  document.getElementById("abrirCarrinho").addEventListener("click", () => fundoModal.hidden = false);
  document.getElementById("fecharCarrinho").addEventListener("click", () => fundoModal.hidden = true);
  fundoModal.addEventListener("click", e => { if (e.target === fundoModal) fundoModal.hidden = true; });
  document.getElementById("finalizarCompra").addEventListener("click", () => {
    if (!carrinho.length) return aviso("Adicione algum produto antes.");
    aviso("Demonstração concluída! Nenhum pagamento foi realizado.");
  });

  busca.addEventListener("input", filtrar);
  filtro.addEventListener("change", filtrar);
  document.getElementById("listaCategorias").addEventListener("click", e => {
    const botao = e.target.closest("[data-categoria]");
    if (!botao) return;
    filtro.value = botao.dataset.categoria;
    filtrar();
    document.getElementById("produtos").scrollIntoView({behavior:"smooth"});
  });
  document.getElementById("verPromocoes").addEventListener("click", () => {
    filtro.value = "Todos";
    busca.value = "";
    renderizarProdutos(produtos.filter(p => p.promocao));
  });
  document.getElementById("formContato").addEventListener("submit", e => {
    e.preventDefault();
    document.getElementById("retornoContato").textContent = "Mensagem registrada apenas nesta demonstração. Obrigado!";
    e.target.reset();
  });
  document.getElementById("menuToggle").addEventListener("click", () => document.getElementById("menu").classList.toggle("aberto"));
  document.querySelectorAll("#menu a").forEach(link => link.addEventListener("click", () => document.getElementById("menu").classList.remove("aberto")));
  document.getElementById("anoAtual").textContent = new Date().getFullYear();

  renderizarProdutos();
  atualizarCarrinho();
});
