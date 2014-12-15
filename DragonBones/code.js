var DragonBonesLayer = cc.Layer.extend({

    ctor: function () {
        this._super();

        ccs.armatureDataManager.addArmatureFileInfo("res/dragonbones/skeleton.png", "res/dragonbones/skeleton.plist", "res/dragonbones/skeleton.xml");
        var armature = new ccs.Armature("Dragon");
        armature.getAnimation().play("walk");
        armature.getAnimation().setSpeedScale(24/60);
        this.addChild(armature);
        armature.x = cc.winSize.width/2;
        armature.y = cc.winSize.height/2;
    }
});