// Importer le Store de auth.js
import Store from './auth.js';

document.addEventListener('DOMContentLoaded', function() {
    // Définir les catégories de produits
    const products = {
        featured: [
            { id: 1, image: "images/altere.jpeg", title: "Tapis de Yoga Premium", price: 49.99 },
            { id: 2, image: "images/tenue2pink.jpeg", title: "Tenue de Sport Pro", price: 79.99 },
            { id: 3, image: "images/gant.jpeg", title: "Gants de Boxe Pro", price: 29.99 },
            { id: 4, image: "images/box.jpeg", title: "Box Fitness Complète", price: 89.99 }
        ],
        new: [
            { id: 5, image: "/images/corde a sauter.jpeg", title: "Corde à sauter", price: 59.99 },
            { id: 6, image: "/images/legins.jpeg", title: "Legging Sport Pro", price: 49.99 }
        ],
        best: [
            { id: 7, image: "/images/Tapis Yoga Antidérapant.jpeg", title: "Tapis de Yoga", price: 34.99 },
            { id: 8, image: "/images/sac de sport.jpeg", title: "Sac de sport", price: 44.99 }
        ]
    };

    // Fonction pour afficher les produits
    function displayProducts(category) {
        const productsGrid = document.querySelector('.products-grid');
        const productsToShow = products[category];
        
        if (!productsGrid || !productsToShow) return;
        
        productsGrid.innerHTML = productsToShow.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}" 
                        data-title="${product.title}" 
                        data-price="${product.price}" 
                        data-image="${product.image}">
                    Add To Cart
                </button>
            </div>
        `).join('');

        // Réinitialiser les événements des boutons "Add to Cart"
        setupAddToCartButtons();
    }

    // Setup des boutons "Add to Cart"
    function setupAddToCartButtons() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const item = {
                    id: parseInt(this.dataset.id),
                    title: this.dataset.title,
                    price: parseFloat(this.dataset.price),
                    image: this.dataset.image
                };
                
                Store.addToCart(item);
                
                // Animation de confirmation
                this.innerHTML = '<i class="fas fa-check"></i> Added';
                this.classList.add('added');
                setTimeout(() => {
                    this.innerHTML = 'Add To Cart';
                    this.classList.remove('added');
                }, 2000);
            });
        });
    }

    // Setup initial des boutons "Add to Cart"
    setupAddToCartButtons();

    // Gérer les boutons de catégorie
    document.querySelectorAll('.category-buttons button[data-category]').forEach(button => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            document.querySelectorAll('.category-buttons button').forEach(btn => btn.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            // Afficher les produits de la catégorie
            displayProducts(this.dataset.category);
        });
    });

    // Afficher les produits "Featured" par défaut
    displayProducts('featured');

    // Setup cart button
    document.getElementById('cartBtn').onclick = () => {
        const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
        cartModal.show();
    };

    // Setup checkout form
    document.getElementById('checkoutForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (Store.cart.items.length === 0) {
            alert('Votre panier est vide !');
            return;
        }
        
        const customerName = this.querySelector('#customerName').value;
        const email = this.querySelector('#customerEmail').value;
        const address = this.querySelector('#customerAddress').value;
        
        // Créer la commande
        const order = {
            id: Date.now(),
            customerName: customerName,
            email: email,
            address: address,
            items: [...Store.cart.items],
            total: Store.getCartTotal(),
            date: new Date().toISOString(),
            status: 'En attente'
        };

        // Sauvegarder la commande
        const orders = JSON.parse(localStorage.getItem('fitglamOrders') || '[]');
        orders.push(order);
        localStorage.setItem('fitglamOrders', JSON.stringify(orders));

        // Sauvegarder le client
        const clients = JSON.parse(localStorage.getItem('fitglamClients') || '[]');
        const existingClient = clients.find(client => client.email === email);
        
        if (!existingClient) {
            clients.push({
                id: Date.now(),
                name: customerName,
                email: email,
                address: address,
                totalOrders: 1,
                totalSpent: order.total,
                lastOrder: order.date
            });
        } else {
            existingClient.totalOrders += 1;
            existingClient.totalSpent += order.total;
            existingClient.lastOrder = order.date;
            if (existingClient.name !== customerName) existingClient.name = customerName;
            if (existingClient.address !== address) existingClient.address = address;
        }
        
        localStorage.setItem('fitglamClients', JSON.stringify(clients));

        // Vider le panier
        Store.clearCart();
        
        // Fermer le modal et afficher la confirmation
        bootstrap.Modal.getInstance(document.getElementById('cartModal')).hide();
        
        // Afficher un message de confirmation
        alert('Votre commande a été validée avec succès !');
        
        // Réinitialiser le formulaire
        this.reset();
    });
});