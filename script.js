const canvas = document.getElementById("RacingGame");
const context = canvas.getContext("2d");

/// inisialiser la taille des assets et jeux /////////////
let carWidthAndHeight = 0;
let carX = 0;
let carY = 0;
let velocity = 0

const enemyCars = [];
const enemyCarCount =  4
const enemyCarSize = 0.40;

let enemyCarVelocity = 5;



///////////////////////////////////////


///Les controles///////////////////////
let controllerIndex = null;
let GoingLeft = false;
let GoingRight = false;
let VibrateController = false;
let GoingUp = false;
///////////////////////////////////////

//Vriables pour les animations
let cloud1X = 0;
let cloud1Velocity = 1;


let frameSeconde = 30;
let intervalFrame = 20;
let lastFrameTime = 0;
///////////////////////////////////////


function setUpRacingGame() {  // on veut que le jeux, fit les proportions de l'écrans
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    carWidthAndHeight = canvas.width * 0.1;
    velocity = canvas.width * 0.01;

    carX = (canvas.width - carWidthAndHeight) / 2;
    carY = (canvas.height - carWidthAndHeight) / 2;


    enemyCarX = canvas.width / 3;
    enemyCarY = canvas.height / 2;
    enemyCarWidth = carWidthAndHeight / 6;
    enemyCarHeight = carWidthAndHeight / 6;
    enemyCarVelocity = velocity * 2;



}


function infiniteSpawnCar() {  // aide AI
    while (enemyCars.length < enemyCarCount) {
        let size = carWidthAndHeight * enemyCarSize;
        let roadWidth = canvas.width * 0.8;
        let roadStartX = (canvas.width - roadWidth) / 2;
        let roadTopY = RoadFrames[currentFrame].height * 0.2;
        let roadBottomY = canvas.height * 0.8;
        let spawnX = roadStartX + Math.random() * roadWidth;
        let spawnY = roadTopY - size / 2; 

        let newenemyCars = {
            x: spawnX,
            y: spawnY,
            width: size,
            height: size,
            velocityY: enemyCarVelocity
        };
        enemyCars.push(newenemyCars);
    }
}

window.addEventListener('resize', setUpRacingGame);  //screen adapté à la fenêtre



/// Utilisation de Gamepad API///////////////////////////////////////////3
window.addEventListener('gamepadconnected', (event) => {  // si la manette est connecter
    controllerIndex = event.gamepad.index;
    console.log("La manette est connecté")
});

window.addEventListener('gamepaddisconnected', (event) => { //si la manette est deconnecter
    console.log("La manette est deconnecté");
    controllerIndex = null;


});

///////////////////////////////////////////3

// Inisitaliser les assets du jeux///////////////////////////////////////
let backgroundSky = new Image();
backgroundSky.src = "img/1.png";  // on défine le background de notre jeux (le ciel)

let Floor = new Image();
Floor.src = "img/Desert.png";


let Cloud1 = new Image();
Cloud1.src = "img/cloud1.png";


let carPlayer = new Image();  // création de la voiture
carPlayer.src = "img/Car.png";  // on va charger la voiture dans le jeux

let carEnemy = new Image();  // création de la voiture
carEnemy.src = "img/carEnemy3.png";


///////////////////////////////////////



///// Load les assets /////////////////////////////////////

backgroundSky.onload = function () {
    setUpRacingGame();
    gameLoop()
}


function clearScreen() { // load les nuages + l'animation
    context.drawImage(backgroundSky, 0, 0, canvas.width, canvas.height);
}

function DrawCloud1() {

    cloud1X -= cloud1Velocity

    if (cloud1X <= -canvas.width) {
        cloud1X = 0;
    }


    context.drawImage(Cloud1, cloud1X, 0, canvas.width, canvas.height / 1.7);
    context.drawImage(Cloud1, cloud1X + canvas.width, 0, canvas.width, canvas.height / 1.7);

}


function DrawFloor() {  // load le deserts (background)
    context.drawImage(Floor, 0, -90, canvas.width, canvas.height);
}


function drawCar() {  // load la voiture du joueur
    context.drawImage(carPlayer, carX, carY * 1.5, carWidthAndHeight * 1.5, carWidthAndHeight * 1.5);
}


function drawCarEnemy() {  // load la voiture du joueur
    enemyCars.forEach(car => {
        context.drawImage(carEnemy, car.x, car.y, car.width, car.height)
    });
}



/// liste pour rentrer toutes les frames
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


function drawRoadFrame(){
    context.drawImage(RoadFrames[currentFrame], 0, 0, canvas.width, canvas.height);

    currentFrame++;
}   


///////////////////////////////////////


////Faire bouger la voiture et autre controle//////////////////////////////////
function controllerCar() {
    if (controllerIndex !== null) {
        const gamepad = navigator.getGamepads()[controllerIndex];
        const buttons = gamepad.buttons;
        GoingLeft = buttons[14].pressed;
        GoingRight = buttons[15].pressed;
        VibrateController = buttons[13].pressed;
        GoingUp = buttons[12].pressed;


        if (VibrateController) {
            gamepad.vibrationActuator.playEffect("dual-rumble", {  // partie prit de chatGpt pour faire vibrer la manette 
                startDelay: 0,
                duration: 100,
                weakMagnitude: 0.5,
                strongMagnitude: 0.5,
            });
        }
    }
}

function moveCar() {
    if (GoingLeft) {
        carX -= velocity
    }

    if (GoingRight) {
        carX += velocity
    }


    if (GoingUp) {
        carY -= velocity;
    }

}


function updateMovesCar() {
    moveCar();
}


function updateEnemyCar(){  // controler l'avancement des voitures ennemies
    enemyCars.forEach(car => {
        car.y += car.velocityY; // Changed to move cars downwards
        if (car.y > canvas.height) { // If the car goes below the canvas
            car.x = Math.random() * (canvas.width - car.width);
            car.y = -car.height; // Respawn above the canvas
        }
    });
}
///////////////////////////////////////


/// loop pour le jeux
function gameLoop(timestamp) {  // controller la vitesse
    console.log("la boucle du jeu marche !")

    if(timestamp - lastFrameTime < intervalFrame){
        requestAnimationFrame(gameLoop);
        return;
    }
    lastFrameTime = timestamp;
    
    clearScreen();
    DrawCloud1()
    DrawFloor();
    LoadFloorGif();
    drawRoadFrame();
    drawCarEnemy();
    updateEnemyCar();
    drawCar();
    controllerCar();
    updateMovesCar();
    infiniteSpawnCar();

    requestAnimationFrame(gameLoop);

}




    



