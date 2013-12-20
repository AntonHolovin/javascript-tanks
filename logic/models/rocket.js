/**
 * Reresents rocket model
 * @param Number x         start x coordinate
 * @param Number y         start y coordinate
 * @param Direction direction direction of the rocket
 * @param Number speed     speed of the rocket
 */
function Rocket(x, y, direction, speed) {

    /**
     * Radious of the rocket
     * @type Number
     */
    var RADIUS = 2;

    /**
     * Rockets direction
     * @type Direction
     */
    var currentDirection = direction;

    /**
     * Base rockets shape (circle)
     * @type Shape
     */
    var shape = setupShape(x, y);

    /**
     * Moves rocket to installed direction
     */
    this.move = function() {

        switch (direction) {
            case Direction.up:
                shape.y -= speed;
                break;
            case Direction.down:
                shape.y += speed;
                break;
            case Direction.left:
                shape.x -= speed;
                break;
            case Direction.right:
                shape.x += speed;
                break;
        }
    }

    /**
     * Build rockets base shape (circle)
     * @param  Number x
     * @param  Number y
     * @return Shape
     */
    function setupShape(x, y) {
        var result = new createjs.Shape();
        result.x = x;
        result.y = y;

        result.graphics.beginFill("#FFFFFF").drawCircle(0, 0, RADIUS);

        return result;
    }

    /**
     * Get radius of the rockets shape
     * @return Number
     */
    this.getRadius = function() {
        return RADIUS;
    }

    /**
     * Get x-coordinate of the rockets shape
     * @return Number
     */
    this.getX = function() {
        return shape.x;
    }

    /**
     * Get y-coordinate of the rockets shape
     * @return Number
     */
    this.getY = function() {
        return shape.y;
    }

    /**
     * Get base rockets shape
     * @return Shape
     */
    this.getShape = function() {
        return shape;
    }
}