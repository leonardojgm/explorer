const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');

let playerX = 185;
let playerY = 570;
let playerSpeed = 5;
let playerJump = false;
let jumpPower = 10;
let gravity = 0.5;
let velocityY = 0;
let platforms = [];
let score = 0;

document.addEventListener('keydown', (e) => {
    console.log(e.code);

    if (e.code === 'ArrowRight') {
        playerX += playerSpeed;
    }

    if (e.code === 'ArrowLeft') {
        playerX -= playerSpeed;
    }

    if (e.code === 'Space' && !playerJump) {
        playerJump = true;
        velocityY = -jumpPower;
    }
});

function createPlatform(yPosition) {
    const gameContainer = document.getElementById('gameContainer');

    if (!gameContainer)
    {
        const platform = document.createElement('div');
    
        platform.classList.add('platform');
        platform.style.left = `${Math.floor(Math.random() * (gameContainer.offsetWidth - 100))}px`;
        platform.style.bottom = `${yPosition}px`;
        gameContainer.appendChild(platform);
    
        platforms.push(platform);
    }
}

function update() {
    const gameContainer = document.getElementById('gameContainer');
    
    if (!gameContainer)
    {
        if (playerJump) {
            playerY += velocityY;
            velocityY += gravity;

            if (playerY > 570) {
                playerY = 570;
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

                scoreDisplay.textContent = `Score: ${score}`;
            }
        });

        if (playerX < 0) playerX = 0;
        
        if (playerX > gameContainer.offsetWidth - player.offsetWidth) playerX = gameContainer.offsetWidth - player.offsetWidth;

        player.style.left = `${playerX}px`;
        player.style.bottom = `${playerY}px`;

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
}

function generateInitialPlatforms() {
    for (let i = 0; i < 5; i++) {
        createPlatform(i * 120);
    }
}

generateInitialPlatforms();
update();