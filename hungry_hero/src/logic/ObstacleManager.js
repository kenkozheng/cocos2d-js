/**
 * Created by kenkozheng on 2014/8/22.
 */

var ObstacleManager = cc.Class.extend({

    _container: null,
    _gameScene: null,
    _obstaclesToAnimate: null,

    /** Obstacle count - to track the frequency of obstacles. */
    _obstacleGapCount: 0,

    ctor: function (gameScene) {
        this._container = gameScene.itemBatchLayer;
        this._gameScene = gameScene;
        this._obstaclesToAnimate = new Array();
    },

    init: function () {
        this.removeAll();
        Game.user.hitObstacle = 0;
    },

    removeAll: function () {
        if (this._obstaclesToAnimate.length > 0) {
            for (var i = this._obstaclesToAnimate.length - 1; i >= 0; i--) {
                var item = this._obstaclesToAnimate[i];
                this._obstaclesToAnimate.splice(i, 1);
                cc.pool.putInPool(item);
                this._container.removeChild(item);
            }
        }
    },

    /**
     * @param hero
     * @param elapsed 秒，见GameScene.update
     */
    update: function (hero, elapsed) {
        // Create an obstacle after hero travels some distance (obstacleGap).
        if (this._obstacleGapCount < GameConstants.OBSTACLE_GAP) {
            this._obstacleGapCount += Game.user.heroSpeed * elapsed;
        }
        else if (this._obstacleGapCount != 0) {
            this._obstacleGapCount = 0;

            // Create any one of the obstacles.
            this._createObstacle(Math.ceil(Math.random() * 4), Math.random() * 1000 + 1000);
        }
        this._animateObstacles(hero, elapsed);
    },

    /**
     * Create the obstacle object based on the type indicated and make it appear based on the distance passed.
     * @param type
     * @param distance
     */
    _createObstacle: function (type, distance) {
        var winSize = cc.director.getWinSize();
        var x = winSize.width;
        var y = 0;
        var position = null;
        // For only one of the obstacles, make it appear in either the top or bottom of the screen.
        if (type <= GameConstants.OBSTACLE_TYPE_3) {
            if (Math.random() > 0.5) {
                y = winSize.height - GameConstants.GAME_AREA_TOP_BOTTOM;
                position = "top";
            }
            else {
                y = GameConstants.GAME_AREA_TOP_BOTTOM;
                position = "bottom";
            }
        }
        else {
            y = Math.floor(Math.random() * (winSize.height - 2 * GameConstants.GAME_AREA_TOP_BOTTOM)) + GameConstants.GAME_AREA_TOP_BOTTOM;
            position = "middle";
        }

        var obstacle = Obstacle.create(type, true, position, GameConstants.OBSTACLE_SPEED, distance);
        obstacle.x = x + obstacle.width/2;
        obstacle.y = y;
        this._obstaclesToAnimate.push(obstacle);
        this._container.addChild(obstacle);
    },

    _animateObstacles: function (hero, elapsed) {
        var obstacle;
        for (var i = this._obstaclesToAnimate.length - 1; i >= 0; i--) {
            obstacle = this._obstaclesToAnimate[i];

            // If the distance is still more than 0, keep reducing its value, without moving the obstacle.
            if (obstacle.distance > 0) {
                obstacle.distance -= Game.user.heroSpeed * elapsed;
            }
            else {
                // Otherwise, move the obstacle based on hero's speed, and check if he hits it. 

                // Remove the look out sign.
                obstacle.hideLookout();

                // Move the obstacle based on hero's speed.
                obstacle.x -= (Game.user.heroSpeed + obstacle.speed) * elapsed;
            }

            // If the obstacle passes beyond the screen, remove it.
            if (obstacle.x < -obstacle.width || Game.gameState == GameConstants.GAME_STATE_OVER) {
                this._obstaclesToAnimate.splice(i, 1);
                cc.pool.putInPool(obstacle);
                this._container.removeChild(obstacle);
                continue;
            }

            // Collision detection - Check if hero collides with any obstacle.
            var heroObstacle_xDist = obstacle.x - hero.x;
            var heroObstacle_yDist = obstacle.y - hero.y;
            var heroObstacle_sqDist = heroObstacle_xDist * heroObstacle_xDist + heroObstacle_yDist * heroObstacle_yDist;

            if (heroObstacle_sqDist < 5000 && !obstacle.alreadyHit) {
                obstacle.alreadyHit = true;
                obstacle.crash();
                Sound.playHit();

                if (Game.user.coffee > 0) {
                    // If hero has a coffee item, break through the obstacle.
                    if (obstacle.position == "bottom") obstacle.setRotation(100);
                    else obstacle.setRotation(-100);

                    // Set hit obstacle value.
                    Game.user.hitObstacle = 30;

                    // Reduce hero's speed
                    Game.user.heroSpeed *= 0.8;
                }
                else {
                    if (obstacle.position == "bottom") obstacle.setRotation(70);
                    else obstacle.setRotation(-70);

                    // Otherwise, if hero doesn't have a coffee item, set hit obstacle value.
                    Game.user.hitObstacle = 30;

                    // Reduce hero's speed.
                    Game.user.heroSpeed *= 0.5;

                    // Play hurt sound.
                    Sound.playHurt();

                    // Update lives.
                    Game.user.lives--;

                    if (Game.user.lives <= 0) {
                        Game.user.lives = 0;
                        this._gameScene.endGame();
                    }
                }
            }
        }
    }

});