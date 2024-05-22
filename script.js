const canvas = document.getElementById("RacingGame");
const context = canvas.getContext("2d");

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

// Position initiale de la voiture ennemie
let enemyCarX = 0;
let enemyCarY = 0;
const enemyCarDistance = 40; // Distance horizontale de la voiture du joueur
let enemyCarVelocity = 20; 

function setUpRacingGame() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    carWidthAndHeight = canvas.width * 0.1;
    velocity = canvas.width * 0.01;

    carX = (canvas.width - carWidthAndHeight) / 2;
    carY = (canvas.height - carWidthAndHeight) / 2;

    let enemyCarWidth = carWidthAndHeight * 1.5; // Largeur de la voiture ennemie
    enemyCarX = (canvas.width - enemyCarWidth) / 2; // Centrer la voiture ennemie
    enemyCarY = carY;
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

let carEnemy = new Image();
carEnemy.src = "img/enemy.png";

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

function drawEnemyCar() {
    context.drawImage(carEnemy, enemyCarX, enemyCarY * 0.9, carWidthAndHeight * 1.5, carWidthAndHeight * 1.5);
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
}

function controllerCar() {
    if (controllerIndex !== null) {
        const gamepad = navigator.getGamepads()[controllerIndex];
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
function updateEnemyCar() {
    // Mettre à jour la position en déplaçant la voiture ennemie vers la droite
    
    enemyCarX += enemyCarVelocity;

    // Vérifier si la voiture atteint la limite droite
    if (enemyCarX >= canvas.width - carWidthAndHeight * 2.5) {
        enemyCarX = canvas.width - carWidthAndHeight * 2.9; // Réduire la position à la limite droite
        enemyCarVelocity *= -1; // Inverser la direction de déplacement vers la gauche
    }

    // Vérifier si la voiture atteint la limite gauche
    if (enemyCarX < 0 ) {
        enemyCarX = 0; // Fixer la position à la limite gauche
        enemyCarVelocity *= -1; // Inverser la direction de déplacement vers la droite
    }
}


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
    updateEnemyCar(); // Mettre à jour la position de la voiture ennemie
    drawEnemyCar(); // Dessiner la voiture ennemie en premier
    drawCar(); // Dessiner la voiture du joueur par-dessus
    controllerCar();
    updateMovesCar();

    requestAnimationFrame(gameLoop);
}
