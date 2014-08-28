/**
 * Created by kenkozheng on 2014/8/21.
 */

var GameOverUI = cc.Layer.extend({

    _distanceText:null,
    _scoreText:null,
    _gameScene:null,

    ctor:function(gameScene){
        this._super();
        this._gameScene = gameScene;

        var winSize = cc.director.getWinSize();
        var bg = new cc.LayerColor(cc.color(0,0,0,200), winSize.width, winSize.height);
        this.addChild(bg);

        var fnt = "res/fonts/font.fnt";
        var title = new cc.LabelBMFont("HERO WAS KILLED!", fnt);
        this.addChild(title);
        title.setColor(cc.color(243,231,95));
        title.x = winSize.width/2;
        title.y = winSize.height - 120;

        this._distanceText = new cc.LabelBMFont("DISTANCE TRAVELLED: 0000000", fnt);
        this.addChild(this._distanceText);
        this._distanceText.x = winSize.width/2;
        this._distanceText.y = winSize.height - 220;

        this._scoreText = new cc.LabelBMFont("SCORE: 0000000", fnt);
        this.addChild(this._scoreText);
        this._scoreText.x = winSize.width/2;
        this._scoreText.y = winSize.height - 270;


        var replayBtn = new cc.MenuItemImage("#gameOver_playAgainButton.png", "#gameOver_playAgainButton.png", this._replay.bind(this));
        var aboutBtn = new cc.MenuItemImage("#gameOver_aboutButton.png", "#gameOver_aboutButton.png", this._about);
        var mainBtn = new cc.MenuItemImage("#gameOver_mainButton.png", "#gameOver_mainButton.png", this._return);
        var menu = new cc.Menu(replayBtn, mainBtn, aboutBtn);
        menu.alignItemsVertically();
        this.addChild(menu);
        menu.y = winSize.height/2 - 100;
    },

    init:function(){
        this._distanceText.setString("DISTANCE TRAVELLED: " + parseInt(Game.user.distance));
        this._scoreText.setString("SCORE: " + Game.user.score);
    },

    _replay:function(){
        this._gameScene.init();
    },

    _about:function(){
        cc.director.runScene(new AboutScene());
    },

    _return:function(){
        cc.director.runScene(new MenuScene());
    }

});