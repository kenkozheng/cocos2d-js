/**
 * Created by kenkozheng on 2014/8/21.
 */

var GameScene = cc.Scene.extend({

    _ui:null,
    _gameOverUI:null,
    _background:null,
    _hero:null,
    itemBatchLayer:null,
    _coffeeEffect:null,
    _mushroomEffect:null,
    _windEffect:null,

    _foodManager:null,
    _obstacleManager:null,

    _touchY:0,
    _cameraShake:0,


    ctor:function () {
        this._super();
        var layer = new cc.Layer();
        this.addChild(layer);

        this._background = new GameBackground();
        layer.addChild(this._background);

        this._hero = new Hero();
        this.addChild(this._hero);

        this.itemBatchLayer = new cc.SpriteBatchNode("res/graphics/texture.png");
        this.addChild(this.itemBatchLayer);

        this._ui = new GameSceneUI();
        this.addChild(this._ui);
        this._ui.update();

        if("touches" in cc.sys.capabilities)
            cc.eventManager.addListener({event: cc.EventListener.TOUCH_ALL_AT_ONCE, onTouchesMoved: this._onTouchMoved.bind(this)}, this);
        else
            cc.eventManager.addListener({event: cc.EventListener.MOUSE, onMouseMove: this._onMouseMove.bind(this)}, this);
        cc.eventManager.addListener({event: cc.EventListener.KEYBOARD, onKeyReleased: this._back}, this);

        this._foodManager = new FoodManager(this);
        this._obstacleManager = new ObstacleManager(this);

        this.init();

        return true;
    },

    init:function() {
        Sound.stop();
        Sound.playGameBgMusic();
        if(this._gameOverUI)
            this._gameOverUI.setVisible(false);

        var winSize = cc.director.getWinSize();
        this._ui.setVisible(true);
        Game.user.lives = GameConstants.HERO_LIVES;
        Game.user.score = Game.user.distance = 0;
        Game.gameState = GameConstants.GAME_STATE_IDLE;
        this._cameraShake = Game.user.heroSpeed = this._background.speed = 0;
        this._touchY = winSize.height/2;

        this._hero.x = -winSize.width/2;
        this._hero.y = winSize.height/2;

        this._foodManager.init();
        this._obstacleManager.init();

        this.stopCoffeeEffect();
        this.stopWindEffect();
        this.stopMushroomEffect();

        this.scheduleUpdate();
    },

    _onTouchMoved:function(touches, event) {
        if(Game.gameState != GameConstants.GAME_STATE_OVER)
            this._touchY = touches[0].getLocation().y;
    },

    _onMouseMove:function(event) {
        if(Game.gameState != GameConstants.GAME_STATE_OVER)
            this._touchY = event.getLocationY();
    },

    _back:function(keyCode, event) {
		if (keyCode == cc.KEY.back)
			cc.director.runScene(new MenuScene());
    },

    _handleHeroPose:function() {
        var winSize = cc.director.getWinSize();
        // Rotate this._hero based on mouse position.
        if (Math.abs(-(this._hero.y - this._touchY) * 0.2) < 30)
            this._hero.setRotation((this._hero.y - this._touchY) * 0.2);

        // Confine the this._hero to stage area limit
        if (this._hero.y < this._hero.height * 0.5)
        {
            this._hero.y = this._hero.height * 0.5;
            this._hero.setRotation(0);
        }
        if (this._hero.y > winSize.height - this._hero.height * 0.5)
        {
            this._hero.y = winSize.height - this._hero.height * 0.5;
            this._hero.setRotation(0);
        }
    },

    _shakeAnimation:function() {
        // Animate quake effect, shaking the camera a little to the sides and up and down.
        if (this._cameraShake > 0){
            this._cameraShake -= 0.1;
            this.x = parseInt(Math.random() * this._cameraShake - this._cameraShake * 0.5);
            this.y = parseInt(Math.random() * this._cameraShake - this._cameraShake * 0.5);
        } else if (this.x != 0) {
            // If the shake value is 0, reset the stage back to normal. Reset to initial position.
            this.x = 0;
            this.y = 0;
        }
    },

    showWindEffect:function() {
        if(this._windEffect)
            return;
        this._windEffect = new cc.ParticleSystem("res/particles/wind.plist");
        this._windEffect.x = cc.director.getWinSize().width;
        this._windEffect.y = cc.director.getWinSize().height/2;
        this._windEffect.setScaleX(100);
        this.addChild(this._windEffect);
    },

    stopWindEffect:function() {
        if(this._windEffect){
            this._windEffect.stopSystem();
            this.removeChild(this._windEffect);
            this._windEffect = null;
        }
    },

    showCoffeeEffect:function(){
        if(this._coffeeEffect)
            return;
        this._coffeeEffect = new cc.ParticleSystem("res/particles/coffee.plist");
        this.addChild(this._coffeeEffect);
        this._coffeeEffect.x = this._hero.x + this._hero.width/4;
        this._coffeeEffect.y = this._hero.y;
    },

    stopCoffeeEffect:function(){
        if(this._coffeeEffect){
            this._coffeeEffect.stopSystem();
            this.removeChild(this._coffeeEffect);
            this._coffeeEffect = null;
        }
    },

    showMushroomEffect:function(){
        if(this._mushroomEffect)
            return;
        this._mushroomEffect = new cc.ParticleSystem("res/particles/mushroom.plist");
        this.addChild(this._mushroomEffect);
        this._mushroomEffect.x = this._hero.x + this._hero.width/4;
        this._mushroomEffect.y = this._hero.y;
    },

    stopMushroomEffect:function(){
        if(this._mushroomEffect){
            this._mushroomEffect.stopSystem();
            this.removeChild(this._mushroomEffect);
            this._mushroomEffect = null;
        }
    },

    showEatEffect:function(itemX, itemY){
        var eat = new cc.ParticleSystem("res/particles/eat.plist");
        eat.setAutoRemoveOnFinish(true);
        eat.x = itemX;
        eat.y = itemY;
        this.addChild(eat);
    },

    /**
     * hero被碰撞N次后，结束游戏；结束之前，先播放hero掉落的动画
     */
    endGame:function(){
        this.x = 0;
        this.y = 0;
        Game.gameState = GameConstants.GAME_STATE_OVER;
    },

    _gameOver:function(){
        if(!this._gameOverUI){
            this._gameOverUI = new GameOverUI(this);
            this.addChild(this._gameOverUI);
        }
        this._gameOverUI.setVisible(true);
        this._gameOverUI.init();
    },

    /**
     *
     * @param elapsed 秒
     */
    update:function(elapsed) {
        var winSize = cc.director.getWinSize();
        switch(Game.gameState){
            case GameConstants.GAME_STATE_IDLE:
                // Take off.
                if (this._hero.x < winSize.width * 0.5 * 0.5)
                {
                    this._hero.x += ((winSize.width * 0.5 * 0.5 + 10) - this._hero.x) * 0.05;
                    this._hero.y -= (this._hero.y - this._touchY) * 0.1;

                    Game.user.heroSpeed += (GameConstants.HERO_MIN_SPEED - Game.user.heroSpeed) * 0.05;
                    this._background.speed = Game.user.heroSpeed * elapsed;
                }
                else
                {
                    Game.gameState = GameConstants.GAME_STATE_FLYING;
                    this._hero.state = GameConstants.HERO_STATE_FLYING;
                }
                this._handleHeroPose();
                this._ui.update();
                break;

            case GameConstants.GAME_STATE_FLYING:
                // If drank coffee, fly faster for a while.
                if (Game.user.coffee > 0)
                    Game.user.heroSpeed += (GameConstants.HERO_MAX_SPEED - Game.user.heroSpeed) * 0.2;
                else
                    this.stopCoffeeEffect();

                // If not hit by obstacle, fly normally.
                if (Game.user.hitObstacle <= 0) {
                    this._hero.y -= (this._hero.y - this._touchY) * 0.1;

                    // If this._hero is flying extremely fast, create a wind effect and show force field around this._hero.
                    if (Game.user.heroSpeed > GameConstants.HERO_MIN_SPEED + 100) {
                        this.showWindEffect();
                        // Animate this._hero faster.
                        this._hero.toggleSpeed(true);
                    }
                    else {
                        // Animate this._hero normally.
                        this._hero.toggleSpeed(false);
                        this.stopWindEffect();
                    }
                    this._handleHeroPose();

                } else {
                    // Hit by obstacle
                    if (Game.user.coffee <= 0)
                    {
                        // Play this._hero animation for obstacle hit.
                        if (this._hero.state != GameConstants.HERO_STATE_HIT){
                            this._hero.state = GameConstants.HERO_STATE_HIT;
                        }

                        // Move hero to center of the screen.
                        this._hero.y -= (this._hero.y - winSize.height/2) * 0.1;

                        // Spin the this._hero.
                        if (this._hero.y > winSize.height * 0.5)
                            this._hero.rotation -= Game.user.hitObstacle * 2;
                        else
                            this._hero.rotation += Game.user.hitObstacle * 2;
                    }

                    // If hit by an obstacle.
                    Game.user.hitObstacle--;

                    // Camera shake.
                    this._cameraShake = Game.user.hitObstacle;
                    this._shakeAnimation();
                }

                // If we have a mushroom, reduce the value of the power.
                if (Game.user.mushroom > 0) Game.user.mushroom -= elapsed;
                else this.stopMushroomEffect();

                // If we have a coffee, reduce the value of the power.
                if (Game.user.coffee > 0) Game.user.coffee -= elapsed;

                Game.user.heroSpeed -= (Game.user.heroSpeed - GameConstants.HERO_MIN_SPEED) * 0.01;

                // Create food items.
                this._foodManager.update(this._hero, elapsed);
                // Create obstacles.
                this._obstacleManager.update(this._hero, elapsed);

//                // Store the hero's current x and y positions (needed for animations below).
//                heroX = hero.x;
//                heroY = hero.y;
//
//                // Animate elements.
//                this._animateFoodItems();
//                this._animateObstacles();
//                this._animateEatParticles();
//                this._animateWindParticles();

                // Set the background's speed based on hero's speed.
                this._background.speed = Game.user.heroSpeed * elapsed;

                // Calculate maximum distance travelled.
                Game.user.distance += (Game.user.heroSpeed * elapsed) * 0.1;
                this._ui.update();

                break;

            case GameConstants.GAME_STATE_OVER:
                this._foodManager.removeAll();
                this._obstacleManager.removeAll();
    // Dispose the eat particle temporarily.
    // Dispose the wind particle temporarily.

                // Spin the hero.
                this._hero.setRotation(30);

                // Make the hero fall.

                // If hero is still on screen, push him down and outside the screen. Also decrease his speed.
                // Checked for +width below because width is > height. Just a safe value.
                if (this._hero.y > -this._hero.height/2)
                {
                    Game.user.heroSpeed -= Game.user.heroSpeed * elapsed;
                    this._hero.y -= winSize.height * elapsed;
                }
                else
                {
                    // Once he moves out, reset speed to 0.
                    Game.user.heroSpeed = 0;

                    // Stop game tick.
                    this.unscheduleUpdate();

                    // Game over.
                    this._gameOver();
                }

                // Set the background's speed based on hero's speed.
                this._background.speed = Game.user.heroSpeed * elapsed;
                break;
        }

        if(this._mushroomEffect) {
            this._mushroomEffect.x = this._hero.x + this._hero.width/4;
            this._mushroomEffect.y = this._hero.y;
        }
        if(this._coffeeEffect) {
            this._coffeeEffect.x = this._hero.x + this._hero.width/4;
            this._coffeeEffect.y = this._hero.y;
        }
    }

});
