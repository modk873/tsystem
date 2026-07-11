/* Products management */
const Products = {
  page: 1, perPage: 8, sortKey: 'name', sortDir: 'asc', editId: null,

  init() {
    this.renderCategories();
    this.render();
    App.initModals();
    document.getElementById('addProductBtn')?.addEventListener('click', () => this.openForm());
    document.getElementById('productForm')?.addEventListener('submit', (e) => { e.preventDefault(); this.save(); });
    document.getElementById('searchInput')?.addEventListener('input', () => { this.page = 1; this.render(); });
    document.getElementById('filterCategory')?.addEventListener('change', () => { this.page = 1; this.render(); });
    document.getElementById('filterStatus')?.addEventListener('change', () => { this.page = 1; this.render(); });

    const q = sessionStorage.getItem('searchQuery');
    if (q) { document.getElementById('searchInput').value = q; sessionStorage.removeItem('searchQuery'); }
  },

  renderCategories() {
    const sel = document.getElementById('filterCategory');
    const formSel = document.getElementById('pCategory');
    const cats = App.getAll('categories');
    [sel, formSel].forEach(s => {
      if (!s) return;
      s.innerHTML = (s === sel ? '<option value="">All Categories</option>' : '') +
        cats.map(c => `<option value="${c}">${c}</option>`).join('');
    });
  },

  getFiltered() {
    let items = App.getAll('products');
    const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const cat = document.getElementById('filterCategory')?.value || '';
    const status = document.getElementById('filterStatus')?.value || '';
    if (search) items = items.filter(p => p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search) || p.barcode.includes(search));
    if (cat) items = items.filter(p => p.category === cat);
    if (status) items = items.filter(p => p.status === status);
    return App.sortData(items, this.sortKey, this.sortDir);
  },

  render() {
    const items = this.getFiltered();
    const { data, page, pages, total } = App.paginate(items, this.page, this.perPage);
    const tbody = document.getElementById('productsBody');
    if (!tbody) return;

    tbody.innerHTML = data.length ? data.map(p => `
      <tr>
        <td><div class="product-thumb" style="display:flex;align-items:center;justify-content:center;background:var(--primary-light);color:var(--primary);font-weight:700;font-size:.7rem">${p.sku.slice(0,2)}</div></td>
        <td><strong>${p.name}</strong></td>
        <td>${p.sku}</td>
        <td>${p.barcode}</td>
        <td>${p.category}</td>
        <td>${p.brand}</td>
        <td>${p.qty}</td>
        <td>${App.formatCurrency(p.cost)}</td>
        <td>${App.formatCurrency(p.price)}</td>
        <td>${p.warranty}</td>
        <td>${App.statusBadge(p.status)}</td>
        <td><div class="action-btns">
          <button class="btn btn-sm btn-secondary btn-icon" onclick="Products.openForm(${p.id})" title="Edit">✎</button>
          <button class="btn btn-sm btn-danger btn-icon" onclick="Products.delete(${p.id})" title="Delete">✕</button>
        </div></td>
      </tr>
    `).join('') : '<tr><td colspan="12" class="empty-state">No products found</td></tr>';

    document.getElementById('totalCount').textContent = total;
    App.renderPagination(document.getElementById('pagination'), page, pages, (p) => { this.page = p; this.render(); });
  },

  sort(key) {
    if (this.sortKey === key) this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    else { this.sortKey = key; this.sortDir = 'asc'; }
    this.render();
  },

  openForm(id) {
    this.editId = id || null;
    const form = document.getElementById('productForm');
    form.reset();
    document.getElementById('modalTitle').textContent = id ? 'Edit Product' : 'Add Product';
    if (id) {
      const p = App.getById('products', id);
      Object.keys(p).forEach(k => { const el = form.elements[k]; if (el) el.value = p[k]; });
    }
    App.openModal('productModal');
  },

  save() {
    const form = document.getElementById('productForm');
    if (!App.validateForm(form)) return;
    const data = {
      name: form.name.value, sku: form.sku.value, barcode: form.barcode.value,
      category: form.category.value, brand: form.brand.value,
      qty: parseInt(form.qty.value), cost: parseFloat(form.cost.value),
      price: parseFloat(form.price.value), warranty: form.warranty.value,
      status: form.status.value, warehouseId: parseInt(form.warehouseId.value), image: ''
    };
    if (data.qty < 10) data.status = 'Low Stock';
    if (this.editId) { App.update('products', this.editId, data); App.notify('Product updated', 'success'); }
    else { App.create('products', data); App.notify('Product created', 'success'); }
    App.closeModal('productModal');
    this.render();
  },

  delete(id) {
    if (confirm('Delete this product?')) {
      App.remove('products', id);
      App.notify('Product deleted', 'info');
      this.render();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('productsBody')) Products.init();
});
