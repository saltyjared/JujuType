const quotes = [
    "You're right, Mahito. I'm you. I wanted to reject you, convince myself that you were wrong. But that doesn't matter now. I'm gonna kill you. Even if you come back as another curse, I'll kill you. Change your name. Change your form. I'll kill you again. I don't need to find meaning or a reason. Maybe in a hundred years after my death, the meaning behind my actions will become apparent. In the grand scheme of things, I'm probably nothing more than a cog. But I'll keep killing curses for as long as I can. That's my role in all this.",
    "I'm just a cog, and cogs have a function. My function is getting rid of curses and if you're necessary for that, I won't give up until you agree.",
    "The sound of the gion shoja bells echoes the impermanence of all things. The colors of sala flowers reveals the truth that the prosperous must decline. However, we are the exception.",
    "You're a strong kid, so help others. Even if it's only those closest to you, just save the people you can. It's okay if you lose your way, and don't worry about whether they'll thank you or not. Just save as many people as you can, even if it's only one. When you die, you should be surrounded by people. Don't end up like me."
];
const numQuotes = quotes.length;
const gameTime = 30 * 1000;
window.timer = null;
window.gameStart = null;

function addClass(el, name){
    el.className += ' '+name;
}

function removeClass(el, name){
    el.className = el.className.replace(' '+name,'');
}

function randomQuote() {
    const randomIndex = Math.floor(Math.random() * numQuotes);
    return quotes[randomIndex];
}

function formatWord(word) {
    return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

function newGame() {
    clearInterval(window.timer);
    window.timer = null;
    window.gameStart = null;
    document.getElementById('words').style.marginTop = '0px';

    document.getElementById('game').className = '';
    document.getElementById('words').innerHTML = '';
    const quote = randomQuote().split(" ");
    for (let i = 0; i < quote.length; i++) {
        document.getElementById('words').innerHTML += formatWord(quote[i]);
    }
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.letter'), 'current');
    document.getElementById('info').innerHTML = (gameTime / 1000) + '';
    document.getElementById('cursor').style.top = document.querySelector('.word.current').getBoundingClientRect().top + 5 + 'px';
    document.getElementById('cursor').style.left = document.querySelector('.word.current').getBoundingClientRect().left - 1 + 'px';
}

function getWPM() {
    const words = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    const lastTypedWordIndex = words.indexOf(lastTypedWord);
    const typedWords = words.slice(0, lastTypedWordIndex);
    const correctWords = typedWords.filter(word => {
        const letters =[...word.children];
        const incorrectLetters = letters.filter(letter => letter.className.includes('incorrect'));
        const correctLetters = letters.filter(letter => letter.className.includes('correct'));
        return incorrectLetters.length === 0 && correctLetters.length === letters.length;
    });
    return correctWords.length / gameTime * 60000;
}

function gameOver() {
    clearInterval(window.timer);
    addClass(document.getElementById('game'), 'over');
    document.getElementById('info').innerHTML = `WPM: ${getWPM()}`;
}

document.getElementById('game').addEventListener('keydown', ev => {
    const key = ev.key;
    const currentWord = document.querySelector('.word.current');
    const currentLetter = document.querySelector('.letter.current');
    const expected = currentLetter?.innerHTML || ' ';
    const isLetter = key.length === 1 && key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';
    const isFirstLetter = currentLetter === currentWord.firstChild;
    const isExtra = document.querySelector('.incorrect.extra');
    const gameEnd = currentWord.nextElementSibling === null && currentLetter.nextSibling === null

    if (document.querySelector('#game.over')) {
        return;
    }

    console.log({key,expected});

    if (!window.timer && (isLetter || isSpace)) {
        window.timer = setInterval(() => {
            if (!window.gameStart) {
                window.gameStart = (new Date()).getTime();
            }
            const currentTime = (new Date()).getTime();
            const msPassed = currentTime - window.gameStart;
            const sPassed = Math.round(msPassed / 1000);
            const sLeft = (gameTime / 1000) - sPassed;
            if (sLeft <= 0) {
                gameOver();
                return;
            }
            document.getElementById('info').innerHTML = sLeft + '';
        }, 100);
    }

    // If input key is a letter, check whether it is correct/incorrect
    if (isLetter) {
        if (currentLetter) {
            // Validate or invalidate current key and move to next letter
            addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
            removeClass(currentLetter, 'current');
            if (currentLetter.nextSibling) {
                addClass(currentLetter.nextSibling, 'current');
            }
        }
        else {
            // If no current letter (meaning space is required), mark subsequent keys as 'extra'
            const incorrectLetter = document.createElement('span');
            incorrectLetter.innerHTML = key;
            incorrectLetter.className = 'letter incorrect extra';
            currentWord.appendChild(incorrectLetter);
        }
    }

    // If input key is a space, check whether it is correct or incorrect
    if (isSpace) {
        if (expected !== ' ') {
            // If space is pressed when it is not expected, invalidate all letters of current word and skip to start of next word
            const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
            lettersToInvalidate.forEach(letter => {
                addClass(letter, 'incorrect');
            })
        }
        removeClass(currentWord, 'current');
        addClass(currentWord.nextSibling, 'current');
        if (currentLetter) {
            removeClass(currentLetter, 'current');
        }
        addClass(currentWord.nextSibling.firstChild, 'current');
    }

    // Backspace implementation
    if (isBackspace) {
        if (currentLetter && isFirstLetter) {
            if (currentWord.previousSibling.children.length === currentWord.previousSibling.querySelectorAll('.correct').length) {
                // If backspace is pressed to traverse into an already correct word, do nothing
                ;
            }
            else {
                // Make previous word's last letter the current letter if last word has an incorrect letter
                removeClass(currentWord, 'current');
                addClass(currentWord.previousSibling, 'current');
                removeClass(currentLetter, 'current');
            }
        }
        if (currentLetter && !isFirstLetter) {
            // Make previous letter current and strip correct/incorrect tag
            removeClass(currentLetter, 'current');
            addClass(currentLetter.previousSibling, 'current');
            removeClass(currentLetter.previousSibling, 'incorrect');
            removeClass(currentLetter.previousSibling, 'correct');
        }
        if (!currentLetter) {
            // Make last letter of current word current and strip correct/incorrect tag
            if (!isExtra) {
                // If last character is not extra, proceed as usual
                addClass(currentWord.lastChild, 'current');
                removeClass(currentWord.lastChild, 'incorrect');
                removeClass(currentWord.lastChild, 'correct');
            }
            else {
                // If last character is extra, remove from word
                currentWord.lastChild.remove(isExtra);
            }
        }
    }

    // Moving cursor
    const nextLetter = document.querySelector('.letter.current');
    const nextWord = document.querySelector('.word.current');
    const cursor = document.getElementById('cursor');
    cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 5 + 'px';
        // Bound cursor top to top of next letter/word
    cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] - 1 + 'px';
        // Bound cursor left to right of next letter, left of next word


    // Moving and scrolling lines of text
    if (currentWord.getBoundingClientRect().top > 260) {
        const words = document.getElementById('words');
        const margin = parseInt(words.style.marginTop || '0px');
        words.style.marginTop = (margin - 35) + 'px';
    }

    if (gameEnd) {
        // End game if last word is completed
        gameOver();
        return;
    }
})

// New game button functionality
document.getElementById('new-game').addEventListener('click', () => {
    gameOver();
    newGame();
});


var icon = document.getElementById('dark-mode-toggle');
var logo = document.getElementById('logo');
icon.onclick = function(){
    document.body.classList.toggle('dark-theme');
    if (document.body.classList.contains('dark-theme')) {
        icon.src = "images/moon.svg";
        logo.src = "images/shinto-shrine.svg";
    }
    else {
        icon.src = "images/sun.svg";
        logo.src = "images/crossed-fingers.svg";
    }
}

newGame();