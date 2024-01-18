import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Restaurant !',
        titre: 'Bienvenue sur la page d\'Accueil du restaurant !',
        urlImage: "images/welcome.png"
    });
});

export default router;
