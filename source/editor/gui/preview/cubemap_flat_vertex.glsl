attribute vec3 envLookup;
varying vec3 vEnvLookup;

void main()
{
    vEnvLookup = envLookup;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}