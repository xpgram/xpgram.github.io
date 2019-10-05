
import {LowResTransform as Transform} from "/src/scripts/LowResTransform.js";

export class GameObject {
    sprite = new PIXI.Sprite();
    transform = new Transform(this.sprite);
    // More or less.
    // How do I get the loader in here?
    // Um...
    // I mean, the loader does its thing elsewhere.
    // How do I know which resources to pull here?
    // I guess not 'here'.
    // class Soldier extends GameObject { sprite = what?; transform = sprite; }
    
    // It would be nice if I could get commonly used classes to somehow request
    // the materials they need from the loader.
    // *Before* loading, though, you know.
    // Pixi doesn't like loading twice unless you reset, which clears the whole thing.
    // I... *guess* that's doable...
    // LIke, load.reset, load.add, load.load, assemble ...
    // For every object that needs anything ...
    // I wonder what makes the most sense.
}