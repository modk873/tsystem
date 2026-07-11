/* Dashboard logic */
const Dashboard = {
  init() {
    this.renderStats();
    this.renderLowStock();
    this.renderRecentOrders();
    this.renderNotifications();
    if (typeof Charts !== 'undefined') Charts.init();
  },

  renderStats() {
    const { sales, products, purchases, customers } = App.db();
    const revenue = sales.reduce((s, o) => s + o.total, 0);
    const completedSales = sales.filter(s => s.status === 'Completed').length;
    const lowStock = products.filter(p => p.qty < 10).length;
    const purchaseTotal = purchases.reduce((s, p) => s + p.total, 0);

    const stats = [
      { label: 'Total Revenue', value: App.formatCurrency(revenue), icon: 'blue', change: '+12.5%', up: true },
      { label: 'Sales Orders', value: sales.length, icon: 'green', change: `${completedSales} completed`, up: true },
      { label: 'Products', value: products.length, icon: 'orange', change: `${lowStock} low stock`, up: false },
      { label: 'Customers', value: customers.length, icon: 'red', change: App.formatCurrency(purchaseTotal) + ' purchases', up: true }
    ];

    const grid = document.getElementById('statsGrid');
    if (!grid) return;
    grid.innerHTML = stats.map(s => `
      <div class="stat-card">
        <div class="stat-icon ${s.icon}">${Icons.sales.replace('width="24"','width="24"')}</div>
        <div class="stat-info">
          <h3>${s.value}</h3>
          <p>${s.label}</p>
          <div class="stat-change ${s.up ? 'up' : 'down'}">${s.change}</div>
        </div>
      </div>
    `).join('');
  },

  renderLowStock() {
    const products = App.getAll('products').filter(p => p.qty < 10);
    const list = document.getElementById('lowStockList');
    if (!list) return;
    if (!products.length) {
      list.innerHTML = '<li style="color:var(--text-muted)">All products well stocked</li>';
      return;
    }
    list.innerHTML = products.map(p => `
      <li>
        <span class="alert-dot ${p.qty < 5 ? 'danger' : 'warning'}"></span>
        <div><strong>${p.name}</strong><br><small>${p.sku} — ${p.qty} units left</small></div>
      </li>
    `).join('');
  },

  renderRecentOrders() {
    const sales = [...App.getAll('sales')].sort((a, b) => b.date - a.date).slice(0, 5);
    const tbody = document.getElementById('recentOrdersBody');
    if (!tbody) return;
    tbody.innerHTML = sales.map(s => `
      <tr>
        <td><strong>${s.orderNo}</strong></td>
        <td>${App.getCustomerName(s.customerId)}</td>
        <td>${App.formatCurrency(s.total)}</td>
        <td>${App.statusBadge(s.status)}</td>
        <td>${App.formatDate(s.date)}</td>
      </tr>
    `).join('');
  },

  renderNotifications() {
    const notifs = App.getAll('notifications').sort((a, b) => b.date - a.date);
    const list = document.getElementById('notificationList');
    const badge = document.getElementById('notifBadge');
    const unread = notifs.filter(n => !n.read).length;
    if (badge) badge.style.display = unread ? 'block' : 'none';
    if (!list) return;
    list.innerHTML = notifs.slice(0, 5).map(n => `
      <li class="notification-item">
        ${n.message}
        <div class="time">${App.formatDate(n.date)}</div>
      </li>
    `).join('');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('statsGrid')) Dashboard.init();
});
