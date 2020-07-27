varying vec4 vColor;

#ifdef SHOULD_ROTATE_TEXTURE
    varying float vAngle;
#endif

#ifdef SHOULD_CALCULATE_SPRITE
    varying vec4 vSpriteSheet;
#endif