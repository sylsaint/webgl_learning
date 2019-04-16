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
    1.0, 1.0, 1.0, 1.0, 1.0, 1.0,  // v0 White
    -1.0, 1.0, 1.0, 1.0, 0.0, 1.0,  // v1 Magenta
    -1.0, -1.0, 1.0, 1.0, 0.0, 0.0,  // v2 Red
    1.0, -1.0, 1.0, 1.0, 1.0, 0.0,  // v3 Yellow
    1.0, -1.0, -1.0, 0.0, 1.0, 0.0,  // v4 Green
    1.0, 1.0, -1.0, 0.0, 1.0, 1.0,  // v5 Cyan
    -1.0, 1.0, -1.0, 0.0, 0.0, 1.0,  // v6 Blue
    -1.0, -1.0, -1.0, 0.0, 0.0, 0.0   // v7 Black
  ]);

  // 顶点索引
  var indices = new Uint8Array([  //(Uint8Array)是无符号8位整型数
    0, 1, 2, 0, 2, 3,    // front
    0, 3, 4, 0, 4, 5,    // right
    0, 5, 6, 0, 6, 1,    // up
    1, 6, 7, 1, 7, 2,    // left
    7, 4, 3, 7, 3, 2,    // down
    4, 7, 6, 4, 6, 5     // back
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
  const vertextBuffer = gl.createBuffer();
  if (!vertextBuffer) {
    console.log('Failed to create buffer');
    return;
  }
  const indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create index buffer');
    return;
  }

  const FSIZE = vertices.BYTES_PER_ELEMENT;
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

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}
