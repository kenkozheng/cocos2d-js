/**
 * Created by kenkozheng on 2014/8/21.
 */

var GameSceneUI = cc.Layer.extend({

    _lifeText:null,
    _distanceText:null,
    _scoreText:null,

    ctor:function () {
        this._super();

        var fnt = "res/fonts/font.fnt";
        var winSize = cc.director.getWinSize();

        var lifeLabel = new cc.LabelBMFont("L I V E S", fnt);
        this.addChild(lifeLabel);
        lifeLabel.x = 360;
        lifeLabel.y = winSize.height - 25;

        this._lifeText = new cc.LabelBMFont("0", fnt, -1, cc.TEXT_ALIGNMENT_LEFT);
        this.addChild(this._lifeText);
        this._lifeText.x = 360;
        this._lifeText.y = winSize.height - 60;

        var distanceLabel = new cc.LabelBMFont("D I S T A N C E", fnt);
        this.addChild(distanceLabel);
        distanceLabel.x = 680;
        distanceLabel.y = winSize.height - 25;

        this._distanceText = new cc.LabelBMFont("50", fnt, -1, cc.TEXT_ALIGNMENT_LEFT);
        this.addChild(this._distanceText);
        this._distanceText.x = 680;
        this._distanceText.y = winSize.height - 60;

        var scoreLabel = new cc.LabelBMFont("S C O R E", fnt);
        this.addChild(scoreLabel);
        scoreLabel.x = 915;
        scoreLabel.y = winSize.height - 25;

        this._scoreText = new cc.LabelBMFont("100", fnt, -1, cc.TEXT_ALIGNMENT_LEFT);
        this.addChild(this._scoreText);
        this._scoreText.x = 915;
        this._scoreText.y = winSize.height - 60;

        var pauseButton = new cc.MenuItemImage("#pauseButton.png", "#pauseButton.png", this._pauseResume);
        if(cc.sys.isNative)
            var soundButton = new cc.MenuItemToggle(new cc.MenuItemImage("#soundOn0002.png"), new cc.MenuItemImage("#soundOff.png"), Sound.toggleOnOff);
        else
            var soundButton = new SoundButton();
        var menu = new cc.Menu(soundButton, pauseButton);
        menu.alignItemsHorizontallyWithPadding(30);
        menu.x = 80;
        menu.y = winSize.height - 45;
        this.addChild(menu);

        return true;
    },

    _pauseResume:function() {
        if(cc.director.isPaused())
            cc.director.resume();
        else
            cc.director.pause();
    },

    update:function() {
        this._lifeText.setString(Game.user.lives.toString());
        this._distanceText.setString(parseInt(Game.user.distance).toString());
        this._scoreText.setString(Game.user.score.toString());
    }

});