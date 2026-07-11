/* Warehouse & inventory */
const Warehouse = {
  activeWarehouse: 1,

  init() {
    this.renderTabs();
    this.renderInventory();
    this.renderMovements();
    App.initModals();
    document.getElementById('stockForm')?.addEventListener('submit', (e) => { e.preventDefault(); this.addMovement(); });
    document.getElementById('addStockBtn')?.addEventListener('click', () => this.openStockForm());
  },

  renderTabs() {
    const tabs = document.getElementById('warehouseTabs');
    if (!tabs) return;
    const warehouses = App.getAll('warehouses');
    tabs.innerHTML = warehouses.map(w => `
      <button class="tab-btn ${w.id === this.activeWarehouse ? 'active' : ''}" onclick="Warehouse.selectWarehouse(${w.id})">${w.name}</button>
    `).join('');

    const info = document.getElementById('warehouseInfo');
    const wh = App.getById('warehouses', this.activeWarehouse);
    if (info && wh) info.innerHTML = `<strong>${wh.name}</strong> — ${wh.location} | Capacity: ${wh.capacity} units`;
  },

  selectWarehouse(id) {
    this.activeWarehouse = id;
    this.renderTabs();
    this.renderInventory();
    this.renderMovements();
  },

  renderInventory() {
    const products = App.getAll('products').filter(p => p.warehouseId === this.activeWarehouse);
    const tbody = document.getElementById('inventoryBody');
    if (!tbody) return;
    tbody.innerHTML = products.map(p => `
      <tr>
        <td>${p.sku}</td>
        <td><strong>${p.name}</strong></td>
        <td>${p.category}</td>
        <td>${p.qty}</td>
        <td>${App.formatCurrency(p.cost)}</td>
        <td>${App.formatCurrency(p.price)}</td>
        <td>${App.statusBadge(p.qty < 10 ? 'Low Stock' : 'Active')}</td>
      </tr>
    `).join('') || '<tr><td colspan="7" class="empty-state">No inventory in this warehouse</td></tr>';
  },

  renderMovements() {
    const movements = App.getAll('stockMovements')
      .filter(m => m.warehouseId === this.activeWarehouse)
      .sort((a, b) => b.date - a.date);
    const tbody = document.getElementById('movementsBody');
    if (!tbody) return;
    tbody.innerHTML = movements.map(m => `
      <tr>
        <td>${App.formatDate(m.date)}</td>
        <td>${App.getProductName(m.productId)}</td>
        <td><span class="badge badge-${m.type === 'in' ? 'success' : 'warning'}">${m.type === 'in' ? 'Stock In' : 'Stock Out'}</span></td>
        <td>${m.qty}</td>
        <td>${m.note || '—'}</td>
      </tr>
    `).join('') || '<tr><td colspan="5" class="empty-state">No movements recorded</td></tr>';
  },

  openStockForm() {
    const form = document.getElementById('stockForm');
    form.reset();
    const prodSel = form.productId;
    prodSel.innerHTML = App.getAll('products').filter(p => p.warehouseId === this.activeWarehouse)
      .map(p => `<option value="${p.id}">${p.name} (${p.qty})</option>`).join('');
    App.openModal('stockModal');
  },

  addMovement() {
    const form = document.getElementById('stockForm');
    if (!App.validateForm(form)) return;
    const productId = parseInt(form.productId.value);
    const type = form.type.value;
    const qty = parseInt(form.qty.value);
    const product = App.getById('products', productId);

    if (type === 'out' && product.qty < qty) { App.notify('Insufficient stock', 'error'); return; }

    App.create('stockMovements', { productId, warehouseId: this.activeWarehouse, type, qty, date: Date.now(), note: form.note.value });
    const newQty = type === 'in' ? product.qty + qty : product.qty - qty;
    App.update('products', productId, { qty: newQty, status: newQty < 10 ? 'Low Stock' : 'Active' });
    App.notify('Stock movement recorded', 'success');
    App.closeModal('stockModal');
    this.renderInventory();
    this.renderMovements();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('inventoryBody')) Warehouse.init();
});
