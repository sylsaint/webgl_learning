import { getWebGLContext, initShaders } from '../lib/cuon-utils';
import { Matrix4, Vector3 } from '../lib/cuon-matrix';

const VSHADER_SOURCE = `
  attribute vec4 attr_position;
  attribute vec4 attr_color;
  attribute vec4 attr_normal;
  uniform mat4 uni_mvp_mat;
  uniform mat4 uni_model_mat;
  uniform mat4 uni_normal_mat;
  varying vec4 v_color;
  varying vec3 v_normal;
  varying vec3 v_position;
  attribute vec2 attr_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = uni_mvp_mat * attr_position;
    v_position = vec3(uni_model_mat * attr_position);
    v_normal = normalize(vec3(uni_normal_mat * attr_normal));
    v_color = attr_color;
    v_texCoord = attr_texCoord;
  }
`;

const FSHADER_SOURCE = `
  precision mediump float;
  uniform vec3 uni_light_color;
  uniform vec3 uni_light_pos;
  uniform vec3 uni_ambient_light;
  varying vec3 v_normal;
  varying vec3 v_position;
  varying vec4 v_color;
  uniform sampler2D u_sampler;
  varying vec2 v_texCoord;
  void main() {
    vec3 normal = normalize(v_normal);
    vec3 light_direct = normalize(uni_light_pos - v_position);
    float nDotL = max(dot(light_direct, normal), 0.0);
    vec4 texel = texture2D(u_sampler, v_texCoord);
    vec3 diffuse = uni_light_color * texel.rgb * nDotL;
    vec3 ambient = uni_ambient_light * texel.rgb;
    gl_FragColor = vec4(diffuse + ambient, texel.a);
  }
`;

let running = false;

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
  const uni_light_color = gl.getUniformLocation(gl.program, 'uni_light_color');
  if (uni_light_color < 0) {
    console.log('Failed to get the uni_light_color location');
    return -1;
  }
  const uni_light_pos = gl.getUniformLocation(gl.program, 'uni_light_pos');
  if (uni_light_pos < 0) {
    console.log('Failed to get the uni_light_direct location');
    return -1;
  }
  const uni_ambient_light = gl.getUniformLocation(gl.program, 'uni_ambient_light');
  if (uni_ambient_light < 0) {
    console.log('Failed to get the uni_ambient_light location');
    return -1;
  }
  const uni_normal_mat = gl.getUniformLocation(gl.program, 'uni_normal_mat');
  if (uni_normal_mat < 0) {
    console.log('Failed to get the uni_normal_mat location');
    return -1;
  }
  const uni_model_mat = gl.getUniformLocation(gl.program, 'uni_model_mat');
  if (uni_model_mat < 0) {
    console.log('Failed to get the uni_model_mat location');
    return -1;
  }
  // set light color
  gl.uniform3f(uni_light_color, 1.0, 1.0, 1.0);
  // set ambient light
  gl.uniform3f(uni_ambient_light, 0.1, 0.1, 0.1);
  // set light position
  gl.uniform3f(uni_light_pos, 0.0, 3.0, 4.0);

  running = true;

  if (!initTextures(gl, canvas, uni_mvp_mat, uni_model_mat, uni_normal_mat, n)) {
    console.log('Failed to initialize the textures ');
    return -1;
  }
  tick(gl, canvas, uni_mvp_mat, uni_model_mat, uni_normal_mat, n);

  /*
  const normalMatrix = new Matrix4();
  const modelMatrix = new Matrix4();
  modelMatrix.setRotate(90, 0, 0, 1);
  const mvpMatrix = new Matrix4();
  mvpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
  mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
  mvpMatrix.multiply(modelMatrix);
  gl.uniformMatrix4fv(uni_mvp_mat, false, mvpMatrix.elements);

  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(uni_normal_mat, false, normalMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
  */

}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    // Vertex coordinates and color
    1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, // front
    1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, // right
    1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, // up
    -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, // left
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, // down
    1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, // back
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

  // 法向量
  const normals = new Float32Array([
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, // front
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, // right
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, //  up
    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // left
    0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, // down
    0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, // back
  ])

  // create buffer object
  const indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create index buffer');
    return;
  }

  // assign texture coord to attr_texCoord and enable it
  const texCoords = new Float32Array([
    1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
  ]);

  if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'attr_position')) {
    return -1;
  }

  if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'attr_color')) {
    return -1;
  }

  if (!initArrayBuffer(gl, normals, 3, gl.FLOAT, 'attr_normal')) {
    return -1;
  }

  if (!initArrayBuffer(gl, texCoords, 2, gl.FLOAT, 'attr_texCoord')) {
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

let rotate = 0;

function tick(gl, canvas, uni_mvp_mat, uni_model_mat, uni_normal_mat, u_sampler, n) {
  if (running) {
    rotate = (rotate + 0.5) % 360;
    draw(gl, canvas, uni_mvp_mat, uni_model_mat, uni_normal_mat, n, rotate);
    requestAnimationFrame(() => {
      tick(gl, canvas, uni_mvp_mat, uni_model_mat, uni_normal_mat, u_sampler, n);
    })
  }
}

function draw(gl, canvas, uni_mvp_mat, uni_mode_mat, uni_normal_mat, n, rotate) {
  const normalMatrix = new Matrix4();
  const modelMatrix = new Matrix4();
  modelMatrix.setRotate(rotate, 1, 1, 1);
  gl.uniformMatrix4fv(uni_mode_mat, false, modelMatrix.elements);
  const mvpMatrix = new Matrix4();
  mvpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
  mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
  mvpMatrix.multiply(modelMatrix);
  gl.uniformMatrix4fv(uni_mvp_mat, false, mvpMatrix.elements);

  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(uni_normal_mat, false, normalMatrix.elements);
  const u_sampler = gl.getUniformLocation(gl.program, 'u_sampler');
  if (u_sampler < 0) {
    console.log('Failed to get u_sampler');
    return;
  }
  gl.uniform1i(u_sampler, 0);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

export function clear() {
  running = false;
}

function initTextures(gl, canvas, uni_mvp_mat, uni_model_mat, uni_normal_mat, n) {
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
  image.onload = () => {
    loadTexture(gl, n, texture, u_sampler, image, canvas, uni_mvp_mat, uni_model_mat, uni_normal_mat);
  }
  image.src = './assets/resources/particle.png';
  return true;
}

function loadTexture(gl, n, texture, u_sampler, image, canvas, uni_mvp_mat, uni_model_mat, uni_normal_mat) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // flip the y-axis
  // turn on 0 texture unit
  gl.activeTexture(gl.TEXTURE0);
  // bind texture object to target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // config the params
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
  // config the image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // transfer 0 texture to shader
  gl.uniform1i(u_sampler, 0);

  gl.clear(gl.COLOR_BUFFER_BIT);

  tick(gl, canvas, uni_mvp_mat, uni_model_mat, uni_normal_mat, u_sampler, n);
}
