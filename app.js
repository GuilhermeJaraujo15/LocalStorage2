const produtos = [
  { id: 1, nome: 'Notebook Inspiron 15', preco: 3500 },
  { id: 2, nome: 'Mouse com fio - MS116', preco: 150 },
  { id: 3, nome: 'Teclado com fio - KB216', preco: 450 },
  { id: 4, nome: 'Monitor 24" - S2425HSM', preco: 900 },
];

const STORAGE_KEY = 'carrinho_loja';

const carrinho = {
  itens: JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'),

  salvar() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.itens));
    renderizarCarrinho();
  },

  adicionar(produtoId) {
    const produto = produtos.find((item) => item.id === produtoId);
    if (!produto) return;

    const itemExistente = this.itens.find((item) => item.id === produtoId);
    if (itemExistente) {
      itemExistente.quantidade++;
    } else {
      this.itens.push({ ...produto, quantidade: 1 });
    }

    this.salvar();
  },

  atualizarQuantidade(produtoId, quantidade) {
    if (!Number.isInteger(quantidade) || quantidade < 1) quantidade = 1;
    const item = this.itens.find((entry) => entry.id === produtoId);
    if (!item) return;
    item.quantidade = quantidade;
    this.salvar();
  },

  remover(produtoId) {
    this.itens = this.itens.filter((item) => item.id !== produtoId);
    this.salvar();
  },

  limpar() {
    this.itens = [];
    this.salvar();
  },

  calcularTotal() {
    return this.itens.reduce((total, item) => total + item.preco * item.quantidade, 0);
  },
};

function renderizarProdutos() {
  const container = document.getElementById('lista-produtos');
  container.innerHTML = produtos.map((produto) => `
    <article class="produto">
      <h3>${produto.nome}</h3>
      <p>${i18n.formatCurrency(produto.preco)}</p>
      <button type="button" data-id="${produto.id}" class="btn-adicionar">
        ${i18n.t('addToCart')}
      </button>
    </article>
  `).join('');
}

function renderizarCarrinho() {
  const container = document.getElementById('lista-carrinho');
  const totalElemento = document.getElementById('total');

  if (carrinho.itens.length === 0) {
    container.innerHTML = `<p>${i18n.t('emptyCart')}</p>`;
    totalElemento.textContent = i18n.formatCurrency(0);
    return;
  }

  container.innerHTML = carrinho.itens.map((item) => `
    <article class="item-carrinho">
      <strong>${item.nome}</strong>
      <p>${i18n.formatCurrency(item.preco)}</p>
      <label>
        ${i18n.t('quantity')}:
        <input type="number" min="1" step="1" inputmode="numeric"
          value="${item.quantidade}" data-id="${item.id}" class="input-quantidade">
      </label>
      <p>${i18n.t('subtotal')}: ${i18n.formatCurrency(item.preco * item.quantidade)}</p>
      <button type="button" data-id="${item.id}" class="btn-remover">
        ${i18n.t('remove')}
      </button>
    </article>
  `).join('');

  totalElemento.textContent = i18n.formatCurrency(carrinho.calcularTotal());
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  if (button.classList.contains('btn-adicionar')) {
    carrinho.adicionar(Number(button.dataset.id));
  } else if (button.classList.contains('btn-remover')) {
    carrinho.remover(Number(button.dataset.id));
  } else if (button.id === 'limpar-carrinho') {
    carrinho.limpar();
  }
});

document.addEventListener('change', (event) => {
  if (!event.target.classList.contains('input-quantidade')) return;
  const quantidade = Number(event.target.value);
  carrinho.atualizarQuantidade(Number(event.target.dataset.id), quantidade);
});

renderizarProdutos();
renderizarCarrinho();
