// Rotate Texture
vec2 vUv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);

#ifdef SHOULD_ROTATE_TEXTURE
   float x = gl_PointCoord.x - 0.5;
   float y = 1.0 - gl_PointCoord.y - 0.5;
   float c = cos(-vAngle);
   float s = sin(-vAngle);

   vUv = vec2(c * x + s * y + 0.5, c * y - s * x + 0.5);
#endif

// Spritesheets overwrite angle calculations.
#ifdef SHOULD_CALCULATE_SPRITE
    float framesX = vSpriteSheet.x;
    float framesY = vSpriteSheet.y;
    float columnNorm = vSpriteSheet.z;
    float rowNorm = vSpriteSheet.w;

    vUv.x = gl_PointCoord.x * framesX + columnNorm;
    vUv.y = 1.0 - (gl_PointCoord.y * framesY + rowNorm);
#endif

vec4 rotatedTexture = texture2D(textureSampler, vUv);
