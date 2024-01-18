import http from 'http';
import url from 'url';
import fetch from "node-fetch";



const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    // recupere les paramettres de l'url 
    const parseUrl = url.parse(req.url, true);

    if (parseUrl.pathname === '/') {
        res.end(`
        <html>
        <head>
        <meta charset="UTF-8">
        <title>QR explore</title>
        </head>
        <body>
        <h1>QR explore</h1>
        <p>Exploration des qestions/reponses</p>
        <br>
        <br>
        <br>
        <br>

        <h2>Bienvenue dans l'application QR Explore ! </h2>
        <br>
        <p>Cette application va vous permettre d'explore les qestions/reponses du système </p>
        <br>
        <br>

        <a href="/questions/list"><button >Voir les questions</button></a> 
        
        </body></html>`);
    } else if (parseUrl.pathname === '/questions/list') {

        const page = parseInt(parseUrl.query.page) || 0;
        const limit = parseInt(parseUrl.query.limit) || 10;
        const questions = await getQuestionByPage(page, limit);

        let rows = '';

        for (let i = 0; i < questions.length; i++) {
            rows += `<tr>
                        <td>${questions[i].id}</td>
                        <td>${questions[i].question}</td>
                        <td><a href='/questions/details?id=${parseInt(questions[i].id)}'>Details</a></td>
                     </tr>`;
        }

        res.end(`
        <html>
        <head>
        <meta charset="UTF-8">
        <title>Listes des questions</title>
        </head>
        <body>
   
        <style>
    
        table {
            width: 100%; 
            border-collapse: collapse; 
        }

        
        th, td {
            border: 1px solid #000;
            padding: 8px; 
            text-align: center;
        }

        
        th {
            background-color: #f2f2f2; /* Couleur de fond gris clair */
        }
        </style>

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Question</th>
                    <th>Action</th>
                </tr>
            </thead>
                <tbody>
                    ${rows}
                </tbody>
        </table>

        <a href="/questions/list?page=${page + 10}&limit=${limit}">Suivant</a>
        </body></html>`);


    } else if (parseUrl.pathname === '/questions/details') {
        const question = await getQuestionById(parseInt(parseUrl.query.id));
        console.log(question);
        res.end(`<html> 
        <head>
        <meta charset="UTF-8">
        <title>Details</title>
        </head><body>
        <h1>Details</h1>
        <br>
        <h2>ID</h2>
        <p>${question.id}</p>
        <br>
        <h2>Question</h2>
        <p>${question.question}</p>
        <br>
        <h2>Réponse</h2>
        <p>${question.reponse}</p>
        <br>
        <a href="/questions/list">Retour à la liste</a>


        </body>
        </html>`);
    } else {
        res.end(`<html><body><h1>Route non trouvée</h1></body></html>`);
    }
});

const port = 8080;
server.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});




async function getQuestionByPage(start, limit) {
    try {
        const response = await fetch(`http://localhost:3000/questions-reponses?_start=${start}&_limit=${limit}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des questions:', error);
        return [];
    }
}

async function getQuestionById(id) {
    try {
        const response = await fetch(`http://localhost:3000/questions-reponses/${id}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des questions:', error);
        return [];
    }
}