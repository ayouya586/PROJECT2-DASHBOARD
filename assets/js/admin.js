// Admin Authentication
let isAuthenticated = false;

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!localStorage.getItem('adminAuthenticated')) {
        window.location.href = 'login.html';
        return;
    }

    // Load initial dashboard content
    loadDashboard();

    // Setup navigation
    setupNavigation();

    // Configuration des graphiques
    Chart.defaults.color = '#1D2D44';
    Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    Chart.defaults.font.size = 14;

    // Données initiales
    const initialData = {
        clients: {
            year: {
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
                data: [12, 19, 15, 25, 22, 30, 28, 35, 40, 42, 45, 48]
            },
            month: {
                labels: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
                data: [20, 25, 28, 30]
            },
            week: {
                labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
                data: [5, 7, 4, 8, 6, 9, 8]
            }
        },
        products: {
            year: [300, 250, 200, 180, 150],
            month: [120, 100, 80, 60, 40],
            week: [50, 40, 30, 20, 10]
        }
    };

    // Initialisation des graphiques
    let clientChart = null;
    let productsChart = null;

    function initializeCharts() {
        // Graphique des clients
        const clientCtx = document.getElementById('clientChart');
        if (clientCtx) {
            clientChart = new Chart(clientCtx, {
                type: 'line',
                data: {
                    labels: initialData.clients.year.labels,
                    datasets: [{
                        label: 'Nouveaux Clients',
                        data: initialData.clients.year.data,
                        borderColor: '#1D2D44',
                        backgroundColor: 'rgba(29, 45, 68, 0.1)',
                        tension: 0.4,
                        fill: true,
                        borderWidth: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                font: {
                                    size: 14
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: 'Évolution des Clients',
                            font: {
                                size: 18,
                                weight: 'bold'
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }

        // Graphique des produits
        const productsCtx = document.getElementById('productsChart');
        if (productsCtx) {
            productsChart = new Chart(productsCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Produit A', 'Produit B', 'Produit C', 'Produit D', 'Produit E'],
                    datasets: [{
                        data: initialData.products.year,
                        backgroundColor: [
                            'rgba(255, 182, 193, 0.9)',    // Plus rose
                            'rgba(255, 192, 203, 0.85)',   // Rose
                            'rgba(255, 202, 213, 0.8)',    // Rose clair
                            'rgba(255, 212, 223, 0.75)',   // Plus clair
                            'rgba(255, 222, 233, 0.7)'     // Très clair
                        ],
                        borderColor: '#ffffff',
                        borderWidth: 3,
                        hoverOffset: 15
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '60%',
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                padding: 20,
                                font: {
                                    size: 14
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: 'Répartition des Produits',
                            font: {
                                size: 18,
                                weight: 'bold'
                            },
                            padding: {
                                bottom: 20
                            }
                        }
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true,
                        duration: 1000
                    }
                }
            });
        }
    }

    // Initialiser les graphiques
    initializeCharts();

    // Gestion du mode plein écran
    const chartContainers = document.querySelectorAll('.chart-container');
    const overlay = document.getElementById('chartOverlay');
    let activeChart = null;

    // Fonction pour fermer le mode plein écran
    function closeFullscreen() {
        if (activeChart && overlay) {
            activeChart.classList.remove('fullscreen');
            overlay.classList.remove('active');
            
            const canvas = activeChart.querySelector('canvas');
            if (canvas) {
                const chart = Chart.getChart(canvas.id);
                if (chart) {
                    setTimeout(() => {
                        chart.resize();
                    }, 300);
                }
            }
            
            activeChart = null;
        }
    }

    // Cliquer sur l'overlay pour fermer
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeFullscreen();
            }
        });
    }

    // Gestion des conteneurs de graphiques
    chartContainers.forEach(container => {
        container.addEventListener('click', function(e) {
            if (e.target.closest('.chart-filter') || e.target.closest('.fullscreen-close') || 
                e.target.closest('.chart-button')) {
                return;
            }
            
            if (!activeChart && overlay) {
                this.classList.add('fullscreen');
                overlay.classList.add('active');
                activeChart = this;
                
                const canvas = this.querySelector('canvas');
                if (canvas) {
                    const chart = Chart.getChart(canvas.id);
                    if (chart) {
                        setTimeout(() => {
                            chart.resize();
                        }, 300);
                    }
                }
            } else if (activeChart === this) {
                closeFullscreen();
            }
        });

        // Gestion du bouton de fermeture
        const closeBtn = container.querySelector('.fullscreen-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                closeFullscreen();
            });
        }
    });

    // Fermer avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeFullscreen();
        }
    });

    // Gestion des filtres de période
    const chartFilters = document.querySelectorAll('.chart-filter');
    chartFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const period = this.dataset.period;
            
            // Mettre à jour tous les filtres
            document.querySelectorAll('.chart-filter').forEach(btn => {
                if (btn.dataset.period === period) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            updateCharts(period);
        });
    });

    // Fonction pour mettre à jour les graphiques
    function updateCharts(period) {
        if (clientChart) {
            clientChart.data.labels = initialData.clients[period].labels;
            clientChart.data.datasets[0].data = initialData.clients[period].data;
            clientChart.update();
        }

        if (productsChart) {
            productsChart.data.datasets[0].data = initialData.products[period];
            productsChart.update();
        }
    }

    // Gestion du bouton Annuler
    document.querySelectorAll('.chart-button.cancel').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const container = this.closest('.chart-container');
            
            // Réinitialiser à l'année
            const yearFilter = container.querySelector('[data-period="year"]');
            if (yearFilter) {
                container.querySelectorAll('.chart-filter').forEach(btn => btn.classList.remove('active'));
                yearFilter.classList.add('active');
                updateCharts('year');
            }
            
            closeFullscreen();
        });
    });

    // Gestion des Clients
    function loadClients() {
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        const tableBody = document.getElementById('clientsTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';
        clients.forEach(client => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${client.id}</td>
                <td>${client.name}</td>
                <td>${client.email}</td>
                <td>${client.phone || '-'}</td>
                <td>${new Date(client.registrationDate).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="editClient(${client.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteClient(${client.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    function addClient(clientData) {
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        const newClient = {
            id: Date.now(),
            ...clientData,
            registrationDate: new Date().toISOString()
        };
        clients.push(newClient);
        localStorage.setItem('clients', JSON.stringify(clients));
        loadClients();
    }

    function editClient(clientId) {
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        const client = clients.find(c => c.id === clientId);
        if (!client) return;

        const form = document.getElementById('editClientForm');
        form.clientId.value = client.id;
        form.name.value = client.name;
        form.email.value = client.email;
        form.phone.value = client.phone || '';

        const modal = new bootstrap.Modal(document.getElementById('editClientModal'));
        modal.show();
    }

    function updateClient(clientId, updatedData) {
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        const index = clients.findIndex(c => c.id === parseInt(clientId));
        if (index === -1) return;

        clients[index] = { ...clients[index], ...updatedData };
        localStorage.setItem('clients', JSON.stringify(clients));
        loadClients();
    }

    function deleteClient(clientId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) return;

        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        const filteredClients = clients.filter(c => c.id !== clientId);
        localStorage.setItem('clients', JSON.stringify(filteredClients));
        loadClients();
    }

    // Gestion des Commandes
    function loadOrders() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const tableBody = document.getElementById('ordersTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';
        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${order.id}</td>
                <td>${order.clientName}</td>
                <td>${new Date(order.date).toLocaleDateString()}</td>
                <td>${order.total.toFixed(2)} €</td>
                <td>
                    <span class="badge bg-${getStatusBadgeClass(order.status)}">${getStatusLabel(order.status)}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="viewOrderDetails(${order.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteOrder(${order.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    function getStatusBadgeClass(status) {
        const statusClasses = {
            'en_attente': 'warning',
            'confirmee': 'info',
            'expediee': 'primary',
            'livree': 'success',
            'annulee': 'danger'
        };
        return statusClasses[status] || 'secondary';
    }

    function getStatusLabel(status) {
        const statusLabels = {
            'en_attente': 'En attente',
            'confirmee': 'Confirmée',
            'expediee': 'Expédiée',
            'livree': 'Livrée',
            'annulee': 'Annulée'
        };
        return statusLabels[status] || status;
    }

    function deleteOrder(orderId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) return;

        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const filteredOrders = orders.filter(o => o.id !== orderId);
        localStorage.setItem('orders', JSON.stringify(filteredOrders));
        loadOrders();
    }

    // Event Listeners pour les formulaires
    const addClientForm = document.getElementById('addClientForm');
    const saveClientBtn = document.getElementById('saveClientBtn');
    if (saveClientBtn) {
        saveClientBtn.addEventListener('click', function() {
            if (addClientForm.checkValidity()) {
                const formData = new FormData(addClientForm);
                const clientData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone')
                };
                addClient(clientData);
                bootstrap.Modal.getInstance(document.getElementById('addClientModal')).hide();
                addClientForm.reset();
            } else {
                addClientForm.reportValidity();
            }
        });
    }

    const editClientForm = document.getElementById('editClientForm');
    const updateClientBtn = document.getElementById('updateClientBtn');
    if (updateClientBtn) {
        updateClientBtn.addEventListener('click', function() {
            if (editClientForm.checkValidity()) {
                const formData = new FormData(editClientForm);
                const clientData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone')
                };
                updateClient(formData.get('clientId'), clientData);
                bootstrap.Modal.getInstance(document.getElementById('editClientModal')).hide();
            } else {
                editClientForm.reportValidity();
            }
        });
    }

    const updateOrderStatusBtn = document.getElementById('updateOrderStatusBtn');
    if (updateOrderStatusBtn) {
        updateOrderStatusBtn.addEventListener('click', function() {
            const orderId = this.dataset.orderId;
            const newStatus = document.getElementById('orderStatus').value;
            updateOrderStatus(orderId, newStatus);
            bootstrap.Modal.getInstance(document.getElementById('orderDetailsModal')).hide();
        });
    }
});

// Admin Dashboard Functions
function loadDashboard() {
    const orders = JSON.parse(localStorage.getItem('fitglamOrders') || '[]');
    const clients = JSON.parse(localStorage.getItem('fitglamClients') || '[]');
    
    // Calculate total revenue
    const totalRevenue = orders.reduce((total, order) => total + order.total, 0);
    
    // Get products count
    const products = getAllProducts();
    
    const content = `
        <div class="dashboard-stats">
            <div class="stat-card">
                <h3>Total Orders</h3>
                <p class="stat-number">${orders.length}</p>
            </div>
            <div class="stat-card">
                <h3>Total Products</h3>
                <p class="stat-number">${products.length}</p>
            </div>
            <div class="stat-card">
                <h3>Total Clients</h3>
                <p class="stat-number">${clients.length}</p>
            </div>
            <div class="stat-card">
                <h3>Total Revenue</h3>
                <p class="stat-number">€${totalRevenue.toFixed(2)}</p>
            </div>
        </div>
        <div class="recent-activity">
            <h3>Recent Orders</h3>
            <div class="activity-list">
                ${getRecentOrdersHTML(orders)}
            </div>
        </div>
        <div class="chart-container">
            <canvas id="clientChart"></canvas>
            <div class="chart-filters">
                <button class="chart-filter active" data-period="year">Année</button>
                <button class="chart-filter" data-period="month">Mois</button>
                <button class="chart-filter" data-period="week">Semaine</button>
            </div>
        </div>
        <div class="chart-container">
            <canvas id="productsChart"></canvas>
            <div class="chart-filters">
                <button class="chart-filter active" data-period="year">Année</button>
                <button class="chart-filter" data-period="month">Mois</button>
                <button class="chart-filter" data-period="week">Semaine</button>
            </div>
        </div>
    `;
    
    document.getElementById('dashboardContent').innerHTML = content;
}

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('fitglamOrders') || '[]');
    
    const content = `
        <div class="orders-section">
            <h2>Orders Management</h2>
            <div class="orders-list">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Client</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orders.map(order => `
                            <tr>
                                <td>${order.id}</td>
                                <td>${order.customerName}</td>
                                <td>${new Date(order.date).toLocaleDateString()}</td>
                                <td>${order.items.length} items</td>
                                <td>€${order.total.toFixed(2)}</td>
                                <td>
                                    <select class="form-select status-select" data-order-id="${order.id}">
                                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                                    </select>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-info" onclick="viewOrderDetails(${order.id})">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    document.getElementById('dashboardContent').innerHTML = content;
    
    // Setup status change handlers
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', function() {
            updateOrderStatus(this.dataset.orderId, this.value);
        });
    });
}

function loadClients() {
    const clients = JSON.parse(localStorage.getItem('fitglamClients') || '[]');
    
    const content = `
        <div class="clients-section">
            <h2>Clients Management</h2>
            <div class="clients-list">
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Total Orders</th>
                            <th>Total Spent</th>
                            <th>Last Order</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${clients.map(client => `
                            <tr>
                                <td>${client.id}</td>
                                <td>${client.name}</td>
                                <td>${client.email}</td>
                                <td>${client.totalOrders}</td>
                                <td>€${client.totalSpent.toFixed(2)}</td>
                                <td>${new Date(client.lastOrder).toLocaleDateString()}</td>
                                <td>
                                    <button class="btn btn-sm btn-info" onclick="viewClientDetails(${client.id})">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    document.getElementById('dashboardContent').innerHTML = content;
}

function loadProducts() {
    const products = getAllProducts();
    
    const content = `
        <div class="products-section">
            <div class="section-header d-flex justify-content-between align-items-center mb-4">
                <h2>Gestion des Produits</h2>
                <button class="btn btn-primary" onclick="showAddProductModal()">
                    <i class="fas fa-plus"></i> Ajouter un Produit
                </button>
            </div>
            <div class="products-list">
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Nom</th>
                            <th>Prix</th>
                            <th>Catégorie</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.map(product => `
                            <tr>
                                <td>${product.id}</td>
                                <td><img src="${product.image}" alt="${product.title}" width="50"></td>
                                <td>${product.title}</td>
                                <td>€${product.price.toFixed(2)}</td>
                                <td>${product.category || 'featured'}</td>
                                <td>
                                    <input type="number" class="form-control form-control-sm stock-input" 
                                           value="${product.stock || 10}" 
                                           data-product-id="${product.id}"
                                           style="width: 80px">
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-primary me-1" onclick="editProduct(${product.id})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    document.getElementById('dashboardContent').innerHTML = content;
    
    // Setup stock input handlers
    document.querySelectorAll('.stock-input').forEach(input => {
        input.addEventListener('change', function() {
            updateProductStock(this.dataset.productId, this.value);
        });
    });
}

function viewOrderDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem('fitglamOrders') || '[]');
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return;
    
    const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal') || createOrderDetailsModal());
    
    document.getElementById('orderDetailsContent').innerHTML = `
        <div class="order-details">
            <h4>Order #${order.id}</h4>
            <p><strong>Customer:</strong> ${order.customerName}</p>
            <p><strong>Email:</strong> ${order.email}</p>
            <p><strong>Address:</strong> ${order.address}</p>
            <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            
            <h5>Items:</h5>
            <table class="table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr>
                            <td>${item.title}</td>
                            <td>€${item.price.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <th>Total</th>
                        <td>€${order.total.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
    
    modal.show();
}

function viewClientDetails(clientId) {
    const clients = JSON.parse(localStorage.getItem('fitglamClients') || '[]');
    const orders = JSON.parse(localStorage.getItem('fitglamOrders') || '[]');
    const client = clients.find(c => c.id === clientId);
    
    if (!client) return;
    
    const clientOrders = orders.filter(o => o.email === client.email);
    
    const modal = new bootstrap.Modal(document.getElementById('clientDetailsModal') || createClientDetailsModal());
    
    document.getElementById('clientDetailsContent').innerHTML = `
        <div class="client-details">
            <h4>Client Profile</h4>
            <p><strong>Name:</strong> ${client.name}</p>
            <p><strong>Email:</strong> ${client.email}</p>
            <p><strong>Address:</strong> ${client.address}</p>
            <p><strong>Total Orders:</strong> ${client.totalOrders}</p>
            <p><strong>Total Spent:</strong> €${client.totalSpent.toFixed(2)}</p>
            
            <h5>Order History:</h5>
            <table class="table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${clientOrders.map(order => `
                        <tr>
                            <td>${order.id}</td>
                            <td>${new Date(order.date).toLocaleDateString()}</td>
                            <td>${order.items.length} items</td>
                            <td>€${order.total.toFixed(2)}</td>
                            <td>${order.status}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    modal.show();
}

function updateOrderStatus(orderId, newStatus) {
    const orders = JSON.parse(localStorage.getItem('fitglamOrders') || '[]');
    const orderIndex = orders.findIndex(o => o.id === parseInt(orderId));
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        localStorage.setItem('fitglamOrders', JSON.stringify(orders));
        
        // Show confirmation
        alert('Order status updated successfully!');
    }
}

// Initial products data
const initialProducts = {
    featured: [
        { 
            id: 1, 
            image: "images/altere.jpeg", 
            title: "Tapis de Yoga Premium", 
            price: 49.99,
            category: "featured",
            stock: 10
        },
        { 
            id: 2, 
            image: "images/tenue2pink.jpeg", 
            title: "Tenue de Sport Pro", 
            price: 79.99,
            category: "featured",
            stock: 15
        },
        { 
            id: 3, 
            image: "images/gant.jpeg", 
            title: "Gants de Boxe Pro", 
            price: 29.99,
            category: "featured",
            stock: 20
        },
        { 
            id: 4, 
            image: "images/box.jpeg", 
            title: "Box Fitness Complète", 
            price: 89.99,
            category: "featured",
            stock: 5
        }
    ],
    new: [
        { 
            id: 5, 
            image: "images/corde a sauter.jpeg", 
            title: "Corde à sauter", 
            price: 59.99,
            category: "new",
            stock: 25
        },
        { 
            id: 6, 
            image: "images/legins.jpeg", 
            title: "Legging Sport Pro", 
            price: 49.99,
            category: "new",
            stock: 30
        }
    ],
    best: [
        { 
            id: 7, 
            image: "images/Tapis Yoga Antidérapant.jpeg", 
            title: "Tapis de Yoga", 
            price: 34.99,
            category: "best",
            stock: 12
        },
        { 
            id: 8, 
            image: "images/sac de sport.jpeg", 
            title: "Sac de sport", 
            price: 44.99,
            category: "best",
            stock: 18
        }
    ]
};

// Initialize products if not exists
function initializeProducts() {
    if (!localStorage.getItem('fitglamProducts')) {
        const allProducts = [
            ...initialProducts.featured,
            ...initialProducts.new,
            ...initialProducts.best
        ];
        localStorage.setItem('fitglamProducts', JSON.stringify(allProducts));
    }
}

// Get all products
function getAllProducts() {
    initializeProducts(); // Make sure we have initial data
    return JSON.parse(localStorage.getItem('fitglamProducts') || '[]');
}

// Get products by category
function getProductsByCategory(category) {
    const allProducts = getAllProducts();
    return allProducts.filter(product => product.category === category);
}

function findProduct(productId) {
    return getAllProducts().find(p => p.id === productId);
}

function updateProductsInStorage(products) {
    localStorage.setItem('fitglamProducts', JSON.stringify(products));
}

function setupNavigation() {
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items
            document.querySelectorAll('.nav-item').forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Load appropriate content
            const page = this.dataset.page;
            switch(page) {
                case 'dashboard':
                    loadDashboard();
                    break;
                case 'products':
                    loadProducts();
                    break;
                case 'orders':
                    loadOrders();
                    break;
                case 'clients':
                    loadClients();
                    break;
            }
        });
    });
}

function showAddProductModal() {
    const modal = new bootstrap.Modal(document.getElementById('productModal') || createProductModal());
    document.getElementById('productModalTitle').textContent = 'Ajouter un Produit';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    modal.show();
}

function editProduct(productId) {
    const product = findProduct(productId);
    if (!product) return;
    
    const modal = new bootstrap.Modal(document.getElementById('productModal') || createProductModal());
    document.getElementById('productModalTitle').textContent = 'Modifier le Produit';
    
    // Fill form with product data
    document.getElementById('productId').value = product.id;
    document.getElementById('productTitle').value = product.title;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category || 'featured';
    document.getElementById('productStock').value = product.stock || 10;
    document.getElementById('currentProductImage').src = product.image;
    
    modal.show();
}

function deleteProduct(productId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    
    const products = getAllProducts();
    const updatedProducts = products.filter(p => p.id !== productId);
    
    // Update localStorage
    updateProductsInStorage(updatedProducts);
    
    // Refresh products display
    loadProducts();
    
    alert('Produit supprimé avec succès');
}

function createProductModal() {
    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal fade';
    modalDiv.id = 'productModal';
    
    modalDiv.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="productModalTitle">Produit</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="productForm">
                        <input type="hidden" id="productId">
                        <div class="mb-3">
                            <label class="form-label">Nom du Produit</label>
                            <input type="text" class="form-control" id="productTitle" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Prix</label>
                            <input type="number" class="form-control" id="productPrice" step="0.01" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Catégorie</label>
                            <select class="form-control" id="productCategory" required>
                                <option value="featured">Featured</option>
                                <option value="new">New</option>
                                <option value="best">Best</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Stock</label>
                            <input type="number" class="form-control" id="productStock" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Image</label>
                            <input type="file" class="form-control" id="productImage" accept="image/*">
                            <img id="currentProductImage" src="" alt="" class="mt-2" style="max-width: 100px; display: none;">
                        </div>
                        <button type="submit" class="btn btn-primary">Enregistrer</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalDiv);
    
    // Setup form submission
    document.getElementById('productForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProduct();
    });
    
    // Setup image preview
    document.getElementById('productImage').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('currentProductImage').src = e.target.result;
                document.getElementById('currentProductImage').style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    return modalDiv;
}

function saveProduct() {
    const productId = document.getElementById('productId').value;
    const title = document.getElementById('productTitle').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;
    const stock = parseInt(document.getElementById('productStock').value);
    const imageInput = document.getElementById('productImage');
    
    let products = getAllProducts();
    
    const productData = {
        id: productId ? parseInt(productId) : Date.now(),
        title: title,
        price: price,
        category: category,
        stock: stock,
        image: imageInput.files.length > 0 ? URL.createObjectURL(imageInput.files[0]) : 
               (productId ? findProduct(parseInt(productId)).image : '')
    };
    
    if (productId) {
        // Update existing product
        products = products.map(p => p.id === parseInt(productId) ? {...p, ...productData} : p);
    } else {
        // Add new product
        products.push(productData);
    }
    
    // Update localStorage
    updateProductsInStorage(products);
    
    // Close modal and refresh products
    bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
    loadProducts();
    
    alert(productId ? 'Produit mis à jour avec succès' : 'Produit ajouté avec succès');
}

function updateProductStock(productId, newStock) {
    const products = getAllProducts();
    const product = products.find(p => p.id === parseInt(productId));
    
    if (product) {
        product.stock = parseInt(newStock);
        updateProductsInStorage(products);
    }
}

function getRecentOrdersHTML(orders) {
    if (orders.length === 0) {
        return '<p>No orders yet</p>';
    }
    
    // Get last 5 orders, sorted by date
    const recentOrders = [...orders]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    return recentOrders.map(order => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas fa-shopping-bag"></i>
            </div>
            <div class="activity-details">
                <p><strong>${order.customerName}</strong> placed an order</p>
                <p class="activity-meta">
                    ${order.items.length} items - €${order.total.toFixed(2)}
                    <span class="activity-time">${new Date(order.date).toLocaleString()}</span>
                </p>
            </div>
        </div>
    `).join('');
}

function createOrderDetailsModal() {
    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal fade';
    modalDiv.id = 'orderDetailsModal';
    
    modalDiv.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Order Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div id="orderDetailsContent"></div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalDiv);
    return modalDiv;
}

function createClientDetailsModal() {
    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal fade';
    modalDiv.id = 'clientDetailsModal';
    
    modalDiv.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Client Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div id="clientDetailsContent"></div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalDiv);
    return modalDiv;
}
