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
    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
  }
`;

const g_points = [];

function click(ev, gl, canvas, attr_position) {
  let x = ev.clientX;
  let y = ev.clientY;
  const rect = ev.target.getBoundingClientRect();
  x = ((x - rect.left) - canvas.height / 2) / (canvas.height / 2);
  y = (canvas.width / 2 - (y - rect.top)) / (canvas.width / 2);
  g_points.push(x);
  g_points.push(y);
  gl.clear(gl.COLOR_BUFFER_BIT);
  for (let i = 0; i < g_points.length; i += 2) {
    gl.vertexAttrib3f(attr_position, g_points[i], g_points[i + 1], 0.0);
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

  canvas.onmousedown = function (ev) { click(ev, gl, canvas, attr_position); };
  // canvas.onmousemove = function (ev) { click(ev, gl, canvas, attr_position); };
  // canvas.onmouseup = function (ev) { click(ev, gl, canvas, attr_position); };

  // assign position to var attribute


  // set bg-color for the canvas
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT);
}
