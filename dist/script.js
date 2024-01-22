const playBoard = document.querySelector("#play-section");
const scoreElement = document.querySelector("#score");
const highScoreElement = document.querySelector("#high-score");
const controls = document.querySelectorAll("#controls p");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

let touchStartX = 0;
let touchStartY = 0;

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
};

const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

const handleSwipe = (startX, startY, endX, endY) => {
    const deltaX = endX - startX;
    const deltaY = endY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0 && velocityX !== -1) {
            velocityX = 1;
            velocityY = 0;
        } else if (deltaX < 0 && velocityX !== 1) {
            velocityX = -1;
            velocityY = 0;
        }
    } else {
        // Vertical swipe
        if (deltaY > 0 && velocityY !== -1) {
            velocityX = 0;
            velocityY = 1;
        } else if (deltaY < 0 && velocityY !== 1) {
            velocityX = 0;
            velocityY = -1;
        }
    }
};

controls.forEach((button) => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const handleTouchStart = (e) => {
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
};

const handleTouchMove = (e) => {
    e.preventDefault();
    if (!touchStartX || !touchStartY) {
        return;
    }

    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;

    handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);

    touchStartX = 0;
    touchStartY = 0;
};

const initGame = () => {
    if (gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);
        score++;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    snakeX += velocityX;
    snakeY += velocityY;

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return (gameOver = true);
    }

    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
};

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);
document.addEventListener("touchstart", handleTouchStart, { passive: true });
document.addEventListener("touchmove", handleTouchMove, { passive: true });
