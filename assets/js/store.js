const Store = {
    products: {
        featured: [
            { id: 1, name: 'Tapis de Yoga Premium', price: 49.99, image: 'images/tapis.jpeg', category: 'featured' },
            { id: 2, name: 'Gants de Boxe Pro', price: 79.99, image: 'images/gant.jpeg', category: 'featured' },
            // Ajoutez plus de produits ici
        ],
        new: [
            { id: 3, name: 'Ballon de Pilates', price: 29.99, image: 'images/ballon.jpeg', category: 'new' },
            // Ajoutez plus de produits ici
        ],
        best: [
            { id: 4, name: 'Bande Élastique Set', price: 19.99, image: 'images/bande.jpeg', category: 'best' },
            // Ajoutez plus de produits ici
        ]
    },
    cart: [],

    init() {
        this.loadCart();
        this.updateCartCount();
        this.setupEventListeners();
    },

    loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    },

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
    },

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = this.cart.reduce((total, item) => total + item.quantity, 0);
        }
    },

    addToCart(productId, category) {
        const product = this.products[category].find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }

        this.saveCart();
        this.updateCartDisplay();
    },

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    },

    updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartItems || !cartTotal) return;

        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h6>${item.name}</h6>
                    <p>Prix: €${item.price} x ${item.quantity}</p>
                </div>
                <button onclick="Store.removeFromCart(${item.id})" class="btn-remove">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
    },

    setupEventListeners() {
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processCheckout();
            });
        }
    },

    processCheckout() {
        const name = document.getElementById('customerName').value;
        const email = document.getElementById('customerEmail').value;
        const address = document.getElementById('customerAddress').value;

        // Ici, vous pouvez ajouter la logique pour traiter la commande
        // Par exemple, envoyer les données à un serveur
        console.log('Commande traitée pour:', { name, email, address, cart: this.cart });

        // Vider le panier après la commande
        this.cart = [];
        this.saveCart();
        this.updateCartDisplay();

        // Fermer le modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
        if (modal) {
            modal.hide();
        }

        // Afficher un message de confirmation
        alert('Merci pour votre commande ! Nous vous contacterons bientôt.');
    }
};
