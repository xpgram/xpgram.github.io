/**
 * 
 * @author Dei Valko
 * @version 0.1.0
 */

// Error Messages

function InvalidLocationError(loc) {
    return `Attempting to access invalid grid location: $(loc.x),$(loc.y)`;
}

// Main

export class Grid {
    _map;   // 2D Dictionary (speedy) representing the grid of tiles and map entities.

    Grid(width, height) {
        this._initMap(width, height);
    }

    /**
     * Builds the data structure representing the map given its width and height.
     * This method does not populate.
     * TODO I should just combine this with 'load'; it's the only use-case that makes sense.
     * @param {Number} width
     * @param {Number} height 
     */
    _initMap(width, height) {
        this._map = {};
        for (x = 0; x < width; x++) {
            this._map[x] = {};
            for (y = 0; y < height; y++) {
                this._map[x][y] = {
                    terrain: null,      // Which terrain type this tile is. Reference only.
                    unit: null,         // Which unit currently inhabits this tile.
                    object: null,       // Which type of treasure/operable is located at this tile.
                };
            }
        }
    }

    /**
     * @return {Number} The horizontal size of the grid map.
     */
    get width() {
        return (this._map[0]) ? this._map[0].length : 0;
    }

    /**
     * @return {Number} The vertical size of the grid map.
     */
    get height() {
        return (this._map) ? this._map.length : 0;
    }

    /**
     * @param {PIXI.Point} loc Location of the subject grid position.
     * @returns The object container for the specified grid location.
     */
    get(loc) {
        if (!this.validPoint(loc))
            throw InvalidLocationError(loc);
        // else
        return this._map[loc.x][loc.y];
    }

    /**
     * @param {*} unit Unit object to be placed on the grid.
     * @param {PIXI.Point} loc Location on the grid being invoked.
     */
    placeUnit(unit, loc) {
        if (!this.validPoint(loc))
            throw InvalidLocationError(loc);
        // else
        this.get(loc).unit = unit;
    }

    /**
     * @param {PIXI.Point} loc Location on the grid to clear of inhabitants.
     */
    removeUnit(loc) {
        if (!this.validPoint(loc))
            throw InvalidLocationError(loc);
        // else
        this.get(loc).unit = null;
    }

    /**
     * @param {PIXI.Point} src Location of the unit to be moved.
     * @param {PIXI.Point} dest Location to move the unit to.
     * @returns True if the operation was successful.
     * @throws If either src or dest are invalid locations.
     */
    moveUnit(src, dest) {
        if (!this.validPoint(src))
            throw InvalidLocationError(src);
        if (!this.validPoint(dest))
            throw InvalidLocationError(dest);
        if (!this.occupiable(dest))
            return false;
        
        let traveler = this.get(src).unit; // Can be null
        this.placeUnit(traveler, dest);
        this.removeUnit(src);

        // TODO This would be the prime location for a send-message in an Object Listener pattern…
        return true;
    }

    /**
     * @param {PIXI.Point} loc Location of the subject grid position.
     * @return {Boolean} True if the unit inhabitant is null.
     * @throws If loc is an invalid location.
     */
    occupiable(loc) {
        if (!this.validPoint(loc))
            throw InvalidLocationError(loc);
        // else
        return (this.get(loc).unit == null);
    }

    /**
     * @param {PIXI.Point} loc Location of the subject grid position.
     * @return {Boolean} True if loc lies within the map's boundaries.
     */
    validPoint(loc) {
        return loc.x > -1 && loc.x < this.width &&
               loc.y > -1 && loc.y < this.height;
    }
}