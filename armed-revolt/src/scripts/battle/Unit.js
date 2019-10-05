/**
 * This class is a container for unit variable-stat information.
 * Things like its HP, its remaining Gas, etc.
 * Constant stats are accessible through this class, but are not actually determined here;
 * Unit simply asks its UnitType what the number should be and passes it along.
 * 
 * For fun, and because Advance Wars actually does this, I have packed all or most of its vital information into one 64-bit value
 * to save memory. I could have hundreds of units.
 * 
 * @author Dei Valko
 * @version 0.1.0
 */

// Constants
const AmmoBitshift = 7;
const CaptureBitshift = 11;
const GasBitshift = 16;
const RankBitshift = 23;

const HPBitmask = 0b1111111;
const AmmoBitmask = 0b1111 << AmmoBitshift;
const CaptureBitmask = 0b11111 << CaptureBitshift;
const GasBitmask = 0b1111111 << GasBitshift;
const RankBitmask = 0b111 << RankBitshift;

// Tools

/**
 * Confines n to the range (min, max) inclusive.
 */
function bound(n, min, max) {
    if (n < min) n = min;
    if (n > max) n = max;
    return n;
}

export class Unit {
    info; // JS numbers are 64-bit, not 16, but I'm using it regardless to pack in all vital information.
    type; // Which unit-kind this unit is.

    constructor(type) {
        this.type = type;
        this.info = 0;
        this.hp = 100;
        this.ammo = 0;  // We should use type to reference what these numbers should be.
        this.gas = 99;  // Just like Terrain, unit stats (since they're constant) will be in a generated namespace called UnitType
    }

    /**
     * @type {number} The number of hitpoints this unit currently has. Range [0, 100]
     */
    get hp() { return this.info & HPBitmask; }
    set hp(amount) {
        this.info = this.info & ~HPBitmask;
        this.info += bound(amount, 0, 100);
    }

    /**
     * @type {number} The number of ammo reserves this unit has for its main weapon. Range [0, 9]
     */
    get ammo() { return this.info & AmmoBitmask >> AmmoBitshift; }
    set ammo(amount) {
        this.info = this.info & ~AmmoBitmask;
        this.info += bound(amount, 0, 9) << AmmoBitshift;
    }

    /**
     * @type {number} The unit's progress toward capturing a base (only used by infantry types). Range [0, 20]
     */
    get capture() { return this.info & CaptureBistmask >> CaptureBitshift; }
    set capture(amount) {
        this.info = this.info & ~CaptureBitmask;
        this.info += bound(amount, 0, 20) << CaptureBitshift;
    }

    /**
     * @type {number} The distance in squares the unit is still able to travel. Range [0, 99]
     */
    get gas() { return this.info & GasBitmask >> GasBitshift; }
    set gas(amount) {
        this.info = this.info & ~GasBitmask;
        this.info += bound(amount, 0, 99) << GasBitshift;
    }

    /**
     * @type {number} The unit's experience level. Ranks go 0 > I > II > Veteran. Range [0, 3]
     */
    get rank() { return this.info & RankBitmask >> RankBitshift; }
    set rank(amount) {
        this.info = this.info & ~RankBitmask;
        this.info += bound(amount, 0, 3) << RankBitshift;
    }

    // Down here, I should probably write methods which ask the type for a constant (purely for convenience).
    // so
    get moveRange() { return this.type.moveRange; }
    // feels silly, and probably makes the whole thing less debugably readable, but ensures smoothness.(?)
}