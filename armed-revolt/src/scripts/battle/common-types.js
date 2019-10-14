//@ts-check

// This is an amazingly dumb way to write enums,
// but it's the only viable option I have until someone tells me different.
// Unless I just start using typescript, I guess.

/**
 * 
 */
export class MoveType {
    static Infantry = 0;
    static Mech     = 1;
    static TireA    = 2;
    static TireB    = 3;
    static Tread    = 4;
    static Air      = 5;
    static Ship     = 6;
    static Transport = 7;
}

/**
 * 
 */
export class ArmorType {
    static Infantry = 0;
    static Vehicle  = 1;
    static Air      = 2;
    static Heli     = 3;
    static Ship     = 4;
    static Sub      = 5;
}

/**
 * 
 */
export class UnitClass {
    static None     = 0;
    static Ground   = 1;
    static Naval    = 2;
    static Air      = 3;
}

/**
 * 
 */
export class Faction {
    static Neutral = 0;
    static Red     = 1; // 12th Battalion
    static Blue    = 2; // Lazurian Army
    static Yellow  = 3; // New Rubinelle Army / NRA
    static Black   = 4; // Intelligence Defense Systems / IDS
}