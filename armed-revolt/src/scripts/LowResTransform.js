//@ts-check

/**
This class represents the translational, rotational and proportional transform of a
2-dimensional object relative to its parent container.

It does this by interfacing with Pixi objects, which already have a
transform, to force low-resolution qualities on-screen, but without losing
precision if using, say, delta-time to meter positional changes over time.

This is handled internally, for the most part, as LowResTransform needs a reference
to the Pixi object it's supposed to be controlling.

Keep in mind, this class cannot block access to a Pixi object's transform values;
doing so would obstruct other properties that are beyond the scope of this class.

@author Dei Valko
@version 0.1.1
*/

/*
    Todo list unspecific to this particular class:

    app.stage.set.layer
    Terrain.Tile needs a deconstructor to remove sprites from the stage
    Camera will move the set around, stage will scale itself according to window size (as it does)
  ✓ Transform needs to accept an empty focus (when setting x,y properties too! Don't call updateObject or otherwise when it's empty!)
    Terrain.Tile should also have default, empty values when nothing is passed in (probably easy).
    Terrain.Tile gets added to Map.Tiles, Terrain.Tile.Sprite gets added to app.stage.set.layer
    Terrain.Tile should have a read-only serialNumber for file IO. Python can write this.
    This serialNumber is passed in to Map as a mapfile, which is converted to a 2D array of Terrain.Types
    Map has a width and a list of tiles (height is inferred)
    Map iterates through its list of types, creates a new Terrain.Tile by passing in position and neighbors, and pushes the result to its 1D list of tiles.
    Map should complain if width*rows != total tiles
    Map.height = rows
    Once created, Map can discard its list of types, just keeping its tiles.
    Map (maybe called Board?) keeps track of units too.
    All in one place means all easily serializeable (I think).
    I mean, Board.tiles Board.units, that's you're entire game right there.
*/

// Constants
const NaN_Error_Msg = "Cannot assign NaN to transform property.";
const floor = Math.floor;
const trunc = Math.trunc;

export class LowResTransform {

    /**
     * @param {PIXI.Object} object 
     * @param {PIXI.Point} pos 
     */
    constructor(object = null, pos = null) {
        if (pos instanceof PIXI.Point) this.position = pos;
        this.object = object || null;
    }

    /**
     * A handle for the associated object to be controlled.
     * @type {PIXI.Object} Anything with PIXI.Transform attached to it.
     */
    get object() {
        return this._object;
    }
    set object(obj) {
        this._object = obj;
        this._updateObjectTransform();
        // TODO Apply a filter to PIXI.Sprite objects which mimic low-res pixel interpolation (nearest neighbor).
    }
    _object;

    /**
     * Conforms the controlled object to this transform.
     * Used once only when a new object is assigned.
     */
    _updateObjectTransform() {
        this._updateObjectPosition();
        this._updateObjectRotation();
        this._updateObjectScale();
    }
    _updateObjectPosition() {
        if (this.object == null)
            return;
        this.object.x = floor(this.position.x);
        this.object.y = floor(this.position.y);
        this.object.zIndex = floor(this.position.z);
    }
    _updateObjectRotation() {
        if (this.object == null)
            return;
        this.object.rotation = this.rotation;
    }
    _updateObjectScale() {
        if (this.object == null)
            return;
        this.object.scale.x = this.scale.x;
        this.object.scale.y = this.scale.y;
        this.object.scale.width = floor(this.object.scale.width);   // Confines the transform to a nice, rounded-integer, pixel-block size.
        this.object.scale.height = floor(this.object.scale.height); // Does not force low-res image interpolation, however.
                                                                    // And now that I think about it, this only forces screen-pixel alignment anyway. Right?
    }

    /**
     * @param {LowResTransform} transform The LowResTransform object to copy properties from. Ignores the focused object.
     */
    copy(transform) {
        let p = transform.position;
        this.position.set(p.x, p.y, p.z);

        this.rotation = transform.rotation;

        let s = transform.scale;
        this.scale.set(s.x, s.y);
    }

    /**
     * A point which represents the translational transformation.
     * @type {PIXI.Point}
     */
    get position() {
        return this._position;
    }
    set position(obj) {
        if (obj instanceof PIXI.Point)
            this.position.set(obj.x, obj.y);
    }
    _position = ((parent) => { return {
        _x: 0,  // x-coordinate
        _y: 0,  // y-coordinate
        _z: 0,  // z-coordinate (adjusts object's z-index)

        /**
         * @type {number}
         */
        get x() {
            return this._x;
        },

        /**
         * @type {number}
         */
        get y() {
            return this._y;
        },

        /**
         * @type {number}
         */
        get z() {
            return this._z;
        },

        // Setters for the above getters
        set x(val) {
            if (isNaN(val))
                throw NaN_Error_Msg;
            this._x = val;
            parent._updateObjectPosition();
        },
        set y(val) {
            if (isNaN(val))
                throw NaN_Error_Msg;
            this._y = val;
            parent._updateObjectPosition();
        },
        set z(val) {
            if (isNaN(val))
                throw NaN_Error_Msg;
            this._z = val;
            parent._updateObjectPosition();
        },
        
        /**
         * Sets the point for the object's positional transform.
         * @param {number} x The object's new x-coordinate. Defaults to self.
         * @param {number} y The object's new y-coordinate. Defaults to self.
         * @param {number} z The object's new z-coordinate (adjusts z-index). Defaults to self.
         */
        set(x, y, z) {
            this._x = x || this._x;
            this._y = y || this._y;
            this._z = z || this._z;
            parent._updateObjectPosition();
        },

        /**
         * Translates the object relative to its current position.
         * @param {number} x The value to apply to the object's x-coordinate. Defaults to 0.
         * @param {number} y The value to apply to the object's y-coordinate. Defaults to 0.
         * @param {number} z The value to apply to the object's z-coordinate (adjusts z-index). Defaults to 0.
         */
        move(x, y, z) {
            this._x += x || 0;
            this._y += y || 0;
            this._z += z || 0;
            parent._updateObjectPosition();
        },
    }})(this);  // 'this' passed in as this object's parent object.

    /**
     * The rotational transformation of the object, expressed in radians.
     * @type {number}
     */
    get rotation() {
        return this._rotation;
    }
    set rotation(val) {
        if (isNaN(val))
            throw NaN_Error_Msg;
        this._rotation = val;
        this._updateObjectRotation();
    }
    _rotation = 0;
    
    /**
     * A 2D vector which represents the proportional transformation of the object.
     */
    get scale() {
        return this._scale;
    }
    _scale = ((parent) => { return {
        _x: 1,
        _y: 1,

        /**
         * Horizontal size ratio.
         * @type {number}
         */
        get x() {
            return this._x;
        },

        /**
         * Vertical size ratio.
         * @type {number}
         */
        get y() {
            return this._y;
        },

        // Setters for the above getters.
        set x(val) {
            if (isNaN(val))
                throw NaN_Error_Msg;
            this._x = val;
            parent._updateObjectScale();
        },
        set y(val) {
            if (isNaN(val))
                throw NaN_Error_Msg;
            this._y = val;
            parent._updateObjectScale();
        },

        /**
         * Sets the vector representing the object's proportional transform.
         * @param {number} x Horizontal size ratio. Defaults to self.
         * @param {number} y Vertical size ratio. Defaults to self.
         */
        set(x, y) {
            this._x = x || this.x;
            this._y = y || this.y;
            parent._updateObjectScale();
        },
    }})(this);  // 'this' passed in as this object's parent object.
}