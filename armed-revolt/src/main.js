
import {Battle as BattleState} from './scenes/battle.js';

// Pixi engine settings
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;                // Gives us that pixel-y look.

class GameInstance {

    scene = new PIXI.Container();

    display = {
        standardLength: 16,

        // Internal resolution (GBA)
        renderWidth: 240,
        renderHeight: 160,

        // External resolution, and the scale factor (ratio) between this and the above.
        scale: 1,
        get width() { return this.renderWidth * this.scale; },
        get height() { return this.renderHeight * this.scale; },

        // Callback function which resizes the canvas to the containing div element on window resize.
        resize: function(app) {
            this.scale = app.view.parentNode.clientWidth / this.renderWidth;    // Update internal to final resolution scale.
            app.renderer.resize(this.width, this.height);                       // Resize PIXI's renderer.
            app.stage.scale.x = app.stage.scale.y = this.scale;                 // Resize our 'upscaler.'
        },
    };

    // Reference to the PIXI application, complete with settings.
    app = new PIXI.Application({
        width: this.display.width,
        height: this.display.height,
        backgroundColor: 0x1099bb,
        autoResize: true,                           // Not sure what's "auto," but allows resizing of game window.
        resolution: window.devicePixelRatio || 1,   // Useful for mobile; measures screen pixel density.
    });

    // Handles for the game's major program states/modes.
    battleState = new BattleState(this);
    state;

    // Game's initializer.
    init() {
        // Add the canvas PIXI created to the DOM.
        document.querySelector('#gameframe').appendChild(this.app.view);

        // First screen resize, and add a listener to keep the size updated.
        this.display.resize(this.app);
        window.addEventListener('resize', () => {this.display.resize(this.app)});

        // Set the game's initial state.
        this.state = this.battleState;

        // Add the main loop to PIXI's ticker. This updates 60 times per second by default, unless your PC sucks.
        this.app.ticker.add((delta) => {this.loop(delta)});

        // Add the scene container (stage set) to the stage. Stage → Browser Window, Scene → Game Viewport
        this.app.stage.addChild(this.scene);
    }

    // Main update loop. Mostly runs whichever state is currently assigned.
    // This game-loop structure is a work in progress, by the way. I don't like it yet.
    loop(delta) {
        if (this.state.mustInitialize) {
            this.state.init();
            this.state.mustInitialize = false;
        }

        if (this.state.ready)
            this.state.update(delta);

        if (this.state.ending)
            this.state.end();
    }
}

// See a boy at the light like: "Run it."
var game = new GameInstance();
game.init();

/**
 * A singleton-like reference to our game instance.
 */
export function Game() { return game; }