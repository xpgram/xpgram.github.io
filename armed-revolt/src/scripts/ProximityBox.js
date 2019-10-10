/**
 * A container representing a 3x3 grid of objects surrounding a central object.
 * 
 * @param list A 9-length list of anything. ProximityBox interprets this as a 3x3 grid of row-then-column values.
 * 
 * @author Dei Valko
 * @version 0.1.0
 */
export class ProximityBox {
    list = [];

    /**
     * @param {any[]} list 
     */
    constructor(list) {
        if (list.length > 9)
            throw "Given list of proximal points is too many.";
        if (list.length < 9)
            throw "Given list of proximal points is too few.";

        this.list = list;
    }

    get upleft() { return this.list[0]; }
    get left() { return this.list[1]; }
    get downleft() { return this.list[2]; }
    get up() { return this.list[3]; }
    get center() { return this.list[4]; }
    get down() { return this.list[5]; }
    get upright() { return this.list[6]; }
    get right() { return this.list[7]; }
    get downright() { return this.list[8]; }
}