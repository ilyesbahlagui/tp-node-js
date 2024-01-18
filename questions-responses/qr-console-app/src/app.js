import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import fetch from "node-fetch"

console.log('** QR-CONSOLE **');

const rl = readline.createInterface({ input, output });


const QUIZ = {
    pseudo: "",
    questions: [],
}


// Génère un tableau d'entiers aléatoires
async function getRandomInt(min, max) {
    let iDs = [];
    for (let i = 0; i < 5; i++) {
        iDs[i] = parseInt(Math.random() * (max - min) + min);
    }
    return iDs;
}
// Fonction principale pour tester le quiz
async function testQuiz() {
    const questions = QUIZ.questions;
    let score = 0;
    const reponses = [];
    // Stocke les reponses une fois 
    for (let i = 0; i < questions.length; i++) {
        reponses.push({
            id: questions[i].id,
            reponse: questions[i].reponse,
        })
    }
    // Pose les questions 
    for (let i = 0; i < questions.length; i++) {
        const bonneReponse = questions[i].reponse;
        console.log(`Qestion numéro ${i + 1} ${questions[i].question}`)

        console.log(`
        1.${reponses[0].reponse}
        2.${reponses[1].reponse}
        3.${reponses[2].reponse}
        4.${reponses[3].reponse}
        5.${reponses[4].reponse}
        `)

        let breakWhile = false;
        let rep = await rl.question('Choisissez une réponse: ');
        while (!breakWhile) {
            if (rep >= 1 && rep <= 5) {
                breakWhile = true;
            } else {
                rep = await rl.question('Choisissez une réponse entre 1 et 5: ');
            }
        }

        if (reponses[rep - 1].reponse === bonneReponse) {
            score++;
        }
    }

    console.log(QUIZ.pseudo, " votre score est de : ", (score / 5) * 100, "%");

}

// Fonction principale du quiz
async function mainQuiz() {

    const pseudo = await rl.question('Entrez ton pseudo : ');
    QUIZ.pseudo = pseudo;

    console.log("Votre Pseudo => ", pseudo);

    const iDs = await getRandomInt(1, 1000);
    console.log("IDS aléatoires => ", iDs)
    await getQuestions(iDs).then(questions => {
        console.log('Questions récupérées :', questions);
        QUIZ.questions = questions;
    });
    await testQuiz();
}


// Récupère les questions du serveur
async function getQuestions(ids) {
    const questions = [];

    for (let id of ids) {
        const response = await fetch(`http://localhost:3000/questions-reponses/${id}`);
        const question = await response.json();
        questions.push(question);
    }

    return questions;
}



// Méthode pour afficher le menu principal
async function startMenu() {
    console.log(`
      1. Saisie un pseudo
      99. Sortir
    `);
    const saisie = await rl.question('Choisissez une option: ');
    await traiterSaisie(saisie);
}

// Méthode asynchrone pour traiter la saisie de l'utilisateur
async function traiterSaisie(saisie) {
    switch (saisie.trim()) {
        case '1':
            console.log(">> Saisie un pseudo");
            await mainQuiz();

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



