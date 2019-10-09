//@ts-check

import { Terrain } from "./Terrain.js";
import { Square } from "./Square.js";
import { ProximityBox } from "../ProximityBox.js";
import { LowResTransform } from "../LowResTransform.js";

// Error Messages
function InvalidLocationError(loc) {
    return `Attempting to access invalid grid location: $(loc.x),$(loc.y)`;
}

/**
 * 
 * @author Dei Valko
 * @version 0.1.0
 */
export class Map {
    _board; // 2D Dictionary (speedy) representing the grid of tiles and map entities.

    /**
     * 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(width, height) {
        this._initMap(width, height);
        this._generateMap();    // Generates a pleasant-looking map.
        this._setupMap();       // Perliminary setup for things like sea-tiles knowing they're shallow.
        this._updateMap();      // Ask each tile to formally align themselves with their surroundings (e.g.: sea(neighbors) → shallow/cliff sprites)
    }

    /**
     * Builds the data structure representing the map given its width and height.
     * This method does not populate.
     * @param {Number} width
     * @param {Number} height 
     */
    _initMap(width, height) {
        this._board = {};

        // Construct map skeleton
        for (let x = 0; x < width; x++) {
            this._board[x] = {};
            for (let y = 0; y < height; y++) {
                this._board[x][y] = new Square();
            }
        }
    }

    /**
     * Generates a random map.
     * Implementation is a testing ground, don't get too hung up over the silliness of it.
     */
    _generateMap() {
        for (let x = 0; x < this.width; x++)
        for (let y = 0; y < this.height; y++) {
            let ratio = 0.1;
            let loc = new PIXI.Point(x,y);

            loc.y--;
            if (this.validPoint(loc) &&
                this.get(loc).terrain.type == Terrain.Plain)
                ratio += 0.1;
            loc.x--; loc.y++;
            if (this.validPoint(loc) &&
                this.get(loc).terrain.type == Terrain.Plain)
                ratio += 0.1;
            loc.y--;
            if (this.validPoint(loc) &&
                this.get(loc).terrain.type == Terrain.Plain)
                ratio += 0.1;

            let transform = new LowResTransform();
            transform.position.x = x*16;        // ← Why am I doing this? Just pass in a Point().
            transform.position.y = y*16;

            if (Math.random() < ratio)
                this._board[x][y].terrain = new Terrain.Plain(transform);
            else
                this._board[x][y].terrain = new Terrain.Sea(transform);
        }
    }

    /**
     * Iterates through the map, first pass, applying some preliminary settings to various tiles
     * based on their surroundings.
     */
    _setupMap() {
        for (let x = 0; x < this.width; x++)
        for (let y = 0; y < this.height; y++) {
            let loc = new PIXI.Point(x,y);
            if (this.get(loc).terrain.type == Terrain.Sea) {
                //this.getSurroundings(loc) → ProximityBox
                let neighborList = [];
                let anchor = new PIXI.Point(x-1,y-1);
                for (let yy = 0; yy < 3; yy++)
                for (let xx = 0; xx < 3; xx++) {
                    let cursor = new PIXI.Point(anchor.x+xx, anchor.y+yy);
                    neighborList.push((this.validPoint(cursor)) ? this.get(cursor).terrain : new Terrain.Object());
                }

                for (let i = 0; i < neighborList.length; i++) {
                    if (neighborList[i].type == Terrain.Plain)
                        this.get(loc).terrain.shallowWaters = true;
                }
            }
        }
    }

    _updateMap() {
        for (let x = 0; x < this.width; x++)
        for (let y = 0; y < this.height; y++) {

            let neighborList = [];
            let anchor = new PIXI.Point(x-1,y-1);
            for (let yy = 0; yy < 3; yy++)
            for (let xx = 0; xx < 3; xx++) {
                let cursor = new PIXI.Point(anchor.x+xx, anchor.y+yy);
                neighborList.push((this.validPoint(cursor)) ? this.get(cursor).terrain : new Terrain.Object());
            }

            let neighbors = new ProximityBox(neighborList);

            this.get(new PIXI.Point(x,y)).terrain.updateShape(neighbors);
        }
    }

    /**
     * @return {Number} The horizontal size of the grid map.
     */
    get width() {
        // Length minus the border of blank objects.
        return (this._board) ? Object.keys(this._board).length : 0;
    }

    /**
     * @return {Number} The vertical size of the grid map.
     */
    get height() {
        // Length minus the border of blank objects.
        return (this._board && this._board[0]) ? Object.keys(this._board[0]).length : 0;
    }

    /**
     * @param {PIXI.Point} loc Location of the subject grid position.
     * @returns The object container for the specified grid location.
     */
    get(loc) {
        if (!this.validPoint(loc))
            throw InvalidLocationError(loc);
        // else
        return this._board[loc.x][loc.y];
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
     * @return {Boolean} True if loc lies within the map's boundaries.
     */
    validPoint(loc) {
        return loc.x > -1 && loc.x < this.width &&
               loc.y > -1 && loc.y < this.height;
    }
}