
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

TODO ((objectWrap) => { return { ... objectWrap() ... }})(() => this.object);
This feels... extremely weird to me.
But I guess it makes sense.

@author Dei Valko
@version 0.1.0
*/

// Constants
const NaN_Error_Msg = "Cannot assign NaN to transform property.";
const NaSprite_Error_Msg = "Sprite property assignment must be a PIXI.Sprite object.";  // Deprecated (useless)
const floor = Math.floor;
const trunc = Math.trunc;

export class LowResTransform {

    constructor(object) {
        this.object = object;
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
    }
    _object;

    /**
     * Conforms the controlled object to this transform.
     * Used once only when a new object is assigned.
     */
    _updateObjectTransform() {
        let s = this._object;
        s.x = floor(this.x);
        s.y = floor(this.y);
        s.z = floor(this.z);
        s.rotation = this.rotation;
        s.scale.x = this.scale.x;
        s.scale.y = this.scale.y;
        s.scale.width = floor(s.scale.width);   // Confines the transform to a nice, round pixel-block size.
        s.scale.height = floor(s.scale.height); // Does not force low-res interpolation, however.
    }

    /**
     * A point which represents the translational transformation.
     * Accepts PIXI.Point through assignment.
     * @type {LowResTransform.position}
     */
    get position() {
        return this._position;
    }
    set position(obj) {
        if (obj instanceof PIXI.Point)
            this.position.set(obj.x, obj.y);
    }
    _position = ((objectWrap) => { return {
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
            this._x = val;                  // Maintain precision,
            objectWrap().x = floor(this._x); // but don't display it.
        },
        set y(val) {
            if (isNaN(val))
                throw NaN_Error_Msg;
            this._y = val;
            objectWrap().y = floor(this._y);
        },
        set z(val) {
            if (isNaN(val))
                throw NaN_Error_Msg;
            this._z = val;
            objectWrap().zIndex = floor(this._z);
        },
        
        /**
         * Sets the point for the object's positional transform.
         * @param {number} x The object's new x-coordinate. Defaults to self.
         * @param {number} y The object's new y-coordinate. Defaults to self.
         * @param {number} z The object's new z-coordinate (adjusts z-index). Defaults to self.
         */
        set(x, y, z) {
            this.x = x || this._x;   // Use the setter methods
            this.y = y || this._y;
            this.z = z || this._z;
        },

        /**
         * Translates the object relative to its current position.
         * @param {number} x The value to apply to the object's x-coordinate. Defaults to 0.
         * @param {number} y The value to apply to the object's y-coordinate. Defaults to 0.
         * @param {number} z The value to apply to the object's z-coordinate (adjusts z-index). Defaults to 0.
         */
        move(x, y, z) {
            this.x += x || 0;   // Use the setter methods
            this.y += y || 0;
            this.z += z || 0;
        },
    }})(() => this.object); // Wraps the by-reference object in a callable function so it's always up-to-date.

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
        this._rotation = this.object.rotation = val;
    }
    _rotation = 0;  // This is only saved to retain rotation between objects during reassignment.
    
    /**
     * A 2D vector which represents the proportional transformation of the object.
     * @type {LowResTransform.scale}
     */
    get scale() {
        return this._scale;
    }
    _scale = ((objectWrap) => { return {
        _x: 1,  // These are only saved to retain scale between objects during reassignment.
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
            this._x = objectWrap().scale.x = val;           // Scale setting.
            objectWrap().width = trunc(objectWrap().width);  // Pixel correction (sorta; bounding edges only).
        },
        set y(val) {
            if (isNaN(val))
                throw NaN_Error_Msg;
            this._y = objectWrap().scale.y = val;
            objectWrap().height = trunc(objectWrap().height);
        },

        /**
         * Sets the vector representing the object's proportional transform.
         * @param {number} x Horizontal size ratio. Defaults to self.
         * @param {number} y Vertical size ratio. Defaults to self.
         */
        set(x, y) {
            this.x = x || this.x;
            this.y = y || this.y;
        },
    }})(() => this.object); // Wraps the by-reference object in a callable function so it's always up-to-date.
}