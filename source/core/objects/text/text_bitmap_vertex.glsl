/**
 * Vertex shader used to draw the text, is responsible for applying the billboard effect by removing the rotation from the transformation matrix.
 */
#define BILLBOARD 0 

varying vec2 vUv;

void main()
{
	vUv = uv;
	
	#if BILLBOARD
		mat4 model = modelViewMatrix; 
		model[0][0] = 1.0;
		model[0][1] = 0.0;
		model[0][2] = 0.0;
		
		model[1][0] = 0.0;
		model[1][1] = 1.0;
		model[1][2] = 0.0;
		
		model[2][0] = 0.0;
		model[2][1] = 0.0;
		model[2][2] = 1.0;
		
		gl_Position = projectionMatrix * model * vec4(position, 1.0);
	#else
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	#endif
	
}