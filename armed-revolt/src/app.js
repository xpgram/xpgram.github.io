
// Pixi engine settings
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;                // Gives us that pixel-y look.

// Global vars (which should be in a namespace)
const renderSize = [240, 160];      // Internal screen resolution (GBA).
const gridSize = [15, 10];          // The dimensions of the grid of 16x16 sprite tiles.
const tileSize = 16;                // The size in pixels of one grid cell or standard tile on screen.
var displaySize;                    // HTML frame-element resolution.
var scaleFactor;                    // Width only; I am assuming aspect ratio will be maintained with GBA.


// Create Pixi application
const app = new PIXI.Application();
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
//const tr_sand = PIXI.Texture.from('./src/assets/sprites/sand.png');
app.loader.add('sand', './src/assets/sprites/sand.png').load((loader, resources) => {
    for (let i = 0; i < (150); i++) {
        const sand = new PIXI.Sprite(resources.sand.texture);
        sand.x = (i % 15) * 16;
        sand.y = Math.floor(i / 15) * 16;
        scene.addChild(sand);
    }
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