import { Game } from "../../main.js";

/**
 * Globally accessible layers for the map system's sprites.
 * Use: MapLayers['layer name'].doSomething();
 * Must be initialized before use.
 * 
 * Layers:
 * 'base'
 * 'surface'
 * 'buildings'
 * 'units'
 * @author Dei Valko
 * @version 0.1.0
 */
export var MapLayers = {
    destroyed: true,
    layerNames: [
        'base',
        'surface',
        'buildings',
        'units'
    ],

    /**
     * Creates containers acting as layers and adds them to the global stage.
     */
    init() {
        if (this.destroyed) {
            MapLayers.layerNames.forEach(layer => {
                MapLayers[layer] = new PIXI.Container();
                Game().app.stage.addChild(this[layer]);
            });
            this.destroyed = false;
        }
    },

    /**
     * Destroys all layers and all their children.
     */
    destroy() {
        if (!this.destroyed) {
            MapLayers.layerNames.forEach(layer => {
                Game().app.stage.removeChild(this[layer]);
                this[layer].destroy({ children: true, textures: true });
            });
            this.destroyed = true;
        }
    }
};