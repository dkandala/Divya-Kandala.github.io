let triviaBtn = document.querySelector("#js-new-quote").addEventListener('click', newTrivia);

let answerBtn = document.querySelector('#js-tweet').addEventListener('click', newAnswer);

let current = {
    text: "",
    book: "",
}

const endpoint = "https://bible-api.com/data/web/random";

async function newTrivia() {
    // console.log("Success");
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw Error(response.statusText)
        }
        const json = await response.json();
        console.log(json);
        current.text = json['random_verse']['text'];
        current.book = json['random_verse']['book'];
        displayTrivia(current.text);
        console.log(current.text);
        console.log(current.book);

     } catch (err) {
        console.log(err)
        alert('Failed to get bible verse');
     }
}

function displayTrivia(question) {
    const questionText = document.querySelector('#js-quote-text');
    const answerText = document.querySelector("#js-answer-text");
    questionText.textContent = question;
    answerText.textContent = "";
}

function newAnswer() {
    const answerText = document.querySelector("#js-answer-text");
    answerText.textContent = current.book;
}

newTrivia();