import { Game } from "../../main.js";

/**
 * Globally accessible layers for the map system's sprites.
 * 
 * I should rethink this later:
 * How am I going to destroy these layers on shutdown?
 * I guess I could write a class, create one, then export the created one like I did with Game.
 * 
 * @author Dei Valko
 * @version 0.1.0
 */
var MapLayers = {
    init() {
        layerNames.forEach(layer => {
            Game().app.stage.addChild(this[layer]);
        });
    }
};

// Declare layer names
let layerNames = [
    'base',
    'surface',
    'surface effects',
    'buildings',
    'units'
];

// Set them into the layers object and make layers visible
layerNames.forEach(layer => {
    MapLayers[layer] = new PIXI.Container();
});

// Importable
export {MapLayers};