// Accessing HTML elements
const greenButton = document.getElementById('green');
const redButton = document.getElementById('red');
const yellowButton = document.getElementById('yellow');
const blueButton = document.getElementById('blue');
const startButton = document.getElementById('start-button');
const currentScoreElement = document.getElementById('current-score');
const highScoreElement = document.getElementById('high-score');
const statusMessage = document.getElementById('status-message'); // NEW: Message display

// Initializing game variables
let gameSequence = [];
let userSequence = [];
let level = 0;
let highScore = localStorage.getItem('highScore') || 0;
let acceptingInput = false; // NEW: Track user input phase

// Set the initial high score
highScoreElement.textContent = highScore;

// Array of colors for the game
const colors = ['green', 'red', 'yellow', 'blue'];

// Audio files for each button (ensure these paths are correct)
const audioFiles = {
    green: new Audio('sounds/green.mp3'),
    red: new Audio('sounds/red.mp3'),
    yellow: new Audio('sounds/yellow.mp3'),
    blue: new Audio('sounds/blue.mp3')
};

// Event listener for the start button
startButton.addEventListener('click', startGame);

// Start the game function
function startGame() {
    level = 0;
    gameSequence = [];
    userSequence = [];
    currentScoreElement.textContent = 0;
    statusMessage.textContent = "Watch the sequence...";
    nextSequence();
}

// Generate the next step in the sequence
function nextSequence() {
    userSequence = [];
    level++;
    currentScoreElement.textContent = level;

    const randomColor = colors[Math.floor(Math.random() * 4)];
    gameSequence.push(randomColor);

    statusMessage.textContent = "Watch the sequence...";
    flashSequence();
}

// Show the full sequence to the player
function flashSequence() {
    let index = 0;
    acceptingInput = false;

    const interval = setInterval(() => {
        flashColor(gameSequence[index]);
        index++;
        if (index >= gameSequence.length) {
            clearInterval(interval);
            setTimeout(() => {
                acceptingInput = true;
                statusMessage.textContent = "Your Turn";
            }, 300); // small delay after flashing
        }
    }, 1000);
}

// Flash visual and audio for a button
function flashColor(color) {
    const button = document.getElementById(color);
    button.style.opacity = 1;
    audioFiles[color].play();

    setTimeout(() => {
        button.style.opacity = 0.7;
    }, 500);
}

// Handle user input by color
function handleUserClick(color) {
    if (!acceptingInput) return;

    userSequence.push(color);
    flashColor(color);
    checkUserSequence();
}

// Check user input against game sequence
function checkUserSequence() {
    const currentIndex = userSequence.length - 1;

    if (userSequence[currentIndex] !== gameSequence[currentIndex]) {
        gameOver();
        return;
    }

    if (userSequence.length === gameSequence.length) {
        acceptingInput = false;
        if (level > highScore) {
            highScore = level;
            highScoreElement.textContent = highScore;
            localStorage.setItem('highScore', highScore);
        }
        setTimeout(() => nextSequence(), 1000);
    }
}

// Game over handling
function gameOver() {
    alert(`Game Over! Your score: ${level}`);
    statusMessage.textContent = "Game Over! Press Start to try again.";

    if (level > highScore) {
        highScore = level;
        highScoreElement.textContent = highScore;
        localStorage.setItem('highScore', highScore);
    }

    acceptingInput = false;
}

// Add button event listeners
greenButton.addEventListener('click', () => handleUserClick('green'));
redButton.addEventListener('click', () => handleUserClick('red'));
yellowButton.addEventListener('click', () => handleUserClick('yellow'));
blueButton.addEventListener('click', () => handleUserClick('blue'));
