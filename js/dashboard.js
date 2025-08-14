// Dashboard Management JavaScript
class DashboardManager {
    constructor() {
        this.currentView = 'overview';
        this.refreshInterval = null;
        this.charts = {};
        this.dataCache = {};
        this.init();
    }

    init() {
        this.setupDashboard();
        this.setupRealTimeUpdates();
        this.setupDashboardActions();
        this.setupDataExport();
        this.setupPerformanceMetrics();
        console.log('Dashboard Manager initialized');
    }

    setupDashboard() {
        this.setupQuickActions();
        this.setupDashboardWidgets();
        this.setupDashboardFilters();
        this.setupDashboardLayout();
    }

    setupQuickActions() {
        const addProductBtn = document.getElementById('addProductBtn');
        const generateLinkBtn = document.getElementById('generateLinkBtn');

        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => {
                this.showAddProductModal();
            });
        }

        if (generateLinkBtn) {
            generateLinkBtn.addEventListener('click', () => {
                this.showGenerateLinkModal();
            });
        }

        // Setup other quick actions
        this.setupBulkActions();
        this.setupImportExport();
    }

    setupDashboardWidgets() {
        this.setupStatsWidgets();
        this.setupActivityWidgets();
        this.setupPerformanceWidgets();
        this.setupNotificationWidgets();
    }

    setupStatsWidgets() {
        // Initialize statistics widgets
        this.updateStatsWidgets();
        
        // Setup auto-refresh for stats
        setInterval(() => {
            this.updateStatsWidgets();
        }, 60000); // Update every minute
    }

    updateStatsWidgets() {
        const stats = this.getDashboardStats();
        
        // Update total earnings
        const totalEarnings = document.getElementById('totalEarnings');
        if (totalEarnings) {
            this.animateNumber(totalEarnings, stats.totalEarnings);
        }

        // Update total sales
        const totalSales = document.getElementById('totalSales');
        if (totalSales) {
            this.animateNumber(totalSales, stats.totalSales);
        }

        // Update active links
        const activeLinks = document.getElementById('activeLinks');
        if (activeLinks) {
            this.animateNumber(activeLinks, stats.activeLinks);
        }
    }

    getDashboardStats() {
        // Simulate real-time stats
        return {
            totalEarnings: Math.floor(Math.random() * 5000000) + 1000000,
            totalSales: Math.floor(Math.random() * 500) + 100,
            activeLinks: Math.floor(Math.random() * 200) + 50
        };
    }

    animateNumber(element, targetValue) {
        const currentValue = parseInt(element.textContent.replace(/[^\d]/g, '')) || 0;
        const increment = (targetValue - currentValue) / 20;
        let current = currentValue;

        const animate = () => {
            current += increment;
            if ((increment > 0 && current >= targetValue) || 
                (increment < 0 && current <= targetValue)) {
                current = targetValue;
            }

            if (element.id === 'totalEarnings') {
                element.textContent = `Rp ${current.toLocaleString('id-ID')}`;
            } else {
                element.textContent = current.toLocaleString('id-ID');
            }

            if (current !== targetValue) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    setupActivityWidgets() {
        this.updateActivityWidgets();
        
        // Setup real-time activity updates
        setInterval(() => {
            this.updateActivityWidgets();
        }, 30000); // Update every 30 seconds
    }

    updateActivityWidgets() {
        const activities = this.getRecentActivities();
        this.renderActivities(activities);
    }

    getRecentActivities() {
        // Simulate recent activities
        const activityTypes = [
            { icon: 'fas fa-shopping-cart', type: 'sale', color: 'success' },
            { icon: 'fas fa-link', type: 'click', color: 'primary' },
            { icon: 'fas fa-chart-line', type: 'bonus', color: 'warning' },
            { icon: 'fas fa-user-plus', type: 'referral', color: 'info' }
        ];

        const activities = [];
        for (let i = 0; i < 5; i++) {
            const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
            activities.push({
                id: Date.now() + i,
                icon: randomType.icon,
                type: randomType.type,
                color: randomType.color,
                title: this.generateActivityTitle(randomType.type),
                detail: this.generateActivityDetail(randomType.type),
                time: this.generateRandomTime(),
                amount: this.generateRandomAmount(randomType.type)
            });
        }

        return activities;
    }

    generateActivityTitle(type) {
        const titles = {
            sale: 'Penjualan produk baru',
            click: 'Link afiliasi diklik',
            bonus: 'Target bulanan tercapai',
            referral: 'Referral baru bergabung'
        };
        return titles[type] || 'Aktivitas baru';
    }

    generateActivityDetail(type) {
        const details = {
            sale: 'Komisi: Rp ' + (Math.floor(Math.random() * 100000) + 10000).toLocaleString('id-ID'),
            click: 'Produk: ' + ['Hosting', 'Domain', 'Software', 'Course'][Math.floor(Math.random() * 4)],
            bonus: 'Bonus: Rp ' + (Math.floor(Math.random() * 200000) + 50000).toLocaleString('id-ID'),
            referral: 'User: user' + Math.floor(Math.random() * 1000)
        };
        return details[type] || 'Detail aktivitas';
    }

    generateRandomTime() {
        const times = ['2 menit yang lalu', '5 menit yang lalu', '10 menit yang lalu', '15 menit yang lalu', '30 menit yang lalu'];
        return times[Math.floor(Math.random() * times.length)];
    }

    generateRandomAmount(type) {
        if (type === 'sale') {
            return Math.floor(Math.random() * 100000) + 10000;
        }
        return 0;
    }

    renderActivities(activities) {
        const activityList = document.getElementById('activityList');
        if (activityList) {
            activityList.innerHTML = activities.map(activity => `
                <div class="activity-item" data-activity-id="${activity.id}">
                    <div class="activity-icon activity-${activity.color}">
                        <i class="${activity.icon}"></i>
                    </div>
                    <div class="activity-details">
                        <p>${activity.title}</p>
                        <span>${activity.detail}</span>
                        ${activity.amount > 0 ? `<span class="activity-amount">Rp ${activity.amount.toLocaleString('id-ID')}</span>` : ''}
                    </div>
                    <span class="activity-time">${activity.time}</span>
                </div>
            `).join('');

            // Add click events to activities
            this.setupActivityInteractions();
        }
    }

    setupActivityInteractions() {
        document.querySelectorAll('.activity-item').forEach(item => {
            item.addEventListener('click', () => {
                const activityId = item.getAttribute('data-activity-id');
                this.showActivityDetails(activityId);
            });
        });
    }

    showActivityDetails(activityId) {
        // Show detailed view of the activity
        console.log('Showing activity details for:', activityId);
        this.showNotification('Membuka detail aktivitas...', 'info');
    }

    setupPerformanceWidgets() {
        this.setupPerformanceCharts();
        this.setupPerformanceMetrics();
    }

    setupPerformanceCharts() {
        // Initialize performance charts
        this.createPerformanceChart();
    }

    createPerformanceChart() {
        const ctx = document.getElementById('performanceChart');
        if (ctx) {
            this.charts.performance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: this.getLast7Days(),
                    datasets: [{
                        label: 'Pendapatan',
                        data: this.generateRandomData(7, 100000, 500000),
                        borderColor: '#4F46E5',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return 'Rp ' + value.toLocaleString('id-ID');
                                }
                            }
                        }
                    }
                }
            });
        }
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

    generateRandomData(count, min, max) {
        const data = [];
        for (let i = 0; i < count; i++) {
            data.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        return data;
    }

    setupPerformanceMetrics() {
        this.updatePerformanceMetrics();
        
        // Update metrics every 5 minutes
        setInterval(() => {
            this.updatePerformanceMetrics();
        }, 300000);
    }

    updatePerformanceMetrics() {
        const metrics = this.getPerformanceMetrics();
        
        // Update conversion rate
        const conversionRate = document.getElementById('conversionRate');
        if (conversionRate) {
            conversionRate.textContent = metrics.conversionRate + '%';
        }

        // Update ranking
        const ranking = document.getElementById('ranking');
        if (ranking) {
            ranking.textContent = '#' + metrics.ranking;
        }

        // Update other metrics
        this.updateMetricCards(metrics);
    }

    getPerformanceMetrics() {
        return {
            conversionRate: (Math.random() * 5 + 1).toFixed(1),
            ranking: Math.floor(Math.random() * 50) + 1,
            todayEarnings: Math.floor(Math.random() * 200000) + 50000,
            todayClicks: Math.floor(Math.random() * 200) + 50
        };
    }

    updateMetricCards(metrics) {
        // Update today's earnings
        const todayEarnings = document.getElementById('todayEarnings');
        if (todayEarnings) {
            todayEarnings.textContent = 'Rp ' + metrics.todayEarnings.toLocaleString('id-ID');
        }

        // Update today's clicks
        const todayClicks = document.getElementById('todayClicks');
        if (todayClicks) {
            todayClicks.textContent = metrics.todayClicks;
        }
    }

    setupNotificationWidgets() {
        this.setupNotificationCenter();
        this.setupNotificationPreferences();
    }

    setupNotificationCenter() {
        // Create notification center if it doesn't exist
        if (!document.getElementById('notificationCenter')) {
            this.createNotificationCenter();
        }
    }

    createNotificationCenter() {
        const sidebar = document.querySelector('.sidebar-content');
        if (sidebar) {
            const notificationCenter = document.createElement('div');
            notificationCenter.id = 'notificationCenter';
            notificationCenter.className = 'notification-center';
            notificationCenter.innerHTML = `
                <h4>Notifikasi</h4>
                <div class="notification-list" id="notificationList">
                    <!-- Notifications will be loaded here -->
                </div>
                <button class="btn btn-sm btn-primary" id="markAllReadBtn">Tandai Semua Dibaca</button>
            `;

            // Insert after quick actions
            const quickActions = sidebar.querySelector('.quick-actions');
            if (quickActions) {
                quickActions.parentNode.insertBefore(notificationCenter, quickActions.nextSibling);
            }

            // Setup notification center functionality
            this.setupNotificationCenterEvents();
        }
    }

    setupNotificationCenterEvents() {
        const markAllReadBtn = document.getElementById('markAllReadBtn');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', () => {
                this.markAllNotificationsAsRead();
            });
        }
    }

    markAllNotificationsAsRead() {
        // Mark all notifications as read
        document.querySelectorAll('.notification-item').forEach(item => {
            item.classList.remove('unread');
        });
        this.showNotification('Semua notifikasi ditandai dibaca', 'success');
    }

    setupDashboardFilters() {
        this.setupDateFilters();
        this.setupCategoryFilters();
        this.setupStatusFilters();
    }

    setupDateFilters() {
        // Create date range picker
        this.createDateRangePicker();
    }

    createDateRangePicker() {
        const dashboardHeader = document.querySelector('.section-header');
        if (dashboardHeader) {
            const dateFilter = document.createElement('div');
            dateFilter.className = 'date-filter';
            dateFilter.innerHTML = `
                <div class="date-range-picker">
                    <label>Rentang Waktu:</label>
                    <select id="dateRange">
                        <option value="today">Hari Ini</option>
                        <option value="week">Minggu Ini</option>
                        <option value="month" selected>Bulan Ini</option>
                        <option value="quarter">Kuartal Ini</option>
                        <option value="year">Tahun Ini</option>
                        <option value="custom">Kustom</option>
                    </select>
                </div>
            `;

            dashboardHeader.appendChild(dateFilter);

            // Setup date range change event
            const dateRange = document.getElementById('dateRange');
            if (dateRange) {
                dateRange.addEventListener('change', () => {
                    this.handleDateRangeChange(dateRange.value);
                });
            }
        }
    }

    handleDateRangeChange(range) {
        console.log('Date range changed to:', range);
        this.updateDashboardData(range);
    }

    updateDashboardData(dateRange) {
        // Update dashboard data based on date range
        this.updateStatsWidgets();
        this.updateActivityWidgets();
        this.updatePerformanceMetrics();
        
        // Show loading state
        this.showLoadingState();
        
        // Simulate data loading
        setTimeout(() => {
            this.hideLoadingState();
            this.showNotification(`Dashboard diperbarui untuk ${dateRange}`, 'success');
        }, 1000);
    }

    setupCategoryFilters() {
        // Setup category-based filtering
        this.createCategoryFilter();
    }

    createCategoryFilter() {
        const dashboardHeader = document.querySelector('.section-header');
        if (dashboardHeader) {
            const categoryFilter = document.createElement('div');
            categoryFilter.className = 'category-filter';
            categoryFilter.innerHTML = `
                <div class="filter-group">
                    <label>Kategori:</label>
                    <select id="dashboardCategoryFilter">
                        <option value="">Semua Kategori</option>
                        <option value="hosting">Hosting</option>
                        <option value="domain">Domain</option>
                        <option value="software">Software</option>
                        <option value="course">Course</option>
                    </select>
                </div>
            `;

            dashboardHeader.appendChild(categoryFilter);

            // Setup category filter change event
            const categorySelect = document.getElementById('dashboardCategoryFilter');
            if (categorySelect) {
                categorySelect.addEventListener('change', () => {
                    this.handleCategoryFilterChange(categorySelect.value);
                });
            }
        }
    }

    handleCategoryFilterChange(category) {
        console.log('Category filter changed to:', category);
        this.filterDashboardData(category);
    }

    filterDashboardData(category) {
        // Filter dashboard data based on category
        if (category) {
            this.showNotification(`Data difilter untuk kategori: ${category}`, 'info');
        } else {
            this.showNotification('Semua data ditampilkan', 'info');
        }
    }

    setupStatusFilters() {
        // Setup status-based filtering
        this.createStatusFilter();
    }

    createStatusFilter() {
        const dashboardHeader = document.querySelector('.section-header');
        if (dashboardHeader) {
            const statusFilter = document.createElement('div');
            statusFilter.className = 'status-filter';
            statusFilter.innerHTML = `
                <div class="filter-group">
                    <label>Status:</label>
                    <select id="dashboardStatusFilter">
                        <option value="">Semua Status</option>
                        <option value="active">Aktif</option>
                        <option value="inactive">Tidak Aktif</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            `;

            dashboardHeader.appendChild(statusFilter);

            // Setup status filter change event
            const statusSelect = document.getElementById('dashboardStatusFilter');
            if (statusSelect) {
                statusSelect.addEventListener('change', () => {
                    this.handleStatusFilterChange(statusSelect.value);
                });
            }
        }
    }

    handleStatusFilterChange(status) {
        console.log('Status filter changed to:', status);
        this.filterDashboardDataByStatus(status);
    }

    filterDashboardDataByStatus(status) {
        // Filter dashboard data based on status
        if (status) {
            this.showNotification(`Data difilter untuk status: ${status}`, 'info');
        } else {
            this.showNotification('Semua data ditampilkan', 'info');
        }
    }

    setupDashboardLayout() {
        this.setupLayoutPreferences();
        this.setupLayoutCustomization();
    }

    setupLayoutPreferences() {
        // Load user's layout preferences
        const layoutPrefs = localStorage.getItem('dashboardLayout');
        if (layoutPrefs) {
            this.applyLayoutPreferences(JSON.parse(layoutPrefs));
        }
    }

    applyLayoutPreferences(prefs) {
        // Apply saved layout preferences
        console.log('Applying layout preferences:', prefs);
    }

    setupLayoutCustomization() {
        // Setup layout customization options
        this.createLayoutCustomizer();
    }

    createLayoutCustomizer() {
        const dashboardHeader = document.querySelector('.section-header');
        if (dashboardHeader) {
            const layoutCustomizer = document.createElement('div');
            layoutCustomizer.className = 'layout-customizer';
            layoutCustomizer.innerHTML = `
                <button class="btn btn-sm btn-secondary" id="customizeLayoutBtn">
                    <i class="fas fa-cog"></i> Kustomisasi Layout
                </button>
            `;

            dashboardHeader.appendChild(layoutCustomizer);

            // Setup layout customization event
            const customizeBtn = document.getElementById('customizeLayoutBtn');
            if (customizeBtn) {
                customizeBtn.addEventListener('click', () => {
                    this.showLayoutCustomizer();
                });
            }
        }
    }

    showLayoutCustomizer() {
        // Show layout customization modal
        this.showNotification('Layout customizer akan segera tersedia', 'info');
    }

    setupRealTimeUpdates() {
        this.setupWebSocketConnection();
        this.setupPollingUpdates();
    }

    setupWebSocketConnection() {
        // Setup WebSocket connection for real-time updates
        console.log('Setting up WebSocket connection...');
        
        // Simulate WebSocket connection
        this.simulateRealTimeUpdates();
    }

    simulateRealTimeUpdates() {
        // Simulate real-time data updates
        setInterval(() => {
            this.updateRandomMetric();
        }, 10000); // Update every 10 seconds
    }

    updateRandomMetric() {
        const metrics = ['todayEarnings', 'todayClicks', 'conversionRate', 'ranking'];
        const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
        
        // Update random metric with small change
        this.updateMetricValue(randomMetric);
    }

    updateMetricValue(metricId) {
        const element = document.getElementById(metricId);
        if (element) {
            // Add subtle animation to show update
            element.classList.add('updating');
            setTimeout(() => {
                element.classList.remove('updating');
            }, 1000);
        }
    }

    setupPollingUpdates() {
        // Setup polling for data updates
        this.refreshInterval = setInterval(() => {
            this.pollForUpdates();
        }, 30000); // Poll every 30 seconds
    }

    pollForUpdates() {
        // Poll server for updates
        console.log('Polling for updates...');
        this.checkForNewData();
    }

    checkForNewData() {
        // Check if there's new data to display
        const hasNewData = Math.random() > 0.7; // 30% chance of new data
        
        if (hasNewData) {
            this.showNotification('Data baru tersedia', 'info');
            this.refreshDashboardData();
        }
    }

    refreshDashboardData() {
        // Refresh dashboard data
        this.updateStatsWidgets();
        this.updateActivityWidgets();
        this.updatePerformanceMetrics();
    }

    setupDashboardActions() {
        this.setupBulkActions();
        this.setupImportExport();
        this.setupDataManagement();
    }

    setupBulkActions() {
        // Setup bulk actions for dashboard items
        this.createBulkActionBar();
    }

    createBulkActionBar() {
        const dashboardMain = document.getElementById('dashboardMain');
        if (dashboardMain) {
            const bulkActionBar = document.createElement('div');
            bulkActionBar.id = 'bulkActionBar';
            bulkActionBar.className = 'bulk-action-bar hidden';
            bulkActionBar.innerHTML = `
                <div class="bulk-action-content">
                    <span class="selected-count">0 item dipilih</span>
                    <div class="bulk-actions">
                        <button class="btn btn-sm btn-primary">Export</button>
                        <button class="btn btn-sm btn-secondary">Archive</button>
                        <button class="btn btn-sm btn-danger">Delete</button>
                    </div>
                </div>
            `;

            dashboardMain.insertBefore(bulkActionBar, dashboardMain.firstChild);
        }
    }

    setupImportExport() {
        // Setup import/export functionality
        this.createImportExportTools();
    }

    createImportExportTools() {
        const dashboardHeader = document.querySelector('.section-header');
        if (dashboardHeader) {
            const importExportTools = document.createElement('div');
            importExportTools.className = 'import-export-tools';
            importExportTools.innerHTML = `
                <div class="tool-buttons">
                    <button class="btn btn-sm btn-secondary" id="importDataBtn">
                        <i class="fas fa-upload"></i> Import
                    </button>
                    <button class="btn btn-sm btn-secondary" id="exportDataBtn">
                        <i class="fas fa-download"></i> Export
                    </button>
                </div>
            `;

            dashboardHeader.appendChild(importExportTools);

            // Setup import/export events
            this.setupImportExportEvents();
        }
    }

    setupImportExportEvents() {
        const importBtn = document.getElementById('importDataBtn');
        const exportBtn = document.getElementById('exportDataBtn');

        if (importBtn) {
            importBtn.addEventListener('click', () => {
                this.showImportModal();
            });
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportDashboardData();
            });
        }
    }

    showImportModal() {
        // Show import modal
        this.showNotification('Fitur import akan segera tersedia', 'info');
    }

    exportDashboardData() {
        // Export dashboard data
        this.showNotification('Mengexport data dashboard...', 'info');
        
        // Simulate export process
        setTimeout(() => {
            this.showNotification('Data berhasil diexport', 'success');
        }, 2000);
    }

    setupDataManagement() {
        // Setup data management tools
        this.createDataManagementTools();
    }

    createDataManagementTools() {
        const dashboardHeader = document.querySelector('.section-header');
        if (dashboardHeader) {
            const dataManagementTools = document.createElement('div');
            dataManagementTools.className = 'data-management-tools';
            dataManagementTools.innerHTML = `
                <div class="tool-buttons">
                    <button class="btn btn-sm btn-secondary" id="backupDataBtn">
                        <i class="fas fa-save"></i> Backup
                    </button>
                    <button class="btn btn-sm btn-secondary" id="restoreDataBtn">
                        <i class="fas fa-undo"></i> Restore
                    </button>
                    <button class="btn btn-sm btn-secondary" id="clearDataBtn">
                        <i class="fas fa-trash"></i> Clear
                    </button>
                </div>
            `;

            dashboardHeader.appendChild(dataManagementTools);

            // Setup data management events
            this.setupDataManagementEvents();
        }
    }

    setupDataManagementEvents() {
        const backupBtn = document.getElementById('backupDataBtn');
        const restoreBtn = document.getElementById('restoreDataBtn');
        const clearBtn = document.getElementById('clearDataBtn');

        if (backupBtn) {
            backupBtn.addEventListener('click', () => {
                this.backupDashboardData();
            });
        }

        if (restoreBtn) {
            restoreBtn.addEventListener('click', () => {
                this.restoreDashboardData();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearDashboardData();
            });
        }
    }

    backupDashboardData() {
        // Backup dashboard data
        this.showNotification('Membuat backup data...', 'info');
        
        setTimeout(() => {
            this.showNotification('Backup berhasil dibuat', 'success');
        }, 2000);
    }

    restoreDashboardData() {
        // Restore dashboard data
        this.showNotification('Memulihkan data...', 'info');
        
        setTimeout(() => {
            this.showNotification('Data berhasil dipulihkan', 'success');
        }, 2000);
    }

    clearDashboardData() {
        // Clear dashboard data
        if (confirm('Apakah Anda yakin ingin menghapus semua data dashboard?')) {
            this.showNotification('Menghapus data...', 'warning');
            
            setTimeout(() => {
                this.showNotification('Data berhasil dihapus', 'success');
                this.refreshDashboardData();
            }, 2000);
        }
    }

    setupDataExport() {
        // Setup data export functionality
        this.setupExportFormats();
        this.setupExportScheduling();
    }

    setupExportFormats() {
        // Setup different export formats
        console.log('Setting up export formats...');
    }

    setupExportScheduling() {
        // Setup scheduled exports
        console.log('Setting up export scheduling...');
    }

    setupPerformanceMetrics() {
        // Setup performance monitoring
        this.setupPerformanceMonitoring();
        this.setupPerformanceAlerts();
    }

    setupPerformanceMonitoring() {
        // Monitor dashboard performance
        console.log('Setting up performance monitoring...');
    }

    setupPerformanceAlerts() {
        // Setup performance alerts
        console.log('Setting up performance alerts...');
    }

    // Utility methods
    showLoadingState() {
        const dashboard = document.getElementById('dashboard');
        if (dashboard) {
            dashboard.classList.add('loading');
        }
    }

    hideLoadingState() {
        const dashboard = document.getElementById('dashboard');
        if (dashboard) {
            dashboard.classList.remove('loading');
        }
    }

    showNotification(message, type = 'info') {
        // Use the main app's notification system
        if (window.powerfulSEOApp && window.powerfulSEOApp.showNotification) {
            window.powerfulSEOApp.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // Modal management
    showAddProductModal() {
        this.showNotification('Modal tambah produk akan segera tersedia', 'info');
    }

    showGenerateLinkModal() {
        this.showNotification('Modal generate link akan segera tersedia', 'info');
    }

    // Cleanup
    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        // Cleanup charts
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.destroy) {
                chart.destroy();
            }
        });
        
        console.log('Dashboard Manager destroyed');
    }
}

// Initialize Dashboard Manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardManager;
}