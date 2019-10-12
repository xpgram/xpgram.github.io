//@ts-check

import { LowResTransform } from "./LowResTransform.js";

export class Camera {
    /**
     * @type {LowResTransform}
     */
    get transform() { return this._transform; }
    set transform(trans) { this._transform.copy(trans) }
    _transform = new LowResTransform();

    // ↑ I was working on this on my laptop, so I should use that.
    // But, I should add a callback function to LowResTransform whenever there's a change.
    // That way, I can directly affect the camera's transform, and the callback function can apply it to the scene.


    set focus(obj) {}           // Any LowResTransform object. This class treats focus as read-only.
    set followPatternFunction(func) {} // A 0–1.0 graph modeling the camera's speed as a function of distance.
    set worldObject(obj) {}     // Usually a pixi.container. Usually stage, actually. What is moved to simulate moving the camera.
    moveTo(point, time, func) {} // Initiates a camera-travel-animation that moves the camera's focus to new LowRes(point), that takes time seconds long, and follows the progress graph made by func(t) on the interval [0,1].
    forceBoundaries(topleft, bottomright) {} // A square representing the space within which the camera will always be. If boundaries are too small (zoomed out), the camera will do its best.
    disableBoundaries() {}      // Removes the enforcement of boundaries once again.
    setFocusBox(topleft, bottomright) {} // The box inside the camera's view (points relative to the camera's transform) which defines the space the focused object can move without moving the camera. If TL == BR, or better yet BR == null, then the 'box' is a point.

    update() {}                 // Moves the camera if focus is outside the focus window. Follows movement graph by first finding a point-intersection between its focus window and the focused object and then calculating the distance of that point to the destination.

    // stage should be resized by the window.
    // scene (I create, and accessible via Game().scene) has all the layers and whatever added to it, has zoom, pan and rotate, etc.
    // Camera will naturally interface with scene.
    // scene.x = -Camera.x
    // scene.scale = Camera.zoom   2x = doubly size, 1x = normal, 0.5x = half-pint
    // scene.rotate = -Camera.rotate
    // scene.anchor.x = Camera.x + Camera.anchor.x

    // DoR maintains 3 tiles of 16px around the cursor at all times normally,
    // while its map designer maintains 3.5 up, 3 left/right, 4.5 down.
    // Make of that what you will.
    // I'm also not using DS screen dimensions...
}