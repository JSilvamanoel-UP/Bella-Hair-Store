document.addEventListener("DOMContentLoaded", () => {
  const CHAVE_PRODUTOS = "bellaProdutos";
  const SENHA_DEMO = "bella2026";
  const $ = id => document.getElementById(id);
  const login = $("loginAdmin");
  const painel = $("painelAdmin");
  const form = $("formProduto");
  const tabela = $("tabelaProdutos");
  let catalogo = carregarProdutos();

  function carregarProdutos() {
    try {
      const salvos = JSON.parse(localStorage.getItem(CHAVE_PRODUTOS) || "null");
      return Array.isArray(salvos) ? salvos : produtos.map(p => ({...p}));
    } catch {
      return produtos.map(p => ({...p}));
    }
  }
  function salvarProdutos() {
    localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(catalogo));
  }
  function moeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {style:"currency",currency:"BRL"});
  }
  function escapar(texto) {
    return String(texto).replace(/[&<>"']/g, caractere => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    })[caractere]);
  }
  function mostrarPainel() {
    login.hidden = true;
    painel.hidden = false;
    $("sairAdmin").hidden = false;
    atualizarPainel();
  }
  $("formLoginAdmin").addEventListener("submit", evento => {
    evento.preventDefault();
    if ($("senhaAdmin").value === SENHA_DEMO) {
      sessionStorage.setItem("bellaAdminLogado", "sim");
      $("erroLogin").textContent = "";
      mostrarPainel();
    } else {
      $("erroLogin").textContent = "Senha incorreta. Confira e tente novamente.";
    }
  });
  $("sairAdmin").addEventListener("click", () => {
    sessionStorage.removeItem("bellaAdminLogado");
    painel.hidden = true;
    login.hidden = false;
    $("sairAdmin").hidden = true;
    $("senhaAdmin").value = "";
  });

  function atualizarPainel() {
    $("totalProdutos").textContent = catalogo.length;
    $("totalPromocoes").textContent = catalogo.filter(p => p.promocao).length;
    $("totalMarcas").textContent = new Set(catalogo.map(p => p.marca.trim().toLowerCase())).size;
    renderizarTabela();
  }
  function renderizarTabela() {
    const termo = $("buscaAdmin").value.trim().toLowerCase();
    const lista = catalogo.filter(p =>
      `${p.nome} ${p.marca} ${p.categoria}`.toLowerCase().includes(termo)
    );
    tabela.innerHTML = lista.map(p => `
      <tr>
        <td>${escapar(p.nome)} ${p.promocao ? '<span class="mini-etiqueta">Oferta</span>' : ""}</td>
        <td>${escapar(p.marca)}</td>
        <td>${escapar(p.categoria)}</td>
        <td>${moeda(p.preco)}</td>
        <td>
          <button class="acao-tabela" data-editar="${p.id}">Editar</button>
          <button class="acao-tabela excluir" data-excluir="${p.id}">Excluir</button>
        </td>
      </tr>`).join("");
    $("listaVazia").hidden = lista.length > 0;
  }
  function limparFormulario() {
    form.reset();
    $("produtoId").value = "";
    $("tituloFormulario").textContent = "Adicionar produto";
    $("salvarProduto").textContent = "Salvar produto";
    $("cancelarEdicao").hidden = true;
  }
  form.addEventListener("submit", evento => {
    evento.preventDefault();
    const idAtual = $("produtoId").value;
    const dados = {
      id: idAtual ? Number(idAtual) : (catalogo.length ? Math.max(...catalogo.map(p => Number(p.id))) + 1 : 1),
      nome: $("produtoNome").value.trim(),
      marca: $("produtoMarca").value.trim(),
      categoria: $("produtoCategoria").value,
      descricao: $("produtoDescricao").value.trim(),
      preco: Number($("produtoPreco").value),
      imagem: $("produtoImagem").value.trim() || "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80",
      promocao: $("produtoPromocao").checked
    };
    if (!dados.nome || !dados.marca || !dados.descricao || !Number.isFinite(dados.preco) || dados.preco <= 0) {
      $("retornoProduto").textContent = "Preencha os campos corretamente.";
      $("retornoProduto").className = "admin-feedback erro";
      return;
    }
    const indice = catalogo.findIndex(p => p.id === dados.id);
    if (indice >= 0) catalogo[indice] = dados;
    else catalogo.push(dados);
    salvarProdutos();
    atualizarPainel();
    limparFormulario();
    $("retornoProduto").textContent = indice >= 0 ? "Produto atualizado com sucesso!" : "Produto cadastrado com sucesso!";
    $("retornoProduto").className = "admin-feedback";
  });
  tabela.addEventListener("click", evento => {
    const editar = evento.target.closest("[data-editar]");
    const excluir = evento.target.closest("[data-excluir]");
    if (editar) {
      const p = catalogo.find(item => item.id === Number(editar.dataset.editar));
      if (!p) return;
      $("produtoId").value = p.id;
      $("produtoNome").value = p.nome;
      $("produtoMarca").value = p.marca;
      $("produtoCategoria").value = p.categoria;
      $("produtoDescricao").value = p.descricao;
      $("produtoPreco").value = p.preco;
      $("produtoImagem").value = p.imagem || "";
      $("produtoPromocao").checked = Boolean(p.promocao);
      $("tituloFormulario").textContent = "Editar produto";
      $("salvarProduto").textContent = "Salvar alterações";
      $("cancelarEdicao").hidden = false;
      window.scrollTo({top:0,behavior:"smooth"});
    }
    if (excluir) {
      const id = Number(excluir.dataset.excluir);
      const p = catalogo.find(item => item.id === id);
      if (p && confirm(`Deseja excluir "${p.nome}" do catálogo?`)) {
        catalogo = catalogo.filter(item => item.id !== id);
        salvarProdutos();
        atualizarPainel();
        limparFormulario();
      }
    }
  });
  $("cancelarEdicao").addEventListener("click", limparFormulario);
  $("buscaAdmin").addEventListener("input", renderizarTabela);

  if (sessionStorage.getItem("bellaAdminLogado") === "sim") mostrarPainel();
});
