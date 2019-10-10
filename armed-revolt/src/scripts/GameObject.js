
import {LowResTransform as Transform} from "/src/scripts/LowResTransform.js";

export class GameObject {
    _transform = new Transform();
    get transform() { return this._transform; }
    set transform(trans) { this._transform.copy(trans); }
    
    // It would be nice for most things to extend this class.
    // But so far, it only grandfathers in a transform.
    // Not so useful.
}