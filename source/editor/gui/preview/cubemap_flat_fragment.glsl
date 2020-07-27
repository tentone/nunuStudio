uniform samplerCube envMap;
varying vec3 vEnvLookup;

void main()
{
    gl_FragColor = textureCube(envMap, vEnvLookup);
}
