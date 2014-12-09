function trace(){
    cc.log(Array.prototype.join.call(arguments, ", "));
}

var GameLayer = cc.Layer.extend({

    ctor: function () {
        this._super();

        var size = cc.winSize;

        var bg = new cc.Sprite("res/bg.jpg");
        this.addChild(bg, 1);
        bg.x = size.width/2;
        bg.y = size.height/2;

        var batch = new cc.SpriteBatchNode("res/grossini.png");
        this.addChild(batch, 2);
        this.batch = batch;

        this.scheduleUpdate();

//        var batch2 = new cc.SpriteBatchNode("res/grossini_dance_13.png");
//        this.addChild(batch2, 3);
//
//        for (var i = 0; i < 2000; i++) {
//            var man = new cc.Sprite("res/grossini_dance_13.png");
//            var rotation = Math.random()*360;
//            man.runAction(cc.spawn(cc.rotateBy(1, rotation, rotation), cc.sequence(cc.scaleTo(1, 2), cc.scaleTo(1, 1))).repeatForever());
//            batch2.addChild(man, 2);
//            man.x = size.width*Math.random();
//            man.y = size.height/2*Math.random();
//        }

//        for (var j = 0; j < 2000; j++) {
//            var man = new cc.Sprite();
//            var animation = new cc.Animation();
//            for (var i = 1; i <= 14; i++) {
//                animation.addSpriteFrameWithFile("res/grossini_dance_" + (i < 10 ? ("0" + i) : i) + ".png");
//            }
//            animation.setDelayPerUnit(1 / 7);
//            man.runAction(cc.animate(animation).repeatForever());
//            man.x = size.width*Math.random();
//            man.y = size.height*Math.random();
//            this.addChild(man, 3);
//        }

        return true;
    },

    add: function () {
        var size = cc.winSize;
        for (var i = 0; i < 20; i++) {
            var man = new cc.Sprite("res/grossini.png");
            var rotation = Math.random()*360;
            man.runAction(cc.spawn(cc.rotateBy(1, rotation, rotation), cc.sequence(cc.scaleTo(1, 2), cc.scaleTo(1, 1)), cc.sequence(cc.moveBy(1, 300*Math.random(), 0), cc.moveBy(1, 300*Math.random(), 0).reverse())).repeatForever());
            this.batch.addChild(man, 2);
            man.x = size.width*Math.random();
            man.y = size.height*Math.random();
        }
    },

    update: function () {
        count++;
        var now = Date.now();
        var delta = now - then;
        if(delta > 1000){
            then = now;
            if(count >= 30){
                this.add();
                spriteCount += 20;
                document.getElementById("count").innerHTML = spriteCount;
            }
            count = 0;
        }
    }

});

var count = 0;
var then = 0;
var spriteCount = 0;

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});