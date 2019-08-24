
// Pixi engine settings
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;                // Gives us that pixel-y look.

// Global vars (which should be in a namespace)
const renderSize = [240, 160];      // Internal screen resolution (GBA).
const gridSize = [15, 10];          // The dimensions of the grid of 16x16 sprite tiles.
const tileSize = 16;                // The size in pixels of one grid cell or standard tile on screen.
var displaySize;                    // HTML frame-element resolution.
var scaleFactor;                    // Width only; I am assuming aspect ratio will be maintained with GBA.


// Create Pixi application
const app = new PIXI.Application({ backgroundColor: 0x1099bb });
document.querySelector('#frame').appendChild(app.view); // Add the canvas Pixi created to the HTML document.

// Global references
const htmlFrame = document.querySelector('#frame');     // Reference to the frame-element containing the game's canvas.
const scene = new PIXI.Container();                     // Reference to the view container (used for screen scaling)
app.stage.addChild(scene);                                  // Adds the scene container to the view.

// Resizes the game's view to that of the containing HTML element.
function resize() {
    const parent = app.view.parentNode;
    app.renderer.resize(parent.clientWidth, parent.clientHeight);
    displaySize = [app.renderer.view.width, app.renderer.view.height];
    scaleFactor = displaySize[0] / renderSize[0];

    scene.scale.x = scaleFactor;
    scene.scale.y = scaleFactor;
}

// On window resize, resize the canvas view too.
window.addEventListener('resize', resize);
resize();



// Test "Move"/"Place" sprite function utilizing scaleFactor to maintain GBA resolution at larger displays.
// This should probably just be a feature of GameObject and be something every thing inherits from.
function moveObject(object, x, y) {
    object.x = x * scaleFactor;
    object.y = y * scaleFactor;
}



// Test bullshits.
// This is probably where the game loop should be.


// Create a grid of bg tiles
app.loader.add('sand', './src/assets/sprites/sand.png');
app.loader.add('TecTacRegular', './src/assets/TecTacRegular.xml');
app.loader.load((loader, resources) => {
    for (let i = 0; i < (150); i++) {
        const sand = new PIXI.Sprite(resources.sand.texture);
        sand.x = (i % 15) * 16;
        sand.y = Math.floor(i / 15) * 16;
        scene.addChild(sand);
    }

    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xBCA474);
    graphics.drawRect(12,12,84,60);     // 12,12 puts the box at 8,8, by the way.
    graphics.drawRect(12,84,198,34);    // I'm sure this has something to do with scaling... maybe.
    graphics.endFill();
    scene.addChild(graphics);

    const bitmapFontText = new PIXI.BitmapText("Select an option:\n1. Dairy\n2. Big Boi\n3. @gmail.com\n4. #5 $1,700\n5. d&d or DnD\n\n\nThis typeface is a little hard to read.\nSome of that is how clumped the pixels are.\nI dunno. I'll fix it later.", { font: '8px TecTacRegular', align: 'left'});
    bitmapFontText.x = 16;
    bitmapFontText.y = 16;
    
    scene.addChild(bitmapFontText);
});

// Why?
scene.position.x = -16;
scene.position.y = -16;

// It's like there's padding or something; when width is adjustable, the top left corner does not stay put.
// Otherwise, 'scene' is exactly what I want it to be.

// All right, this was a good first exercise.
// I am gonna sleep a little teensy.
// The clever solution to my screen-scaling problem lies in PIXI.containers.
// Put every scene object in a container, then scale that to the window size.