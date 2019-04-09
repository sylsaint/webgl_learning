import { getWebGLContext, initShaders } from '../lib/cuon-utils';
import { Matrix4 } from '../lib/cuon-matrix';

// vertex shader
const VSHADER_SOURCE = `
  attribute vec4 attr_position;
  attribute vec4 attr_color;
  uniform mat4 uni_mat;
  varying vec4 v_color;
  void main() {
    gl_Position = uni_mat * attr_position;
    gl_PointSize = 10.0;
    v_color = attr_color;
  }
`;

const FSHADER_SOURCE = `
  precision mediump float;
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

  // retrieve uni_mat location
  const uni_mat = gl.getUniformLocation(gl.program, 'uni_mat');
  if (uni_mat < 0) {
    console.log('Failed to get the uni_mat storage location');
    return;
  }
  const viewMatrix = new Matrix4();
  viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);

  //transfer viewMatrix to uni_mat
  gl.uniformMatrix4fv(uni_mat, false, viewMatrix.elements);


  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT);

  // draw a point
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
  const vertices = new Float32Array([
    // vertex and color
    0.0, 0.5, -0.4, 0.4, 1.0, 0.4,
    -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
    0.0, -0.5, -0.4, 1.0, 0.4, 0.4,

    0.5, 0.4, -0.2, 1.0, 0.4, 0.4,
    -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
    0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

    0.0, 0.5, 0.0, 0.4, 0.4, 1.0,
    -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
    0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
  ]);
  const n = parseInt(vertices.length / 6);

  // create buffer object
  const vertextBuffer = gl.createBuffer();
  if (!vertextBuffer) {
    console.log('Failed to create buffer');
    return;
  }

  const FSIZE = vertices.BYTES_PER_ELEMENT;
  console.log(FSIZE);
  // bind buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuffer);
  // write data to the buffer
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const attr_position = gl.getAttribLocation(gl.program, 'attr_position');
  if (attr_position < 0) {
    console.log('Failed to get position of attribute');
    return;
  }

  gl.vertexAttribPointer(attr_position, 3, gl.FLOAT, false, FSIZE * 6, 0);

  gl.enableVertexAttribArray(attr_position);

  const attr_color = gl.getAttribLocation(gl.program, 'attr_color');
  if (attr_color < 0) {
    console.log('Failed to get color of attribute');
    return;
  }

  gl.vertexAttribPointer(attr_color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);

  gl.enableVertexAttribArray(attr_color);

  return n;
}
