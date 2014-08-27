/**
 * Created by kenkozheng on 2014/8/20.
 */

var AboutScene = cc.Scene.extend({

    ctor:function () {
        this._super();
        var layer = new cc.Layer();
        this.addChild(layer);

        var winSize = cc.director.getWinSize();
        var bgWelcome = new cc.Sprite("res/graphics/bgWelcome.jpg");
        bgWelcome.x = winSize.width/2;
        bgWelcome.y = winSize.height/2;
        layer.addChild(bgWelcome);

        var aboutText = "Hungry Hero is a free and open source game built on Adobe Flash using Starling Framework.\n\nhttp://www.hungryherogame.com\n\n" +
            " And this is a cocos2d-js version modified by Kenko.\n\n" +
            " The concept is very simple. The hero is pretty much always hungry and you need to feed him with food.\n\n" +
            " You score when your Hero eats food.There are different obstacles that fly in with a \"Look out!\"\n\n" +
            " caution before they appear. Avoid them at all costs. You only have 5 lives. Try to score as much as possible and also\n\n" +
            " try to travel the longest distance.";
        var helloLabel = cc.LabelTTF.create(aboutText, "Arial", 14);
//        helloLabel.color = cc.color(0,0,0);
//        helloLabel._setStrokeStyle(cc.color(0,0,255));
        helloLabel.x = winSize.width/2;
        helloLabel.y = winSize.height/2 + 80;
//        helloLabel.textAlign = cc.TEXT_ALIGNMENT_CENTER;
        layer.addChild(helloLabel);

        var backButton = new cc.MenuItemImage("#about_backButton.png", "#about_backButton.png", this._back);
        backButton.x = 150;
        backButton.y = -70;
        var menu = new cc.Menu(backButton);
        layer.addChild(menu);

        cc.eventManager.addListener({event: cc.EventListener.KEYBOARD, onKeyReleased: this._back}, this);

        return true;
    },

    _back:function() {
        Sound.playCoffee();
        cc.director.runScene(new MenuScene());
    }

});
