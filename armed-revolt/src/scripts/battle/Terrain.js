//@ts-check

//import 'pixi.js';
import { LowResTransform } from "../LowResTransform.js";
import { Game } from "../../main.js";
import { ProximityBox } from "../ProximityBox.js";
import { MapLayers } from "./MapLayers.js";
import { UnitClass, MoveType } from "./common-types.js";

function plainVariant() {
    let n = (Math.random() < 0.3) ? Math.floor(Math.random()*6)+1 : 0;
    return `${n}`;
}

function tileVariant(num) {
    let n = Math.floor(Math.random()*num);
    return `${n}`;
}

function seaCliffVariant(neighbors) {
    // 0 = none, 1 = land border, 2 = border corner
    //  l=2 u=1 u=2
    //  l=1 src r=1
    let u, r, d, l;

    // If side is adjacent to land, set side.
    u = (neighbors.up.landTile) ? 1 : 0;
    r = (neighbors.right.landTile) ? 1 : 0;
    d = (neighbors.down.landTile) ? 1 : 0;
    l = (neighbors.left.landTile) ? 1 : 0;

    // If counter-clockwise is empty, and clockwise isn't adjacent to land, set corner.
    u = (neighbors.upright.landTile && u == 0 && r != 1)   ? 2 : u;
    r = (neighbors.downright.landTile && r == 0 && d != 1) ? 2 : r;
    d = (neighbors.downleft.landTile && d == 0 && l != 1)  ? 2 : d;
    l = (neighbors.upleft.landTile && l == 0 && u != 1)    ? 2 : l;

    return `${u}${r}${d}${l}`;
}

function seaShallowVariant(neighbors) {
    let n = {
        up:        neighbors.up.shallowWaters || neighbors.up.landTile,
        upleft:    neighbors.upleft.shallowWaters || neighbors.upleft.landTile,
        upright:   neighbors.upright.shallowWaters || neighbors.upright.landTile,
        down:      neighbors.down.shallowWaters || neighbors.down.landTile,
        downleft:  neighbors.downleft.shallowWaters || neighbors.downleft.landTile,
        downright: neighbors.downright.shallowWaters || neighbors.downright.landTile,
        left:      neighbors.left.shallowWaters || neighbors.left.landTile,
        right:     neighbors.right.shallowWaters || neighbors.right.landTile
    }

    // 0 = deep, 1 = shallow
    // ul=1 --- ur=1
    // ---  src ---
    let ur, dr, dl, ul;

    // If the corner and two adjacent sides are shallow, the corner is 'full'
    ur = (n.up && n.upright && n.right)     ? 1 : 0;
    dr = (n.down && n.downright && n.right) ? 1 : 0;
    dl = (n.down && n.downleft && n.left)   ? 1 : 0;
    ul = (n.up && n.upleft && n.left)       ? 1 : 0;

    return `${ur}${dr}${dl}${ul}`;
}

function beachVariant(neighbors) {
    let u, r, d, l;

    u = (neighbors.up.landTile) ? 1 : 0;
    r = (neighbors.right.landTile) ? 1 : 0;
    d = (neighbors.down.landTile) ? 1 : 0;
    l = (neighbors.left.landTile) ? 1 : 0;
    
    u = (neighbors.up.type == Terrain.Beach) ? 2 : u;
    r = (neighbors.right.type == Terrain.Beach) ? 2 : r;
    d = (neighbors.down.type == Terrain.Beach) ? 2 : d;
    l = (neighbors.left.type == Terrain.Beach) ? 2 : l;

    return `${u}${r}${d}${l}`;
}

function fourDirectionalVariant(neighbors, type1, type2 = null) {
    // 0 = none, 1 = same type, 2 = alt type
    // l=2 u=1 u=2
    // l=1 src r=1
    let u = 0, r = 0, d = 0, l = 0;

    // If side is adjacent to type1, set 1
    u = (neighbors.up.type == type1)    ? 1 : 0;
    r = (neighbors.right.type == type1) ? 1 : 0;
    d = (neighbors.down.type == type1)  ? 1 : 0;
    l = (neighbors.left.type == type1)  ? 1 : 0;

    // If side is adjacent to type2, set 1  (entirely because rivers/sea)
    if (type2) {
        u = (neighbors.up.type == type2)    ? 1 : 0;
        r = (neighbors.right.type == type2) ? 1 : 0;
        d = (neighbors.down.type == type2)  ? 1 : 0;
        l = (neighbors.left.type == type2)  ? 1 : 0;
    }

    return `${u}${r}${d}${l}`;
}

function lineDirectionalVariant(neighbors, type) {
    // 0 = none, 1 = same type
    // l=1 src r=1
    let l, r;

    // If adjacent to the same tile type, set 1
    l = (neighbors.left.type == type)  ? 1 : 0;
    r = (neighbors.right.type == type) ? 1 : 0;

    return `${l}${r}`;
}

/**
 * Terrain objects represent land and sea tiles on the map.  
 * Use via new Terrain.Type()  
 * Terrain objects may be compared with object.type and Terrain.Type
 * @namespace
 * 
 * @author Dei Valko
 * @version 0.1.0
 */
export var Terrain = {

    /**
     * Interface for classes that represent a terrain type on the battlefield.
     * (This doesn't work yet, btw)
     * @typedef {Object} Tfderrain
     * 
     * @property {LowResTransform} transform
     * 
     * @property {Function} movementCost Retrieves the number of movement points a movement type would need to spend to move into this tile type.
     * @param {MoveType} type A movement method for traversing the map.
     * @return {number} Movement points, or 0 if inhabiting this tile is impossible.
     */

    /**
     * @param {ProximityBox} proxBox 
     * @returns {boolean} True iff a beach can be placed in this neighborly situation.
     */
    beachLegal(proxBox) {
        // No isolated corners
        if (proxBox.upright.landTile && !proxBox.up.landTile && !proxBox.right.landTile ||
            proxBox.downright.landTile && !proxBox.down.landTile && !proxBox.right.landTile ||
            proxBox.downleft.landTile && !proxBox.down.landTile && !proxBox.left.landTile ||
            proxBox.upleft.landTile && !proxBox.up.landTile && !proxBox.left.landTile)
            return false;
        // No opposing sides
        if (proxBox.right.landTile && proxBox.left.landTile && !proxBox.up.landTile && !proxBox.down.landTile ||
            proxBox.up.landTile && proxBox.down.landTile && !proxBox.right.landTile && !proxBox.left.landTile)
            return false;
        // No all-four-sides
        if (proxBox.up.landTile && proxBox.right.landTile && proxBox.down.landTile && proxBox.left.landTile)
            return false;

        // Must have at least 1 side
        return  (proxBox.up.landTile || proxBox.right.landTile || proxBox.down.landTile || proxBox.left.landTile);
    },

    /**
     * A blank object used for bordering the game map.
     * Has sparse details to help the tileset system configure itself near the borders.
     * type {Terrain}
     */
    Void: class VoidTile {
        get landTile() { return false; }
        static landTile = false;
        shallowWaters = false;
    },

    /** type {Terrain} */
    Plain: class PlainTile {
        _layer0 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return PlainTile; }
        get serial() { return 0; }
        get landTile() { return true; }
        static landTile = true;
        get shallowWaters() { return false; }

        get name() { return "Plain"; }
        get shortName() { return "Plain"; }
        get defenseRating() { return 1; }
        get generatesIncome() { return false; }
        get repairType() { return UnitClass.None; }
        get hideaway() { return false; }
        get vision() { return 0; }
        get description() { return "Plains are easily traveled but offer little defense."; }
        
        movementCost(type) {
            let costs = [1,1,2,1,1,1,0,0];
            return costs[type];
        }

        constructor(transform = null) {
            this._transform = transform || new LowResTransform();
            this._transform.object = this._layer0;

            MapLayers['bottom'].addChild(this._layer0);
        }

        destroy() {
            MapLayers['bottom'].removeChild(this._layer0);

            this._layer0.destroy();
            this._transform.destroy();
        }

        orientSelf(neighbors) {
            let v = plainVariant();
            this._layer0.texture = PIXI.Texture.from(`plain-${v}.png`);
        }
    },

    /** type {Terrain} */
    Road: class RoadTile {
        _layer0 = new PIXI.Sprite();
        _layer1 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return RoadTile; }
        get serial() { return 1; }
        get landTile() { return true; }
        static landTile = true;
        get shallowWaters() { return false; }

        get name() { return "Road"; }
        get shortName() { return "Road"; }
        get defenseRating() { return 0; }
        get generatesIncome() { return false; }
        get repairType() { return UnitClass.None; }
        get hideaway() { return false; }
        get vision() { return 0; }
        get description() { return "Well-surfaced roads provide optimum mobility, but little cover."; }
        
        movementCost(type) {
            let costs = [1,1,1,1,1,1,0,0];
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
            let v = plainVariant();
            this._layer0.texture = PIXI.Texture.from(`plain-${v}.png`);

            v = fourDirectionalVariant(neighbors, RoadTile);
            this._layer1.texture = PIXI.Texture.from(`road-${v}.png`)
        }
    },

    /** type {Terrain} */
    Wood: class WoodTile {
        _layer0 = new PIXI.Sprite();
        _layer1 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return WoodTile; }
        get serial() { return 2; }
        get landTile() { return true; }
        static landTile = true;
        get shallowWaters() { return false; }

        get name() { return "Wood"; }
        get shortName() { return "Wood"; }
        get defenseRating() { return 3; }
        get generatesIncome() { return false; }
        get repairType() { return UnitClass.None; }
        get hideaway() { return true; }
        get vision() { return 0; }
        get description() { return "Woods provide /hiding places/ for ground units in Fog of War."; }
        
        movementCost(type) {
            let costs = [1,1,3,3,2,1,0,0];
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
            let v = plainVariant();
            this._layer0.texture = PIXI.Texture.from(`plain-${v}.png`);

            v = lineDirectionalVariant(neighbors, WoodTile);
            this._layer1.texture = PIXI.Texture.from(`wood-${v}.png`)
        }
    },

    /** type {Terrain} */
    Mountain: class MountainTile {
        _layer0 = new PIXI.Sprite();
        _layer1 = new PIXI.Sprite();
        _layer2 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return MountainTile; }
        get serial() { return 3; }
        get landTile() { return true; }
        static landTile = true;
        get shallowWaters() { return false; }

        get name() { return "Mountain"; }
        get shortName() { return "Mtn"; }
        get defenseRating() { return 4; }
        get generatesIncome() { return false; }
        get repairType() { return UnitClass.None; }
        get hideaway() { return false; }
        get vision() { return 0; }
        get description() { return "In Fog of War, these add 3 to the /vision/ of infantry and mech units."; }
        
        movementCost(type) {
            let costs = [2,1,0,0,0,1,0,0];
            return costs[type];
        }

        constructor(transform = null) {
            this._layer1.anchor.y = 0.5;
            this._layer2.alpha = 0.25;

            this._transform = transform || new LowResTransform();

            let layers = [];
            layers.push(this._layer0);
            layers.push(this._layer1);
            layers.push(this._layer2);
            this._transform.object = layers;

            MapLayers['bottom'].addChild(this._layer0);
            MapLayers['top'].addChild(this._layer1);
            MapLayers['top'].addChild(this._layer2);
        }

        destroy() {
            MapLayers['bottom'].removeChild(this._layer0);
            MapLayers['top'].removeChild(this._layer1);
            MapLayers['top'].removeChild(this._layer2);

            this._layer0.destroy();
            this._layer1.destroy();
            this._layer2.destroy();
            this._transform.destroy();
        }

        orientSelf(neighbors) {
            this._layer0.texture = PIXI.Texture.from(`plain-0.png`);

            let v = lineDirectionalVariant(neighbors, MountainTile);
            this._layer1.texture = PIXI.Texture.from(`mountain-${v}.png`)

            this._layer2.texture = PIXI.Texture.from(`shadow.png`);
        }
    },

    /** type {Terrain} */
    Wasteland: class WastelandTile {
        _layer0 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return WastelandTile; }
        get serial() { return 4; }
        get landTile() { return true; }
        static landTile = true;
        get shallowWaters() { return false; }

        get name() { return "Wasteland"; }
        get shortName() { return "Wstlnd"; }
        get defenseRating() { return 2; }
        get generatesIncome() { return false; }
        get repairType() { return UnitClass.None; }
        get hideaway() { return false; }
        get vision() { return 0; }
        get description() { return "This impairs mobility for all but infantry and mech units."; }
        
        movementCost(type) {
            let costs = [1,1,3,3,2,1,0,0];
            return costs[type];
        }

        constructor(transform = null) {
            this._transform = transform || new LowResTransform();
            this._transform.object = this._layer0;

            MapLayers['bottom'].addChild(this._layer0);
        }

        destroy() {
            MapLayers['bottom'].removeChild(this._layer0);

            this._layer0.destroy();
            this._transform.destroy();
        }

        orientSelf(neighbors) {
            let v = tileVariant(6);
            this._layer0.texture = PIXI.Texture.from(`wasteland-${v}.png`);
        }
    },

    /** type {Terrain} */
    Ruins: class RuinsTile {
        _layer0 = new PIXI.Sprite();
        _layer1 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return RuinsTile; }
        get serial() { return 5; }
        get landTile() { return true; }
        static landTile = true;
        get shallowWaters() { return false; }

        get name() { return "Ruins"; }
        get shortName() { return "Ruins"; }
        get defenseRating() { return 1; }
        get generatesIncome() { return false; }
        get repairType() { return UnitClass.None; }
        get hideaway() { return true; }
        get vision() { return 0; }
        get description() { return "Ruins provide /hiding places/ for ground units during Fog of War."; }
        
        movementCost(type) {
            let costs = [1,1,2,1,1,1,0,0];
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
            let v = plainVariant();
            this._layer0.texture = PIXI.Texture.from(`plain-${v}.png`);

            v = tileVariant(3);
            this._layer1.texture = PIXI.Texture.from(`ruin-${v}.png`);
        }
    },

    /** type {Terrain} */
    Bridge: class BridgeTile {
        _layer0 = new PIXI.Sprite();
        _layer1 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return BridgeTile; }
        get serial() { return 6; }
        get landTile() { return true; }
        static landTile = true;
        get shallowWaters() { return false; }

        get name() { return "Bridge"; }
        get shortName() { return "Bridge"; }
        get defenseRating() { return 0; }
        get generatesIncome() { return false; }
        get repairType() { return UnitClass.None; }
        get hideaway() { return false; }
        get vision() { return 0; }
        get description() { return "Naval units can't pass under river bridges."; }
        
        movementCost(type) {
            let costs = [1,1,1,1,1,1,0,0];
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
            // Bridge will be tough
            // If land tile: use river
            // If sea: use cliffs and shallows and stuff.
            // How does DoR do it? What I'm doing seems harder than just... somehow putting
            // a bridge ~over~ a sea/river tile. I dunno, man.
        }
    },

    /** type {Terrain} */
    River: class RiverTile {
        _layer0 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return RiverTile; }
        get serial() { return 7; }
        get landTile() { return true; }
        static landTile = true;
        get shallowWaters() { return false; }

        get name() { return "River"; }
        get shortName() { return "River"; }
        get defenseRating() { return 0; }
        get generatesIncome() { return false; }
        get repairType() { return UnitClass.None; }
        get hideaway() { return false; }
        get vision() { return 0; }
        get description() { return "Only foot soldiers can ford rivers."; }
        
        movementCost(type) {
            let costs = [2,1,0,0,0,1,0,0];
            return costs[type];
        }

        constructor(transform = null) {
            this._transform = transform || new LowResTransform();
            this._transform.object = this._layer0;

            MapLayers['bottom'].addChild(this._layer0);
        }

        destroy() {
            MapLayers['bottom'].removeChild(this._layer0);

            this._layer0.destroy();
            this._transform.destroy();
        }

        orientSelf(neighbors) {
            let v = fourDirectionalVariant(neighbors, RiverTile, Terrain.SeaTile);
            this._layer0.texture = PIXI.Texture.from(`river-${v}.png`);
        }
    },

    /** type {Terrain} */
    Sea: class SeaTile {
        _layer0;
        _layer1 = new PIXI.Sprite();
        _layer2 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return SeaTile; }
        get serial() { return 8; }
        get landTile() { return false; }
        static landTile = false;
        shallowWaters = false;

        get name() { return "Sea"; }
        get shortName() { return "Sea"; }
        get defenseRating() { return 0; }
        get generatesIncome() { return false; }
        get repairType() { return UnitClass.None; }
        get hideaway() { return false; }
        get vision() { return 0; }
        get description() { return "Naval and air forces have good mobility on calm seas."; }
        
        movementCost(type) {
            let costs = [0,0,0,0,0,1,1,1];
            return costs[type];
        }

        constructor(transform = null) {
            let sheet = Game().app.loader.resources['NormalMapTilesheet'].spritesheet;
            this._layer0 = new PIXI.AnimatedSprite(sheet.animations["sea"]);
            this._layer0.animationSpeed = 0.1;
            this._layer0.play();

            this._layer1.blendMode = PIXI.BLEND_MODES.ADD;
            this._layer1.alpha = 0.1;

            this._transform = transform || new LowResTransform();

            let layers = [];
            layers.push(this._layer0);
            layers.push(this._layer1);
            layers.push(this._layer2);
            this._transform.object = layers;

            MapLayers['bottom'].addChild(this._layer0);
            MapLayers['bottom'].addChild(this._layer1);
            MapLayers['bottom'].addChild(this._layer2);
        }

        destroy() {
            MapLayers['bottom'].removeChild(this._layer0);
            MapLayers['bottom'].removeChild(this._layer1);
            MapLayers['bottom'].removeChild(this._layer2);

            this._layer0.destroy();
            this._layer1.destroy();
            this._layer2.destroy();
            this._transform.destroy();
        }

        orientSelf(neighbors) {
            let v;

            if (this.shallowWaters) {
                v = seaShallowVariant(neighbors);
                if (v != "0000")
                    this._layer1.texture = PIXI.Texture.from(`sea-shallow-${v}.png`);
            }

            v = seaCliffVariant(neighbors);
            if (v != "0000")
                this._layer2.texture = PIXI.Texture.from(`sea-cliff-${v}.png`);
        }
    },

    /** type {Terrain} */
    Beach: class BeachTile {
        _layer0;
        _layer1 = new PIXI.Sprite();
        _layer2 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return BeachTile; }
        get serial() { return 9; }
        get landTile() { return false; }
        static landTile = false;
        get shallowWaters() { return true; }

        get name() { return "Beach"; }
        get shortName() { return "Beach"; }
        get defenseRating() { return 0; }
        get generatesIncome() { return false; }
        get repairType() { return UnitClass.None; }
        get hideaway() { return false; }
        get vision() { return 0; }
        get description() { return "Landers and gunboats can /load and drop/ units here."; }
        
        movementCost(type) {
            let costs = [1,1,2,2,1,1,0,1];
            return costs[type];
        }

        constructor(transform = null) {
            let sheet = Game().app.loader.resources['NormalMapTilesheet'].spritesheet;

            this._layer0 = new PIXI.AnimatedSprite(sheet.animations["sea"]);
            this._layer0.animationSpeed = 0.1;
            this._layer0.play();

            this._layer1.texture = PIXI.Texture.from('sea-shallow-1111.png');
            this._layer1.blendMode = PIXI.BLEND_MODES.ADD;
            this._layer1.alpha = 0.1;

            this._transform = transform || new LowResTransform();

            let layers = [];
            layers.push(this._layer0);
            layers.push(this._layer1);
            layers.push(this._layer2);
            this._transform.object = layers;

            MapLayers['bottom'].addChild(this._layer0);
            MapLayers['bottom'].addChild(this._layer1);
            MapLayers['bottom'].addChild(this._layer2);
        }

        destroy() {
            MapLayers['bottom'].removeChild(this._layer0);
            MapLayers['bottom'].removeChild(this._layer1);
            MapLayers['bottom'].removeChild(this._layer2);

            this._layer0.destroy();
            this._layer1.destroy();
            this._layer2.destroy();
            this._transform.destroy();
        }

        orientSelf(neighbors) {
            let v = beachVariant(neighbors);
            this._layer2.texture = PIXI.Texture.from(`beach-${v}.png`);
        }
    },

    /** type {Terrain} */
    RoughSea: class RoughSeaTile {
        _layer0;
        _layer1;
        _layer2 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return RoughSeaTile; }
        get serial() { return 10; }
        get landTile() { return false; }
        static landTile = false;
        shallowWaters = false;

        get name() { return "Rough Sea"; }
        get shortName() { return "Rough"; }
        get defenseRating() { return 2; }
        get generatesIncome() { return false; }
        get repairType() { return UnitClass.None; }
        get hideaway() { return false; }
        get vision() { return 0; }
        get description() { return "Slows the movement of naval units, but air units are not affected."; }
        
        movementCost(type) {
            let costs = [0,0,0,0,0,1,2,2];
            return costs[type];
        }

        constructor(transform = null) {
            let sheet = Game().app.loader.resources['NormalMapTilesheet'].spritesheet;

            this._layer0 = new PIXI.AnimatedSprite(sheet.animations["sea"]);
            this._layer0.animationSpeed = 0.1;
            this._layer0.play();

            this._layer1 = new PIXI.AnimatedSprite(sheet.animations["rough"]);
            this._layer1.animationSpeed = 0.1;
            this._layer1.play();

            this._layer2.blendMode = PIXI.BLEND_MODES.ADD;
            this._layer2.alpha = 0.1;

            this._transform = transform || new LowResTransform();

            let layers = [];
            layers.push(this._layer0);
            layers.push(this._layer1);
            layers.push(this._layer2);
            this._transform.object = layers;

            MapLayers['bottom'].addChild(this._layer0);
            MapLayers['bottom'].addChild(this._layer1);
            MapLayers['bottom'].addChild(this._layer2);
        }

        destroy() {
            MapLayers['bottom'].removeChild(this._layer0);
            MapLayers['bottom'].removeChild(this._layer1);
            MapLayers['bottom'].removeChild(this._layer2);

            this._layer0.destroy();
            this._layer1.destroy();
            this._layer2.destroy();
            this._transform.destroy();
        }

        orientSelf(neighbors) {
            if (this.shallowWaters) {
                let v = seaShallowVariant(neighbors);
                if (v != "0000")
                    this._layer2.texture = PIXI.Texture.from(`sea-shallow-${v}.png`);
            }
        }
    },

    /** type {Terrain} */
    Mist: class MistTile {
        _layer0;
        _layer1 = new PIXI.Sprite();
        _layer2 = new PIXI.Sprite();
        _layer3 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return MistTile; }
        get serial() { return 11; }
        get landTile() { return false; }
        static landTile = false;
        shallowWaters = false;

        get name() { return "Mist"; }
        get shortName() { return "Mist"; }
        get defenseRating() { return 1; }
        get generatesIncome() { return false; }
        get repairType() { return UnitClass.None; }
        get hideaway() { return true; }
        get vision() { return 0; }
        get description() { return "Mist provides ideal /hiding places/ for naval units in Fog of War."; }
        
        movementCost(type) {
            let costs = [0,0,0,0,0,1,1,1];
            return costs[type];
        }

        constructor(transform = null) {
            let sheet = Game().app.loader.resources['NormalMapTilesheet'].spritesheet;

            this._layer0 = new PIXI.AnimatedSprite(sheet.animations['sea']);
            this._layer0.animationSpeed = 0.1;
            this._layer0.play();

            this._layer1.blendMode = PIXI.BLEND_MODES.ADD;
            this._layer1.alpha = 0.1;

            this._layer3.anchor.y = 0.5;
            this._layer3.alpha = 0.75;

            this._transform = transform || new LowResTransform();

            let layers = [];
            layers.push(this._layer0);
            layers.push(this._layer1);
            layers.push(this._layer2);
            layers.push(this._layer3);
            this._transform.object = layers;

            MapLayers['bottom'].addChild(this._layer0);
            MapLayers['bottom'].addChild(this._layer1);
            MapLayers['bottom'].addChild(this._layer2);
            MapLayers['top'].addChild(this._layer3);
        }

        destroy() {
            MapLayers['bottom'].removeChild(this._layer0);
            MapLayers['bottom'].removeChild(this._layer1);
            MapLayers['bottom'].removeChild(this._layer2);
            MapLayers['top'].removeChild(this._layer3);

            this._layer0.destroy();
            this._layer1.destroy();
            this._layer2.destroy();
            this._layer3.destroy();
            this._transform.destroy();
        }

        orientSelf(neighbors) {
            let v;

            if (this.shallowWaters) {
                v = seaShallowVariant(neighbors);
                if (v != "0000")
                    this._layer1.texture = PIXI.Texture.from(`sea-shallow-${v}.png`);
            }

            v = seaCliffVariant(neighbors);
            if (v != "0000")
                this._layer2.texture = PIXI.Texture.from(`sea-cliff-${v}.png`);

            v = lineDirectionalVariant(neighbors, MistTile);
            this._layer3.texture = PIXI.Texture.from(`mist-${v}.png`);
        }
    },

    /** type {Terrain} */
    Reef: class ReefTile {
        _layer0;
        _layer1 = new PIXI.Sprite();
        _layer2 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return ReefTile; }
        get serial() { return 12; }
        get landTile() { return false; }
        static landTile = false;
        shallowWaters = false;

        get name() { return "Reef"; }
        get shortName() { return "Reef"; }
        get defenseRating() { return 2; }
        get generatesIncome() { return false; }
        get repairType() { return UnitClass.None; }
        get hideaway() { return true; }
        get vision() { return 0; }
        get description() { return "Spiky reefs provide ideal /hiding places/ for naval units in Fog of War."; }
        
        movementCost(type) {
            let costs = [0,0,0,0,0,1,2,2];
            return costs[type];
        }

        constructor(transform = null) {
            let sheet = Game().app.loader.resources['NormalMapTilesheet'].spritesheet;

            this._layer0 = new PIXI.AnimatedSprite(sheet.animations["sea"]);
            this._layer0.animationSpeed = 0.1;
            this._layer0.play();

            this._layer1.blendMode = PIXI.BLEND_MODES.ADD;
            this._layer1.alpha = 0.1;

            let v = tileVariant(4);
            this._layer2.texture = PIXI.Texture.from(`reef-${v}.png`);

            this._transform = transform || new LowResTransform();

            let layers = [];
            layers.push(this._layer0);
            layers.push(this._layer1);
            layers.push(this._layer2);
            this._transform.object = layers;

            MapLayers['bottom'].addChild(this._layer0);
            MapLayers['bottom'].addChild(this._layer1);
            MapLayers['bottom'].addChild(this._layer2);
        }

        destroy() {
            MapLayers['bottom'].removeChild(this._layer0);
            MapLayers['bottom'].removeChild(this._layer1);
            MapLayers['bottom'].removeChild(this._layer2);

            this._layer0.destroy();
            this._layer1.destroy();
            this._layer2.destroy();
            this._transform.destroy();
        }

        orientSelf(neighbors) {
            if (this.shallowWaters) {
                let v = seaShallowVariant(neighbors);
                if (v != "0000")
                    this._layer1.texture = PIXI.Texture.from(`sea-shallow-${v}.png`);
            }
        }
    },

    /** type {Terrain} */
    Fire: class FireTile {
        _layer0 = new PIXI.Sprite();
        _layer1;

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return FireTile; }
        get serial() { return 13; }
        get landTile() { return true; }
        static landTile = true;
        get shallowWaters() { return false; }

        get name() { return "Fire"; }
        get shortName() { return "Fire"; }
        get defenseRating() { return 0; }
        get generatesIncome() { return false; }
        get repairType() { return UnitClass.None; }
        get hideaway() { return false; }
        get vision() { return 5; }
        get description() { return "Prevents unit movement and illuminates a /5-square/ area in Fog of War."; }
        
        movementCost(type) {
            let costs = [0,0,0,0,0,0,0,0];
            return costs[type];
        }

        constructor(transform = null) {
            let sheet = Game().app.loader.resources['NormalMapTilesheet'].spritesheet;

            this._layer0.texture = PIXI.Texture.from(`plain-8.png`);

            this._layer1 = new PIXI.AnimatedSprite(sheet.animations['fire']);
            this._layer1.animationSpeed = 0.2;
            this._layer1.play();
            this._layer1.anchor.y = 0.535;  // TODO: Fix sprite

            this._transform = transform || new LowResTransform();

            let layers = [];
            layers.push(this._layer0);
            layers.push(this._layer1);
            this._transform.object = layers;

            MapLayers['bottom'].addChild(this._layer0);
            MapLayers['top'].addChild(this._layer1);
        }

        destroy() {
            MapLayers['bottom'].removeChild(this._layer0);
            MapLayers['top'].removeChild(this._layer1);

            this._layer0.destroy();
            this._layer1.destroy();
            this._transform.destroy();
        }

        orientSelf(neighbors) {
            // stub
        }
    },

    /** type {Terrain} */
    Meteor: class MeteorTile {
        _layer0 = new PIXI.Sprite();
        _layer1 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return MeteorTile; }
        get serial() { return 14; }
        get landTile() { return true; }
        static landTile = true;
        get shallowWaters() { return false; }

        get name() { return "Meteor"; }
        get shortName() { return "Meteor"; }
        get defenseRating() { return 0; }
        get generatesIncome() { return false; }
        get repairType() { return UnitClass.None; }
        get hideaway() { return false; }
        get vision() { return 0; }
        get description() { return "/Destroy/ meteor chunks to eliminate any nearby plasma."; }
        
        _value = 0;
        get value() { return this._value; }
        set value(n) { this._value = Common.bindValue(n, 0, 99); }

        movementCost(type) {
            let costs = [0,0,0,0,0,0,0,0];
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

    /** type {Terrain} */
    Plasma: class PlasmaTile {
        _layer0 = new PIXI.Sprite();
        _layer1 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return PlasmaTile; }
        get serial() { return 15; }
        get landTile() { return true; }
        static landTile = true;
        get shallowWaters() { return false; }

        get name() { return "Plasma"; }
        get shortName() { return "Plasma"; }
        get defenseRating() { return 0; }
        get generatesIncome() { return false; }
        get repairType() { return UnitClass.None; }
        get hideaway() { return false; }
        get vision() { return 0; }
        get description() { return "Plasma is impassable but disappears if /meteor chunks/ are destroyed."; }
        
        movementCost(type) {
            let costs = [0,0,0,0,0,0,0,0];
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

    /** type {Terrain} */
    Pipeline: class PipelineTile {
        _layer0 = new PIXI.Sprite();
        _layer1 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return PipelineTile; }
        get serial() { return 16; }
        get landTile() { return true; }
        static landTile = true;
        get shallowWaters() { return false; }

        get name() { return "Pipeline"; }
        get shortName() { return "Pipe"; }
        get defenseRating() { return 0; }
        get generatesIncome() { return false; }
        get repairType() { return UnitClass.None; }
        get hideaway() { return false; }
        get vision() { return 0; }
        get description() { return "Its armor renders the pipeline indestructible. No units can pass it."; }
        
        movementCost(type) {
            let costs = [0,0,0,0,0,0,0,0];
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

    /** type {Terrain} */
    PipeSeam: class PipeSeamTile {
        _layer0 = new PIXI.Sprite();
        _layer1 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return PipeSeamTile; }
        get serial() { return 17; }
        get landTile() { return true; }
        static landTile = true;
        get shallowWaters() { return false; }

        get name() { return "Pipe Seam"; }
        get shortName() { return "Pipe"; }
        get defenseRating() { return 0; }
        get generatesIncome() { return false; }
        get repairType() { return UnitClass.None; }
        get hideaway() { return false; }
        get vision() { return 0; }
        get description() { return "The armor is weaker here than on other sections of the pipe."; }
        
        _value = 0;
        get value() { return this._value; }
        set value(n) { this._value = Common.bindValue(n, 0, 99); }

        movementCost(type) {
            let costs = [0,0,0,0,0,0,0,0];
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

    /** type {Terrain} */
    HQ: class HQTile {
        _layer0 = new PIXI.Sprite();
        _layer1 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return HQTile; }
        get serial() { return 18; }
        get landTile() { return true; }
        static landTile = true;
        get shallowWaters() { return false; }

        get name() { return "HQ"; }
        get shortName() { return "HQ"; }
        get defenseRating() { return 4; }
        get generatesIncome() { return true; }
        get repairType() { return UnitClass.Ground; }
        get hideaway() { return true; }
        get vision() { return 2; }
        get description() { return "Capture the HQ to /end a battle/. Ground units can /resupply/ here too."; }
        
        _value = 0;
        get value() { return this._value; }
        set value(n) { this._value = Common.bindValue(n, 0, 99); }

        movementCost(type) {
            let costs = [1,1,1,1,1,1,0,0];
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

    /** type {Terrain} */
    City: class CityTile {
        _layer0 = new PIXI.Sprite();
        _layer1 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return CityTile; }
        get serial() { return 19; }
        get landTile() { return true; }
        static landTile = true;
        get shallowWaters() { return false; }

        get name() { return "City"; }
        get shortName() { return "City"; }
        get defenseRating() { return 2; }
        get generatesIncome() { return true; }
        get repairType() { return UnitClass.Ground; }
        get hideaway() { return true; }
        get vision() { return 2; }
        get description() { return "A populated city. Once captured, ground units can /resupply/ here."; }
        
        _value = 0;
        get value() { return this._value; }
        set value(n) { this._value = Common.bindValue(n, 0, 99); }

        movementCost(type) {
            let costs = [1,1,1,1,1,1,0,0];
            return costs[type];
        }

        constructor(transform = null) {
            let v = plainVariant();
            this._layer0.texture = PIXI.Texture.from(`plain-${v}.png`);

            this._layer1.texture = PIXI.Texture.from(`city-white.png`);
            this._layer1.anchor.y = 0.5;

            this._transform = transform || new LowResTransform();

            let layers = [];
            layers.push(this._layer0);
            layers.push(this._layer1);
            this._transform.object = layers;

            MapLayers['bottom'].addChild(this._layer0);
            MapLayers['top'].addChild(this._layer1);
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

    /** type {Terrain} */
    ComTower: class ComTowerTile {
        _layer0 = new PIXI.Sprite();
        _layer1 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return ComTowerTile; }
        get serial() { return 20; }
        get landTile() { return true; }
        static landTile = true;
        get shallowWaters() { return false; }

        get name() { return "Com Tower"; }
        get shortName() { return "Com T"; }
        get defenseRating() { return 3; }
        get generatesIncome() { return true; }
        get repairType() { return UnitClass.None; }
        get hideaway() { return true; }
        get vision() { return 2; }
        get description() { return "Once captured, this boosts your /attack and defense/."; }
        
        _value = 0;
        get value() { return this._value; }
        set value(n) { this._value = Common.bindValue(n, 0, 99); }

        movementCost(type) {
            let costs = [1,1,1,1,1,1,0,0];
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

    /** type {Terrain} */
    Radar: class RadarTile {
        _layer0 = new PIXI.Sprite();
        _layer1 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return RadarTile; }
        get serial() { return 21; }
        get landTile() { return true; }
        static landTile = true;
        get shallowWaters() { return false; }

        get name() { return "Radar"; }
        get shortName() { return "Radar"; }
        get defenseRating() { return 3; }
        get generatesIncome() { return true; }
        get repairType() { return UnitClass.None; }
        get hideaway() { return true; }
        get vision() { return 5; }
        get description() { return "This reveals a /5-square/ area during Fog of War conditions."; }
        
        _value = 0;
        get value() { return this._value; }
        set value(n) { this._value = Common.bindValue(n, 0, 99); }

        movementCost(type) {
            let costs = [1,1,1,1,1,1,0,0];
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

    /** type {Terrain} */
    Silo: class SiloTile {
        _layer0 = new PIXI.Sprite();
        _layer1 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return SiloTile; }
        get serial() { return 22; }
        get landTile() { return true; }
        static landTile = true;
        get shallowWaters() { return false; }

        get name() { return "Silo"; }
        get shortName() { return "Silo"; }
        get defenseRating() { return 2; }
        get generatesIncome() { return false; }
        get repairType() { return UnitClass.None; }
        get hideaway() { return true; }
        get vision() { return 0; }
        get description() { return "Foot soldiers can launch this. It damages a /13-square/ area."; }
        
        _value = 0;
        get value() { return this._value; }
        set value(n) { this._value = Common.bindValue(n, 0, 99); }

        movementCost(type) {
            let costs = [1,1,1,1,1,1,0,0];
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

    /** type {Terrain} */
    Factory: class FactoryTile {
        _layer0 = new PIXI.Sprite();
        _layer1 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return FactoryTile; }
        get serial() { return 23; }
        get landTile() { return true; }
        static landTile = true;
        get shallowWaters() { return false; }

        get name() { return "Factory"; }
        get shortName() { return "Fctry"; }
        get defenseRating() { return 3; }
        get generatesIncome() { return true; }
        get repairType() { return UnitClass.Ground; }
        get hideaway() { return true; }
        get vision() { return 2; }
        get description() { return "Once captured, this can be used to /produce and resupply/ ground units."; }
        
        _value = 0;
        get value() { return this._value; }
        set value(n) { this._value = Common.bindValue(n, 0, 99); }

        movementCost(type) {
            let costs = [1,1,1,1,1,1,0,0];
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

    /** type {Terrain} */
    Airport: class AirportTile {
        _layer0 = new PIXI.Sprite();
        _layer1 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return AirportTile; }
        get serial() { return 24; }
        get landTile() { return true; }
        static landTile = true;
        get shallowWaters() { return false; }

        get name() { return "Airport"; }
        get shortName() { return "Airport"; }
        get defenseRating() { return 3; }
        get generatesIncome() { return true; }
        get repairType() { return UnitClass.Air; }
        get hideaway() { return true; }
        get vision() { return 2; }
        get description() { return "Once captured, this can be used to /produce and resupply/ air units."; }
        
        _value = 0;
        get value() { return this._value; }
        set value(n) { this._value = Common.bindValue(n, 0, 99); }

        movementCost(type) {
            let costs = [1,1,1,1,1,1,0,0];
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

    /** type {Terrain} */
    Port: class PortTile {
        _layer0 = new PIXI.Sprite();
        _layer1 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return PortTile; }
        get serial() { return 25; }
        get landTile() { return false; }
        static landTile = false;
        get shallowWaters() { return false; }

        get name() { return "Port"; }
        get shortName() { return "Port"; }
        get defenseRating() { return 3; }
        get generatesIncome() { return true; }
        get repairType() { return UnitClass.Naval; }
        get hideaway() { return true; }
        get vision() { return 2; }
        get description() { return "Once captured, this can be used to /produce and resupply/ naval units."; }
        
        _value = 0;
        get value() { return this._value; }
        set value(n) { this._value = Common.bindValue(n, 0, 99); }

        movementCost(type) {
            let costs = [1,1,1,1,1,1,1,1];
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

    /** type {Terrain} */
    TempAirpt: class TempAirptTile {
        _layer0 = new PIXI.Sprite();
        _layer1 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return TempAirptTile; }
        get serial() { return 26; }
        get landTile() { return true; }
        static landTile = true;
        get shallowWaters() { return false; }

        get name() { return "Temp Airpt"; }
        get shortName() { return "T Air"; }
        get defenseRating() { return 1; }
        get generatesIncome() { return false; }
        get repairType() { return UnitClass.Air; }
        get hideaway() { return true; }
        get vision() { return 2; }
        get description() { return "A temporary airport that can /resupply/ and /repair/ air units."; }
        
        _value = 0;
        get value() { return this._value; }
        set value(n) { this._value = Common.bindValue(n, 0, 99); }

        movementCost(type) {
            let costs = [1,1,1,1,1,1,0,0];
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

    /** type {Terrain} */
    TempPort: class TempPortTile {
        _layer0 = new PIXI.Sprite();
        _layer1 = new PIXI.Sprite();

        _transform;
        get transform() { return this._transform; }
        set transform(transform) { this._transform.copy(transform); }

        get type() { return TempPortTile; }
        get serial() { return 27; }
        get landTile() { return false; }
        static landTile = false;
        get shallowWaters() { return false; }

        get name() { return "Temp Port"; }
        get shortName() { return "T Port"; }
        get defenseRating() { return 1; }
        get generatesIncome() { return false; }
        get repairType() { return UnitClass.Naval; }
        get hideaway() { return true; }
        get vision() { return 2; }
        get description() { return "A temporary port that can /resupply//repair/ naval units."; }
        
        _value = 0;
        get value() { return this._value; }
        set value(n) { this._value = Common.bindValue(n, 0, 99); }

        movementCost(type) {
            let costs = [1,1,1,1,1,1,1,1];
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
}

// 1600 fucking lines. God damn. This is awesome.