import { getWebGLContext, initShaders } from '../lib/cuon-utils';

// vertex shader
const VSHADER_SOURCE = `
  attribute vec4 attr_position;
  void main() {
    gl_Position = attr_position; 
    gl_PointSize = 10.0;
  }
`;

const FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
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
  gl.drawArrays(gl.POINTS, 0, n);
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