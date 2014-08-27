/**
 * Created by kenkozheng on 2014/8/21.
 */

var Obstacle = cc.Sprite.extend({
    
    type:0,

    /** Speed of the obstacle. */
    speed:0,
    
    /** Distance after which the obstacle should appear on screen. */
    distance:0,
    
    /** Look out sign status. */
    showLookOut:true,
    
    /** Has the hero already collided with the obstacle? */
    alreadyHit:false,
    
    /** Vertical position of the obstacle. [String] */
    position:null,

    _lookoutAnimation:null,

    _lookoutAction:null,

    ctor:function (type, showLookOut, position, speed, distance) {
        this._super();
        this.reuse(type, showLookOut, position, speed, distance);

        return true;
    },

    hideLookout:function(){
        if(this._lookoutAnimation){
            this._lookoutAnimation.setVisible(false);
        }
    },

    /**
     * call by cc.pool.getFromPool
     * @param type int
     */
    reuse:function(type, showLookOut, position, speed, distance) {
        if(type == GameConstants.OBSTACLE_TYPE_4){
            this.setSpriteFrame("obstacle4_0001.png");      //先设置皮肤，用于sprite计算自己的大小
            var animation = new cc.Animation();
            animation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame("obstacle4_0001.png"));
            animation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame("obstacle4_0002.png"));
            animation.setDelayPerUnit(1/10);
            var action = cc.animate(animation).repeatForever();
            this.runAction(action);
        }else{
            this.setSpriteFrame("obstacle" + type + ".png");
        }
        this.showLookOut = showLookOut;
        this.position = position;
        this.speed = speed;
        this.distance = distance;
        this.alreadyHit = false;
        this.type = type;

        if(showLookOut){
            if(!this._lookoutAnimation) {
                this._lookoutAnimation = new cc.Sprite("#watchOut_0001.png");
                this.addChild(this._lookoutAnimation);
            }else{
                this._lookoutAnimation.setVisible(true);
            }
            if(!this._lookoutAction){
                var animation1 = new cc.Animation();
                animation1.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame("watchOut_0001.png"));
                animation1.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame("watchOut_0002.png"));
                animation1.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame("watchOut_0003.png"));
                animation1.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame("watchOut_0004.png"));
                animation1.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame("watchOut_0005.png"));
                animation1.setDelayPerUnit(1 / 10);
                this._lookoutAction = cc.animate(animation1).repeatForever();
                this._lookoutAction.retain();
            }
            this._lookoutAnimation.runAction(this._lookoutAction);
            this._lookoutAnimation.x = -this._lookoutAnimation.width;
            this._lookoutAnimation.y = this._lookoutAnimation.height/2;
        }
    },

    unuse:function() {
        this.stopAllActions();
        this.setRotation(0);
        this.hideLookout();
        this.retain();          //jsb必须加这句
    },

    crash:function() {
        this.stopAllActions();
        this.setSpriteFrame("obstacle" + this.type + "_crash.png");
    }

});

Obstacle.create = function(type, showLookOut, position, speed, distance){
    if(cc.pool.hasObj(Obstacle)) {
        return cc.pool.getFromPool(Obstacle, type, showLookOut, position, speed, distance);
    }
    else{
        return new Obstacle(type, showLookOut, position, speed, distance);
    }
}