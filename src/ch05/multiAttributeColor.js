import { getWebGLContext, initShaders } from '../lib/cuon-utils';

// vertex shader
const VSHADER_SOURCE = `
  attribute vec4 attr_position;
  attribute vec4 attr_color;
  varying vec4 v_color;
  attribute float attr_size;
  void main() {
    gl_Position = attr_position;
    gl_PointSize = attr_size;
    v_color = attr_color;
  }
`;

const FSHADER_SOURCE = `
  precision mediump float; // https://stackoverflow.com/questions/27058064/why-do-i-need-to-define-a-precision-value-in-webgl-shaders
  varying vec4 v_color;
  void main() {
    gl_FragColor = v_color; 
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


  const n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // set bg-color for the canvas
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT);

  // draw a point
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
  const verticesColors = new Float32Array([
    0.0, 0.5, 10.0, 1.0, 0.0, 0.0,
    -0.5, -0.5, 20.0, 0.0, 1.0, 0.0,
    0.5, -0.5, 30.0, 0.0, 0.0, 1.0,
  ]);
  const n = parseInt(verticesColors.length / 6);

  // create buffer object
  const vertextBuffer = gl.createBuffer();
  if (!vertextBuffer) {
    console.log('Failed to create buffer');
    return;
  }


  const FSIZE = verticesColors.BYTES_PER_ELEMENT;
  // bind buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuffer);
  // write data to the buffer
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
  const attr_position = gl.getAttribLocation(gl.program, 'attr_position');
  if (attr_position < 0) {
    console.log('Failed to get position of attribute');
    return;
  }
  gl.vertexAttribPointer(attr_position, 2, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(attr_position);


  const attr_size = gl.getAttribLocation(gl.program, 'attr_size');
  if (attr_size < 0) {
    console.log('Failed to get position of attribute');
    return;
  }
  gl.vertexAttribPointer(attr_size, 1, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
  gl.enableVertexAttribArray(attr_size);

  const attr_color = gl.getAttribLocation(gl.program, 'attr_color');
  if (attr_color < 0) {
    console.log('Failed to get color of attribute');
    return;
  }
  gl.vertexAttribPointer(attr_color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(attr_color);

  return n;
}