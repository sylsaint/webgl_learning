import { getWebGLContext, initShaders } from '../lib/cuon-utils';
import { Matrix4 } from '../lib/cuon-matrix';

// vertex shader
const VSHADER_SOURCE = `
  attribute vec4 attr_position;
  uniform mat4 uni_mat;
  void main() {
    gl_Position = uni_mat * attr_position;
    gl_PointSize = 10.0;
  }
`;

const FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;


const angleStep = 45.0;
let g_last = Date.now();

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
  let currentAngle = 0.0;
  // Matrix in WebGL is column major order 
  const xFormMatrix = new Matrix4();
  const uni_mat = gl.getUniformLocation(gl.program, 'uni_mat');
  const tick = function () {
    currentAngle = animate(currentAngle);
    draw(gl, n, currentAngle, xFormMatrix, uni_mat);
    requestAnimationFrame(tick);
  }
  tick();
  // clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT);

  // draw a point
  gl.drawArrays(gl.LINE_LOOP, 0, n);
}

function initVertexBuffers(gl) {
  const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  const n = parseInt(vertices.length / 2);

  // create buffer object
  const vertextBuffer = gl.createBuffer();
  if (!vertextBuffer) {
    console.log('Failed to create buffer');
    return;
  }

  // bind buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuffer);
  // write data to the buffer
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const attr_position = gl.getAttribLocation(gl.program, 'attr_position');
  if (attr_position < 0) {
    console.log('Failed to get position of attribute');
    return;
  }

  gl.vertexAttribPointer(attr_position, 2, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(attr_position);

  return n;
}

function draw(gl, n, currentAngle, modelMatrix, uni_mat) {
  modelMatrix.setRotate(currentAngle, 0, 0, 1);
  gl.uniformMatrix4fv(uni_mat, false, modelMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function animate(angle) {
  const now = Date.now();
  const elapsed = now - g_last;
  g_last = now;
  let newAngle = angle + (angleStep * elapsed) / 1000.0;
  return newAngle %= 360;
}