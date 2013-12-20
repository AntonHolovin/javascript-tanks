/**
 * Represents tank model
 * @param Number x          x-coordination of the tank
 * @param Number y          y-coordination of the tank
 * @param String spritePath path to the sprite sheet
 * @param Number speed      start speed of the tank
 */
function Tank(x, y, spritePath, speed) {

    /**
     * Tanks direction
     * @type Direction
     */
    var currentDirection;

    /**
     * Tanks animation
     * @type Sprite
     */
    var animation = setupAnimation();

    /**
     * Build tank animation
     * @return Sprite esaeljs object 
     */
    function setupAnimation() {

        var data = {
            "images": [spritePath],
            "frames": {
                "width": tankSize.width,
                "height": tankSize.height
            },
            "animations": {
                "up": {
                    "frames": [0]
                },
                "left": {
                    "frames": [1]
                },
                "down": {
                    "frames": [2]
                },
                "right": {
                    "frames": [3]
                }
            }
        };

        var spriteSheet = new createjs.SpriteSheet(data);
        currentDirection = Direction.up;

        var result = new createjs.Sprite(spriteSheet, currentDirection);
        result.x = x;
        result.y = y;


        return result;
    }

    /**
     * Get tanks direction
     * @return Direction direction of the tank
     */
    this.getDirection = function() {
        return currentDirection;
    }

    /**
     * Get tanks height
     * @return Number height of the tank
     */
    this.getHeight = function() {
        return tankSize.height;
    }

    /**
     * Get tanks width
     * @return Number width of the tank
     */
    this.getWidth = function() {
        return tankSize.width;
    }

    /**
     * Get x-coordinate of the tanks barrel
     * @return Number x-coordinate
     */
    this.getBarrelX = function() {

        var result = animation.x;

        switch (currentDirection) {
            case Direction.up:
                result += tankSize.width / 2;
                break;
            case Direction.down:
                result += tankSize.width / 2;
                break;
            case Direction.right:
                result += tankSize.width;
                break;
        }

        return result;
    }

    /**
     * Get y-coordinate of the tanks barrel
     * @return Number y-coordinate
     */
    this.getBarrelY = function() {

        var result = animation.y;

        switch (currentDirection) {
            case Direction.down:
                result += tankSize.height;
                break;
            case Direction.left:
                result += tankSize.height / 2;
                break;
            case Direction.right:
                result += tankSize.height / 2;
                break;
        }

        return result;
    }

    /**
     * Get center x of the tank
     * @return Number x-coordinate
     */
    this.getCenterX = function() {
        return animation.x + tankSize.width / 2;
    }

    /**
     * Get center y of the tank
     * @return Number y-coordinate
     */
    this.getCenterY = function() {
        return animation.y + tankSize.height / 2;
    }

    /**
     * Get x-coordinate of the tank
     * @return Number x-coordinate
     */
    this.getX = function() {
        return animation.x;
    }

    /**
     * Get y-coordinate of the tank
     * @return Number y-coordinate
     */
    this.getY = function() {
        return animation.y;
    }

    /**
     * Get base DisplayObject of tank
     * @return DisplayObject easeljs object
     */
    this.getAnimation = function() {
        return animation;
    }

    /**
     * Increment tanks speed
     */
    this.incrementSpeed = function() {
        speed++;
    }

    /**
     * Move tank to up
     */
    this.moveUp = function() {
        animation.y -= speed;
    }

    /**
     * Move tank to down
     */
    this.moveDown = function() {
        animation.y += speed;
    }

    /**
     * Move tank to left
     */
    this.moveLeft = function() {
        animation.x -= speed;
    }

    /**
     * Move tank to right
     */
    this.moveRight = function() {
        animation.x += speed;
    }

    /**
     * Direct tank to up
     */
    this.animateUp = function() {
        currentDirection = Direction.up;
        animation.gotoAndPlay(currentDirection);
    }

    /**
     * Direct tank to down
     */
    this.animateDown = function() {
        currentDirection = Direction.down;
        animation.gotoAndPlay(currentDirection);
    }

    /**
     * Direct tank to left
     */
    this.animateLeft = function() {
        currentDirection = Direction.left;
        animation.gotoAndPlay(currentDirection);
    }

    /**
     * Direct tank to right
     */
    this.animateRight = function() {
        currentDirection = Direction.right;
        animation.gotoAndPlay(currentDirection);
    }
}