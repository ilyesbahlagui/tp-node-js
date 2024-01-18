import express from 'express';
import indexRouter from './routes/index.js';
import dishRouter from './routes/dish.js';

const app = express();
const port = 8000;

//  Pug comme moteur de template
app.set('view engine', 'pug');

// Dossier pour les fichiers statiques (images, CSS)
app.use(express.static('public'));

app.use(express.json()) // Content-Type: application/json
app.use(express.urlencoded({ extended: true })) // Content-Type: application/x-wwwform-urlencoded



// Utilisation des routeurs
app.use('/', indexRouter);
app.use('/plats', dishRouter);

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Started => http://localhost:${port}`);
});
