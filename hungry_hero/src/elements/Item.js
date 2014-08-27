/**
 * Created by kenkozheng on 2014/8/21.
 */

var Item = cc.Sprite.extend({

    type:0,

    ctor:function (type) {
        this._super("#item" + type + ".png");
        this.type = type;
        return true;
    },

    /**
     * call by cc.pool.getFromPool
     * @param type int
     */
    reuse:function(type) {
        this.setSpriteFrame("item" + type + ".png");
        this.type = type;
    },

    unuse:function() {
        this.retain();          //jsb必须加这句
    }

});

Item.create = function(type){
    if(cc.pool.hasObj(Item)) {
        return cc.pool.getFromPool(Item, type);
    }
    else{
        return new Item(type);
    }
}