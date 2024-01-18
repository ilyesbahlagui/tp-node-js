import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import routeCustome from "./routes/route.js";

const app = express();
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


// il faut faire les templates jade donc l'insatller et changer le html en puge 

app.use('/', routeCustome);

const httpServer = createServer(app);
const router = express.Router();
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Sauvegarde la conversation
const conversation = [];
const serverStartTime = Date.now();


io.on('connection', (socket) => {

    // Envoi de l'historique des messages au client qui se connecte
    socket.emit('historique', conversation);

    // Ecoute sur l'evenement pseudo
    socket.on('pseudo', (pseudoUser) => {
        // Enregistre le pseudo du nouvel utilisateur
        socket.pseudoUser = pseudoUser;
        const salon = "salon-gaming-serveur";
        // Rejoint le salon 
        socket.join(salon);
        console.log(`L'utilisateur ${pseudoUser} s'est connecté au salon ${salon}.`);
        // envoi un evenement sur salon-gaming-client
        socket.emit('salon-gaming-client', pseudoUser, salon);
    });

    socket.on('message', (data) => {
        // Récupère le pseudo de l'expéditeur
        const pseudo = data.pseudo;
        // Récupère le message envoyé
        const message = data.message;
        // Ajoute le message à l'historique
        conversation.push({ pseudo, message });

        // Envoie le message à tous les clients dans le salon
        io.to(socket.rooms.values().next().value).emit('message', data);
    });

    // Temps demarrage serveur
    setInterval(() => {
        const currentTime = Date.now();
        const elapsedSeconds = Math.floor((currentTime - serverStartTime) / 1000);
        io.emit('serverTime', elapsedSeconds); 
    }, 1000)

    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté');
    });
});



const PORT = 8000;
httpServer.listen(PORT, () => {
    console.log(`Serveur => port ${PORT}`);
});

