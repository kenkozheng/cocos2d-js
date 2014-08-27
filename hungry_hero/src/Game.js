/**
 * Created by kenkozheng on 2014/8/21.
 * This game is based on the Flash Starling version of Hungry-Hero created by Hsharma, visit http://www.hungryherogame.com
 */

var Game = {

    user:{
        lives:GameConstants.HERO_LIVES,
        score:0,
        distance:0,
        heroSpeed:0,
        coffee:0,
        mushroom:0,
        hitObstacle:0
    },

    gameState:null,

    /**
     * 整个游戏的真正入口
     */
    start:function(){
        cc.spriteFrameCache.addSpriteFrames("res/graphics/texture.plist");
        cc.director.runScene(new MenuScene());
    }
};


var jslog = function() {
    cc.log(Array.prototype.join.call(arguments, ", "));
};