// Small, dependency-free translations for the page's static and dynamic text.
const translations = {
  'pt-BR': {
    pageTitle: 'Sistema de Carrinho',
    storeTitle: 'Loja Virtual',
    products: 'Produtos',
    cart: 'Carrinho',
    total: 'Total',
    clearCart: 'Limpar Carrinho',
    addToCart: 'Adicionar ao Carrinho',
    emptyCart: 'Carrinho vazio.',
    quantity: 'Quantidade',
    subtotal: 'Subtotal',
    remove: 'Remover',
    languageName: 'English',
    switchLanguage: 'Mudar idioma para inglês',
  },
  en: {
    pageTitle: 'Shopping Cart',
    storeTitle: 'Online Store',
    products: 'Products',
    cart: 'Shopping Cart',
    total: 'Total',
    clearCart: 'Clear Cart',
    addToCart: 'Add to Cart',
    emptyCart: 'Your cart is empty.',
    quantity: 'Quantity',
    subtotal: 'Subtotal',
    remove: 'Remove',
    languageName: 'Português',
    switchLanguage: 'Switch language to Portuguese',
  },
};

const LANGUAGE_STORAGE_KEY = 'loja_idioma';
const supportedLanguages = Object.keys(translations);

const i18n = {
  language: supportedLanguages.includes(localStorage.getItem(LANGUAGE_STORAGE_KEY))
    ? localStorage.getItem(LANGUAGE_STORAGE_KEY)
    : 'pt-BR',

  t(key) {
    return translations[this.language][key] ?? translations['pt-BR'][key] ?? key;
  },

  formatCurrency(value) {
    return new Intl.NumberFormat(this.language === 'en' ? 'en-US' : 'pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  },

  setLanguage(language) {
    if (!supportedLanguages.includes(language)) return;
    this.language = language;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.title = this.t('pageTitle');

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      element.textContent = this.t(element.dataset.i18n);
    });

    const toggle = document.getElementById('language-toggle');
    toggle.lang = language === 'pt-BR' ? 'en' : 'pt-BR';
    toggle.setAttribute('aria-label', this.t('switchLanguage'));
    document.getElementById('language-label').textContent = this.t('languageName');

    if (typeof renderizarProdutos === 'function') renderizarProdutos();
    if (typeof renderizarCarrinho === 'function') renderizarCarrinho();
  },
};

document.addEventListener('DOMContentLoaded', () => {
  i18n.setLanguage(i18n.language);
  document.getElementById('language-toggle').addEventListener('click', () => {
    i18n.setLanguage(i18n.language === 'pt-BR' ? 'en' : 'pt-BR');
  });
});
