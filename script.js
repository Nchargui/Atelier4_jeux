const canvas = document.getElementById("RacingGame");
const context = canvas.getContext("2d");

/// inisialiser la taille des assets et jeux /////////////
let carWidthAndHeight = 0; 
let carX = 0;
let carY = 0;
let velocity = 0
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


function setUpRacingGame(){  // on veut que le jeux, fit les proportions de l'écrans
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    carWidthAndHeight = canvas.width * 0.1;
    velocity = canvas.width * 0.01;

    carX = (canvas.width - carWidthAndHeight)/2;
    carY = (canvas.height - carWidthAndHeight)/2;

}

window.addEventListener('resize', setUpRacingGame);  //screen adapté à la fenêtre



/// Utilisation de Gamepad API///////////////////////////////////////////3
window.addEventListener('gamepadconnected', (event) =>{  // si la manette est connecter
    controllerIndex = event.gamepad.index;
    console.log("La manette est connecté")
}); 

window.addEventListener('gamepaddisconnected', (event) =>{ //si la manette est deconnecter
    console.log("La manette est deconnecté");
    controllerIndex = null;
    

}); 

///////////////////////////////////////////3

// Inisitaliser les assets du jeux///////////////////////////////////////
let backgroundSky =  new Image();
backgroundSky.src  = "img/1.png";  // on défine le background de notre jeux (le ciel)

let Floor =  new Image();
Floor.src  = "img/FloorRace.png";  

let Road =  new Image();
Road.src  = "img/road.gif";  

let Cloud1 =  new Image();
Cloud1.src  = "img/cloud1.png"; 


let carPlayer = new Image();  // création de la voiture
carPlayer.src = "img/Car.png";  // on va charger la voiture dans le jeux
///////////////////////////////////////



///// Load les assets /////////////////////////////////////

backgroundSky.onload = function(){
setUpRacingGame();
gameLoop()
}


function clearScreen(){
    context.drawImage(backgroundSky, 0, 0, canvas.width, canvas.height);
}

function DrawCloud1(){

    cloud1X -= cloud1Velocity

    if(cloud1X <= -canvas.width){
        cloud1X = 0;
    }


    context.drawImage(Cloud1, cloud1X, 0, canvas.width, canvas.height / 1.7);
    context.drawImage(Cloud1, cloud1X + canvas.width, 0, canvas.width, canvas.height / 1.7);

}


function DrawFloor(){
    context.drawImage(Floor, 0, 0, canvas.width, canvas.height);
}


function DrawRoad(){
    
    context.drawImage(Road, 0, 0, canvas.width , canvas.height);
}


function drawCar(){
    context.drawImage(carPlayer, carX, carY * 1.5, carWidthAndHeight * 1.5, carWidthAndHeight * 1.5);
}

///////////////////////////////////////


////Faire bouger la voiture et autre controle//////////////////////////////////
function controllerCar(){
    if(controllerIndex !== null){
        const gamepad = navigator.getGamepads()[controllerIndex];
        const buttons = gamepad.buttons;
        GoingLeft = buttons[14].pressed;
        GoingRight = buttons[15].pressed;
        VibrateController = buttons[13].pressed;
        GoingUp = buttons[12].pressed;


        if(VibrateController){
            gamepad.vibrationActuator.playEffect("dual-rumble", {  // partie prit de chatGpt pour faire vibrer la manette 
                startDelay: 0,
                duration: 100,
                weakMagnitude: 0.5,
                strongMagnitude: 0.5,
            });
        }
    }   
}

function moveCar(){
    if(GoingLeft){
        carX -= velocity
    }

    if(GoingRight){
        carX += velocity
    }

    
    if(GoingUp){
        carY -= velocity;
    }

}

function updateMovesCar(){
    moveCar();
}


/// loop pour le jeux
function gameLoop(){
    console.log("la boucle marche !")
    clearScreen();
    DrawCloud1()
    DrawFloor();
    DrawRoad();
    drawCar();
    controllerCar();
    updateMovesCar();
    requestAnimationFrame(gameLoop);
}



