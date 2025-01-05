// Gestionnaire d'authentification et de panier global
const Store = {
    // État global
    cart: {
        items: [],
        total: 0
    },
    isLoggedIn: sessionStorage.getItem('adminLoggedIn') === 'true',

    // Méthodes d'authentification
    login(username, password) {
        if (username === 'admin' && password === 'admin') {
            sessionStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('adminAuthenticated', 'true');
            this.isLoggedIn = true;
            this.updateUI();
            return true;
        }
        return false;
    },

    logout() {
        sessionStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminAuthenticated');
        this.isLoggedIn = false;
        this.updateUI();
        window.location.href = 'shop.html';
    },

    // Méthodes du panier
    addToCart(item) {
        this.cart.items.push(item);
        this.cart.total += item.price;
        this.saveCart();
        this.updateUI();
    },

    removeFromCart(itemId) {
        const index = this.cart.items.findIndex(item => item.id === itemId);
        if (index !== -1) {
            const item = this.cart.items[index];
            this.cart.total -= item.price;
            this.cart.items.splice(index, 1);
            this.saveCart();
            this.updateUI();
        }
    },

    clearCart() {
        this.cart.items = [];
        this.cart.total = 0;
        this.saveCart();
        this.updateUI();
    },

    getCartTotal() {
        return this.cart.total;
    },

    saveCart() {
        localStorage.setItem('fitglamCart', JSON.stringify(this.cart));
    },

    loadCart() {
        const savedCart = localStorage.getItem('fitglamCart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        } else {
            this.cart = { items: [], total: 0 };
        }
        this.updateUI();
    },

    // Mettre à jour l'interface utilisateur
    updateUI() {
        // Mettre à jour le bouton de login
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.innerHTML = this.isLoggedIn ? '<i class="fas fa-sign-out-alt"></i> Logout' : '<i class="fas fa-user"></i> Login';
        }

        // Mettre à jour le compteur du panier
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = this.cart.items.length;
            cartCount.style.display = this.cart.items.length > 0 ? 'flex' : 'none';
        }

        // Mettre à jour le contenu du panier
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (cartItems) {
            if (this.cart.items.length === 0) {
                cartItems.innerHTML = '<p class="text-center">Votre panier est vide</p>';
            } else {
                cartItems.innerHTML = this.cart.items.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.title}" width="50">
                        <div class="cart-item-details">
                            <h6>${item.title}</h6>
                            <p>$${item.price.toFixed(2)}</p>
                        </div>
                        <button class="btn btn-sm btn-danger remove-item" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `).join('');

                // Ajouter les événements pour supprimer les articles
                document.querySelectorAll('.remove-item').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const id = parseInt(e.currentTarget.dataset.id);
                        this.removeFromCart(id);
                    });
                });
            }
        }

        if (cartTotal) {
            cartTotal.textContent = this.cart.total.toFixed(2);
        }
    },

    // Initialiser l'application
    init() {
        this.loadCart();

        // Setup du bouton de login
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                if (this.isLoggedIn) {
                    this.logout();
                } else {
                    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                    loginModal.show();
                }
            });
        }

        // Setup du formulaire de login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;

                if (this.login(username, password)) {
                    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                    if (loginModal) {
                        loginModal.hide();
                    }
                    window.location.href = 'admin.html';
                } else {
                    alert('Invalid credentials');
                }
            });
        }
    }
};

// Exposer le Store globalement pour la compatibilité
window.Store = Store;

// Exporter le Store pour les modules ES6
export default Store;

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    Store.init();
});