
// inisialiser le canva
const canvas = document.getElementById("RacingGame");
const context = canvas.getContext("2d");

const restartButton = document.getElementById("restartButton");
const backToMenuButton = document.getElementById("backToMenuButton");


// recommencer le jeux
restartButton.addEventListener('click', function(){
    window.location.href = 'decompte.html';

});


// aller dans le menu
backToMenuButton.addEventListener('click', function() {
    window.location.href = 'PageChoisirVoiture.html';
});


// valeur pour la voiture
let carWidthAndHeight = 0;
let carX = 0;
let carY = 0;
let velocity = 0;


// controle de la manette
let controllerIndex = null;
let GoingLeft = false;
let GoingRight = false;
let VibrateController = false;
let GoingUp = false;
let GoingDown = false;

///controler clavier
let keys = {};

window.addEventListener('keydown', function(e) {
    keys[e.key] = true;
});

window.addEventListener('keyup', function(e) {
    delete keys[e.key];
});

// pour l'animation des asests
let cloud1X = 0;
let cloud1Velocity = 1;

let frameSeconde = 50;
let intervalFrame = 40;
let lastFrameTime = 0;

const coneWidthAndHeight = 50;
let cones = [];
let coneSpawnInterval = 2000; 
let lastConeSpawnTime = 0;

let score = 0;
let timer = 30; 
let gameOver = false;


// responsive
function setUpRacingGame() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    carWidthAndHeight = canvas.width * 0.1;
    velocity = canvas.width * 0.01;

    carX = (canvas.width - carWidthAndHeight) / 2;
    carY = (canvas.height - carWidthAndHeight) / 2;

    setInterval(updateTimer, 1000); 
}

window.addEventListener('resize', setUpRacingGame);


//api gamepad code
window.addEventListener('gamepadconnected', (event) => {
    controllerIndex = event.gamepad.index;
    console.log("La manette est connectée")
});

window.addEventListener('gamepaddisconnected', (event) => {
    console.log("La manette est déconnectée");
    controllerIndex = null;
});


// inisialiser les images des assets
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
// le bg du canva
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
// utilisation d'une boucle pour load le gif car sur canva sa marche pas
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


/// inisialiser toute les controles pour la manette
function controllerCar() {
    if (controllerIndex !== null) 
        {const gamepad = navigator.getGamepads()[controllerIndex];
        const buttons = gamepad.buttons;
        GoingLeft = buttons[14].pressed;
        GoingRight = buttons[15].pressed;
        VibrateController = buttons[13].pressed;
        GoingUp = buttons[12].pressed;
        GoingDown = buttons[6].pressed;

        const stickDeadZone = 0.5;
        const GoingLeftRight = gamepad.axes[0];


        if(GoingLeftRight >= stickDeadZone){
            GoingLeft = true
        }

        else if(GoingLeftRight <= -stickDeadZone){
            GoingRight = true;

        }


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


// choisir les mouvent par rapport au controles
function moveCar() {
    if (GoingLeft && carX > 0) {
        carX -= velocity;
    }
    if (GoingRight && carX < canvas.width - carWidthAndHeight * 1.5) {
        carX += velocity;
    }
   
    if (GoingDown && carY < canvas.height - carWidthAndHeight * 1.5) {
        carY += velocity;
    }
    if (keys['ArrowLeft'] && carX > 0) {
        carX -= velocity;
    }
    if (keys['ArrowRight'] && carX < canvas.width - carWidthAndHeight * 1.5) {
        carX += velocity;
    }
}

// mise a jour du mouvement de la voiture
function updateMovesCar() {
    moveCar();
}


// faire apparaitre les cones
function spawnCone() {
    const cone = {
        x: Math.random() * (canvas.width - coneWidthAndHeight),
        y: -coneWidthAndHeight 
    };
    cones.push(cone);
}


// regarder si il y a une collision
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
            if (controllerIndex !== null) {  // si ya collison le score monte et la mannette vibre
                const gamepad = navigator.getGamepads()[controllerIndex];
                if (gamepad && gamepad.vibrationActuator) {

                    gamepad.vibrationActuator.playEffect("dual-rumble", {
                        startDelay: 0,
                        duration: 100,
                        weakMagnitude: 0.5,
                        strongMagnitude: 0.5,
                    });
                }
            }
            return false; 
        }
        return true;
    });
}

function updateTimer() {  //timer de la partie 
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



// la loop pour faire fonctionner le jeux
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
       