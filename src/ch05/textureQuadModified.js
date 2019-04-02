import { getWebGLContext, initShaders } from '../lib/cuon-utils';

// vertex shader
const VSHADER_SOURCE = `
  attribute vec4 attr_position;
  attribute vec2 attr_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = attr_position;
    v_texCoord = attr_texCoord;
  }
`;

const FSHADER_SOURCE = `
  precision mediump float;
  uniform sampler2D u_sampler;
  varying vec2 v_texCoord;
  void main() {
    gl_FragColor = texture2D(u_sampler, v_texCoord); 
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

  if (!initTextures(gl, n)) {
    consolelog('Failed to init textures.');
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
  const vertices = new Float32Array([
    -0.5, 0.5, -0.3, 1.7,
    -0.5, -0.5, -0.3, -0.2,
    0.5, 0.5, 1.7, 1.7,
    0.5, -0.5, 1.7, -0.2,
  ]);
  const n = parseInt(vertices.length / 4);

  // create buffer object
  const vertextBuffer = gl.createBuffer();
  if (!vertextBuffer) {
    console.log('Failed to create buffer');
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
  gl.vertexAttribPointer(attr_position, 2, gl.FLOAT, false, FSIZE * 4, 0);
  gl.enableVertexAttribArray(attr_position);

  // assign texture coord to attr_texCoord and enable it
  const attr_texCoord = gl.getAttribLocation(gl.program, 'attr_texCoord');
  if (attr_texCoord < 0) {
    console.log('Failed to get position of attribute textCoord.');
    return;
  }
  gl.vertexAttribPointer(attr_texCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(attr_texCoord);

  return n;
}

function initTextures(gl, n) {
  const texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to init texture.');
    return;
  }
  const u_sampler = gl.getUniformLocation(gl.program, 'u_sampler');
  if (u_sampler < 0) {
    console.log('Failed to get u_sampler');
    return;
  }
  const image = new Image();
  image.onload = function () {
    loadTexture(gl, n, texture, u_sampler, image);
  }
  image.src = './assets/resources/sky.jpg';
  return true;
}

function loadTexture(gl, n, texture, u_sampler, image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // flip the y-axis
  // turn on 0 texture unit
  gl.activeTexture(gl.TEXTURE0);
  // bind texture object to target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // config the params
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // config the image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // transfer 0 texture to shader
  gl.uniform1i(u_sampler, 0);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}