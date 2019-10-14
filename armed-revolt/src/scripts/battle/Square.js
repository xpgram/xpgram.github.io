
/**
 * Used by Map only.
 * Generally a container for map information, but also features many self-managing methods for
 * search-propogation and map UI artifacts.
 * 
 * @author Dei Valko
 * @version 0.1.0
 */
export class Square {
    terrain;    // What terrain is located here. Use terrain.type for comparisons.
    unit;       // Which unit currently inhabits this tile.
    _sprite;    // Not implemented. Its purpose is drawing grid highlights on the map. DoR actually uses tints, though.
    _displayInfo = 0;

    // Constants/accessor-values for _displayInfo
    static moveableShift = 0;
    static attackableShift = 1;
    static dangerousShift = 2;
    static COEffectedShift = 3;
    static hiddenShift = 4;
    static arrowFromShift = 5;
    static arrowToShift = 8;
    static xCoordShift = 11;
    static yCoordShift = 19;

    static boolLength = 1;
    static directionLength = 3;
    static coordinateLength = 8;

    static MAX_COORDS = 255;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Destroys this object and its children.
     */
    destroy() {
        this.terrain.destroy();
        this.unit.destroy();
        this._sprite.destroy();
    }

    /**
     * Retrieves bits from the object's information number. All JS numbers are 64-bit.
     * @param {number} length The length of the bit-mask.
     * @param {number} shift How far left the bit-mask is applied.
     */
    _displayInfoGet(length, shift) {
        let mask = Math.pow(2,length) - 1;  // Get us a series of 1 bits.
        return (this._displayInfo >> shift & mask);
    }

    /**
     * Writes bits to the object's information number. All JS numbers are 64-bit.
     * @param {number} length The length of the bit-mask.
     * @param {number} shift How far left the bit-mask is applied.
     * @param {number} value The value to write into info (overages are not possible; mask is applied to value).
     */
    _displayInfoSet(length, shift, value) {
        let mask = Math.pow(2,length) - 1;  // Get us a series of 1 bits.
        this._displayInfo = this._displayInfo & !(mask << shift);
        this._displayInfo += (value & mask) << shift;
        this.updateHighlight();
    }

    /**
     * @type {boolean} Whether this tile is reachable by a traveling unit.
     */
    get moveable() {
        return 1 == this._displayInfoGet(Square.boolLength, Square.moveableShift);
    }
    /**
     * @type {boolean} Whether this tile is attackable by a unit.
     */
    get attackable() {
        return 1 == this._displayInfoGet(Square.boolLength, Square.attackableShift);
    }
    /**
     * @type {boolean} Whether this tile is attackable by enemy troops.
     */
    get dangerous() {
        return 1 == this._displayInfoGet(Square.boolLength, Square.dangerousShift);
    }
    /**
     * @type {boolean} Whether this tile is affected by CO Unit influence.
     */
    get COEffected() {
        return 1 == this._displayInfoGet(Square.boolLength, Square.COEffectedShift);
    }
    /**
     * @type {boolean} Whether this tile's contents are obscured by Fog of War.
     */
    get hidden() {
        return 1 == this._displayInfoGet(Square.boolLength, Square.hiddenShift);
    }
    /**
     * @type {number} The from direction of the movement arrow splice. Range 0–4: none, up, right, down, left.
     */
    get arrowFrom() {
        return this._displayInfoGet(Square.directionLength, Square.arrowFromShift);
    }
    /**
     * @type {number} The to direction of the movement arrow splice. Range 0–4: none, up, right, down, left.
     */
    get arrowTo() {
        return this._displayInfoGet(Square.directionLength, Square.arrowToShift);
    }
    /**
     * @type {number} Represents this square's x-coordinate on the map.
     */
    get x() {
        return this._displayInfoGet(Square.coordinateLength, Square.xCoordShift);
    }
    /**
     * @type {number} Represents this square's y-coordinate on the map.
     */
    get y() {
        return this._displayInfoGet(Square.coordinateLength, Square.yCoordShift);
    }
    /**
     * @type {point} A point object representing this square's positional coordinates on the map.
     */
    get pos() {
        return {x: this.x, y: this.y};
    }

    set moveable(value) {
        this._displayInfoSet(Square.boolLength, Square.moveableShift, value);
    }
    set attackable(value) {
        this._displayInfoSet(Square.boolLength, Square.attackableShift, value);
    }
    set dangerous(value) {
        this._displayInfoSet(Square.boolLength, Square.dangerousShift, value);
    }
    set COEffected(value) {
        this._displayInfoSet(Square.boolLength, Square.COEffectedShift, value);
    }
    set hidden(value) {
        this._displayInfoSet(Square.boolLength, Square.hiddenShift, value);
    }
    set arrowFrom(value) {
        this._displayInfoSet(Square.directionLength, Square.arrowFromShift, value);
    }
    set arrowTo(value) {
        this._displayInfoSet(Square.directionLength, Square.arrowToShift, value);
    }
    set x(value) {
        this._displayInfoSet(Square.coordinateLength, Square.xCoordShift);
    }
    set y(value) {
        this._displayInfoSet(Square.coordinateLength, Square.yCoordShift);
    }
    set pos(point) {
        this.x = point.x;
        this.y = point.y;
    }

    updateHighlight() {
        // Maintain a sprite object at this position (the terrain.transform, probably)
        // Highlight precedence: blue > red > maroon > grey
        // Dark grey, Fog of War is separate and underneath the above colors.

        // If blue, red, maroon and grey are all false, destroy (null?) the sprite
        // If seeable is true, destroy (null?) the FoW sprite
    }

    occupiable(unit) {
        // does terrain.moveCost(unit) return >= 1?
        // does unit == null?
        // return true
    }

    traversable(unit) {
        // does this.terrain.moveCost(unit) return >= 1?
        // is this.unit either null or allied to unit?
        // return true
    }

    // ↓ Methods for iteratively depth-searching tiles ↓
}