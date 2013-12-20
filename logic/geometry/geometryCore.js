/**
 * Global object that represents operations with 2D geometry
 */
function GeometryCore() {

}

/**
 * Checks is circle intersects rectangle
 * @param  {Circle}  circle    
 * @param  {Rectangle}  rectangle 
 * @return {Boolean}           attribute
 */
GeometryCore.isCircleIntersectsRectangle = function(circle, rectangle) {

    if (circle != null && rectangle != null) {
        var circleDistanceX = Math.abs(circle.getX() - rectangle.getCenterX());
        var circleDistanceY = Math.abs(circle.getY() - rectangle.getCenterY());

        if (circleDistanceX > (rectangle.getWidth() / 2 + circle.getRadius())) {
            return false;
        }

        if (circleDistanceY > (rectangle.getHeight() / 2 + circle.getRadius())) {
            return false;
        }

        if (circleDistanceX <= (rectangle.getWidth() / 2)) {
            return true;
        }

        if (circleDistanceY <= (rectangle.getHeight() / 2)) {
            return true;
        }

        cornerDistance = Math.pow((circleDistanceX - rectangle.getWidth() / 2), 2) +
            Math.pow((circleDistanceY - rectangle.getHeight() / 2), 2);

        return cornerDistance <= Math.pow(circle.getRadius(), 2);
    } else {
        return false;
    }
}

/**
 * Checks is y-coordinate of the some object in the top border or not
 * @param  {Number}  y y-coordinate
 * @return {Boolean}   attribute
 */
GeometryCore.isInTopBorder = function(y) {
    return y > 0;
}

/**
 * Checks is y-coordinate of the some object in the bottom border or not
 * @param  {Number}  y y-coordinate
 * @param  {Number}  height of the object
 * @param  {Number}  bottomBorder bottom border 
 * @return {Boolean}              attribute
 */
GeometryCore.isInBottomBorder = function(y, height, bottomBorder) {
    return y + height < bottomBorder;
}

/**
 * Checks is x-coordinate of the some object in the left border or not
 * @param  {Number}  x x-coordinate
 * @return {Boolean}   attribute
 */
GeometryCore.isInLeftBorder = function(x) {
    return x > 0;
}

/**
 * Checks is x-coordinate of the some object in the right border or not
 * @param  Number  x           x-coordinate
 * @param  Number  width       width of the object
 * @param  Number  rightBorder right border
 * @return {Boolean}             attribute
 */
GeometryCore.isInRightBorder = function(x, width, rightBorder) {
    return x + width < rightBorder;
}

/**
 * Checks is two rectangles intersects with each other
 * @param  {Rectangle}  firstRectangule  
 * @param  {Rectangle}  secondRectangule 
 * @return {Boolean}                   attribute
 */
GeometryCore.isRectangularsIntersects = function(firstRectangular, secondRectangular) {
    var firstLeft = firstRectangular.getX();
    var firstRight = firstRectangular.getX() + tankSize.width;
    var firstTop = firstRectangular.getY();
    var firstBottom = firstRectangular.getY() + tankSize.height;

    var secondRight = secondRectangular.getX() + tankSize.width;
    var secondLeft = secondRectangular.getX();
    var secondBottom = secondRectangular.getY() + tankSize.height;
    var secondTop = secondRectangular.getY();

    return (firstLeft <= secondRight) && (secondLeft <= firstRight) && (firstTop <= secondBottom) && (secondTop <= firstBottom);
}

/**
 * Checks is circle out of border
 * @param  {Circle}  circle 
 * @param  {Number}  height height of the border
 * @param  {Number}  width  width of the border
 * @return {Boolean}        attribute
 */
GeometryCore.isCircleOutOfBorder = function(circle, height, width) {
    return circle.getY() < 0 || circle.getY() > height || circle.getX() < 0 || circle.getX() > width;
}