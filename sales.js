/* Sales & Purchases */
const Sales = {
  page: 1, editId: null,

  init() {
    this.render();
    App.initModals();
    document.getElementById('addSaleBtn')?.addEventListener('click', () => this.openForm());
    document.getElementById('saleForm')?.addEventListener('submit', (e) => { e.preventDefault(); this.save(); });
    this.populateSelects();
  },

  populateSelects() {
    const custSel = document.getElementById('saleCustomer');
    const prodSel = document.getElementById('saleProduct');
    if (custSel) custSel.innerHTML = App.getAll('customers').map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    if (prodSel) prodSel.innerHTML = App.getAll('products').map(p => `<option value="${p.id}" data-price="${p.price}">${p.name} — ${App.formatCurrency(p.price)}</option>`).join('');
  },

  render() {
    const sales = [...App.getAll('sales')].sort((a, b) => b.date - a.date);
    const { data, page, pages } = App.paginate(sales, this.page, 8);
    const tbody = document.getElementById('salesBody');
    if (!tbody) return;
    tbody.innerHTML = data.map(s => `
      <tr>
        <td><strong>${s.orderNo}</strong></td>
        <td>${App.getCustomerName(s.customerId)}</td>
        <td>${App.formatDate(s.date)}</td>
        <td>${s.items.length} item(s)</td>
        <td>${App.formatCurrency(s.total)}</td>
        <td>${App.statusBadge(s.status)}</td>
        <td><button class="btn btn-sm btn-danger btn-icon" onclick="Sales.delete(${s.id})">✕</button></td>
      </tr>
    `).join('') || '<tr><td colspan="7" class="empty-state">No sales orders</td></tr>';
    App.renderPagination(document.getElementById('pagination'), page, pages, (p) => { this.page = p; this.render(); });
  },

  openForm() {
    document.getElementById('saleForm').reset();
    this.populateSelects();
    App.openModal('saleModal');
  },

  save() {
    const form = document.getElementById('saleForm');
    if (!App.validateForm(form)) return;
    const productId = parseInt(form.productId.value);
    const qty = parseInt(form.qty.value);
    const product = App.getById('products', productId);
    const price = product.price;
    const total = price * qty;
    const orderNo = 'SO-' + String(App.getAll('sales').length + 1).padStart(3, '0');

    App.create('sales', {
      orderNo, customerId: parseInt(form.customerId.value), date: Date.now(),
      items: [{ productId, qty, price }], total, status: form.status.value
    });

    if (form.status.value === 'Completed') {
      App.update('products', productId, { qty: product.qty - qty, status: (product.qty - qty) < 10 ? 'Low Stock' : 'Active' });
    }
    App.notify('Sales order created', 'success');
    App.closeModal('saleModal');
    this.render();
  },

  delete(id) {
    if (confirm('Delete this order?')) { App.remove('sales', id); App.notify('Order deleted', 'info'); this.render(); }
  }
};

const Purchases = {
  page: 1,

  init() {
    this.render();
    App.initModals();
    document.getElementById('addPurchaseBtn')?.addEventListener('click', () => this.openForm());
    document.getElementById('purchaseForm')?.addEventListener('submit', (e) => { e.preventDefault(); this.save(); });
    this.populateSelects();
  },

  populateSelects() {
    const supSel = document.getElementById('purchaseSupplier');
    const prodSel = document.getElementById('purchaseProduct');
    if (supSel) supSel.innerHTML = App.getAll('suppliers').map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    if (prodSel) prodSel.innerHTML = App.getAll('products').map(p => `<option value="${p.id}" data-cost="${p.cost}">${p.name} — ${App.formatCurrency(p.cost)}</option>`).join('');
  },

  render() {
    const purchases = [...App.getAll('purchases')].sort((a, b) => b.date - a.date);
    const { data, page, pages } = App.paginate(purchases, this.page, 8);
    const tbody = document.getElementById('purchasesBody');
    if (!tbody) return;
    tbody.innerHTML = data.map(p => `
      <tr>
        <td><strong>${p.orderNo}</strong></td>
        <td>${App.getSupplierName(p.supplierId)}</td>
        <td>${App.formatDate(p.date)}</td>
        <td>${p.items.length} item(s)</td>
        <td>${App.formatCurrency(p.total)}</td>
        <td>${App.statusBadge(p.status)}</td>
        <td><button class="btn btn-sm btn-danger btn-icon" onclick="Purchases.delete(${p.id})">✕</button></td>
      </tr>
    `).join('') || '<tr><td colspan="7" class="empty-state">No purchase orders</td></tr>';
    App.renderPagination(document.getElementById('pagination'), page, pages, (p) => { this.page = p; this.render(); });
  },

  openForm() {
    document.getElementById('purchaseForm').reset();
    this.populateSelects();
    App.openModal('purchaseModal');
  },

  save() {
    const form = document.getElementById('purchaseForm');
    if (!App.validateForm(form)) return;
    const productId = parseInt(form.productId.value);
    const qty = parseInt(form.qty.value);
    const product = App.getById('products', productId);
    const cost = product.cost;
    const total = cost * qty;
    const orderNo = 'PO-' + String(App.getAll('purchases').length + 1).padStart(3, '0');

    App.create('purchases', {
      orderNo, supplierId: parseInt(form.supplierId.value), date: Date.now(),
      items: [{ productId, qty, cost }], total, status: form.status.value
    });

    if (form.status.value === 'Received') {
      App.update('products', productId, { qty: product.qty + qty });
    }
    App.notify('Purchase order created', 'success');
    App.closeModal('purchaseModal');
    this.render();
  },

  delete(id) {
    if (confirm('Delete this order?')) { App.remove('purchases', id); App.notify('Order deleted', 'info'); this.render(); }
  }
};

/* Maintenance */
const Maintenance = {
  page: 1, editId: null,

  init() {
    this.render();
    App.initModals();
    document.getElementById('addMaintBtn')?.addEventListener('click', () => this.openForm());
    document.getElementById('maintForm')?.addEventListener('submit', (e) => { e.preventDefault(); this.save(); });
    const custSel = document.getElementById('maintCustomer');
    if (custSel) custSel.innerHTML = App.getAll('customers').map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  },

  render() {
    const items = [...App.getAll('maintenance')].sort((a, b) => b.date - a.date);
    const { data, page, pages } = App.paginate(items, this.page, 8);
    const tbody = document.getElementById('maintBody');
    if (!tbody) return;
    tbody.innerHTML = data.map(m => `
      <tr>
        <td><strong>${m.requestNo}</strong></td>
        <td>${m.equipment}</td>
        <td>${App.getCustomerName(m.customerId)}</td>
        <td>${m.technician}</td>
        <td><span class="badge badge-${m.priority === 'High' ? 'danger' : m.priority === 'Medium' ? 'warning' : 'info'}">${m.priority}</span></td>
        <td>${App.statusBadge(m.status)}</td>
        <td>${App.formatDate(m.date)}</td>
        <td><div class="action-btns">
          <button class="btn btn-sm btn-secondary btn-icon" onclick="Maintenance.openForm(${m.id})">✎</button>
          <button class="btn btn-sm btn-danger btn-icon" onclick="Maintenance.delete(${m.id})">✕</button>
        </div></td>
      </tr>
    `).join('') || '<tr><td colspan="8" class="empty-state">No repair requests</td></tr>';
    App.renderPagination(document.getElementById('pagination'), page, pages, (p) => { this.page = p; this.render(); });
  },

  openForm(id) {
    this.editId = id || null;
    const form = document.getElementById('maintForm');
    form.reset();
    document.getElementById('modalTitle').textContent = id ? 'Edit Request' : 'New Repair Request';
    if (id) { const m = App.getById('maintenance', id); Object.keys(m).forEach(k => { if (form.elements[k]) form.elements[k].value = m[k]; }); }
    App.openModal('maintModal');
  },

  save() {
    const form = document.getElementById('maintForm');
    if (!App.validateForm(form)) return;
    const data = {
      equipment: form.equipment.value, customerId: parseInt(form.customerId.value),
      technician: form.technician.value, status: form.status.value,
      priority: form.priority.value, description: form.description.value, date: Date.now()
    };
    if (this.editId) { App.update('maintenance', this.editId, data); App.notify('Request updated', 'success'); }
    else {
      data.requestNo = 'MR-' + String(App.getAll('maintenance').length + 1).padStart(3, '0');
      App.create('maintenance', data);
      App.notify('Repair request created', 'success');
    }
    App.closeModal('maintModal');
    this.render();
  },

  delete(id) {
    if (confirm('Delete this request?')) { App.remove('maintenance', id); App.notify('Request deleted', 'info'); this.render(); }
  }
};

/* Reports */
const Reports = {
  init() {
    this.render();
    document.getElementById('reportFilter')?.addEventListener('change', () => this.render());
  },

  render() {
    const filter = document.getElementById('reportFilter')?.value || 'all';
    const sales = App.getAll('sales');
    const products = App.getAll('products');
    const purchases = App.getAll('purchases');

    const totalRevenue = sales.reduce((s, o) => s + o.total, 0);
    const totalPurchases = purchases.reduce((s, p) => s + p.total, 0);
    const profit = totalRevenue - totalPurchases;
    const totalStock = products.reduce((s, p) => s + p.qty, 0);
    const stockValue = products.reduce((s, p) => s + (p.qty * p.cost), 0);

    document.getElementById('reportStats').innerHTML = `
      <div class="stat-card"><div class="stat-icon blue">${Icons.sales}</div><div class="stat-info"><h3>${App.formatCurrency(totalRevenue)}</h3><p>Total Sales Revenue</p></div></div>
      <div class="stat-card"><div class="stat-icon orange">${Icons.purchases}</div><div class="stat-info"><h3>${App.formatCurrency(totalPurchases)}</h3><p>Total Purchases</p></div></div>
      <div class="stat-card"><div class="stat-icon green">${Icons.sales}</div><div class="stat-info"><h3>${App.formatCurrency(profit)}</h3><p>Net Profit</p></div></div>
      <div class="stat-card"><div class="stat-icon red">${Icons.warehouse}</div><div class="stat-info"><h3>${totalStock} units</h3><p>Stock Value: ${App.formatCurrency(stockValue)}</p></div></div>
    `;

    const tbody = document.getElementById('reportTableBody');
    if (tbody) {
      const rows = sales.map(s => `<tr><td>${s.orderNo}</td><td>Sale</td><td>${App.getCustomerName(s.customerId)}</td><td>${App.formatCurrency(s.total)}</td><td>${App.formatDate(s.date)}</td></tr>`);
      purchases.forEach(p => rows.push(`<tr><td>${p.orderNo}</td><td>Purchase</td><td>${App.getSupplierName(p.supplierId)}</td><td>${App.formatCurrency(p.total)}</td><td>${App.formatDate(p.date)}</td></tr>`));
      tbody.innerHTML = rows.join('') || '<tr><td colspan="5">No data</td></tr>';
    }

    if (typeof Charts !== 'undefined') {
      Charts.renderReportCharts(
        { labels: ['Q1','Q2','Q3','Q4'], values: [totalRevenue * .2, totalRevenue * .3, totalRevenue * .25, totalRevenue * .25] },
        { labels: products.map(p => p.category).filter((v,i,a) => a.indexOf(v) === i), values: products.reduce((acc, p) => { const i = acc.findIndex(a => a.cat === p.category); if (i >= 0) acc[i].val += p.qty; else acc.push({ cat: p.category, val: p.qty }); return acc; }, []).map(a => a.val) }
      );
    }
  }
};

/* Settings */
const Settings = {
  init() {
    const db = App.db();
    const form = document.getElementById('companyForm');
    if (form && db.settings?.company) {
      Object.keys(db.settings.company).forEach(k => { if (form.elements[k]) form.elements[k].value = db.settings.company[k]; });
    }
    const user = App.currentUser();
    const profileForm = document.getElementById('profileForm');
    const fullUser = App.getAll('users').find(u => u.email === user?.email);
    if (profileForm && fullUser) {
      profileForm.name.value = fullUser.name;
      profileForm.email.value = fullUser.email;
      profileForm.phone.value = fullUser.phone || '';
      profileForm.role.value = fullUser.role;
    }
    document.getElementById('themeSelect').value = db.settings?.theme || 'light';
    document.getElementById('languageSelect').value = db.settings?.language || 'en';

    document.getElementById('companyForm')?.addEventListener('submit', (e) => { e.preventDefault(); this.saveCompany(); });
    document.getElementById('profileForm')?.addEventListener('submit', (e) => { e.preventDefault(); this.saveProfile(); });
    document.getElementById('themeSelect')?.addEventListener('change', (e) => {
      document.documentElement.setAttribute('data-theme', e.target.value);
      const db = App.db(); db.settings.theme = e.target.value; App.save(db);
      App.notify('Theme updated', 'success');
    });
    document.getElementById('languageSelect')?.addEventListener('change', (e) => {
      const db = App.db(); db.settings.language = e.target.value; App.save(db);
      App.notify('Language preference saved', 'success');
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab)?.classList.add('active');
      });
    });
  },

  saveCompany() {
    const form = document.getElementById('companyForm');
    const db = App.db();
    db.settings.company = { name: form.name.value, email: form.email.value, phone: form.phone.value, address: form.address.value, tax: form.tax.value };
    App.save(db);
    App.notify('Company info saved', 'success');
  },

  saveProfile() {
    const form = document.getElementById('profileForm');
    const user = App.currentUser();
    const db = App.db();
    const idx = db.users.findIndex(u => u.email === user.email);
    if (idx >= 0) { db.users[idx].name = form.name.value; db.users[idx].phone = form.phone.value; App.save(db); App.notify('Profile updated', 'success'); App.renderUser(); }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('salesBody')) Sales.init();
  if (document.getElementById('purchasesBody')) Purchases.init();
  if (document.getElementById('maintBody')) Maintenance.init();
  if (document.getElementById('reportStats')) Reports.init();
  if (document.getElementById('companyForm')) Settings.init();
});
