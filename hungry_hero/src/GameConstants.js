/**
 * Created by kenkozheng on 2014/8/20.
 */
var GameConstants = {

    // Player's states - what is the player doing? -------------
    GAME_STATE_IDLE : 0,
    GAME_STATE_FLYING : 1,
    GAME_STATE_OVER : 2,

    // Hero's graphic states - what is the position/animation of hero?
    
    HERO_STATE_IDLE : 0,
    HERO_STATE_FLYING : 1,
    HERO_STATE_HIT : 2,
    HERO_STATE_FALL : 3,
    
    // Food item types -----------------------------------------
    
    ITEM_TYPE_1 : 1,
    ITEM_TYPE_2 : 2,
    ITEM_TYPE_3 : 3,
    ITEM_TYPE_4 : 4,
    ITEM_TYPE_5 : 5,
    
    /** Special Item - Coffee. */
    ITEM_TYPE_COFFEE : 6,
    
    /** Special Item - Mushroom. */
    ITEM_TYPE_MUSHROOM : 7,
    
    // Obstacle types ------------------------------------------
    
    /** Obstacle - Aeroplane. */
    OBSTACLE_TYPE_1 : 1,
    
    /** Obstacle - Space Ship. */
    OBSTACLE_TYPE_2 : 2,
    
    /** Obstacle - Airship. */
    OBSTACLE_TYPE_3 : 3,
    
    /** Obstacle - Helicopter. */
    OBSTACLE_TYPE_4 : 4,
    
    // Particle types ------------------------------------------
    
    /** Particle - Sparkle. */
    PARTICLE_TYPE_1 : 1,
    
    /** Particle - Wind Force. */
    PARTICLE_TYPE_2 : 2,
    
    // Hero properties -----------------------------------------
    
    /** Hero's initial spare lives. */
    HERO_LIVES : 5,
    
    /** Hero's minimum speed. */
    HERO_MIN_SPEED : 650,
    
    /** Hero's maximum speed when had coffee. */
    HERO_MAX_SPEED : 1400,
    
    /** Movement speed - game/player/items/obstacles speed. */
    GRAVITY : 10,
    
    // Obstacle properties -------------------------------------
    
    /** Obstacle frequency. */
    OBSTACLE_GAP : 1200,
    
    /** Obstacle speed. */
    OBSTACLE_SPEED : 300,

    GAME_AREA_TOP_BOTTOM : 100
};