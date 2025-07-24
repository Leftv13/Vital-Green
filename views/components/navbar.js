document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('navright');

    // --- Lógica para el menú de hamburguesa ---
    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show');

            if (navLinks.classList.contains('show')) {
                hamburgerBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 2rem; height: 2rem;"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>`;
            } else {
                hamburgerBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 2rem; height: 2rem;"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>`;
            }
        });
    }

    // --- Lógica para el botón de Cerrar Sesión ---
    const logoutBtn = document.getElementById('logout-nav-btn');

    // Si el botón existe en la página actual, le añadimos la funcionalidad
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                // Llamamos al endpoint de logout que ya tienes creado
                await axios.get('/api/logout', { withCredentials: true });
                // Redirigimos al usuario a la página de login
                window.location.pathname = '/login';
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
                alert('No se pudo cerrar la sesión. Por favor, intenta de nuevo.');
            }
        });
    }
});