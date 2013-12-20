// stage update options
var FPS = 30;
var TICK_EVENT_LISTENER_NAME = "tick";

// hold key flags
var leftHold;
var rightHold;
var upHold;
var downHold;
var spaceHold;

// codes of the keys
var KEYCODE_UP = 38;
var KEYCODE_DOWN = 40;
var KEYCODE_LEFT = 37;
var KEYCODE_RIGHT = 39;
var KEYCODE_SPACE = 32;

var playing;

// HTML5 canvas and easeljs stage
var canvas;
var stage;

// start coordinates of the tank
var START_X = 250;
var START_Y = 250;

// players variables
var ownTank;
var ownRocket;
var ownSpeed = 3;
var ownRocketSpeed = 10;

// enemies variables
var ENEMY_TANKS_COUNT = 3;
var enemies;

var enemiesDirections;
var enemiesRockets;
var isEnemiesFiring;
var enemySpeed = 5;
var enemyRocketSpeed = 10;

// titles
var titleFiled;
var scoreField;

/**
 * Document ready jquery-handler
 */
$(document).ready(function() {

    playing = true;

    setupStage();

    setupFileds();
    setupOwnTank();

    setupEnemies();

    // generate enemies 
    setInterval(function() {
        fillEnemyTanks()
    }, 5 * 1000);

    // change enemies directions 
    setInterval(function() {
        generateEnemiesDirections()
    }, 1 * 1000);

    // generate fire events for enemies
    setInterval(function() {
        generateEnemiesFire()
    }, 2 * 1000);

    // setup game update
    if (!createjs.Ticker.hasEventListener(TICK_EVENT_LISTENER_NAME)) {
        createjs.Ticker.setFPS(FPS);
        createjs.Ticker.addEventListener(TICK_EVENT_LISTENER_NAME, tick);
    }

    /**
     * First stage setup
     */
    function setupStage() {

        canvas = document.getElementById("main-canvas");
        stage = new createjs.Stage(canvas);
    }

    /**
     * Setups text fields
     */
    function setupFileds() {

        scoreField = new createjs.Text("0", "bold 12px Arial", "#FFFFFF");
        scoreField.textAlign = "right";
        scoreField.x = canvas.width - 20;
        scoreField.y = canvas.height - 20;
        scoreField.maxWidth = 100;

        titleFiled = new createjs.Text("", "bold 40px Arial", "#FFFFFF");
        titleFiled.textAlign = "center";
        titleFiled.x = canvas.width / 2;
        titleFiled.y = canvas.height / 2;

        stage.addChild(scoreField);
    }

    /**
     * Setups parameters of the own tank
     */
    function setupOwnTank() {

        ownTank = new Tank(START_X, START_Y, "sprites/tanks.png", ownSpeed);
        stage.addChild(ownTank.getAnimation());
    }

    /**
     * Setups parameters of the enemies
     */
    function setupEnemies() {

        enemies = new Array();
        enemiesDirections = new Array();

        for (var i = 0; i < ENEMY_TANKS_COUNT; i++) {
            enemiesDirections.push(Randomizer.getRandomDirection());
        }

        enemiesRockets = new Array();
        isEnemiesFiring = new Array();
    }

    /**
     * Handler of the stage update
     * @param  Event event easeljs object
     */
    function tick(event) {

        if (playing) {
            handleTankNavigation();

            handleTankFire();
        }

        handleRocketNavigation();


        handleEnemiesNavigation();

        handleEnemiesFire();
        handleEnemiesRocketsNavigation();

        stage.update(event);
    }

    /**
     * Handler for own tank fire
     */
    function handleTankFire() {

        if (spaceHold && ownRocket == null) {
            ownRocket = createRocket(ownTank, ownRocketSpeed);
        }
    }

    /**
     * Handler for enemies fire
     */
    function handleEnemiesFire() {

        if (isEnemiesFiring.length == 0) { // not generated yet
            return;
        }

        if (enemiesRockets.length == 0) { // first filling

            for (var i = 0; i < enemies.length; i++) {

                if (isEnemiesFiring[i]) {
                    enemiesRockets.push(createRocket(enemies[i], enemyRocketSpeed));
                }
            }
        } else {
            for (var i = 0; i < enemies.length; i++) {
                if (isEnemiesFiring[i] && enemiesRockets[i] == null) {
                    enemiesRockets[i] = createRocket(enemies[i], enemyRocketSpeed);
                }
            }
        }
    }

    /**
     * Creates rocket
     * @param  Tank tank  tank that fired
     * @param Number speed speed of the rocket
     * @return Rocket       created rocket
     */
    function createRocket(tank, speed) {
        var rocket = new Rocket(tank.getBarrelX(), tank.getBarrelY(), tank.getDirection(), speed);
        stage.addChild(rocket.getShape());

        return rocket;
    }

    /**
     * Moves own rocket when the stage updates
     */
    function handleRocketNavigation() {

        if (ownRocket != null) {
            ownRocket.move();

            if (GeometryCore.isCircleOutOfBorder(ownRocket, canvas.height, canvas.width)) {
                destroyOwnRocket();
            }

            handleRocketEnemyHit();
        }
    }

    /**
     * Moves enemies rockets when the stage updates
     */
    function handleEnemiesRocketsNavigation() {

        for (var i = 0; i < enemiesRockets.length; i++) {
            if (enemiesRockets[i] != null) {
                enemiesRockets[i].move();

                if (GeometryCore.isCircleOutOfBorder(enemiesRockets[i], canvas.height, canvas.width)) {
                    stage.removeChild(enemiesRockets[i].getShape());
                    enemiesRockets[i] = null;
                }

                if (GeometryCore.isCircleIntersectsRectangle(enemiesRockets[i], ownTank)) {
                    stage.removeChild(enemiesRockets[i].getShape());
                    enemiesRockets[i] = null;

                    stopGame();
                }
            }
        }
    }

    /**
     * Stops game
     */
    function stopGame() {

        stage.removeChild(ownTank.getAnimation());
        ownTank = null;
        stage.addChild(titleFiled);

        titleFiled.text = "Game Over D:\n Score: " + scoreField.text;
        scoreField.text = "Press F5 to play again";
        playing = false;
    }

    /**
     * Handler for enemies moving
     */
    function handleEnemiesNavigation() {

        for (var i = 0; i < enemies.length; i++) {
            switch (enemiesDirections[i]) {
                case Direction.up:
                    enemies[i].animateUp();

                    if (GeometryCore.isInTopBorder(enemies[i].getY())) {
                        enemies[i].moveUp();
                    }
                    break;
                case Direction.down:
                    enemies[i].animateDown();

                    if (GeometryCore.isInBottomBorder(enemies[i].getY(), enemies[i].getHeight(), canvas.height)) {
                        enemies[i].moveDown();
                    }
                    break;
                case Direction.left:
                    enemies[i].animateLeft();

                    if (GeometryCore.isInLeftBorder(enemies[i].getX())) {
                        enemies[i].moveLeft();
                    }
                    break;
                case Direction.right:
                    enemies[i].animateRight();

                    if (GeometryCore.isInRightBorder(enemies[i].getX(), enemies[i].getWidth(), canvas.width)) {
                        enemies[i].moveRight();
                    }
                    break;
                case Direction.stop:
                    // nop
                    break;
            }
        }
    }

    /**
     * Generates direction for each enemy
     */
    function generateEnemiesDirections() {

        if (enemiesDirections.length == 0) { // first filling

            for (var i = 0; i < ENEMY_TANKS_COUNT; i++) {
                enemiesDirections.push(Randomizer.getRandomDirection());
            }
        } else {
            for (var i = 0; i < enemiesDirections.length; i++) {
                enemiesDirections[i] = Randomizer.getRandomDirection();
            }
        }
    }

    /**
     * Generates events of the enemies fire
     */
    function generateEnemiesFire() {

        if (isEnemiesFiring.length == 0) { // first filling
            for (var i = 0; i < ENEMY_TANKS_COUNT; i++) {
                isEnemiesFiring.push(Randomizer.getRandomBoolean());
            }
        } else {
            for (var i = 0; i < isEnemiesFiring.length; i++) {
                isEnemiesFiring[i] = Randomizer.getRandomBoolean();
            }
        }
    }

    /**
     * Generates the new enemies
     */
    function fillEnemyTanks() {

        var newTanksCount = ENEMY_TANKS_COUNT - enemies.length;

        for (var i = 0; i < newTanksCount; i++) {

            var enemyTankPosition = Randomizer.getRandomValue(EnemyStartPosition.first, EnemyStartPosition.third);

            var x = calculateEnemyStartX(enemyTankPosition);
            var y = 0

            enemy = new Tank(x, y, "sprites/enemy tanks.png", enemySpeed);

            enemies.push(enemy);
            stage.addChild(enemy.getAnimation());
        }
    }

    /**
     * Calculates part of the real  position of the enemy
     * @param  EnemyStartPosition enemyTankPosition one of the three positions
     * @return Number                   x coordinate
     */
    function calculateEnemyStartX(enemyTankPosition) {

        var result;

        switch (enemyTankPosition) {
            case EnemyStartPosition.first:
                result = 0;
                break;

            case EnemyStartPosition.second:
                result = canvas.width / 2 - tankSize.width / 2;
                break;

            case EnemyStartPosition.third:
                result = canvas.width - tankSize.width;
                break;
        }

        return result;
    }

    /**
     * Handler for hit of the enemy
     */
    function handleRocketEnemyHit() {

        var hittedEnemyIndex = -1;

        for (var i = 0; i < enemies.length; i++) {

            if (GeometryCore.isCircleIntersectsRectangle(ownRocket, enemies[i])) {
                hittedEnemyIndex = i;
            }
        }

        if (hittedEnemyIndex != -1) {

            var enemy = enemies[hittedEnemyIndex];

            stage.removeChild(enemy.getAnimation());
            enemies.splice(hittedEnemyIndex, 1);

            destroyOwnRocket();

            var newScore = parseInt(scoreField.text) + 10;
            scoreField.text = newScore;


            if (newScore % 50 == 0) {
                enemySpeed++;
                enemyRocketSpeed++;
            }

            if (newScore % 100 == 0) {
                ownTank.incrementSpeed();
                ownRocketSpeed++;
            }
        }
    }

    /**
     * Removes own rocket from the stage
     */
    function destroyOwnRocket() {
        stage.removeChild(ownRocket.getShape());
        ownRocket = null;
    }

    /**
     * Handler for own tank navigation
     */
    function handleTankNavigation() {

        if (upHold) {

            ownTank.animateUp();

            if (GeometryCore.isInTopBorder(ownTank.getY())) {
                ownTank.moveUp();

                if (isIntersectWithEnemies()) {
                    ownTank.moveDown();
                }
            }

        } else if (downHold) {

            ownTank.animateDown();

            if (GeometryCore.isInBottomBorder(ownTank.getY(), ownTank.getHeight(), canvas.height)) {
                ownTank.moveDown();

                if (isIntersectWithEnemies()) {
                    ownTank.moveUp();
                }
            }

        } else if (leftHold) {

            ownTank.animateLeft();

            if (GeometryCore.isInLeftBorder(ownTank.getX())) {
                ownTank.moveLeft();

                if (isIntersectWithEnemies()) {
                    ownTank.moveRight();
                }
            }

        } else if (rightHold) {

            ownTank.animateRight();

            if (GeometryCore.isInRightBorder(ownTank.getX(), ownTank.getWidth(), canvas.width)) {
                ownTank.moveRight();

                if (isIntersectWithEnemies()) {
                    ownTank.moveLeft();
                }
            }
        }
    }

    /**
     * Returns attribute of the intersection with enemies
     * @return Boolean value of the attribute
     */
    function isIntersectWithEnemies() {
        for (var i = 0; i < enemies.length; i++) {
            if (GeometryCore.isRectangularsIntersects(ownTank, enemies[i])) {
                return true;
            }
        }

        return false;
    }
});

/**
 * Keydown handler (listens arrows and space)
 * @param  Event event jquery event
 */
$(document).keydown(function(event) {
    switch (event.which) {
        case KEYCODE_UP:
            upHold = true;
            break;
        case KEYCODE_LEFT:
            leftHold = true;
            break;
        case KEYCODE_RIGHT:
            rightHold = true;
            break;
        case KEYCODE_DOWN:
            downHold = true;
            break;
        case KEYCODE_SPACE:
            spaceHold = true;
            break;
    }
});

/**
 * Keyup handler (listens arrows and space)
 * @param  Event event jquery event
 */
$(document).keyup(function(event) {
    switch (event.which) {
        case KEYCODE_UP:
            upHold = false;
            break;
        case KEYCODE_LEFT:
            leftHold = false;
            break;
        case KEYCODE_RIGHT:
            rightHold = false;
            break;
        case KEYCODE_DOWN:
            downHold = false;
            break;
        case KEYCODE_SPACE:
            spaceHold = false;
            break;
    }
});