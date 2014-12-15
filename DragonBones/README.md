description: http://www.cnblogs.com/kenkofox/p/4165062.html

只需要按照DragonBones的制作规范制作动画，再使用修改版的DragonBonesDesignPanel，就可以轻松在cocos2d-js加载DragonBones骨骼动画。

如果使用zrong的版本，导出时直接选择cocos2d版本，导出的是plist、大图和xml；而cocos提供的2.0版本则导出碎图+xml，我们还需要另行把碎图变成Spritesheet。

加载的代码很简单：

        ccs.armatureDataManager.addArmatureFileInfo("res/dragonbones/skeleton.png", "res/dragonbones/skeleton.plist", "res/dragonbones/skeleton.xml");

        var armature = new ccs.Armature("Dragon");

        armature.getAnimation().play("stand");

        armature.getAnimation().setSpeedScale(24/60);

 

 

播放时，大家可能会发现卡顿或跳动的情况，那是因为在cocos2d-js中使用DragonBones，还有一个额外的规范。每个动作的最后一帧需要把所有的部件回位，否则就出现跳动。因为最后一帧到第一帧这个过程，DragonBones自己的运行库会做平缓过度，而cocos2d-js解析则没有这个过度，所以我们就要自己动手加一帧了。