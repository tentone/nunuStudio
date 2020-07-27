// From:
//- http:// stackoverflow.com/a/12553149
//- https:// stackoverflow.com/questions/22895237/hexadecimal-to-rgb-values-in-webgl-shader
// unpackColor
vec3 unpackColor(in float hex) {
    vec3 c = vec3(0.0);

    float r = mod((hex / PACKED_COLOR_SIZE / PACKED_COLOR_SIZE), PACKED_COLOR_SIZE);
    float g = mod((hex / PACKED_COLOR_SIZE), PACKED_COLOR_SIZE);
    float b = mod(hex, PACKED_COLOR_SIZE);

    c.r = r / PACKED_COLOR_DIVISOR;
    c.g = g / PACKED_COLOR_DIVISOR;
    c.b = b / PACKED_COLOR_DIVISOR;

    return c;
}

// unpackRotationAxis
vec3 unpackRotationAxis(in float hex) {
    vec3 c = vec3(0.0);

    float r = mod((hex / PACKED_COLOR_SIZE / PACKED_COLOR_SIZE), PACKED_COLOR_SIZE);
    float g = mod((hex / PACKED_COLOR_SIZE), PACKED_COLOR_SIZE);
    float b = mod(hex, PACKED_COLOR_SIZE);

    c.r = r / PACKED_COLOR_DIVISOR;
    c.g = g / PACKED_COLOR_DIVISOR;
    c.b = b / PACKED_COLOR_DIVISOR;

    c *= vec3(2.0);
    c -= vec3(1.0);

    return c;
}

// floatOverLifetime:
float getFloatOverLifetime(in float positionInTime, in vec4 attr) {
    highp float value = 0.0;
    float deltaAge = positionInTime * float(VALUE_OVER_LIFETIME_LENGTH - 1);
    float fIndex = 0.0;
    float shouldApplyValue = 0.0;

    // This might look a little odd, but it's faster in the testing I"ve done than using branches. Uses basic maths to avoid branching.
    //
    // Take a look at the branch-avoidance functions defined above, and be sure to check out The Orange Duck site where I got this from (link above).
    //
    // Fix for static emitters (age is always zero).
    value += attr[0] * when_eq(deltaAge, 0.0);

    for(int i = 0; i < VALUE_OVER_LIFETIME_LENGTH - 1; ++i) {
        fIndex = float(i);
        shouldApplyValue = and(when_gt(deltaAge, fIndex), when_le(deltaAge, fIndex + 1.0));
        value += shouldApplyValue * mix(attr[i], attr[i + 1], deltaAge - fIndex);
    }

    return value;
}

// colorOverLifetime
vec3 getColorOverLifetime(in float positionInTime, in vec3 color1, in vec3 color2, in vec3 color3, in vec3 color4) {
    vec3 value = vec3(0.0);
    value.x = getFloatOverLifetime(positionInTime, vec4(color1.x, color2.x, color3.x, color4.x));
    value.y = getFloatOverLifetime(positionInTime, vec4(color1.y, color2.y, color3.y, color4.y));
    value.z = getFloatOverLifetime(positionInTime, vec4(color1.z, color2.z, color3.z, color4.z));
    return value;
}

// paramFetchingFunctions
float getAlive() {
    return params.x;
}

float getAge() {
    return params.y;
}

float getMaxAge() {
    return params.z;
}

float getWiggle() {
    return params.w;
}

// forceFetchingFunctions
vec4 getPosition(in float age) {
    return modelViewMatrix * vec4(position, 1.0);
}

vec3 getVelocity(in float age) {
    return velocity * age;
}

vec3 getAcceleration(in float age) {
    return acceleration.xyz * age;
}


// rotationFunctions
// Huge thanks to:
//- http:// www.neilmendoza.com/glsl-rotation-about-an-arbitrary-axis/
#ifdef SHOULD_ROTATE_PARTICLES
mat4 getRotationMatrix(in vec3 axis, in float angle) {
   axis = normalize(axis);
   float s = sin(angle);
   float c = cos(angle);
   float oc = 1.0 - c;

   return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
               oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
               oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
               0.0,                                0.0,                                0.0,                                1.0);
}

vec3 getRotation(in vec3 pos, in float positionInTime) {
  if(rotation.y == 0.0) {
       return pos;
  }

  vec3 axis = unpackRotationAxis(rotation.x);
  vec3 center = rotationCenter;
  vec3 translated;
  mat4 rotationMatrix;

  float angle = 0.0;
  angle += when_eq(rotation.z, 0.0) * rotation.y;
  angle += when_gt(rotation.z, 0.0) * mix(0.0, rotation.y, positionInTime);
  translated = rotationCenter - pos;
  rotationMatrix = getRotationMatrix(axis, angle);
  return center - vec3(rotationMatrix * vec4(translated, 0.0));
}
#endif
