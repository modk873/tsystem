/* Chart.js wrappers */
const Charts = {
  salesChart: null,
  inventoryChart: null,

  init() {
    this.renderSalesChart();
    this.renderInventoryChart();
  },

  renderSalesChart() {
    const canvas = document.getElementById('salesChart');
    if (!canvas || typeof Chart === 'undefined') return;
    const sales = App.getAll('sales');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const data = new Array(12).fill(0);
    sales.forEach(s => {
      const m = new Date(s.date).getMonth();
      data[m] += s.total;
    });

    if (this.salesChart) this.salesChart.destroy();
    this.salesChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Revenue',
          data: data,
          borderColor: '#1e5aa8',
          backgroundColor: 'rgba(30,90,168,.1)',
          fill: true,
          tension: .4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
  },

  renderInventoryChart() {
    const canvas = document.getElementById('inventoryChart');
    if (!canvas || typeof Chart === 'undefined') return;
    const products = App.getAll('products');
    const cats = {};
    products.forEach(p => { cats[p.category] = (cats[p.category] || 0) + p.qty; });

    if (this.inventoryChart) this.inventoryChart.destroy();
    this.inventoryChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: Object.keys(cats),
        datasets: [{
          data: Object.values(cats),
          backgroundColor: ['#1e5aa8','#0ea5e9','#16a34a','#d97706','#dc2626','#8b5cf6','#64748b']
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } } }
    });
  },

  renderReportCharts(salesData, inventoryData) {
    const sc = document.getElementById('reportSalesChart');
    const ic = document.getElementById('reportInventoryChart');
    if (sc && typeof Chart !== 'undefined') {
      new Chart(sc, {
        type: 'bar',
        data: { labels: salesData.labels, datasets: [{ label: 'Sales', data: salesData.values, backgroundColor: '#1e5aa8' }] },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
    if (ic && typeof Chart !== 'undefined') {
      new Chart(ic, {
        type: 'pie',
        data: { labels: inventoryData.labels, datasets: [{ data: inventoryData.values, backgroundColor: ['#1e5aa8','#0ea5e9','#16a34a','#d97706','#dc2626'] }] },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  }
};
