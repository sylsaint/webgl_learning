import { getWebGLContext, initShaders } from '../lib/cuon-utils';
import { Matrix4 } from '../lib/cuon-matrix';

const VSHADER_SOURCE = `
  attribute vec4 attr_position;
  attribute vec4 attr_color;
  uniform mat4 uni_mvp_mat;
  varying vec4 v_color;
  void main() {
    gl_Position = uni_mvp_mat * attr_position;
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

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // retrieve uni_mat location
  const uni_mvp_mat = gl.getUniformLocation(gl.program, 'uni_mvp_mat');
  if (uni_mvp_mat < 0) {
    console.log('Failed to get the uni_mvp_mat storage location');
    return;
  }
  console.log(gl);
  const mvpMatrix = new Matrix4();
  mvpMatrix.setPerspective(30, 1, 1, 100);
  mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
  gl.uniformMatrix4fv(uni_mvp_mat, false, mvpMatrix.elements);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    // Vertex coordinates and color
    1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
    1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,
    1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
    1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0,
  ]);

  var colors = new Float32Array([
    0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0,
    0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4,
    1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4,
    1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4,
    1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4,
    0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0,
  ]);

  // 顶点索引
  var indices = new Uint8Array([  //(Uint8Array)是无符号8位整型数
    0, 1, 2, 0, 2, 3,    // front
    4, 5, 6, 4, 6, 7,    // right
    8, 9, 10, 8, 10, 11,    // up
    12, 13, 14, 12, 14, 15,    // left
    16, 17, 18, 16, 18, 19,    // down
    20, 21, 22, 20, 22, 23     // back
  ]);
  /*  const vertices = new Float32Array([
      // vertex and color
      1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
      -1.0, 1.0, 1.0, 1.0, 0.0, 1.0,
      -1.0, -1.0, 1.0, 1.0, 0.0, 0.0,
      1.0, -1.0, 1.0, 1.0, 1.0, 0.0,
      1.0, -1.0, -1.0, 0.0, 1.0, 0.0,
      1.0, 1.0, -1.0, 0.0, 1.0, 1.0,
      -1.0, 1.0, -1.0, 0.0, 0.0, 1.0,
      -1.0, -1.0, -1.0, 0.0, 0.0, 0.0,
    ]);
  
    const indices = new Uint8Array([
      0, 1, 2, 0, 2, 3, // front
      0, 3, 4, 0, 4, 5, // right
      0, 5, 6, 0, 6, 1, // up
      1, 6, 7, 1, 7, 2, // left
      7, 4, 3, 7, 3, 2, // down
      4, 7, 6, 4, 6, 5, // back
    ]);
    */

  // create buffer object
  const indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create index buffer');
    return;
  }

  if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'attr_position')) {
    return -1;
  }

  if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'attr_color')) {
    return -1;
  }


  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function initArrayBuffer(gl, data, num, type, attribute) {
  const buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create buffer');
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  const attr = gl.getAttribLocation(gl.program, attribute);
  if (attr < 0) {
    console.log('Failed to get attribute location');
    return -1;
  }
  gl.vertexAttribPointer(attr, num, type, false, 0, 0);
  gl.enableVertexAttribArray(attr);

  return true;
}