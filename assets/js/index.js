document.addEventListener('DOMContentLoaded', function() {
    // Setup cart modal
    document.getElementById('cartBtn').onclick = () => {
        const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
        cartModal.show();
    };

    // Setup checkout form
    document.getElementById('checkoutForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Commande validée !');
        const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
        cartModal.hide();
    });
});