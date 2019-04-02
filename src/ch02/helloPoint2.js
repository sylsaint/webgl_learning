import { getWebGLContext, initShaders } from '../lib/cuon-utils';

// vertex shader
const VSHADER_SOURCE = `
  attribute vec4 attr_position;
  attribute float attr_point_size;
  void main() {
    gl_Position = attr_position; 
    gl_PointSize = attr_point_size;
  }
`;

const FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
  }
`;

export default function main() {
  // retrieve the canvas element
  const canvas = document.getElementById('webgl');

  // retrieve the context of webgl
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // initialize the shader
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return;
  }

  // retrieve the storage position of attribute
  const attr_position = gl.getAttribLocation(gl.program, 'attr_position');
  if (attr_position < 0) {
    console.log('Failed to get the storage location of attr_position');
    return;
  }

  // assign position to var attribute
  gl.vertexAttrib3f(attr_position, 0.0, 0.0, 0.0);


  const attr_point_size = gl.getAttribLocation(gl.program, 'attr_point_size');
  if (attr_point_size < 0) {
    console.log('Failed to get the storage location of attr_point_size');
    return;
  }

  // assign position to var attribute
  gl.vertexAttrib1f(attr_point_size, 5.0);

  // set bg-color for the canvas
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT);

  // draw a point
  gl.drawArrays(gl.POINTS, 0, 1);
}