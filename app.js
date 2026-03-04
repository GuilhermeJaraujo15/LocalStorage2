// ==============================
// Base de Produtos (Simulação API)
// ==============================

const produtos = [
  { id: 1, nome: "Notebook Inspiron 15", preco: 3500 },
  { id: 2, nome: "Mouse com fio - MS116", preco: 150 },
  { id: 3, nome: "Teclado com fio - KB216 ", preco: 450 },
  { id: 4, nome: 'Monitor 24" - S2425HSM', preco: 900 },
];

const STORAGE_KEY = "carrinho_loja";

// ==============================
// MÓDULO DO CARRINHO
// ==============================

const carrinho = {
  itens: JSON.parse(localStorage.getItem(STORAGE_KEY)) || [],

  salvar() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.itens));
    renderizarCarrinho();
  },

  adicionar(produtoId) {
    const produto = produtos.find((p) => p.id === produtoId);
    if (!produto) return;

    const itemExistente = this.itens.find((i) => i.id === produtoId);

    if (itemExistente) {
      itemExistente.quantidade++;
    } else {
      this.itens.push({
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        quantidade: 1,
      });
    }

    this.salvar();
  },

atualizarQuantidade(produtoId, novaQuantidade) {

  // 🔒 Validação forte
  if (!Number.isInteger(novaQuantidade) || novaQuantidade < 1) {
    novaQuantidade = 1;
  }

  const item = this.itens.find(i => i.id === produtoId);
  if (!item) return;

  item.quantidade = novaQuantidade;
  this.salvar();
},
  remover(produtoId) {
    this.itens = this.itens.filter((i) => i.id !== produtoId);
    this.salvar();
  },

  limpar() {
    this.itens = [];
    this.salvar();
  },

  calcularTotal() {
    return this.itens.reduce((total, item) => {
      return total + item.preco * item.quantidade;
    }, 0);
  },
};

// ==============================
// RENDERIZAÇÃO
// ==============================

function renderizarProdutos() {
  const container = document.getElementById("lista-produtos");

  container.innerHTML = produtos
    .map(
      (produto) => `
    <div class="produto">
      <h3>${produto.nome}</h3>
      <p>R$ ${produto.preco.toFixed(2)}</p>
      <button data-id="${produto.id}" class="btn-adicionar">
        Adicionar ao Carrinho
      </button>
    </div>
  `,
    )
    .join("");
}

function renderizarCarrinho() {
  const container = document.getElementById("lista-carrinho");
  const totalElemento = document.getElementById("total");

  if (carrinho.itens.length === 0) {
    container.innerHTML = "<p>Carrinho vazio.</p>";
    totalElemento.textContent = "0.00";
    return;
  }

  container.innerHTML = carrinho.itens
    .map(
      (item) => `
    <div class="item-carrinho">
      <strong>${item.nome}</strong>
      <p>R$ ${item.preco.toFixed(2)}</p>
      <p>
        Quantidade:
        <input 
  type="number"
  min="1"
  step="1"
  inputmode="numeric"
  value="${item.quantidade}"
  data-id="${item.id}"
  class="input-quantidade">
      </p>
      <p>Subtotal: R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
      <button data-id="${item.id}" class="btn-remover">
        Remover
      </button>
    </div>
  `,
    )
    .join("");

  totalElemento.textContent = carrinho.calcularTotal().toFixed(2);
}

// ==============================
// EVENTOS (Event Delegation)
// ==============================

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-adicionar")) {
    const id = Number(e.target.dataset.id);
    carrinho.adicionar(id);
  }

  if (e.target.classList.contains("btn-remover")) {
    const id = Number(e.target.dataset.id);
    carrinho.remover(id);
  }

  if (e.target.id === "limpar-carrinho") {
    carrinho.limpar();
  }
});

// ==============================
// EVENTOS
// ==============================

document.addEventListener("click", (e) => {

  if (e.target.classList.contains("btn-adicionar")) {
    const id = Number(e.target.dataset.id);
    carrinho.adicionar(id);
  }

  if (e.target.classList.contains("btn-remover")) {
    const id = Number(e.target.dataset.id);
    carrinho.remover(id);
  }

  if (e.target.id === "limpar-carrinho") {
    carrinho.limpar();
  }
});


// COLOQUE AQUI (logo abaixo do click)

document.addEventListener("change", (e) => {
  if (e.target.classList.contains("input-quantidade")) {

    const id = Number(e.target.dataset.id);
    let quantidade = Number(e.target.value);

    if (!Number.isInteger(quantidade) || quantidade < 1) {
      quantidade = 1;
      e.target.value = 1;
    }

    carrinho.atualizarQuantidade(id, quantidade);
  }
});

// ==============================
// INICIALIZAÇÃO
// ==============================

renderizarProdutos();
renderizarCarrinho();
