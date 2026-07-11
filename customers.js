/* Customers management */
const Customers = {
  page: 1, perPage: 8, editId: null, viewId: null,

  init() {
    this.render();
    App.initModals();
    document.getElementById('addCustomerBtn')?.addEventListener('click', () => this.openForm());
    document.getElementById('customerForm')?.addEventListener('submit', (e) => { e.preventDefault(); this.save(); });
    document.getElementById('searchInput')?.addEventListener('input', () => { this.page = 1; this.render(); });
  },

  getFiltered() {
    let items = App.getAll('customers');
    const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
    if (search) items = items.filter(c => c.name.toLowerCase().includes(search) || c.contact.toLowerCase().includes(search) || c.email.toLowerCase().includes(search));
    return items;
  },

  render() {
    const items = this.getFiltered();
    const { data, page, pages } = App.paginate(items, this.page, this.perPage);
    const tbody = document.getElementById('customersBody');
    if (!tbody) return;

    tbody.innerHTML = data.map(c => {
      const orders = App.getAll('sales').filter(s => s.customerId === c.id);
      const total = orders.reduce((s, o) => s + o.total, 0);
      return `<tr>
        <td><strong>${c.name}</strong></td>
        <td>${c.contact}</td>
        <td>${c.email}</td>
        <td>${c.phone}</td>
        <td>${c.type}</td>
        <td>${orders.length} orders</td>
        <td>${App.formatCurrency(total)}</td>
        <td><div class="action-btns">
          <button class="btn btn-sm btn-secondary" onclick="Customers.viewHistory(${c.id})">History</button>
          <button class="btn btn-sm btn-secondary btn-icon" onclick="Customers.openForm(${c.id})">✎</button>
          <button class="btn btn-sm btn-danger btn-icon" onclick="Customers.delete(${c.id})">✕</button>
        </div></td>
      </tr>`;
    }).join('') || '<tr><td colspan="8" class="empty-state">No customers found</td></tr>';

    App.renderPagination(document.getElementById('pagination'), page, pages, (p) => { this.page = p; this.render(); });
  },

  openForm(id) {
    this.editId = id || null;
    const form = document.getElementById('customerForm');
    form.reset();
    document.getElementById('modalTitle').textContent = id ? 'Edit Customer' : 'Add Customer';
    if (id) { const c = App.getById('customers', id); Object.keys(c).forEach(k => { if (form.elements[k]) form.elements[k].value = c[k]; }); }
    App.openModal('customerModal');
  },

  save() {
    const form = document.getElementById('customerForm');
    if (!App.validateForm(form)) return;
    const data = { name: form.name.value, contact: form.contact.value, email: form.email.value, phone: form.phone.value, address: form.address.value, type: form.type.value };
    if (this.editId) { App.update('customers', this.editId, data); App.notify('Customer updated', 'success'); }
    else { App.create('customers', data); App.notify('Customer created', 'success'); }
    App.closeModal('customerModal');
    this.render();
  },

  viewHistory(id) {
    const c = App.getById('customers', id);
    const orders = App.getAll('sales').filter(s => s.customerId === id);
    document.getElementById('historyTitle').textContent = `Purchase History — ${c.name}`;
    document.getElementById('historyBody').innerHTML = orders.length ? orders.map(o => `
      <tr><td>${o.orderNo}</td><td>${App.formatDate(o.date)}</td><td>${App.formatCurrency(o.total)}</td><td>${App.statusBadge(o.status)}</td></tr>
    `).join('') : '<tr><td colspan="4">No orders yet</td></tr>';
    App.openModal('historyModal');
  },

  delete(id) {
    if (confirm('Delete this customer?')) { App.remove('customers', id); App.notify('Customer deleted', 'info'); this.render(); }
  }
};

/* Suppliers - reuse similar pattern */
const Suppliers = {
  page: 1, perPage: 8, editId: null,

  init() {
    this.render();
    App.initModals();
    document.getElementById('addSupplierBtn')?.addEventListener('click', () => this.openForm());
    document.getElementById('supplierForm')?.addEventListener('submit', (e) => { e.preventDefault(); this.save(); });
    document.getElementById('searchInput')?.addEventListener('input', () => { this.page = 1; this.render(); });
  },

  getFiltered() {
    let items = App.getAll('suppliers');
    const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
    if (search) items = items.filter(s => s.name.toLowerCase().includes(search) || s.contact.toLowerCase().includes(search));
    return items;
  },

  render() {
    const items = this.getFiltered();
    const { data, page, pages } = App.paginate(items, this.page, this.perPage);
    const tbody = document.getElementById('suppliersBody');
    if (!tbody) return;

    tbody.innerHTML = data.map(s => {
      const orders = App.getAll('purchases').filter(p => p.supplierId === s.id);
      const total = orders.reduce((sum, o) => sum + o.total, 0);
      return `<tr>
        <td><strong>${s.name}</strong></td>
        <td>${s.contact}</td>
        <td>${s.email}</td>
        <td>${s.phone}</td>
        <td>${s.category}</td>
        <td>${orders.length}</td>
        <td>${App.formatCurrency(total)}</td>
        <td><div class="action-btns">
          <button class="btn btn-sm btn-secondary" onclick="Suppliers.viewHistory(${s.id})">History</button>
          <button class="btn btn-sm btn-secondary btn-icon" onclick="Suppliers.openForm(${s.id})">✎</button>
          <button class="btn btn-sm btn-danger btn-icon" onclick="Suppliers.delete(${s.id})">✕</button>
        </div></td>
      </tr>`;
    }).join('') || '<tr><td colspan="8" class="empty-state">No suppliers found</td></tr>';

    App.renderPagination(document.getElementById('pagination'), page, pages, (p) => { this.page = p; this.render(); });
  },

  openForm(id) {
    this.editId = id || null;
    const form = document.getElementById('supplierForm');
    form.reset();
    document.getElementById('modalTitle').textContent = id ? 'Edit Supplier' : 'Add Supplier';
    if (id) { const s = App.getById('suppliers', id); Object.keys(s).forEach(k => { if (form.elements[k]) form.elements[k].value = s[k]; }); }
    App.openModal('supplierModal');
  },

  save() {
    const form = document.getElementById('supplierForm');
    if (!App.validateForm(form)) return;
    const data = { name: form.name.value, contact: form.contact.value, email: form.email.value, phone: form.phone.value, address: form.address.value, category: form.category.value };
    if (this.editId) { App.update('suppliers', this.editId, data); App.notify('Supplier updated', 'success'); }
    else { App.create('suppliers', data); App.notify('Supplier created', 'success'); }
    App.closeModal('supplierModal');
    this.render();
  },

  viewHistory(id) {
    const s = App.getById('suppliers', id);
    const orders = App.getAll('purchases').filter(p => p.supplierId === id);
    document.getElementById('historyTitle').textContent = `Purchase History — ${s.name}`;
    document.getElementById('historyBody').innerHTML = orders.length ? orders.map(o => `
      <tr><td>${o.orderNo}</td><td>${App.formatDate(o.date)}</td><td>${App.formatCurrency(o.total)}</td><td>${App.statusBadge(o.status)}</td></tr>
    `).join('') : '<tr><td colspan="4">No purchases yet</td></tr>';
    App.openModal('historyModal');
  },

  delete(id) {
    if (confirm('Delete this supplier?')) { App.remove('suppliers', id); App.notify('Supplier deleted', 'info'); this.render(); }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('customersBody')) Customers.init();
  if (document.getElementById('suppliersBody')) Suppliers.init();
});
