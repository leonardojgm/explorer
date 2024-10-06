let gameContainer = document.getElementById('gameContainer');
let player = document.getElementById('player');
let scoreDisplay = document.getElementById('score');
let gameOverDisplay = document.getElementById('gameOver');
let playButton = document.getElementById('playButton');
let modal = document.getElementById('factModal');
let modalContent = document.getElementById('factContent');
let skipButton = document.getElementById('skipButton');
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
let scoreFact = 10;
let gameStarted = false;
let isPaused = false;
let timeModal = 5000;
let backgroundYPosition = 0;
let walkingFrame = 1;
let frameCounter = 0;
let frequencyPlatforms = 7;
let frequencyObjects = 10;
let platformCounter = 0;
let activeObject = null;

function startGame() {
    gameContainer = document.getElementById('gameContainer');
    player = document.getElementById('player');
    scoreDisplay = document.getElementById('score');
    gameOverDisplay = document.getElementById('gameOver');
    playButton = document.getElementById('playButton');
    modal = document.getElementById('factModal');
    modalContent = document.getElementById('factContent');
    playButton.style.display = 'none';
    gameOverDisplay.style.display = 'none';
    scoreDisplay.style.display = 'block';
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
    walkingFrame = 1;
    platformCounter = 0;

    clearPlatforms();
    generateInitialPlatforms();
    update();
}

function showFactModal() {
    const randomFact = language == 'en' 
        ? facts_en[Math.floor(Math.random() * facts_en.length)] 
        : facts_pt_br[Math.floor(Math.random() * facts_pt_br.length)];
    
    modalContent.textContent = `"${randomFact}"`;
    modal.style.display = 'flex';

    isPaused = true;

    let counter = timeModal / 1000;
    const counterDisplay = document.getElementById('counter');
    counterDisplay.textContent = `${clossing_in_text} ${counter}`;

    const countdown = setInterval(() => {
        counter--;
        counterDisplay.textContent = `${clossing_in_text} ${counter}`;

        if (counter === 0) {
            clearInterval(countdown);

            modal.style.display = 'none';
            isPaused = false;

            update();
        }
    }, 1000);

    setTimeout(() => {
        modal.style.display = 'none';
        isPaused = false;
    }, timeModal);
}

function createFloatingObject() {
    const randomClass = `object_${parseInt(Math.random() * 12) + 1}`;
    const floatingObject = document.createElement('div');
    const isLeft = Math.random() < 0.5;

    floatingObject.classList.add('floating-object');
    floatingObject.classList.add(randomClass);
    floatingObject.style.top = '-200px';

    if (isLeft) {
        floatingObject.style.left = '0px';
        floatingObject.style.transform = 'scaleX(1)';
    } else {
        floatingObject.style.right = '0px';
        floatingObject.style.transform = 'scaleX(-1)';
    }

    gameContainer.appendChild(floatingObject);

    activeObject = floatingObject;
}

function updateFloatingObject() {
    if (activeObject) {
        const currentTop = parseFloat(activeObject.style.top);

        activeObject.style.top = `${currentTop + 2}px`;

        if (currentTop > gameContainer.offsetHeight) {
            activeObject.remove();
            activeObject = null;
        }
    }
}

function updatePlayerImage() {
    if (playerJump) {
        player.style.backgroundImage = `url(/img/groundhog_3.png)`;
        
        if (moveLeft) {
            player.style.transform = 'scaleX(-1)';
        } else {
            player.style.transform = 'scaleX(1)';
        }
    } else {
        if (moveRight || moveLeft) {
            frameCounter++;

            if (frameCounter % 10 === 0) {
                walkingFrame = walkingFrame === 1 ? 2 : 1;
            }

            player.style.backgroundImage = `url(/img/groundhog_${walkingFrame}.png)`;

            if (moveLeft) {
                player.style.transform = 'scaleX(-1)';
            } else {
                player.style.transform = 'scaleX(1)';
            }
        } else {
            player.style.backgroundImage = `url(/img/groundhog_1.png)`;
        }
    }
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

    const randomColor = `${parseInt(Math.random() * 5) + 1}`;
    const randomClass = Math.random() < 0.5 ? `platform_a_${randomColor}` : `platform_b_${randomColor}`;

    platform.classList.add(randomClass);

    gameContainer.appendChild(platform);    
    platforms.push(platform);

    platformCounter++;

    if (platformCounter >= frequencyObjects && !activeObject) {
        createFloatingObject();

        platformCounter = 0;
    }
}

function generateInitialPlatforms() {
    for (let i = 0; i < frequencyPlatforms; i++) {
        createPlatform(i * 120);
    }
}

function gameOver() {
    gameStarted = false;
    gameOverDisplay.textContent = `${end_game_text} ${score}`;
    gameOverDisplay.style.display = 'block';
    playButton.style.display = 'flex';
}

function scrollBackground() {
    if (gameStarted)
    {
        backgroundYPosition += 1;
    
        gameContainer.style.backgroundPosition = `0 ${backgroundYPosition}px`;
    }
}

function update() {
    if (isPaused) return; 

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

            if (score % scoreFact === 0 && score > 0) {
                showFactModal();
            }
        }
    });

    scoreDisplay.textContent = `${score_text} ${score}`;

    if (playerX < 0) playerX = 0;
    
    if (playerX > gameContainer.offsetWidth - player.offsetWidth) playerX = gameContainer.offsetWidth - player.offsetWidth;

    player.style.left = `${playerX}px`;
    player.style.bottom = `${playerY}px`;

    if (playerY <= 0 && !playerJump && score > 0) {
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

    updateFloatingObject();
    updatePlayerImage();
    scrollBackground();
    requestAnimationFrame(update);
}