import { Application, Assets, Graphics, Sprite, RenderTexture, Point} from 'https://cdn.skypack.dev/pixi.js'; 


const canvas = document.createElement('canvas');
const view = canvas.transferControlToOffscreen();

(async () =>{

    
    const app = new PIXI.Application();

    let keys = {};
   

    await app.init({view, resizeTo:window});
    document.body.appendChild(canvas);




    const { width, height } = app.screen;

    await Assets.load(['img/1.png']);
    await Assets.load(['img/3.png']);
    await Assets.load(['img/4.png']);
    await Assets.load(['img/tiles.png']);
    await Assets.load(['img/image.png']);

   


    const background = Sprite.from('img/1.png')
    const clouds1 = Sprite.from('img/3.png')
    const clouds2 = Sprite.from('img/4.png')
    const tiles = Sprite.from('img/tiles.png')
    const weird = Sprite.from('img/image.png')


    
   





    background.width = width * 2.7;
    background.height = height * 2;
    
    clouds1.width = width *  2.7;
    clouds1.height = height

    clouds2.width = width *  2.7;
    clouds2.height = height


    tiles.height = height * 1;
    tiles.width = width * 4.5;

    tiles.y += 5;


   weird.anchor.set(0.5);
   weird.x = app.view.width / 2;
   weird.y = app.view.height / 2;

   
    app.stage.addChild(background, clouds1, clouds2, tiles, weird);


    window.addEventListener("keydown", keysDown);
    window.addEventListener("keyup", keysUp);

    function keysDown(e){
        console.log(e.keyCode);
        keys[e.keyCode] = true;


    }

    function keysUp(e){
        console.log(e.keyCode);
        keys[e.keyCode] = false;

    }


   
  




 })();