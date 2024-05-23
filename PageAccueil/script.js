const canvas = document.getElementById("RacingGame");
const context = canvas.getContext("2d");

const restartButton = document.getElementById("restartButton");
const backToMenuButton = document.getElementById("backToMenuButton");

restartButton.addEventListener('click', function(){
    window.location.href = 'decompte.html';

});

backToMenuButton.addEventListener('click', function() {
    window.location.href = 'PageChoisirVoiture.html';
});

let carWidthAndHeight = 0;
let carX = 0;
let carY = 0;
let velocity = 0;

let controllerIndex = null;
let GoingLeft = false;
let GoingRight = false;
let VibrateController = false;
let GoingUp = false;
let GoingDown = false;

let cloud1X = 0;
let cloud1Velocity = 1;

let frameSeconde = 50;
let intervalFrame = 100;
let lastFrameTime = 0;

const coneWidthAndHeight = 50; // Taille des cônes
let cones = [];
let coneSpawnInterval = 2000; // Intervalle en ms pour l'apparition des cônes
let lastConeSpawnTime = 0;

let score = 0;
let timer = 30; // Compte à rebours en secondes
let gameOver = false;

function setUpRacingGame() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    carWidthAndHeight = canvas.width * 0.1;
    velocity = canvas.width * 0.01;

    carX = (canvas.width - carWidthAndHeight) / 2;
    carY = (canvas.height - carWidthAndHeight) / 2;

    setInterval(updateTimer, 1000); // Mettre à jour le timer chaque seconde
}

window.addEventListener('resize', setUpRacingGame);

window.addEventListener('gamepadconnected', (event) => {
    controllerIndex = event.gamepad.index;
    console.log("La manette est connectée")
});

window.addEventListener('gamepaddisconnected', (event) => {
    console.log("La manette est déconnectée");
    controllerIndex = null;
});
let backgroundSky = new Image();
backgroundSky.src = "img/1.png";

let Floor = new Image();
Floor.src = "img/Desert.png";

let Cloud1 = new Image();
Cloud1.src = "img/cloud1.png";

let carPlayer = new Image();
carPlayer.src = "img/Car.png";

let coneImage = new Image();
coneImage.src = "img/cone.png";

backgroundSky.onload = function () {
    setUpRacingGame();
    gameLoop();
}

function clearScreen() {
    context.drawImage(backgroundSky, 0, 0, canvas.width, canvas.height);
}

function DrawCloud1() {
    cloud1X -= cloud1Velocity;
    if (cloud1X <= -canvas.width) {
        cloud1X = 0;
    }
    context.drawImage(Cloud1, cloud1X, 0, canvas.width, canvas.height / 1.7);
    context.drawImage(Cloud1, cloud1X + canvas.width, 0, canvas.width, canvas.height / 1.7);
}

function DrawFloor() {
    context.drawImage(Floor, 0, -90, canvas.width, canvas.height);
}

function drawCar() {
    context.drawImage(carPlayer, carX, carY * 1.5, carWidthAndHeight * 1.5, carWidthAndHeight * 1.5);
}

function drawCones() {
    cones.forEach(cone => {
        context.drawImage(coneImage, cone.x, cone.y, coneWidthAndHeight, coneWidthAndHeight);
    });
}

let RoadFrames = [];
let currentFrame = 0;

function LoadFloorGif() {
    for (let i = 0; i <= 24; i++) {
        const filename = `img/RoadImgs/frame_${i < 10 ? '0' : ''}${i}_delay-0.04s.gif`;
        const RoadGif = new Image();
        RoadGif.src = filename;
        RoadFrames.push(RoadGif);
    }
}

function drawRoadFrame() {
    context.drawImage(RoadFrames[currentFrame], 0, 0, canvas.width, canvas.height);
    currentFrame++;
    if (currentFrame >= RoadFrames.length) {
        currentFrame = 0;
    }
}

function controllerCar() {
    if (controllerIndex !== null) {const gamepad = navigator.getGamepads()[controllerIndex];
        const buttons = gamepad.buttons;
        GoingLeft = buttons[14].pressed;
        GoingRight = buttons[15].pressed;
        VibrateController = buttons[13].pressed;
        GoingUp = buttons[12].pressed;
        GoingDown = buttons[6].pressed;
        if (VibrateController) {
            gamepad.vibrationActuator.playEffect("dual-rumble", {
                startDelay: 0,
                duration: 100,
                weakMagnitude: 0.5,
                strongMagnitude: 0.5,
            });
        }
    }
}

function moveCar() {
    if (GoingLeft && carX > 0) {
        carX -= velocity;
    }
    if (GoingRight && carX < canvas.width - carWidthAndHeight * 1.5) {
        carX += velocity;
    }
    if (GoingUp && carY > canvas.height * 0.3) {
        carY -= velocity;
    }
    if (GoingDown && carY < canvas.height - carWidthAndHeight * 1.5) {
        carY += velocity;
    }
}

function updateMovesCar() {
    moveCar();
}

function spawnCone() {
    const cone = {
        x: Math.random() * (canvas.width - coneWidthAndHeight),
        y: -coneWidthAndHeight 
    };
    cones.push(cone);
}

function checkCollision(car, cone) {
    return (
        car.x < cone.x + coneWidthAndHeight &&
        car.x + car.width > cone.x &&
        car.y < cone.y + coneWidthAndHeight &&
        car.y + car.height > cone.y
    );
}

function updateCones() {
    const currentTime = Date.now();
    if (currentTime - lastConeSpawnTime > coneSpawnInterval) {
        spawnCone();
        lastConeSpawnTime = currentTime;
    }

    cones.forEach(cone => {
        cone.y += velocity; 
    });

   
    cones = cones.filter(cone => {
        if (cone.y >= canvas.height) {
            return false;
        }
        if (checkCollision({ x: carX, y: carY * 1.5, width: carWidthAndHeight * 1.5, height: carWidthAndHeight * 1.5 }, cone)) {
            score += 10; 
            return false; 
        }
        return true;
    });
}

function updateTimer() {
    if (timer > 0) {
        timer--;
    } else {
        gameOver = true;
        restartButton.style.display = "block"; 
    }
}

function drawScoreAndTimer() {
    context.font = "30px Arial";
    context.fillStyle = "white";
    context.fillText(`Score: ${score}`, 10, 30);
    context.fillText(`Time: ${timer}s`, canvas.width - 150, 30);
}

function drawGameOver() {
    context.font = "70px Arial";
    context.fillStyle = "Black";
    var textWidth = context.measureText("GAME OVER").width;
    context.fillText("GAME OVER", (canvas.width - textWidth) / 2, canvas.height / 3);
    
    if (score >= 100) {
        context.fillText("YOU WON!", (canvas.width - textWidth) / 2, canvas.height / 3 + 60);
    } else {
        context.fillText("YOU LOSE!", (canvas.width - textWidth) / 2, canvas.height / 3 + 60);
    }
}


function resetGame() {
    score = 0;
    timer = 30;
    gameOver = false;
    cones = [];
    carX = (canvas.width - carWidthAndHeight) / 2;
    carY = (canvas.height - carWidthAndHeight) / 2;
    lastConeSpawnTime = 0;
    restartButton.style.display = "none"; 
    gameLoop();
}

restartButton.addEventListener('click', resetGame);

function gameLoop(timestamp) {
    if (timestamp - lastFrameTime < intervalFrame) {
        requestAnimationFrame(gameLoop);
        return;
    }
    lastFrameTime = timestamp;

    clearScreen();
    DrawCloud1();
    DrawFloor();
    LoadFloorGif();
    drawRoadFrame();
    drawCones(); 
    drawCar(); 
    controllerCar();
    updateMovesCar();
    updateCones(); 
    drawScoreAndTimer(); 

    if (gameOver) {
        drawGameOver();
    } else {
        requestAnimationFrame(gameLoop);
    }
}

gameLoop();
       