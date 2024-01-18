import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import fs from 'fs';
import { parse } from 'csv-parse';
import { readFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';

console.log('** QR-IMPORT **');

const rl = readline.createInterface({ input, output });

// Méthode pour récupérer les données CSV via le module standard de node
async function printCSV() {
    return new Promise((resolve) => {
        const datas = { "questions-reponses": [] };
        createReadStream("./csv/questoin-reponse.csv")
            .pipe(parse({ delimiter: ",", from_line: 2 }))
            .on("data", function (row) {

                // console.log(row);
                let question = row[0];
                let reponse = row[1];
                datas["questions-reponses"].push({
                    "id": datas["questions-reponses"].length + 1,
                    "question": question,
                    "reponse": reponse,
                })
            })
            .on("end", function () {

                console.log(datas);
                alimenteDbJson(datas);
                resolve();

            });
    })
}

// Méthode pour écrire dans le fichier db.json
async function alimenteDbJson(datas) {
    const path = '../qr-data/db.json';
    fs.writeFile(path, JSON.stringify(datas, null, 2), (error) => {
        if (error) {
            console.log('Erreur création db.json : ', error);
            return;
        }
    });
}

// Méthode pour lire le fichier db.json 
async function dbJson() {
    try {
        const filePath = '../qr-data/db.json';
        const contents = await readFile(filePath, { encoding: 'utf8' });
        // console.log(contents);
        return JSON.parse(contents);
    } catch (err) {
        console.error(err.message);
    }
}

// Méthode pour afficher le nombre de questions
async function nbQuestions() {
    const jsonData = await dbJson();
    const nombreDeQuestions = jsonData["questions-reponses"].length;
    console.log("Nombre total de questions :", nombreDeQuestions);

}

// Méthode pour rechercher une question par ID et l'afficher
async function rechercheQuestion(id) {
    const jsonData = await dbJson();
    const question = jsonData["questions-reponses"].find(q => q.id === parseInt(id));
    if (question) {
        console.log(question.question, " ? ", question.reponse);
    } else {
        console.log("Question non trouvée pour l'ID:", id);
    }
}

// Méthode pour saisir l'ID de la question à afficher
async function inputIdQuestion() {
    const id = await rl.question('Entrez l\'id de la question: ');
    await rechercheQuestion(id)
}

// Méthode pour afficher le menu principal
async function startMenu() {
    console.log(`
      1. Importer les données CSV
      2. Afficher le nombre de questions
      3. Afficher une question
      99. Sortir
    `);
    const saisie = await rl.question('Choisissez une option: ');
    await traiterSaisie(saisie);
}

// Méthode asynchrone pour traiter la saisie de l'utilisateur
async function traiterSaisie(saisie) {
    switch (saisie.trim()) {
        case '1':
            console.log(">> Import des données");
            await printCSV();
            break;
        case '2':
            console.log(">> Affichage du nombre de questions");
            await nbQuestions();
            break;
        case '3':
            console.log(">> Affichage d'une question");
            await inputIdQuestion();
            break;
        case '99':
            console.log("Au revoir");
            rl.close();
            return;
        default:
            console.log("Saisie non reconnue");
    }
    await startMenu();
}

// Appel initial pour démarrer le menu
startMenu();
