const canvas = document.getElementById("RacingGame");
const context = canvas.getContext("2d");

/// inisialiser la taille des assets et jeux /////////////
let carWidthAndHeight = 0;
let carX = 0;
let carY = 0;
let velocity = 0

var enemyCars = [];
var enemyCarTimer = game.time.events.loop(2000, function() {
  // Generate a random position and speed for the enemy car
  var x = game.rnd.integerInRange(0, game.world.width);
  var speed = game.rnd.integerInRange(100, 300);
  
  // Create a new enemy car
  var enemyCar = new EnemyCar(x, game.world.height - 100, speed);
  
  // Add the enemy car to the array
  enemyCars.push(enemyCar);
});



///////////////////////////////////////


///Les controles///////////////////////
let controllerIndex = null;
let GoingLeft = false;
let GoingRight = false;
let VibrateController = false;
let GoingUp = false;
///////////////////////////////////////

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

}

function EnemyCar(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = game.add.sprite(x, y, 'enemy-car');
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.collideWorldBounds = true;
  }
  
  EnemyCar.prototype.update = function() {
    // Move the enemy car to the left
    this.x -= this.speed;
    
    // Check if the enemy car has gone off-screen
    if (this.x < 0 - this.sprite.width) {
      // If so, reset its position to the right side of the screen
      this.x = game.world.width + this.sprite.width;
    }
    
    // Check for collisions with the player car
    game.physics.arcade.collide(this.sprite, playerCar.sprite, function() {
      // Handle collision here
    });
  }
    
///////////////////////////////////////////3
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

const carEnemy = new Image();  // création de la voiture
carEnemy.src = "img/enemy.png";


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


function update() {
    // Update the player car
    playerCar.update();
  
    // Loop through the array of enemy cars
    for (var i = 0; i < enemyCars.length; i++) {
      var enemyCar = enemyCars[i];
      
      // Update the enemy car
      enemyCar.update();
    }
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
    drawCar();
    controllerCar();
    updateMovesCar();

    requestAnimationFrame(gameLoop);

}




    



