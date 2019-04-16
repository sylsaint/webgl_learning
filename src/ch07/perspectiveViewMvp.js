import { getWebGLContext, initShaders } from '../lib/cuon-utils';
import { Matrix4 } from '../lib/cuon-matrix';

// vertex shader
const VSHADER_SOURCE = `
  attribute vec4 attr_position;
  attribute vec4 attr_color;
  uniform mat4 uni_view_mat;
  uniform mat4 uni_mod_mat;
  uniform mat4 uni_proj_mat;
  varying vec4 v_color;
  void main() {
    gl_Position = uni_proj_mat * uni_view_mat * uni_mod_mat * attr_position;
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

  const nf = document.getElementById('nearFar');

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
  const uni_view_mat = gl.getUniformLocation(gl.program, 'uni_view_mat');
  if (uni_view_mat < 0) {
    console.log('Failed to get the uni_view_mat storage location');
    return;
  }
  const uni_proj_mat = gl.getUniformLocation(gl.program, 'uni_proj_mat');
  if (uni_proj_mat < 0) {
    console.log('Failed to get the uni_proj_mat storage location');
    return;
  }
  const uni_mod_mat = gl.getUniformLocation(gl.program, 'uni_mod_mat');
  if (uni_mod_mat < 0) {
    console.log('Failed to get the uni_mod_mat storage location');
    return;
  }
  const viewMatrix = new Matrix4();
  const projMatrix = new Matrix4();
  const modelMatrix = new Matrix4();
  viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
  projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
  gl.uniformMatrix4fv(uni_view_mat, false, viewMatrix.elements);
  gl.uniformMatrix4fv(uni_proj_mat, false, projMatrix.elements);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  modelMatrix.setTranslate(0, 0, 0);
  gl.uniformMatrix4fv(uni_mod_mat, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 0, n);


  modelMatrix.setTranslate(-1.5, 0, 0);
  gl.uniformMatrix4fv(uni_mod_mat, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
  const vertices = new Float32Array([
    // vertex and color
    0.75, 1.0, 0.0, 0.4, 0.4, 1.0,
    0.25, -1.0, 0.0, 0.4, 0.4, 1.0,
    1.25, -1.0, 0.0, 1.0, 0.4, 0.4,

    0.75, 1.0, -2.0, 1.0, 1.0, 0.4,
    0.25, -1.0, -2.0, 1.0, 1.0, 0.4,
    1.25, -1.0, -2.0, 1.0, 0.4, 0.4,

    0.75, 1.0, -4.0, 0.4, 1.0, 0.4,
    0.25, -1.0, -4.0, 0.4, 1.0, 0.4,
    1.25, -1.0, -4.0, 1.0, 0.4, 0.4,
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
