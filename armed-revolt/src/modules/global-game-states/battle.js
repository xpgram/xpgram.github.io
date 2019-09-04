export class Battle {
    mustInitialize = true;  // Signals the game skeleton that this state needs to initalize before use.
    ready = false;          // The way I'm doing things currently, I need this silly signal that it's okay to call update()
    ending = false;         // Signals the game skeleton that this state is closing.
    game;                   // Reference to the global game object.

    scrollingText;
    point = new PIXI.Point();

    // Accepts a reference to the global game instance.
    constructor(game) {
        this.game = game;
    }

    // Used to load all required assets.
    load() {
        this.game.app.loader.reset();
        this.game.app.loader.add('sand', './src/assets/sprites/sand.png');
        this.game.app.loader.add('TecTacRegular', './src/assets/TecTacRegular.xml');
        this.game.app.loader.load();
    }

    // Called once before anything else.
    // I would make the skeleton call load() on this state object,
    // but it happens asynchronously and I can only run init() once it completes.
    // What I should probably do is list what needs loading somehow and then merge load and init together.
    // Although...
    // Wait. Why couldn't I just do this onComplete thing that I'm doing here in the game loop?
    // Well, I will make that change later.
    init() {
        this.load();
        this.game.app.loader.onComplete.add((loader, resources) => {

        // Places a grid of sand tiles on the screen to simulate earth.
        for (let i = 0; i < (150); i++) {
            const sand = new PIXI.Sprite(this.game.app.loader.resources.sand.texture);
            sand.pivot.x = sand.pivot.y = 4;    // I forgot I did this (to the textures: 24x24) to allow overlap.
            sand.x = (i % 15) * 16;
            sand.y = Math.floor(i / 15) * 16;
            // sand.tint = 0x555555;
            this.game.app.stage.addChild(sand);
        }

        // Creates a text object with my imported bitmap font.
        this.scrollingText = new PIXI.BitmapText(this.msgContent, { font: '8px TecTacRegular', align: 'left'});
        this.scrollingText.x = this.point.x = 32;
        this.scrollingText.y = this.point.y = 120;
        this.scrollingText.letterSpacing = 0;
        this.scrollingText.alpha = 0.95;
        for (let i = 0; i < this.scrollingText.children.length; i++)
            this.scrollingText.children[i].blendMode = PIXI.BLEND_MODES.SCREEN;
        this.game.app.stage.addChild(this.scrollingText);

        // Creates a mask to emulate FFI-style stuff
        let square = new PIXI.Graphics();
        square.beginFill(0xFFFFFF);
        square.drawRect(0,16, this.game.display.width, 96);
        square.endFill();
        this.game.app.stage.addChild(square);
        this.scrollingText.mask = square;

        this.ready = true;
    });
    }

    // Main program logic — the part that runs itself.
    update(delta) {
        this.point.y -= 0.08 * delta;
        this.scrollingText.y = Math.floor(this.point.y);
    }

    // Used to close data structures or invisible things maybe.
    end() {

    }

    msgContent = 'And so their quest began.\n\n\n' +
    'As the Four Warriors of Light,\n' +
    'they felt overwhelmed by\n' +
    'the great task destiny had\n' +
    'placed before them.\n\n\n' +
    'They did not even know the\n' +
    'true significance of the four\n' +
    'crystals they held in their hands...\n\n\n' +
    'The crystals that once,\n' +
    'long ago, held a light that\n' +
    'shone so brilliantly.\n\n\n' +
    'The time for their journey had come.\n\n\n' +
    'The time to break the... dark.\n' +
    'Or something.\nBreak \'em up. Hard.\n\n' +
    'Literally dead-like.\n\n\n' +
    'Look, stop asking me questions.\n\n\n' +
    'The time has come\n' +
    'for you to stop asking questions\n' +
    'before I lay the smack on your mom, okay?\n\n\n' +
    'I feel like you\'re not listening to me.\n\n\n' +
    'There\'s a guy named Garland,\n' +
    'you\'ll meet him later,\n' +
    'the Four Light Boys wanna\n' +
    'stab him up with the swords\n' +
    'they bought yesterday.\n\n' +
    'That\'s all you need to know.\n\n\n' +
    'Don\'t believe me?\n' +
    'Play the game then. I dare you.\n\n' +
    'That\'s exactly what\'s gonna happen.\n\n\n' +
    'It might take you forty hours\n\'cause you\'re an idiot.\n\n\n\n' +
    'This game is all about time loops, you know.\n\n' +
    'I should let you play the loop\nwhere you fail and die.\n\n\n' +
    'Garland\'s gonna toast your ass, dog.\n\n' +
    'That\'s what you get for playing the bad boy.\n\n' +
    'The bad boy is me. I will destroy you.\n\n' +
    'I know five different ju-jitsu moves.\n\n' +
    'One of them is called:\n' +
    '"Steven Seagal."\n\n' +
    'That\'s where I pretend to be Steven Seagal,\n' +
    'and then I kill you.\n\n' +
    'Except I won\'t \'cause that\'s illegal.\n\n' +
    'Ha! Got you, dude!\n' +
    'I was gonna pretend\nto be Steven Seagal on you, dog.\n\n' +
    'That\'s pretty scary.\n\n' +
    'You might wet your pants.\n\n' +
    'You better bring some standby pants\n' +
    'before I fricken' + String.fromCharCode(196) + ' on you, dude.\n\n' +
    'Yeah.\n\n' +
    'Check this out, dog:\n\n\n\n\n' +
    'You couldn\'t see it,\n' +
    'but I faked on you, bro.\n\n' +
    'Point your eyes somewhere else\n' +
    'before I do it again.\n\n' +
    'That\'s what it means to bring beef\n' +
    'to the meat party.\n\n\n\n' +
    'Oh yeah,\nyou\'re about to cross a bridge right now.';
}