import express from 'express';
import mysql from 'mysql2';

const router = express.Router();
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    database: 'restaurant_db',
    password: 'root',
    port: 9000,
    waitForConnections: true,
    connectionLimit: 10
});

const promisePool = pool.promise();


// Route GET pour la liste
router.get('/lister', async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM dish');
        console.log(rows);
        res.render('layout', {
            title: 'Liste des plats !',
            titre: 'Administration des plats!',
            urlImage: "/images/welcome.png",
            items: rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération des données');
    }
});

// Route GET pour la page créer
router.get('/ajouter', (req, res) => {
    res.render('create', {
        title: 'Create !',
        titre: 'Administration des plats!',

    });
});
// Route POST pour créer un plat
router.post('/ajouter', async (req, res) => {
    try {
        const { name, price } = req.body;

        // Insérez le plat dans la bdd
        await promisePool.execute('INSERT INTO dish (name, price) VALUES (?, ?)', [name, price]);

        // Redirige vers la liste
        res.redirect('/plats/lister');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de l\'ajout du plat');
    }
});

// Route GET pour la page editer
router.get('/editer/:id', async (req, res) => {

    const id = req.params.id;
    try {
        const [plat] = await promisePool.query('SELECT * FROM dish where id=?', [id]);
        console.log(plat);
        res.render('edit', {
            title: 'Editer !',
            titre: 'Administration des plats!',
            plat: plat[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération des données');
    }
});

// Route POST pour eciter un plat
router.post('/editer', async (req, res) => {
    try {
        const { id, name, price } = req.body;
        // Update le plat dans la bdd
        await promisePool.execute('UPDATE dish SET name=?, price=? WHERE id=?', [name, price, id]);
        // Redirige vers la liste
        res.redirect('/plats/lister');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la modification du plat');
    }
});
// Route POST pour eciter un plat
router.get('/supprimer/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // Update le plat dans la bdd
        await promisePool.execute('Delete from dish WHERE id=?', [id]);
        // Redirige vers la liste
        res.redirect('/plats/lister');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la suppression du plat');
    }
});
export default router;