'use strict';

const TIME_LIMIT = 20;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;

// const bg = new Audio('./sound/bg.mp3');

const game__board = document.querySelector('.game__board');
const game__setting__playBtn = document.querySelector('.game__setting__playBtn');
const playBtn = document.querySelector('.fa-play');
const stopBtn = document.querySelector('.fa-stop');
const gameSettingTimer = document.querySelector('.game__setting__timer');
const gameSettingCount = document.querySelector('.game__setting__count');
const gameStatus = document.querySelector('.game__status');

let intervalId = null;
let onGame = false;
let boardActivate = false;

const randomNumberGenerator = () => {
    const x = Math.floor(Math.random() * 645);
    const y = Math.floor(Math.random() * 120);
    return [x, y];
}

const refreshBoard = () => {
    let children = game__board.children;
    for (const child of children) {
        if (child.classList[0] === "game__status") continue;
        child.remove()
    }
}

const putImgRandom = (img) => {
    let image_url = undefined;
    let image_alt = undefined;
    let image_class = undefined;
    switch (img) {
        case 'carrot':
            image_url = "img/carrot.png";
            image_alt = "carrot"
            image_class = "game__carrot"
            break;
        case 'bug':
            image_url = "img/bug.png";
            image_alt = "bug";
            image_class = "game__bug";
            break;
        default:
            console.log("Invalid input!");
    }
    const [x, y] = randomNumberGenerator();
    const image = document.createElement('img');
    image.setAttribute("src", image_url);
    image.setAttribute("alt", image_alt);
    image.setAttribute("class", image_class);
    image.style.top = `${y}px`;
    image.style.right = `${x}px`;

    game__board.appendChild(image);
}

const gameTimer = () => {
    let time = gameSettingTimer.innerText;
    let seconds = time.split(":")[0]
    let milliseconds = time.split(":")[1]

    if (milliseconds === "00") {
        if (seconds !== "00") {
            milliseconds = "99";
            seconds = parseInt(seconds) - 1;
            if (seconds >= 0 && seconds <= 9) {
                seconds = "0" + String(seconds);
            } else {
                seconds = String(seconds);
            }
        } else {
            clearInterval(intervalId);
            playBtn.classList.toggle('hide');
            stopBtn.classList.toggle('hide');
            onGame = false;
            boardActivate = false;
            gameStatus.innerText = "You Lose... 😭";
            gameStatus.style.visibility = "visible";
        }
    } else {
        milliseconds = parseInt(milliseconds) - 1;
        if (milliseconds >= 0 && milliseconds <= 9) {
            milliseconds = "0" + String(milliseconds);
        } else {
            milliseconds = String(milliseconds);
        }
    }
    gameSettingTimer.innerText = `${seconds}:${milliseconds}`;
}

// gameSettingTimer.innerText = `${TIME_LIMIT}:00`;

game__setting__playBtn.addEventListener('click', async (event) => {
    if (playBtn.classList.contains('hide')) { // Stop
        playBtn.classList.toggle('hide');
        stopBtn.classList.toggle('hide');
        clearInterval(intervalId);
        boardActivate = false;
        gameStatus.innerText = "Resume? 🖕";
        gameStatus.style.visibility = "visible";
    } else { // Start
        playBtn.classList.toggle('hide');
        stopBtn.classList.toggle('hide');
        if (!onGame) { // Start
            refreshBoard();

            onGame = true;
            boardActivate = true;
            gameSettingTimer.innerText = `${TIME_LIMIT}:00`;
            gameSettingCount.innerText = CARROT_COUNT;
            gameStatus.style.visibility = "hidden";
            intervalId = setInterval(gameTimer, 10);

            for (let i = 0; i < CARROT_COUNT; i++) {
                putImgRandom("carrot")
            }
            for (let i = 0; i < BUG_COUNT; i++) {
                putImgRandom("bug")
            }
        } else { // reStart
            intervalId = setInterval(gameTimer, 10);
            boardActivate = true;
            gameStatus.style.visibility = "hidden";
        }
    }
});

game__board.addEventListener('click', (event) => {
    const target = event.target;
    const targetType = target.classList[0];
    if (!boardActivate) return;
    if (targetType === "game__bug") {
        playBtn.classList.toggle('hide');
        stopBtn.classList.toggle('hide');
        clearInterval(intervalId);
        onGame = false;
        boardActivate = false;
        gameStatus.innerText = "You Lose... 😭";
        gameStatus.style.visibility = "visible";
    } else if (targetType === "game__carrot") {
        gameSettingCount.innerText = String(parseInt(gameSettingCount.innerText) - 1);
        target.remove();
        if (gameSettingCount.innerText === "0") { // Win
            playBtn.classList.toggle('hide');
            stopBtn.classList.toggle('hide');
            clearInterval(intervalId);
            onGame = false;
            boardActivate = false;
            gameStatus.innerText = "You Win! 😀";
            gameStatus.style.visibility = "visible";
        }
    }
})