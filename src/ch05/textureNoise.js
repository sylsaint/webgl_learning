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
  #ifdef GL_ES
  precision mediump float;
  #endif

  int p[512];
  // int permutation[256] = int[256](151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,		129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,		251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,		49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,		138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180	);
  float fade(float t){return t*t*t*(t*(t*6.0-15.0)+10.0);}
  float lerp(float t,float a,float b){return a+t*(b-a);}
  float grad(int hash,float x,float y,float z){
    int h=hash&15;
    float u=h<8?x:y;
    float v=h<4?y:h==12||h==14?x:z;
    return((h&1)==0?u:-u)+((h&2)==0?v:-v);
  }
  float noise(float x,float y,float z){
    for(int i=0;i<256;i++)p[256+i]=p[i]=permutation[i];}
    int X=int(floor(x))&255,Y=int(floor(y))&255,Z=int(floor(z))&255;
    x-=floor(x);
    y-=floor(y);
    z-=floor(z);
    float u=fade(x),v=fade(y),w=fade(z);
    int A=p[X]+Y,AA=p[A]+Z,AB=p[A+1]+Z,B=p[X+1]+Y,BA=p[B]+Z,BB=p[B+1]+Z;
    return lerp(w,lerp(v,lerp(u,grad(p[AA],x,y,z),
      grad(p[BA],x-1,y,z)),
      lerp(u,grad(p[AB],x,y-1,z),
      grad(p[BB],x-1,y-1,z))),
      lerp(v,lerp(u,grad(p[AA+1],x,y,z-1),
      grad(p[BA+1],x-1,y,z-1)),
      lerp(u,grad(p[AB+1],x,y-1,z-1),
      grad(p[BB+1],x-1,y-1,z-1))));
   }
  float octave_noise(float x,float y,float z,int octaves,float persistence){
    float total=0;
    float frequency=1;
    float amplitude=1;
    float max_value=0;
    for(int i=0;i<octaves;i++){
      total+=noise(x*frequency,y*frequency,z*frequency)*amplitude;
      max_value+=amplitude;
      amplitude*=persistence;
      frequency*=2;
    }
    return total/max_value;
  }
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


  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  if (!initTextures(gl, n)) {
    consolelog('Failed to init textures.');
    return;
  }
}

function initVertexBuffers(gl) {
  const vertices = new Float32Array([
    -0.5, 0.5, 0.0, 1.0,
    -0.5, -0.5, 0.0, 0.0,
    0.5, 0.5, 1.0, 1.0,
    0.5, -0.5, 1.0, 0.0,
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
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
  // config the image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // transfer 0 texture to shader
  gl.uniform1i(u_sampler, 0);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}
