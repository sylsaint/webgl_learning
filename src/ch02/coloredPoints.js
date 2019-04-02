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
  precision mediump float;
  uniform vec4 uni_frag_color;
  void main() {
    gl_FragColor = uni_frag_color; 
  }
`;

const g_points = [];
const g_colors = [];

function click(ev, gl, canvas, attr_position, uni_frag_color) {
  console.log('click');
  let x = ev.clientX;
  let y = ev.clientY;
  const rect = ev.target.getBoundingClientRect();
  x = ((x - rect.left) - canvas.height / 2) / (canvas.height / 2);
  y = (canvas.width / 2 - (y - rect.top)) / (canvas.width / 2);
  g_points.push([x, y]);

  if (x >= 0 && y >= 0) {
    g_colors.push([1.0, 0.0, 0.0, 1.0]);
  } else if (x < 0 && y < 0) {
    g_colors.push([0.0, 1.0, 0.0, 1.0]);
  } else {
    g_colors.push([1.0, 1.0, 1.0, 1.0]);
  }
  gl.clear(gl.COLOR_BUFFER_BIT);
  for (let i = 0; i < g_points.length; i += 1) {
    const xy = g_points[i];
    const rgba = g_colors[i];
    gl.vertexAttrib3f(attr_position, xy[0], xy[1], 0.0);
    gl.uniform4f(uni_frag_color, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}

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

  // retrieve the storage position of attribute
  const attr_position = gl.getAttribLocation(gl.program, 'attr_position');
  if (attr_position < 0) {
    console.log('Failed to get the storage location of attr_position');
    return;
  }

  // retrieve the storage position of uniform 
  const uni_frag_color = gl.getUniformLocation(gl.program, 'uni_frag_color');
  // returns null if uniform variable is not found 
  if (!uni_frag_color) {
    console.log('Failed to get the storage location of uni_frag_color');
    return;
  }

  canvas.onmousedown = function (ev) { click(ev, gl, canvas, attr_position, uni_frag_color); };
  // canvas.onmousemove = function (ev) { click(ev, gl, canvas, attr_position); };
  // canvas.onmouseup = function (ev) { click(ev, gl, canvas, attr_position); };

  // assign position to var attribute


  // set bg-color for the canvas
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT);
}
