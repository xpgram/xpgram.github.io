import { Game } from "../../main.js";

/**
 * Globally accessible layers for the map system's sprites.
 * Use: MapLayers['layer name'].doSomething();
 * Must be initialized before use.
 * 
 * Layers:
 * 'bottom'
 * 'top'
 * 'fog'
 * 
 * @author Dei Valko
 * @version 0.1.0
 */
export var MapLayers = {
    destroyed: true,
    layerNames: [
        'bottom',
        'top',    // units, meteors and plasma get +1 to z-index
        'fog'
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