const triviaBtn = document.querySelector("#js-new-quote");
if (triviaBtn) triviaBtn.addEventListener('click', newTrivia);

const answerBtn = document.querySelector('#js-tweet');
if (answerBtn) answerBtn.addEventListener('click', newAnswer);

let quoteCount = 0;
const saved = parseInt(localStorage.getItem('quoteCount'),10);
if (!Number.isNaN(saved)) quoteCount = saved;

updateQuoteCount();

let current = {
    text: "",
    book: "",
}

function updateQuoteCount() {
    const el = document.querySelector('#js-quote-count');
    if (el) el.textContent = String(quoteCount);
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

        quoteCount += 1;
        localStorage.setItem('quoteCount', quoteCount);
        updateQuoteCount();

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

document.addEventListener('DOMContentLoaded', () => {
    updateQuoteCount();
});

newTrivia();