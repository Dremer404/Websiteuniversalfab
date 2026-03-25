    function updateHeader() {
        const isLariya = window.location.pathname.includes('/produits') || window.location.pathname.includes('/lariya-section');
        const toggleBtnText = document.getElementById('section-toggle-text');
        const toggleBtn = document.getElementById('section-toggle');

        if (toggleBtn && toggleBtnText) {
            if (isLariya) {
                toggleBtnText.textContent = 'HOME';
                // Calculer le bon chemin vers l'accueil (index.html à la racine)
                const currentPath = window.location.pathname;
                if (currentPath.includes('/lariya-section/')) {
                    // On est dans une sous-page (ex: /lariya-section/creative/index.html)
                    // On remonte de 2 niveaux si on est dans un sous-dossier de lariya-section
                    // Mais plus robuste: chercher la racine du projet.
                    // Pour ce projet statique, on peut utiliser des chemins relatifs basés sur la structure connue.
                    let depth = (currentPath.split('/lariya-section/')[1] || '').split('/').filter(Boolean).length;
                    toggleBtn.href = '../'.repeat(depth + 1) + 'index.html';
                } else if (currentPath.endsWith('/lariya-section') || currentPath.endsWith('/lariya-section/index.html')) {
                    toggleBtn.href = '../index.html';
                } else {
                    toggleBtn.href = '/index.html';
                }
            } else {
                toggleBtnText.textContent = 'Nos produits';
                toggleBtn.href = 'lariya-section/index.html';
            }
        }
    }

    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateHeader);
    } else {
        updateHeader();
    }

    // Support for history changes (if any SPA-like behavior exists)
    window.addEventListener('popstate', updateHeader);
