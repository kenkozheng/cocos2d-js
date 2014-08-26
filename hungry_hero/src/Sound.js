/**
 * Created by kenkozheng on 2014/8/20.
 */
var Sound = {
    silence:false,
    _eatEffect:0,
    playMenuBgMusic:function(){
        if(!Sound.silence)
            cc.audioEngine.playMusic("res/sounds/bgWelcome.mp3", true);
    },
    playGameBgMusic:function(){
        if(!Sound.silence)
            cc.audioEngine.playMusic("res/sounds/bgGame.mp3", true);
    },
    playEat:function(){
        if(!Sound.silence)
        {
            //先停止之前播放的吃音效，否则会因为连续播放过多而报错
            if(Sound._eatEffect)
                cc.audioEngine.stopEffect(Sound._eatEffect);
            Sound._eatEffect = cc.audioEngine.playEffect("res/sounds/eat.mp3", false);
        }
    },
    playCoffee:function(){
        if(!Sound.silence)
            cc.audioEngine.playEffect("res/sounds/coffee.mp3", false);
    },
    playMushroom:function(){
        if(!Sound.silence)
            cc.audioEngine.playEffect("res/sounds/mushroom.mp3", false);
    },
    playHit:function(){
        if(!Sound.silence)
            cc.audioEngine.playEffect("res/sounds/hit.mp3", false);
    },
    playHurt:function(){
        if(!Sound.silence)
            cc.audioEngine.playEffect("res/sounds/hurt.mp3", false);
    },
    playLose:function(){
        if(!Sound.silence)
            cc.audioEngine.playEffect("res/sounds/lose.mp3", false);
    },
    stop:function(){
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.stopMusic();
    },
    toggleOnOff:function(){
        if(Sound.silence){
            Sound.silence = false;
            cc.audioEngine.setEffectsVolume(1);
            cc.audioEngine.setMusicVolume(1);
        }
        else{
            Sound.silence = true;
            cc.audioEngine.setEffectsVolume(0);
            cc.audioEngine.setMusicVolume(0);
        }
    }
};