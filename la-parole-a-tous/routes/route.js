import express from 'express';
const routeCustome = express.Router();

// ROUTAGE 
// Route pour la page rejoindre-salon
routeCustome.get('/rejoindre-salon', (req, res) => {
    res.render('rejoindre-salon'); 
});

// Route pour afficher la page du salon
routeCustome.get('/salon', (req, res) => {
    const pseudo = req.query.pseudo; 

    if (pseudo && pseudo.trim() !== '') {
        res.render('salon', { pseudo }); 
    } else {
        res.redirect('/rejoindre-salon');
    } 

});

export default routeCustome;
