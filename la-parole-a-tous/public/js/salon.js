document.addEventListener('DOMContentLoaded', () => {

    const socket = io('http://localhost:8000');
    const conversationElement = document.getElementById('conversation');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');

    // Ecouteur de l'evenement historique
    socket.on('historique', (historique) => {
        historique.forEach((message) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${message.pseudo}: ${message.message}`;
            conversationElement.appendChild(listItem);
        });
    });

    // Ecouteur de l'evenement salon-gaming-client
    socket.on('salon-gaming-client', (pseudoUser) => {
        pseudo = pseudoUser;
        const bienvenueElement = document.getElementById('bienvenue');
        bienvenueElement.textContent = `Bienvenue, ${pseudo} !`;
    });

    // Ecouteur de l'evenement message apres l'emission de l'ev message avec le form 
    socket.on('message', (data) => {
        const { pseudo, message } = data;
        const messageAvecPseudo = `${pseudo}: ${message}`;

        const listItem = document.createElement('li');
        listItem.textContent = messageAvecPseudo;
        conversationElement.appendChild(listItem);
    });

    // Envoi du message via le formulaire aus serveur 
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const message = messageInput.value.trim();
        if (message !== '') {
            // Envoi le message à l'evenement message
            socket.emit('message', { pseudo, message });

            messageInput.value = '';
        }
    });

    // Temps de demarrage serveur
    socket.on('serverTime', (temps) => {
        const timeDisplay = document.getElementById('time-display');
        timeDisplay.textContent = `Temps écoulé depuis le démarrage du serveur : ${temps} secondes`;
    });



});
