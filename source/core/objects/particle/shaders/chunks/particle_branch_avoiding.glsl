// Branch-avoiding comparison fns
//- http:// theorangeduck.com/page/avoiding-shader-conditionals
float when_gt(float x, float y) {
    return max(sign(x - y), 0.0);
}

float when_lt(float x, float y) {
    return min(max(1.0 - sign(x - y), 0.0), 1.0);
}

float when_eq(float x, float y) {
    return 1.0 - abs(sign(x - y));
}

float when_ge(float x, float y) {
  return 1.0 - when_lt(x, y);
}

float when_le(float x, float y) {
  return 1.0 - when_gt(x, y);
}

// Branch-avoiding logical operators (to be used with above comparison fns)
float and(float a, float b) {
    return a * b;
}

float or(float a, float b) {
    return min(a + b, 1.0);
}