
document.addEventListener('DOMContentLoaded', () => {
    const socket = io('http://localhost:8000');
    const pseudoForm = document.getElementById('pseudo-form');
    const pseudoInput = document.getElementById('pseudo');


    // Ecouteur de l'evenement salon-gaming-client
    socket.on('salon-gaming-client', (pseudo, salon) => {
        // Envoi un evenement au salon-gaming-serveur
        socket.emit('salon-gaming-serveur', salon);
        window.location.href = `/salon?pseudo=${pseudo}`;
    });

    pseudoForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const pseudo = pseudoInput.value.trim();
        if (pseudo !== '') {
            // Envoi un evenement a pseudo
            socket.emit('pseudo', pseudo);
        }
    });
});
