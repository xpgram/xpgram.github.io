/**
 * Commonly useful functions.
 * 
 * @author Dei Valko
 * @version 0.1.0
 */

export var Common = {

    /**
     * Confines n to the range (min, max) inclusive.  
     * I'm going to trust you that min will always be less than max.  
     * Don't make me get out my paddle.
     */
    bindValue: (n, min, max) => {
        if (n < min) n = min;
        if (n > max) n = max;
        return n;
    },

}