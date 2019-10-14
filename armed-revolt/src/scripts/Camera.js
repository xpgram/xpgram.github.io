import { LowResTransform } from "./LowResTransform.js";
import { Game } from "../main.js";

export class Camera {
    _transform = new LowResTransform();
    get transform() { return this._transform; }
    set transform(trans) { this._transform.copy(trans); }

    // Focus on any object ~with~ a transform.
    // Or pass in a point object.
    // This is for following objects. Null if no target to follow
    _focus = new LowResTransform();
    get focus() { return this._focus; }
    set focus(obj) {
        if (obj instanceof LowResTransform) this._focus.copy(obj.transform);
        else this._focus.position = obj;    // If obj == {x,y}
    }
    // Are PIXI.Points addable? You know, JS doesn't allow operator overloading... hm.

    _scene;
    get scene() { return this._scene; }
    set scene(obj) {
        if (obj instanceof PIXI.Container)
            this._transform.object = obj;
            // FYI, I never stop to ask if something is already controlling the scene.
            // Try not to be dumb, programmer.
    }

    get x() { return -this.transform.position.x + this.viewport.center.x; }
    get y() { return -this.transform.position.y; }
    get pos() { return {x: this.x, y: this.y}; }
    get rotation() { return -this.transform.rotation; }
    get zoom() { return this.transform.scale.x; } // x should be 1 by default, I think.
    get viewport() {
        // This is confusing to me. Return the output put of a function (passing in 'this') which returns an object.
        return function(parent) { return {
            get width() { return Game().display.renderWidth * parent.zoom; },
            get height() { return 160; },
            get center() { return {x: this.width * 0.5, y: this.height * 0.5} },
            set width(value) { parent.transform.scale.x; }, // = value / display.width or something.
            set height(value) { parent.transform.scale.y; }

            // Javascript is so funny.
            // This is such a weird way of doing things.
        }}(this);
    }

    // I think I'm setting NaN to something.x?? I wish low res transform would print a stack trace.
    set x(n) { this.transform.position.x = -n + this.viewport.center.x; }
    set rotation(angle) { this.transform.rotation = -angle; }
    set zoom(factor) { this.transform.scale.x = factor; this.transform.scale.y = factor; }


    // This is the box ~in world~ that the camera is confined too.
    setBoundingBox(topleft, bottomright) {
        this._boundingBox.x1 = topleft.x;
        this._boundingBox.y1 = topleft.y;
        this._boundingBox.x2 = bottomright.x;
        this._boundingBox.y2 = bottomright.y;
        //this._boundingBox.w = { return x2 - x1; }
        //this._boundingBox.h = { return y2 - y1; }
    }

    // This is the box ~in view~ that the camera considers framed correctly.
    // x and y are relative to the camera's transform
    setFocusBox(topleft, bottomright) {
        this._focusBox.x1 = topleft.x;
        this._focusBox.y1 = topleft.y;
        this._focusBox.x2 = bottomright.x;
        this._focusBox.y2 = bottomright.y;
    }

    // for movement
    // I may want to give the camera a speed graph or something (?)
    // But it should have a momentum.
    // Whatever speed it figures it should be going, it needs to incrementally build momentum, a vector,
    // in that direction until it reaches the desired speed.
    // This will virtually always look better.
    // I could also set minimum and maximum values on the acceleration time.
}