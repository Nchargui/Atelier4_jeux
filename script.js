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

function setUpRacingGame() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    carWidthAndHeight = canvas.width * 0.1;
    velocity = canvas.width * 0.01;

    carX = (canvas.width - carWidthAndHeight) / 2;
    carY = (canvas.height - carWidthAndHeight) / 2;
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
    drawCar();
    controllerCar();
    updateMovesCar();

    requestAnimationFrame(gameLoop);
}

gameLoop();
