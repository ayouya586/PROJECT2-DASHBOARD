document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si l'utilisateur est déjà connecté
    const isAdmin = sessionStorage.getItem('adminLoggedIn') === 'true';
    const loginBtn = document.getElementById('loginBtn');
    const adminBtn = document.getElementById('adminBtn');
    const cartBtn = document.getElementById('cartBtn');

    function updateButtonsVisibility() {
        if (isAdmin) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (adminBtn) adminBtn.style.display = 'flex';
            if (cartBtn) cartBtn.style.display = 'none';
        } else {
            if (loginBtn) loginBtn.style.display = 'flex';
            if (adminBtn) adminBtn.style.display = 'none';
            if (cartBtn) cartBtn.style.display = 'flex';
        }
    }

    // Mettre à jour l'affichage initial des boutons
    updateButtonsVisibility();

    // Gestionnaire de clic pour le bouton login
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            // Simuler une connexion (à remplacer par votre véritable système d'authentification)
            const username = prompt('Nom d\'utilisateur :');
            const password = prompt('Mot de passe :');

            if (username === 'admin' && password === 'admin') {
                sessionStorage.setItem('adminLoggedIn', 'true');
                window.location.href = 'admin.html';
            } else {
                alert('Identifiants incorrects');
            }
        });
    }

    // Gestionnaire de déconnexion
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('adminLoggedIn');
            window.location.href = 'index.html';
        });
    }

    // Gestion du sidebar
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarCollapse) {
        sidebarCollapse.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Gestion du changement de langue
    const languageItems = document.querySelectorAll('.dropdown-item');
    languageItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = e.target.getAttribute('href').replace('#', '');
            changeLanguage(lang);
        });
    });

    // Gestion des transitions entre pages
    const overlay = document.querySelector('.overlay');
    const pageTransition = document.querySelector('.page-transition');

    // Gestion des liens avec transition
    document.querySelectorAll('a.transition-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const destination = this.href;

            // Activer l'effet de flou sur la page actuelle
            overlay.style.backgroundColor = 'rgba(245, 235, 220, 0.5)';
            overlay.style.backdropFilter = 'blur(5px)';

            // Afficher la transition
            pageTransition.classList.add('active');

            // Attendre que la transition soit terminée avant de changer de page
            setTimeout(() => {
                window.location.href = destination;
            }, 600);
        });
    });

    // Réinitialiser l'overlay au chargement de la page
    overlay.style.backgroundColor = 'rgba(245, 235, 220, 0)';
    overlay.style.backdropFilter = 'blur(0px)';
    pageTransition.classList.remove('active');
});

function changeLanguage(lang) {
    // À implémenter : logique de changement de langue
    console.log(`Changement de langue vers : ${lang}`);
} 