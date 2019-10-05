begin = """//@ts-check

import {MoveType, Faction, UnitClass} from "./common-types";

// Tools

/**
 * Confines n to the range (min, max) inclusive.
 */
function bound(n, min, max) {
    if (n < min) n = min;
    if (n > max) n = max;
    return n;
}

/**
 * Terrain objects represent land and sea tiles on the map.  
 * Use via new Terrain.Type()  
 * Terrain objects may be compared with object.type and Terrain.Type
 */
 export var Terrain = {
"""

valueStub = """get value() { return this._value; }
        set value(n) { this._value = bound(n, 0, 99); }"""

copyable = """
    [type]: class [type]Tile {
        _graphic = [graphic index];
        _value = 0;

        get type() { return [type]Tile; }
        get landTile() { return [land tile]; }

        get name() { return [name]; }
        get shortName() { return [short name]; }
        get defenseRating() { return [DEF]; }
        get generatesIncome() { return [income]; }
        get repairType() { return [repair type]; }
        get hidesUnits() { return [hideable]; }
        get vision() { return [VIS]; }
        get description() { return "[desc]"; }
        [value stub]

        /**
         * @param {MoveType} type The kind of travel mechanism being inquired about. Should be TravelType.Type
         * @return {number} The number of movement points required to move into this tile. A return of '0' should mean it is impossible to move into this tile space.
         */
        movementCost(movetype) {
            let costs = [movement cost matrix];
            return costs[movetype];
        }

        /**
         * @param {*} neighbors a 3x3 grid containing this tile's nearest neighbor's types. Used to pick the right tile graphic or anim set.
         */
        constructor (neighbors) {
            // stub
        }
    },"""

end = "}"

classtype = "[type]"
graphic = "[graphic index]"
landtile = "[land tile]"
name = "[name]"
shortname = "[short name]"
defense = "[DEF]"
income = "[income]"
repairtype = "[repair type]"
hideable = "[hideable]"
vision = "[VIS]"
description = "[desc]"
value = "[value stub]"
movementCost = "[movement cost matrix]"

# Turn the above into real js dawg
