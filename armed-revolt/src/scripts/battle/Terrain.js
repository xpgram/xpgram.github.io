//@ts-check

import { MoveType, Faction, UnitClass } from "./common-types";
import { LowResTransform } from "../LowResTransform";
import { Common } from "../Common.js";

/**
 * Terrain objects represent land and sea tiles on the map.  
 * Use via new Terrain.Type()  
 * Terrain objects may be compared with object.type and Terrain.Type
 */
export var Terrain = {
    // start
    {class}: class {class}Tile {
        _sprite = {sprite};                       // This should be a sprite object, probably... I need to figure out how to link this, actually.

        get type() { return {class}Tile; }        // So we can compare tiles together.
        get landTile() { return {land}; }         // This, in theory, is the difference between land and sea meteors. Seemed like it had another purpose, too... generally this has to do with map-making and auto-tile-graphics.

        get name() { return "{name}"; }                  // The terrain type's full name.
        get shortName() { return {shortname}; }           // The terrain type's display name in compact visual situation.
        get defenseRating() { return {DEF}; }               // The star-rating defense boost this terrain provides inhabiting units.
        get generatesIncome() { return {income}; }         // Whether a team can gather funds from this terrain.
        get repairType() { return {repair}; }     // Whether this terrain repairs units (and which).
        get hidesUnits() { return {hideable}; }              // Whether this terrain hides units in Fog of War.
        get vision() { return {VIS}; }                      // How far into Fog of War this captured terrain "sees." Not necessary for any but capturable types.
        get description() { return "{desc}"; }

        {valuestub}
        _value = 0;
        get value() { return this._value; }             // Represents HP for Meteors, faction type for capturables, or anything else, really.
        set value(n) { this._value = Common.bindValue(n, 0, 99); }
        {end}

        /**
         * @param {MoveType} type The kind of travel mechanism being inquired about. Should be TravelType.Type
         * @return {number} The number of movement points required to move into this tile. A return of '0' should mean it is impossible to move into this tile space.
         */
        movementCost(type) {
            let costs = [{movementmatrix}];  // Inftry, Mech, TireA, TireB, Tread, Air, Ship, Transport
            return costs[type];
        }

        /**
         * @param {LowResTransform} pos The position on-map (in pixels) this tile object should occupy.
         * @param {*} neighbors a 3x3 grid containing this tile's nearest neighbor's types. Used to pick the right tile graphic or anim set.
         */
        constructor (pos, neighbors) {
            // stub
        }
    },
    // end
}