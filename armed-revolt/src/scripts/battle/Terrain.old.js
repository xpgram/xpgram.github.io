//@ts-check

//import 'pixi.js';
import { LowResTransform } from "../LowResTransform.js";
import { Game } from "../../main.js";
import { ProximityBox } from "../ProximityBox.js";
import { MapLayers } from "./MapLayers.js";
import { UnitClass, MoveType } from "./common-types.js";

/**
 * Interface for classes that represent a terrain type on the battlefield.
 * @typedef {Object} Terrain
 * 
 * @property {LowResTransform} transform
 * 
 * @property {Function} movementCost Retrieves the number of movement points a movement type would need to spend to move into this tile type.
 * @param {MoveType} type A movement method for traversing the map.
 * @return {number} Movement points, or 0 if inhabiting this tile is impossible.
 */

/**
 * Terrain objects represent land and sea tiles on the map.  
 * Use via new Terrain.Type()  
 * Terrain objects may be compared with object.type and Terrain.Type
 * @namespace
 * 
 * @author Dei Valko
 * @version 0.0.0
 */
export var Terrain = {

    /**
     * A blank object used for bordering the game map.
     * Has sparse details to help the tileset system configure itself near the borders.
     * type Terrain
     */
    Object: class ObjectTile {
        get landTile() { return false; }
        shallowWaters = false;
    },

    // start
    /** type {Terrain} */
    Template: class TemplateTile {
        _layer0 = new PIXI.Sprite();
        _layer1 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return TemplateTile; }
        get serial() { return /*serial*/; }
        get landTile() { return /*land*/; }
        get shallowWaters() { return /*shallow*/; }

        get name() { return /*name*/; }
        get shortName() { return /*short name*/; }
        get defenseRating() { return /*defense*/; }
        get generatesIncome() { return /*income*/; }
        get repairType() { return /*repair*/; }
        get hideaway() { return /*hideaway*/; }
        get vision() { return /*vision*/; }
        get description() { return /*desc*/; }
        /*value*/
        movementCost(type) {
            let costs = [/*inf*/,/*mch*/,/*trA*/,/*trB*/,/*trd*/,/*air*/,/*shp*/,/*trp*/];
            return costs[type];
        }

        constructor(transform = null) {
            this._transform = transform || new LowResTransform();

            let layers = [];
            layers.push(this._layer0);
            layers.push(this._layer1);
            this._transform.object = layers;

            MapLayers['bottom'].addChild(this._layer0);
            MapLayers['bottom'].addChild(this._layer1);
        }

        destroy() {
            MapLayers['bottom'].removeChild(this._layer0);
            MapLayers['bottom'].removeChild(this._layer1);

            this._layer0.destroy();
            this._layer1.destroy();
            this._transform.destroy();
        }

        orientSelf(neighbors) {
            // stub
        }
    },
    // end

    Plain: class PlainTile {
        _sprite = new PIXI.Sprite();

        /**
         * @type {LowResTransform}
         */
        get transform() { return this._transform; }
        set transform(obj) { this._transform.copy(obj); }
        _transform;

        get type() { return PlainTile; }
        get landTile() { return true; }
        get shallowWaters() { return true; }

        /**
         * @param {LowResTransform} pos The position on-map (in pixels) this tile object should occupy.
         */
        constructor (pos) {
            this._transform = pos;
            this._transform.object = this._sprite;  // all three layers to share the same location.
            MapLayers['bottom'].addChild(this._sprite);
        }

        /**
         * Removes associated objects from containers and breaks references to allow the garbage collector to do its job.
         */
        destroy() {
            MapLayers['bottom'].removeChild(this._sprite);
            // If this has a reference to its transform, but no object has a reference to this, will the GC still collect this and the transform?
        }

        /**
         * @param {ProximityBox} neighbors a 3x3 grid containing this tile's nearest neighbor's types. Used to pick the right tile graphic or anim set.
         */
        orientSelf(neighbors) {
            let n = (Math.random() < 0.3) ? Math.floor(Math.random()*6)+1 : 0;
            this._sprite.texture = PIXI.Texture.from('plain-'+n+'.png');
        }
    },

    Sea: class SeaTile {
        _sprite; // = new PIXI.AnimatedSprite();    ← I would do this, but a blank constructor is bugged or intentionally broken. Workarounds!
        _layer1 = new PIXI.Sprite();
        _layer2 = new PIXI.Sprite();
        _transform;

        shallowWaters = false;    // Configured by the map system. Dictates whether to draw the shallow overlay.

        get type() { return SeaTile; }
        get landTile() { return false; }

        /**
         * @param {LowResTransform} pos The position on-map (in pixels) this tile object should occupy.
         */
        constructor (pos) {
            this._transform = pos;

            // Setup base sea animation. (This needs to be here (because it's less wasteful) because I need all sea tiles to be in sync)
            let sheet = Game().app.loader.resources['NormalMapTilesheet'].spritesheet;
            this._sprite = new PIXI.AnimatedSprite(sheet.animations["sea"]);
            //this._sprite.tint = 0xA0D0FF;
            this._sprite.animationSpeed = 0.1;
            this._sprite.play();

            // Settings for layers
            this._layer1.blendMode = PIXI.BLEND_MODES.ADD;
            this._layer1.alpha = 0.1;

            // Build complete graphical object
            let image = [];
            image.push(this._sprite);
            image.push(this._layer1); // TODO: I may want to shift this down 2 to 4 px, but I can't until I add layers to the stage.
            image.push(this._layer2);

            // Add to screen and link transform.
            MapLayers['bottom'].addChild(this._sprite);
            MapLayers['bottom'].addChild(this._layer1);
            MapLayers['bottom'].addChild(this._layer2);
            this._transform.object = image;
        }

        /**
         * Disables children and dereferences for garbage collection.
         */
        destroy() {
            Game().app.stage.removeChild(this._container);
            this._transform.object = null;  // This should be .destroy()
        }

        /**
         * @param {ProximityBox} neighbors a 3x3 grid containing this tile's nearest neighbor's types. Used to pick the right tile grahic or anim set.
         */
        orientSelf(neighbors) {
            this._layer2.texture = null;
            this._layer1.texture = null;

            // Pick the right sea-shallow overlay

            // Build a new proximity grid, changing all the values to shallow waters booleans.
            // Do this so that Terrain.Object's at the edge can reflect whatever the center is.
            if (this.shallowWaters) {
                let ul = 0, ur = 0, dl = 0, dr = 0;
                if (neighbors.up.shallowWaters && neighbors.upleft.shallowWaters && neighbors.left.shallowWaters)
                    ul = 1;
                if (neighbors.up.shallowWaters && neighbors.upright.shallowWaters && neighbors.right.shallowWaters)
                    ur = 1;
                if (neighbors.down.shallowWaters && neighbors.downleft.shallowWaters && neighbors.left.shallowWaters)
                    dl = 1;
                if (neighbors.down.shallowWaters && neighbors.downright.shallowWaters && neighbors.right.shallowWaters)
                    dr = 1;

                let n = `${ur}${dr}${dl}${ul}`;

                if (n != "0000")
                    this._layer1.texture = PIXI.Texture.from('sea-shallow-'+n+'.png');
            }

            // Pick the right sea-land border overlay
            let u = 0, r = 0, d = 0, l = 0;
            if (neighbors.up.landTile) u = 1;
            if (neighbors.down.landTile) d = 1;
            if (neighbors.left.landTile) l = 1;
            if (neighbors.right.landTile) r = 1;

            if (neighbors.upleft.landTile && l == 0 && u != 1) l = 2;
            if (neighbors.upright.landTile && u == 0 && r != 1) u = 2;
            if (neighbors.downleft.landTile && d == 0 && l != 1) d = 2;
            if (neighbors.downright.landTile && r == 0 && d != 1) r = 2;

            let n = `${u}${r}${d}${l}`;

            if (n != "0000")
                this._layer2.texture = PIXI.Texture.from('sea-cliff-'+n+'.png');
        }
    },

    Wood: class WoodTile {
        _layer0 = new PIXI.Sprite();
        _layer1 = new PIXI.Sprite();
        _container = new PIXI.Container();

        /**
         * @type {LowResTransform}
         */
        get transform() { return this._transform; }
        set transform(obj) {
            if (obj instanceof LowResTransform)
                this._transform.copy(obj);
        }
        _transform;

        get type() { return WoodTile; }
        get landTile() { return true; }
        get shallowWaters() { return true; }

        /**
         * @param {LowResTransform} pos The position on-map (in pixels) this tile object should occupy.
         */
        constructor (pos) {
            this._transform = pos;
            this._transform.position.z = this._transform.position.y - this._transform.position.x;
            //this._transform.object = this._container;
            this._transform.object = this._layer0;
            this._transform.object = this._layer1;

            MapLayers['bottom'].addChild(this._layer0);
            MapLayers['bottom'].addChild(this._layer1);
        }

        /**
         * Removes associated objects from containers and breaks references to allow the garbage collector to do its job.
         */
        destroy() {
            Game().app.stage.removeChild(this._container);
            this._transform.destroy();
            this._layer0.destroy();
            this._layer1.destroy();
            this._container.destroy();  // I think I can just destroy(true) or something to break the container and its children
        }

        /**
         * @param {ProximityBox} neighbors a 3x3 grid containing this tile's nearest neighbor's types. Used to pick the right tile graphic or anim set.
         */
        orientSelf(neighbors) {
            this._layer0.texture = PIXI.Texture.from('plain-0.png');

            let l = (neighbors.left.type == Terrain.Wood) ? 1 : 0;
            let r = (neighbors.right.type == Terrain.Wood) ? 1 : 0;
            this._layer1.texture = PIXI.Texture.from(`wood-${l}${r}.png`);
        }
    },

    Mountain: class MountainTile {
        _layer0 = new PIXI.Sprite();
        _layer1 = new PIXI.Sprite();
        _layer2 = new PIXI.Sprite();
        _container = new PIXI.Container();

        /**
         * @type {LowResTransform}
         */
        get transform() { return this._transform; }
        set transform(obj) {
            if (obj instanceof LowResTransform)
                this._transform.copy(obj);
        }
        _transform;

        get type() { return MountainTile; }
        get landTile() { return true; }
        get shallowWaters() { return true; }

        /**
         * @param {LowResTransform} pos The position on-map (in pixels) this tile object should occupy.
         */
        constructor (pos) {
            this._layer1.anchor.y = 0.5;

            this._container.addChild(this._layer0);
            this._container.addChild(this._layer1);
            this._container.addChild(this._layer2);

            this._transform = pos;
            this._transform.object = this._layer0;  // Right... objects can only be child of one thing.
            this._transform.object = this._layer1;  // I'll need to figure out how to share transforms then—some way besides pixi containers.
            this._transform.position.z = this._transform.position.y - this._transform.position.x; // Affect layer1/2, just doesn't work.
            this._transform.object = this._layer2;  // I think I can get LowResTransform to accept a list of targets.

            MapLayers['bottom'].addChild(this._layer0);
            MapLayers['top'].addChild(this._layer1);
            MapLayers['top'].addChild(this._layer2);
        }

        /**
         * Removes associated objects from containers and breaks references to allow the garbage collector to do its job.
         */
        destroy() {
            Game().app.stage.removeChild(this._container);
            this._transform.destroy();
            this._layer0.destroy();
            this._layer1.destroy();
            this._layer2.destroy();
            // If this has a reference to its transform, but no object has a reference to this, will the GC still collect this and the transform?
        }

        /**
         * @param {ProximityBox} neighbors a 3x3 grid containing this tile's nearest neighbor's types. Used to pick the right tile graphic or anim set.
         */
        orientSelf(neighbors) {
            this._layer0.texture = PIXI.Texture.from('plain-0.png');

            let l = (neighbors.left.type == Terrain.Mountain) ? 1 : 0;
            let r = (neighbors.right.type == Terrain.Mountain) ? 1 : 0;
            this._layer1.texture = PIXI.Texture.from(`mountain-${l}${r}.png`);

            this._layer2.texture = PIXI.Texture.from('shadow.png');
            this._layer2.alpha = 0.3;
        }
    },
}