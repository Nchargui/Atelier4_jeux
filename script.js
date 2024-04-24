import { Application, Assets, Graphics, Sprite, RenderTexture, Point} from 'https://cdn.skypack.dev/pixi.js'; 


const canvas = document.createElement('canvas');
const view = canvas.transferControlToOffscreen();

(async () =>{

    
    const app = new PIXI.Application();
   

    await app.init({view, resizeTo:window});
    document.body.appendChild(canvas);




    const { width, height } = app.screen;

    await Assets.load(['img/1.png']);
    await Assets.load(['img/3.png']);
    await Assets.load(['img/4.png']);

    const background = Sprite.from('img/1.png')
    const clouds1 = Sprite.from('img/3.png')
    const clouds2 = Sprite.from('img/4.png')




    background.width = width * 2.7;
    background.height = height;
    
    clouds1.width = width * 2.7;
    clouds1.height = height;

    clouds2.width = width * 2.7;
    clouds2.height = height;




    app.stage.addChild(background, clouds1, clouds2);


    app.ticker.add((delta) => {
        // Move clouds2 to the left
        clouds2.x -= 1 * delta;

        // Reset clouds2 position when it goes off-screen
        if (clouds2.x < -clouds2.width) {
            clouds2.x = width;
        }
    });




 })();