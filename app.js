/* ProFix ERP - Core Application */
const DB_KEY = 'profix_erp';

const App = {
  init() {
    this.seed();
    this.checkAuth();
    this.initTheme();
    this.initSidebar();
    this.renderUser();
    this.initGlobalSearch();
  },

  db() {
    try { return JSON.parse(localStorage.getItem(DB_KEY)) || {}; }
    catch { return {}; }
  },

  save(data) { localStorage.setItem(DB_KEY, JSON.stringify(data)); },

  /* Seed initial data */
  seed() {
    if (localStorage.getItem(DB_KEY)) return;
    const now = Date.now();
    this.save({
      users: [{ id: 1, email: 'admin@profix.com', password: 'admin123', name: 'Admin User', role: 'Administrator', phone: '+971 50 123 4567' }],
      categories: ['Workshop Equipment', 'Construction Tools', 'Electrical Equipment', 'Gold Workshop Machinery', 'Spare Parts', 'Maintenance Supplies', 'Safety Equipment'],
      products: [
        { id: 1, name: 'Industrial Drill Press', sku: 'WD-001', barcode: '8901234567890', category: 'Workshop Equipment', brand: 'Bosch', qty: 45, cost: 850, price: 1200, warranty: '2 Years', status: 'Active', image: '', warehouseId: 1 },
        { id: 2, name: 'Angle Grinder 125mm', sku: 'CT-002', barcode: '8901234567891', category: 'Construction Tools', brand: 'Makita', qty: 8, cost: 120, price: 189, warranty: '1 Year', status: 'Active', image: '', warehouseId: 1 },
        { id: 3, name: 'Circuit Breaker 32A', sku: 'EL-003', barcode: '8901234567892', category: 'Electrical Equipment', brand: 'Schneider', qty: 120, cost: 25, price: 45, warranty: '3 Years', status: 'Active', image: '', warehouseId: 2 },
        { id: 4, name: 'Gold Melting Furnace', sku: 'GW-004', barcode: '8901234567893', category: 'Gold Workshop Machinery', brand: 'ProFix', qty: 3, cost: 4500, price: 6200, warranty: '5 Years', status: 'Active', image: '', warehouseId: 1 },
        { id: 5, name: 'Hydraulic Pump Seal Kit', sku: 'SP-005', barcode: '8901234567894', category: 'Spare Parts', brand: 'Parker', qty: 5, cost: 45, price: 78, warranty: '6 Months', status: 'Low Stock', image: '', warehouseId: 2 },
        { id: 6, name: 'Industrial Lubricant 20L', sku: 'MS-006', barcode: '8901234567895', category: 'Maintenance Supplies', brand: 'Shell', qty: 60, cost: 85, price: 135, warranty: 'N/A', status: 'Active', image: '', warehouseId: 1 },
        { id: 7, name: 'Safety Helmet Class E', sku: 'SE-007', barcode: '8901234567896', category: 'Safety Equipment', brand: '3M', qty: 2, cost: 35, price: 55, warranty: '1 Year', status: 'Low Stock', image: '', warehouseId: 2 },
        { id: 8, name: 'Welding Machine 200A', sku: 'WD-008', barcode: '8901234567897', category: 'Workshop Equipment', brand: 'Lincoln', qty: 15, cost: 650, price: 950, warranty: '2 Years', status: 'Active', image: '', warehouseId: 1 }
      ],
      customers: [
        { id: 1, name: 'Al Rashid Construction', contact: 'Ahmed Al Rashid', email: 'ahmed@alrashid.ae', phone: '+971 4 123 4567', address: 'Dubai Industrial City', type: 'Corporate' },
        { id: 2, name: 'Gold Craft Workshop', contact: 'Mohammed Hassan', email: 'info@goldcraft.ae', phone: '+971 50 987 6543', address: 'Gold Souk, Dubai', type: 'Business' },
        { id: 3, name: 'Emirates Electric Co.', contact: 'Sara Khalid', email: 'sara@emirateselec.ae', phone: '+971 2 456 7890', address: 'Abu Dhabi', type: 'Corporate' }
      ],
      suppliers: [
        { id: 1, name: 'Global Tools Trading', contact: 'John Smith', email: 'john@globaltools.com', phone: '+971 4 555 0101', address: 'Jebel Ali Free Zone', category: 'Tools & Equipment' },
        { id: 2, name: 'ElectroSupply LLC', contact: 'Fatima Noor', email: 'fatima@electrosupply.ae', phone: '+971 4 555 0202', address: 'Sharjah Industrial Area', category: 'Electrical' }
      ],
      warehouses: [
        { id: 1, name: 'Main Warehouse', location: 'Dubai Industrial City', capacity: 5000 },
        { id: 2, name: 'North Branch', location: 'Sharjah', capacity: 2000 }
      ],
      stockMovements: [
        { id: 1, productId: 1, warehouseId: 1, type: 'in', qty: 50, date: now - 86400000 * 5, note: 'Initial stock' },
        { id: 2, productId: 2, warehouseId: 1, type: 'out', qty: 12, date: now - 86400000 * 2, note: 'Sales order SO-001' }
      ],
      sales: [
        { id: 1, orderNo: 'SO-001', customerId: 1, date: now - 86400000 * 2, items: [{ productId: 2, qty: 12, price: 189 }], total: 2268, status: 'Completed' },
        { id: 2, orderNo: 'SO-002', customerId: 2, date: now - 86400000, items: [{ productId: 4, qty: 1, price: 6200 }], total: 6200, status: 'Completed' },
        { id: 3, orderNo: 'SO-003', customerId: 3, date: now - 3600000, items: [{ productId: 3, qty: 50, price: 45 }], total: 2250, status: 'Pending' }
      ],
      purchases: [
        { id: 1, orderNo: 'PO-001', supplierId: 1, date: now - 86400000 * 10, items: [{ productId: 1, qty: 50, cost: 850 }], total: 42500, status: 'Received' },
        { id: 2, orderNo: 'PO-002', supplierId: 2, date: now - 86400000 * 3, items: [{ productId: 3, qty: 100, cost: 25 }], total: 2500, status: 'Received' }
      ],
      maintenance: [
        { id: 1, equipment: 'Gold Melting Furnace GW-004', requestNo: 'MR-001', customerId: 2, technician: 'Ali Hassan', status: 'In Progress', priority: 'High', date: now - 86400000, description: 'Temperature sensor malfunction' },
        { id: 2, equipment: 'Welding Machine WD-008', requestNo: 'MR-002', customerId: 1, technician: 'Omar Farid', status: 'Open', priority: 'Medium', date: now - 3600000, description: 'Arc stability issue' }
      ],
      notifications: [
        { id: 1, message: 'Low stock alert: Safety Helmet Class E (2 remaining)', type: 'warning', date: now - 3600000, read: false },
        { id: 2, message: 'New sales order SO-003 received', type: 'info', date: now - 1800000, read: false },
        { id: 3, message: 'Purchase order PO-002 delivered', type: 'success', date: now - 86400000, read: true }
      ],
      settings: {
        company: { name: 'ProFix Industrial Supplies', email: 'info@profix.ae', phone: '+971 4 000 0000', address: 'Dubai Industrial City, UAE', tax: 'TRN-100000000' },
        theme: 'light',
        language: 'en'
      }
    });
  },

  /* Auth */
  checkAuth() {
    const page = location.pathname.split('/').pop() || 'index.html';
    const publicPages = ['login.html', 'index.html', ''];
    if (!publicPages.includes(page) && !sessionStorage.getItem('user')) {
      location.href = 'login.html';
    }
  },

  login(email, password) {
    const user = this.db().users?.find(u => u.email === email && u.password === password);
    if (user) {
      sessionStorage.setItem('user', JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role }));
      return true;
    }
    return false;
  },

  logout() {
    sessionStorage.removeItem('user');
    location.href = 'login.html';
  },

  currentUser() {
    try { return JSON.parse(sessionStorage.getItem('user')); }
    catch { return null; }
  },

  /* CRUD */
  getAll(collection) { return this.db()[collection] || []; },

  getById(collection, id) {
    return this.getAll(collection).find(item => item.id === id);
  },

  create(collection, item) {
    const db = this.db();
    if (!db[collection]) db[collection] = [];
    item.id = Date.now();
    db[collection].push(item);
    this.save(db);
    return item;
  },

  update(collection, id, data) {
    const db = this.db();
    db[collection] = db[collection].map(item => item.id === id ? { ...item, ...data } : item);
    this.save(db);
  },

  remove(collection, id) {
    const db = this.db();
    db[collection] = db[collection].filter(item => item.id !== id);
    this.save(db);
  },

  /* Theme */
  initTheme() {
    const theme = this.db().settings?.theme || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    document.getElementById('themeToggle')?.addEventListener('click', () => this.toggleTheme());
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    const db = this.db();
    db.settings.theme = next;
    this.save(db);
  },

  /* Sidebar */
  initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebarToggle');
    const overlay = document.getElementById('sidebarOverlay');

    toggle?.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar?.classList.toggle('mobile-open');
        overlay?.classList.toggle('active');
      } else {
        sidebar?.classList.toggle('collapsed');
        document.body.classList.toggle('sidebar-collapsed');
      }
    });

    overlay?.addEventListener('click', () => {
      sidebar?.classList.remove('mobile-open');
      overlay.classList.remove('active');
    });

    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.logout();
    });
  },

  renderUser() {
    const user = this.currentUser();
    if (!user) return;
    const el = document.getElementById('userName');
    const av = document.getElementById('userAvatar');
    if (el) el.textContent = user.name;
    if (av) av.textContent = user.name.charAt(0).toUpperCase();
  },

  /* Notifications */
  notify(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  },

  /* Utilities */
  formatCurrency(n) { return '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2 }); },
  formatDate(ts) { return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); },

  paginate(items, page, perPage = 10) {
    const total = items.length;
    const pages = Math.ceil(total / perPage) || 1;
    const start = (page - 1) * perPage;
    return { data: items.slice(start, start + perPage), page, pages, total };
  },

  renderPagination(container, page, pages, onPage) {
    if (!container) return;
    container.innerHTML = '';
    const prev = document.createElement('button');
    prev.textContent = 'Prev';
    prev.disabled = page <= 1;
    prev.onclick = () => onPage(page - 1);
    container.appendChild(prev);

    for (let i = 1; i <= pages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      if (i === page) btn.classList.add('active');
      btn.onclick = () => onPage(i);
      container.appendChild(btn);
    }

    const next = document.createElement('button');
    next.textContent = 'Next';
    next.disabled = page >= pages;
    next.onclick = () => onPage(page + 1);
    container.appendChild(next);
  },

  /* Modal helpers */
  openModal(id) { document.getElementById(id)?.classList.add('active'); },
  closeModal(id) { document.getElementById(id)?.classList.remove('active'); },

  initModals() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('active');
      });
    });
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.modal-overlay')?.classList.remove('active');
      });
    });
  },

  /* Form validation */
  validateForm(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach(input => {
      const err = input.parentElement.querySelector('.form-error');
      if (err) err.remove();
      if (!input.value.trim()) {
        valid = false;
        const e = document.createElement('div');
        e.className = 'form-error';
        e.textContent = 'This field is required';
        input.parentElement.appendChild(e);
      }
    });
    return valid;
  },

  /* Global search */
  initGlobalSearch() {
    const input = document.getElementById('globalSearch');
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        sessionStorage.setItem('searchQuery', input.value.trim());
        location.href = 'products.html';
      }
    });
  },

  /* Table sort */
  sortData(data, key, dir) {
    return [...data].sort((a, b) => {
      let va = a[key], vb = b[key];
      if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      if (va < vb) return dir === 'asc' ? -1 : 1;
      if (va > vb) return dir === 'asc' ? 1 : -1;
      return 0;
    });
  },

  getCustomerName(id) { return this.getById('customers', id)?.name || 'N/A'; },
  getSupplierName(id) { return this.getById('suppliers', id)?.name || 'N/A'; },
  getProductName(id) { return this.getById('products', id)?.name || 'N/A'; },
  getWarehouseName(id) { return this.getById('warehouses', id)?.name || 'N/A'; },

  statusBadge(status) {
    const map = { Active: 'success', 'Low Stock': 'warning', Completed: 'success', Pending: 'warning', Received: 'success', Open: 'info', 'In Progress': 'warning', Done: 'success', Cancelled: 'danger' };
    return `<span class="badge badge-${map[status] || 'info'}">${status}</span>`;
  }
};

/* SVG Icons helper */
const Icons = {
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  products: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>',
  customers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
  suppliers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
  warehouse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  sales: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
  purchases: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>',
  maintenance: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>',
  reports: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
  logo: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#fff" opacity=".15"/><path d="M8 22V10l8-4 8 4v12l-8 4-8-4z" stroke="#fff" stroke-width="2" fill="none"/><path d="M16 14v8M12 16v4M20 16v4" stroke="#fff" stroke-width="1.5"/></svg>'
};

document.addEventListener('DOMContentLoaded', () => App.init());
