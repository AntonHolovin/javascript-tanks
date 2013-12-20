/**
 * Global object that represents operations with random values
 */
function Randomizer() {

}

/**
 * Returns random value from a to b
 * @param  Number a lover lomit
 * @param  Number b upper limit
 * @return Number   random value
 */
Randomizer.getRandomValue = function(a, b) {

    return Math.floor(Math.random() * (b - a + 1)) + a;
}

/**
 * Returns one of the Direction enum values
 * @return Direction random direction
 */
Randomizer.getRandomDirection = function() {

    var directions = $.map(Direction, function(item, index) {
        return [item];
    });

    var index = Randomizer.getRandomValue(0, directions.length - 1);

    return directions[index];
}

/**
 * Returns random Boolean
 * @return Boolean true or false
 */
Randomizer.getRandomBoolean = function() {
    return Math.random() > .5;
}