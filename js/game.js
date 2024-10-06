let gameContainer = document.getElementById('gameContainer');
let player = document.getElementById('player');
let scoreDisplay = document.getElementById('score');
let gameOverDisplay = document.getElementById('gameOver');
let playButton = document.getElementById('playButton');
let playerX = 753;
let playerY = 0;
let playerSpeed = 20;
let moveLeft = false;
let moveRight = false;
let playerJump = false;
let jumpPower = 10;
let gravity = 0.5;
let velocityY = 0;
let platforms = [];
let score = 0;
let gameStarted = false;
let actionPlayer = false;

function startGame() {
    gameContainer = document.getElementById('gameContainer');
    player = document.getElementById('player');
    scoreDisplay = document.getElementById('score');
    gameOverDisplay = document.getElementById('gameOver');
    playButton = document.getElementById('playButton');
    playButton.style.display = 'none';
    gameOverDisplay.style.display = 'none';
    playerX = 753;
    playerY = 0;
    playerSpeed = 15;
    moveLeft = false;
    moveRight = false;
    playerJump = false;
    jumpPower = 15;
    gravity = 0.5;
    velocityY = 0;
    score = 0;
    gameStarted = true;

    clearPlatforms();
    generateInitialPlatforms();
    update();
}

document.addEventListener('keydown', (e) => {
    if (!gameStarted) return;

    if (e.code === 'ArrowLeft' || e.code.toUpperCase() === 'KEYA') {
        moveLeft = true;
    }

    if (e.code === 'ArrowRight' || e.code.toUpperCase() === 'KEYD') {
        moveRight = true;
    }

    if ((e.code === 'Space' || e.code.toUpperCase() === 'KEYW') && !playerJump) {
        playerJump = true;
        velocityY = -jumpPower;
        actionPlayer = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code.toUpperCase() === 'KEYA') {
        moveLeft = false;
    }

    if (e.code === 'ArrowRight' || e.code.toUpperCase() === 'KEYD') {
        moveRight = false;
    }
});

function clearPlatforms() {
    platforms.forEach((platform) => {
        platform.remove();
    });

    platforms = [];
}

function createPlatform(yPosition) {
    const platform = document.createElement('div');

    platform.classList.add('platform');
    platform.style.left = `${Math.floor(Math.random() * (gameContainer.offsetWidth - 100))}px`;
    platform.style.bottom = `${yPosition}px`;

    const randomClass = Math.random() < 0.5 ? 'platform_a' : 'platform_b';

    platform.classList.add(randomClass);

    gameContainer.appendChild(platform);    
    platforms.push(platform);
}

function generateInitialPlatforms() {
    for (let i = 0; i < 5; i++) {
        createPlatform(i * 120);
    }
}

function gameOver() {
    gameStarted = false;
    actionPlayer = false;
    gameOverDisplay.textContent = `You Lose. Score: ${score}`;
    gameOverDisplay.style.display = 'block';
    playButton.style.display = 'flex';
}

function update() {
    if (moveRight) {
        playerX += playerSpeed;
    }

    if (moveLeft) {
        playerX -= playerSpeed;
    }

    if (playerJump) {
        playerY -= velocityY;
        velocityY += gravity;

        if (playerY < 0) {
            playerY = 0;
            playerJump = false;
        }
    }

    platforms.forEach((platform) => {
        const platformRect = platform.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();
        
        if (
            playerRect.bottom >= platformRect.top &&
            playerRect.top <= platformRect.bottom &&
            playerRect.right >= platformRect.left &&
            playerRect.left <= platformRect.right &&
            velocityY > 0
        ) {
            playerJump = true;
            velocityY = -jumpPower;
            score++;
        }
    });

    scoreDisplay.textContent = `Score: ${score}`;

    if (playerX < 0) playerX = 0;
    
    if (playerX > gameContainer.offsetWidth - player.offsetWidth) playerX = gameContainer.offsetWidth - player.offsetWidth;

    player.style.left = `${playerX}px`;
    player.style.bottom = `${playerY}px`;

    if (playerY <= 0 && !playerJump && actionPlayer) {
        gameOver();
        return;
    }

    platforms.forEach((platform, index) => {
        const platformY = parseFloat(platform.style.bottom);

        platform.style.bottom = `${platformY - 2}px`;

        if (platformY < -10) {
            platform.remove();
            platforms.splice(index, 1);

            createPlatform(gameContainer.offsetHeight);
        }
    });

    requestAnimationFrame(update);
}