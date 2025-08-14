// Charts and Data Visualization JavaScript
class ChartsManager {
    constructor() {
        this.charts = {};
        this.chartColors = {
            primary: '#4F46E5',
            secondary: '#10B981',
            accent: '#F59E0B',
            danger: '#EF4444',
            warning: '#F59E0B',
            success: '#10B981',
            info: '#3B82F6'
        };
        this.init();
    }

    init() {
        this.setupCharts();
        this.setupChartResponsiveness();
        this.setupChartInteractions();
        console.log('Charts Manager initialized');
    }

    setupCharts() {
        // Initialize all charts
        this.initEarningsChart();
        this.initTrafficChart();
        this.initPerformanceChart();
        this.initGeographicChart();
        this.initProductPerformanceChart();
        this.initConversionChart();
    }

    initEarningsChart() {
        const ctx = document.getElementById('earningsChart');
        if (ctx) {
            this.charts.earnings = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: this.getLast12Months(),
                    datasets: [{
                        label: 'Pendapatan',
                        data: this.generateEarningsData(),
                        borderColor: this.chartColors.primary,
                        backgroundColor: this.hexToRgba(this.chartColors.primary, 0.1),
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: this.chartColors.primary,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff',
                            borderColor: this.chartColors.primary,
                            borderWidth: 1,
                            callbacks: {
                                label: function(context) {
                                    return 'Pendapatan: Rp ' + context.parsed.y.toLocaleString('id-ID');
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#6B7280',
                                font: {
                                    size: 12
                                }
                            }
                        },
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: '#E5E7EB',
                                borderDash: [5, 5]
                            },
                            ticks: {
                                color: '#6B7280',
                                font: {
                                    size: 12
                                },
                                callback: function(value) {
                                    return 'Rp ' + (value / 1000000).toFixed(1) + 'M';
                                }
                            }
                        }
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    },
                    elements: {
                        point: {
                            hoverBackgroundColor: this.chartColors.primary
                        }
                    }
                }
            });
        }
    }

    initTrafficChart() {
        const ctx = document.getElementById('trafficChart');
        if (ctx) {
            this.charts.traffic = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: this.getLast7Days(),
                    datasets: [
                        {
                            label: 'Klik',
                            data: this.generateTrafficData('clicks'),
                            backgroundColor: this.chartColors.primary,
                            borderColor: this.chartColors.primary,
                            borderWidth: 0,
                            borderRadius: 4,
                            borderSkipped: false
                        },
                        {
                            label: 'Konversi',
                            data: this.generateTrafficData('conversions'),
                            backgroundColor: this.chartColors.success,
                            borderColor: this.chartColors.success,
                            borderWidth: 0,
                            borderRadius: 4,
                            borderSkipped: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                padding: 20,
                                color: '#6B7280',
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff',
                            borderColor: this.chartColors.primary,
                            borderWidth: 1
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#6B7280',
                                font: {
                                    size: 12
                                }
                            }
                        },
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: '#E5E7EB',
                                borderDash: [5, 5]
                            },
                            ticks: {
                                color: '#6B7280',
                                font: {
                                    size: 12
                                }
                            }
                        }
                    },
                    interaction: {
                        mode: 'index',
                        intersect: false
                    }
                }
            });
        }
    }

    initPerformanceChart() {
        const ctx = document.getElementById('performanceChart');
        if (ctx) {
            this.charts.performance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Hosting', 'Domain', 'Software', 'Course', 'Lainnya'],
                    datasets: [{
                        data: [35, 25, 20, 15, 5],
                        backgroundColor: [
                            this.chartColors.primary,
                            this.chartColors.success,
                            this.chartColors.accent,
                            this.chartColors.info,
                            this.chartColors.secondary
                        ],
                        borderColor: '#ffffff',
                        borderWidth: 3,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                padding: 20,
                                color: '#6B7280',
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff',
                            borderColor: this.chartColors.primary,
                            borderWidth: 1,
                            callbacks: {
                                label: function(context) {
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((context.parsed / total) * 100).toFixed(1);
                                    return context.label + ': ' + percentage + '%';
                                }
                            }
                        }
                    },
                    cutout: '60%'
                }
            });
        }
    }

    initGeographicChart() {
        // Create geographic performance chart
        this.createGeographicChart();
    }

    createGeographicChart() {
        const geoContainer = document.getElementById('geoPerformance');
        if (geoContainer) {
            const chartContainer = document.createElement('div');
            chartContainer.className = 'geo-chart-container';
            chartContainer.innerHTML = `
                <canvas id="geographicChart"></canvas>
            `;
            geoContainer.appendChild(chartContainer);

            const ctx = document.getElementById('geographicChart');
            if (ctx) {
                this.charts.geographic = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang'],
                        datasets: [{
                            label: 'Performa',
                            data: this.generateGeographicData(),
                            backgroundColor: this.chartColors.primary,
                            borderColor: this.chartColors.primary,
                            borderWidth: 0,
                            borderRadius: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                titleColor: '#ffffff',
                                bodyColor: '#ffffff',
                                borderColor: this.chartColors.primary,
                                borderWidth: 1
                            }
                        },
                        scales: {
                            x: {
                                grid: {
                                    display: false
                                },
                                ticks: {
                                    color: '#6B7280',
                                    font: {
                                        size: 11
                                    }
                                }
                            },
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: '#E5E7EB',
                                    borderDash: [5, 5]
                                },
                                ticks: {
                                    color: '#6B7280',
                                    font: {
                                        size: 11
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
    }

    initProductPerformanceChart() {
        const topProductsContainer = document.getElementById('topProducts');
        if (topProductsContainer) {
            this.createProductPerformanceChart(topProductsContainer);
        }
    }

    createProductPerformanceChart(container) {
        const products = [
            { name: 'Hosting Premium', performance: 95, color: this.chartColors.primary },
            { name: 'Domain .com', performance: 87, color: this.chartColors.success },
            { name: 'Software Antivirus', performance: 78, color: this.chartColors.accent },
            { name: 'Course Digital Marketing', performance: 72, color: this.chartColors.info },
            { name: 'SSL Certificate', performance: 65, color: this.chartColors.warning }
        ];

        container.innerHTML = products.map(product => `
            <div class="product-performance-item">
                <div class="product-info">
                    <span class="product-name">${product.name}</span>
                    <span class="product-score">${product.performance}%</span>
                </div>
                <div class="performance-bar">
                    <div class="performance-fill" style="width: ${product.performance}%; background-color: ${product.color}"></div>
                </div>
            </div>
        `).join('');
    }

    initConversionChart() {
        // Create conversion funnel chart
        this.createConversionFunnel();
    }

    createConversionFunnel() {
        const conversionContainer = document.getElementById('conversionFunnel');
        if (conversionContainer) {
            const funnelData = [
                { stage: 'Impressions', count: 10000, percentage: 100, color: this.chartColors.info },
                { stage: 'Clicks', count: 500, percentage: 5, color: this.chartColors.primary },
                { stage: 'Add to Cart', count: 100, percentage: 1, color: this.chartColors.accent },
                { stage: 'Purchase', count: 25, percentage: 0.25, color: this.chartColors.success }
            ];

            conversionContainer.innerHTML = funnelData.map(item => `
                <div class="funnel-stage">
                    <div class="stage-info">
                        <span class="stage-name">${item.stage}</span>
                        <span class="stage-count">${item.count.toLocaleString('id-ID')}</span>
                        <span class="stage-percentage">${item.percentage}%</span>
                    </div>
                    <div class="funnel-bar" style="background-color: ${item.color}; width: ${item.percentage}%"></div>
                </div>
            `).join('');
        }
    }

    // Data generation methods
    getLast12Months() {
        const months = [];
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        
        for (let i = 11; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            months.push(monthNames[date.getMonth()]);
        }
        
        return months;
    }

    getLast7Days() {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toLocaleDateString('id-ID', { weekday: 'short' }));
        }
        return days;
    }

    generateEarningsData() {
        const data = [];
        for (let i = 0; i < 12; i++) {
            data.push(Math.floor(Math.random() * 5000000) + 1000000);
        }
        return data;
    }

    generateTrafficData(type) {
        const data = [];
        for (let i = 0; i < 7; i++) {
            if (type === 'clicks') {
                data.push(Math.floor(Math.random() * 500) + 100);
            } else {
                data.push(Math.floor(Math.random() * 50) + 10);
            }
        }
        return data;
    }

    generateGeographicData() {
        const data = [];
        for (let i = 0; i < 5; i++) {
            data.push(Math.floor(Math.random() * 100) + 50);
        }
        return data;
    }

    // Chart responsiveness
    setupChartResponsiveness() {
        window.addEventListener('resize', () => {
            this.handleChartResize();
        });

        // Setup chart resize observer
        this.setupResizeObserver();
    }

    setupResizeObserver() {
        if ('ResizeObserver' in window) {
            const resizeObserver = new ResizeObserver(entries => {
                entries.forEach(entry => {
                    const chartId = entry.target.id;
                    if (this.charts[chartId]) {
                        this.charts[chartId].resize();
                    }
                });
            });

            // Observe all chart containers
            Object.keys(this.charts).forEach(chartKey => {
                const chart = this.charts[chartKey];
                if (chart && chart.canvas) {
                    resizeObserver.observe(chart.canvas);
                }
            });
        }
    }

    handleChartResize() {
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.resize) {
                chart.resize();
            }
        });
    }

    // Chart interactions
    setupChartInteractions() {
        this.setupChartClickEvents();
        this.setupChartHoverEffects();
        this.setupChartAnimations();
    }

    setupChartClickEvents() {
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.canvas) {
                chart.canvas.addEventListener('click', (e) => {
                    this.handleChartClick(e, chart);
                });
            }
        });
    }

    handleChartClick(event, chart) {
        const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
        
        if (points.length > 0) {
            const firstPoint = points[0];
            const dataIndex = firstPoint.index;
            const datasetIndex = firstPoint.datasetIndex;
            
            this.showChartDataDetails(chart, dataIndex, datasetIndex);
        }
    }

    showChartDataDetails(chart, dataIndex, datasetIndex) {
        const data = chart.data.datasets[datasetIndex].data[dataIndex];
        const label = chart.data.labels[dataIndex];
        
        console.log(`Chart data: ${label} = ${data}`);
        
        // Show detailed information in a tooltip or modal
        this.showDataTooltip(label, data);
    }

    showDataTooltip(label, data) {
        // Create and show a custom tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <strong>${label}</strong><br>
                Nilai: ${data.toLocaleString('id-ID')}
            </div>
        `;
        
        document.body.appendChild(tooltip);
        
        // Position tooltip near cursor
        const rect = tooltip.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.left = (event.clientX - rect.width / 2) + 'px';
        tooltip.style.top = (event.clientY - rect.height - 10) + 'px';
        
        // Remove tooltip after 3 seconds
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.remove();
            }
        }, 3000);
    }

    setupChartHoverEffects() {
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.options) {
                chart.options.onHover = (event, elements) => {
                    this.handleChartHover(event, elements, chart);
                };
            }
        });
    }

    handleChartHover(event, elements, chart) {
        const canvas = chart.canvas;
        
        if (elements.length > 0) {
            canvas.style.cursor = 'pointer';
        } else {
            canvas.style.cursor = 'default';
        }
    }

    setupChartAnimations() {
        // Add custom animations to charts
        this.setupChartEntranceAnimations();
        this.setupChartUpdateAnimations();
    }

    setupChartEntranceAnimations() {
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.options) {
                chart.options.animation = {
                    duration: 1000,
                    easing: 'easeOutQuart'
                };
            }
        });
    }

    setupChartUpdateAnimations() {
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.options) {
                chart.options.animation = {
                    duration: 750,
                    easing: 'easeInOutQuart'
                };
            }
        });
    }

    // Chart update methods
    updateChartData(chartName, newData) {
        const chart = this.charts[chartName];
        if (chart) {
            chart.data.datasets[0].data = newData;
            chart.update('active');
        }
    }

    updateChartLabels(chartName, newLabels) {
        const chart = this.charts[chartName];
        if (chart) {
            chart.data.labels = newLabels;
            chart.update('active');
        }
    }

    addChartDataset(chartName, dataset) {
        const chart = this.charts[chartName];
        if (chart) {
            chart.data.datasets.push(dataset);
            chart.update('active');
        }
    }

    removeChartDataset(chartName, datasetIndex) {
        const chart = this.charts[chartName];
        if (chart) {
            chart.data.datasets.splice(datasetIndex, 1);
            chart.update('active');
        }
    }

    // Chart export methods
    exportChartAsImage(chartName, format = 'png') {
        const chart = this.charts[chartName];
        if (chart) {
            const dataURL = chart.toBase64Image(format);
            this.downloadImage(dataURL, `${chartName}_chart.${format}`);
        }
    }

    exportChartAsPDF(chartName) {
        const chart = this.charts[chartName];
        if (chart) {
            // Implementation for PDF export
            console.log(`Exporting ${chartName} as PDF...`);
        }
    }

    downloadImage(dataURL, filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Utility methods
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Chart refresh methods
    refreshAllCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.update) {
                chart.update('none');
            }
        });
    }

    refreshChart(chartName) {
        const chart = this.charts[chartName];
        if (chart && chart.update) {
            chart.update('active');
        }
    }

    // Chart destruction
    destroyChart(chartName) {
        const chart = this.charts[chartName];
        if (chart && chart.destroy) {
            chart.destroy();
            delete this.charts[chartName];
        }
    }

    destroyAllCharts() {
        Object.keys(this.charts).forEach(chartName => {
            this.destroyChart(chartName);
        });
    }

    // Performance monitoring
    setupPerformanceMonitoring() {
        this.monitorChartPerformance();
        this.setupPerformanceOptimizations();
    }

    monitorChartPerformance() {
        // Monitor chart rendering performance
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.canvas) {
                const startTime = performance.now();
                
                chart.update('none');
                
                const endTime = performance.now();
                const renderTime = endTime - startTime;
                
                if (renderTime > 100) {
                    console.warn(`Chart ${chart.id} took ${renderTime.toFixed(2)}ms to render`);
                }
            }
        });
    }

    setupPerformanceOptimizations() {
        // Apply performance optimizations
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.options) {
                // Reduce animation duration for better performance
                chart.options.animation = {
                    duration: 500
                };
                
                // Optimize rendering
                chart.options.elements = {
                    point: {
                        radius: 4,
                        hoverRadius: 6
                    }
                };
            }
        });
    }
}

// Initialize Charts Manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.chartsManager = new ChartsManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChartsManager;
}