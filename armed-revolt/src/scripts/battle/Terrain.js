//@ts-check

import { LowResTransform } from "../LowResTransform.js";
import { Common } from "../Common.js";
import { Game } from "../../main.js";

/**
 * Throws errors if the given list of neighboring tiles is non-standard.
 * @param {Terrain.Object} list 
 */
function verifyNeighboringTilesList(list) {
    if (list.length != 9)
        throw "Recieved a list of neighboring tiles of the wrong length.";
    // I would verify these are all Terrain.Objects, but... not without a big refactor.
    // Javascript is not really a typed language, you know.
}

/**
 * Terrain objects represent land and sea tiles on the map.  
 * Use via new Terrain.Type()  
 * Terrain objects may be compared with object.type and Terrain.Type
 */
export var Terrain = {
    /**
     * Blank, null-type terrain object.
     * @typedef TerrainObject
     */
    Object: class TerrainObject { },

    // start
    // {class}: class {class}Tile {
    //     _sprite;                       // This should be a sprite object, probably... I need to figure out how to link this, actually.
    //     _transform;                    // Used to describe this object's position in virtual space.

    //     get type() { return {class}Tile; }        // So we can compare tiles together.
    //     get landTile() { return {land}; }         // This, in theory, is the difference between land and sea meteors. Seemed like it had another purpose, too... generally this has to do with map-making and auto-tile-graphics.

    //     get name() { return "{name}"; }                  // The terrain type's full name.
    //     get shortName() { return {shortname}; }           // The terrain type's display name in compact visual situation.
    //     get defenseRating() { return {DEF}; }               // The star-rating defense boost this terrain provides inhabiting units.
    //     get generatesIncome() { return {income}; }         // Whether a team can gather funds from this terrain.
    //     get repairType() { return {repair}; }     // Whether this terrain repairs units (and which).
    //     get hidesUnits() { return {hideable}; }              // Whether this terrain hides units in Fog of War.
    //     get vision() { return {VIS}; }                      // How far into Fog of War this captured terrain "sees." Not necessary for any but capturable types.
    //     get description() { return "{desc}"; }

    //     {valuestub}
    //     _value = 0;
    //     get value() { return this._value; }             // Represents HP for Meteors, faction type for capturables, or anything else, really.
    //     set value(n) { this._value = Common.bindValue(n, 0, 99); }
    //     {end}

    //     /**
    //      * @param {MoveType} type The kind of travel mechanism being inquired about. Should be TravelType.Type
    //      * @return {number} The number of movement points required to move into this tile. A return of '0' should mean it is impossible to move into this tile space.
    //      */
    //     movementCost(type) {
    //         let costs = [{movementmatrix}];  // Inftry, Mech, TireA, TireB, Tread, Air, Ship, Transport
    //         return costs[type];
    //     }

    //     /**
    //      * @param {LowResTransform} pos The position on-map (in pixels) this tile object should occupy.
    //      * @param {*} neighbors a 3x3 grid containing this tile's nearest neighbor's types. Used to pick the right tile graphic or anim set.
    //      */
    //     constructor (pos, neighbors) {
    //         this._transform = pos;
    //         this._transform.object = this._sprite;
    //         this.update(neighbors);
    //     }

    //     /**
    //      * @param {TerrainObject[]} neighbors a 3x3 grid containing this tile's nearest neighbor's types. Used to pick the right tile grahic or anim set.
    //      */
    //     update (neighbors) {
    //         // stub
    //     }
    // },
    // end

    Plain: class PlainTile {
        _sprite = new PIXI.Sprite();

        /**
         * @type {LowResTransform}
         */
        get transform() { return this._transform; }
        set transform(obj) {
            if (obj instanceof LowResTransform)
                this._transform.copy(obj);
        }
        _transform;

        get type() { return PlainTile; }
        static get landTile() { return true; }

        /**
         * @param {LowResTransform} pos The position on-map (in pixels) this tile object should occupy.
         * @param {*} neighbors a 3x3 grid containing this tile's nearest neighbor's types. Used to pick the right tile graphic or anim set.
         */
        constructor (pos, neighbors) {
            this.update(neighbors);
            this._transform = pos;
            this._transform.object = this._sprite;  // all three layers to share the same location.
        }

        /**
         * Removes associated objects from containers and breaks references to allow the garbage collector to do its job.
         */
        destoy() {
            Game().app.stage.removeChild(this._sprite);
            // If this has a reference to its transform, but no object has a reference to this, will the GC still collect this and the transform?
        }

        /**
         * @param {TerrainObject[]} neighbors a 3x3 grid containing this tile's nearest neighbor's types. Used to pick the right tile graphic or anim set.
         */
        update (neighbors) {
            // TODO Move this to Terrain: static get sheet() { return ↓; }
            //let sheet = Game().app.loader.resources['./src/assets/sheets/normal-map-tiles-sm.json'].spritesheet;
            // Terrain.sheet.[whatever you need to do]

            // PIXI.Texture.from("") checks the loaded base textures, btw, so the sheet line above is probably unnecessary.

            /*
            I'm going to bed. Here's where I am:
            PIXI.Texture.from(loaded assets) is not working (..?)
            But PIXI.Sprite and PIXI.AnimatedSprite are.
            However, something is not properly linking them with their transforms.
            They're not moving into place.
            I should assert that transform.object actually gets filled.
            */

            let n = (Math.random() < 0.2) ? Math.floor(Math.random()*6)+1 : 0;
            this._sprite.texture = new PIXI.Texture.from('plain-'+n+'.png');

            // I'm testing right now; this (below) should not be here.
            Game().app.stage.addChild(this._sprite);
        }
    },

    Sea: class SeaTile {
        _sprite; // = new PIXI.AnimatedSprite();    ← I would do this, but a blank constructor is bugged or intentionally broken. Workarounds!
        _layer1 = new PIXI.Sprite();
        _layer2 = new PIXI.Sprite();
        _container = new PIXI.Container();
        _transform;

        shallow = false;    // Configured by the map system. Dictates whether to draw the shallow overlay.
        /*
        Here are the next steps:
        class Map
            Takes in serialized list of tiles
            Turns them into a list of objects (by asking Terrain to unserialize them)
            Tile constructors DO NOT start configuring graphics
            Map iterates over itself, tells sea tiles they are shallow if they are adjacent a land tile
            Map iterates over itself, tells all tiles to update their shape while providing their neighbors (objects, not types: no need for static methods)
            This is where sea will choose an overlay shallow graphic and a cliff graphic
        Write a Task Log with checkboxes an shit. If I write anymore of these in the code, I'm going to start losing them.
        There is one in LowResTransform, btw.
        */

        get type() { return SeaTile; }
        static get landTile() { return false; }

        /**
         * @param {LowResTransform} pos The position on-map (in pixels) this tile object should occupy.
         * @param {*} neighbors a 3x3 grid containing this tile's nearest neighbor's types. Used to pick the right tile graphic or anim set.
         */
        constructor (pos, neighbors) {
            this._transform = pos;

            // Setup base sea animation. (This needs to be here (because it's less wasteful) because I need all sea tiles to be in sync)
            let sheet = Game().app.loader.resources['NormalMapTilesheet'].spritesheet;
            this._sprite = new PIXI.AnimatedSprite(sheet.animations["sea"]);
            this._sprite.animationSpeed = 0.1;
            this._sprite.play();

            // Settings for layers
            this._layer1.blendMode = PIXI.BLEND_MODES.ADD;
            this._layer1.alpha = 0.06;

            // Blend texture shapes with surroundings
            this.updateShape(neighbors);

            // Build complete graphical object
            this._container.addChild(this._sprite);
            this._container.addChild(this._layer1);
            this._container.addChild(this._layer2);

            // Add to screen and link transform.
            Game().app.stage.addChild(this._container);
            this._transform.object = this._container;
        }

        /**
         * Disables children and dereferences for garbage collection.
         */
        destroy() {
            Game().app.stage.removeChild(this._container);
            this._transform.object = null;  // This should be .destroy()
        }

        /**
         * @param {TerrainObject[]} neighbors a 3x3 grid containing this tile's nearest neighbor's types. Used to pick the right tile grahic or anim set.
         */
        updateShape (neighbors) {
            verifyNeighboringTilesList(neighbors);

            let shallow = false;

            // Pick the right shallow waters overlay
            neighbors.forEach(tile => {
                if (tile.landTile) shallow = true;
            });

            if (shallow)
                this._layer1.texture = new PIXI.Texture.from('sea-shallow-0.png');
            else
                this._layer1.texture = null;

            // Pick the right sea-land border overlay
            let u = 0, r = 0, d = 0, l = 0;
            if (neighbors[1] === Terrain.Plain) u = 1;
            if (neighbors[3] === Terrain.Plain) l = 1;
            if (neighbors[5] === Terrain.Plain) r = 1;
            if (neighbors[7] === Terrain.Plain) d = 1;

            if (neighbors[0] === Terrain.Plain && l == 0 && u != 1) l = 2;
            if (neighbors[2] === Terrain.Plain && u == 0 && r != 1) u = 2;
            if (neighbors[6] === Terrain.Plain && d == 0 && l != 1) d = 2;
            if (neighbors[8] === Terrain.Plain && r == 0 && d != 1) r = 2;

            let n = `${u}${r}${d}${l}`;

            if (n != "0000")
                this._layer2.texture = new PIXI.Texture.from('sea-cliff-'+n+'.png');
            else
                this._layer2.texture = null;
        }
    },
}