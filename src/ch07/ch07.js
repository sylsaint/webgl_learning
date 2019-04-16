import { createButton } from '../lib/dom';
import coloredTriangle from './coloredTriangle';
import lookAtRotatedTriangles from './lookAtRotatedTriangles';
import lookAtTrianglesWithKeys from './lookAtTrianglesWithKeys';
import orthoView from './orthoView';
import perspectiveView from './perspectiveView';
import perspectiveViewMvp from './perspectiveViewMvp';
import zFighting from './zFighting';
import helloCube from './helloCube';
import coloredCube from './coloredCube';

const buttonContainer = document.getElementById('buttons');

const buttons = [
  { name: 'coloredTriangle', callback: coloredTriangle },
  { name: 'lookAtRotatedTriangles', callback: lookAtRotatedTriangles },
  { name: 'lookAtTrianglesWithKeys', callback: lookAtTrianglesWithKeys },
  { name: 'orthoView', callback: orthoView },
  { name: 'perspectiveView', callback: perspectiveView },
  { name: 'perspectiveViewMvp', callback: perspectiveViewMvp },
  { name: 'zFighting', callback: zFighting },
  { name: 'helloCube', callback: helloCube },
  { name: 'coloredCube', callback: coloredCube },
];
buttons.map(entry => {
  const btn = createButton(entry.name);
  btn.addEventListener('click', () => {
    entry.callback();
  })
  buttonContainer.appendChild(btn);
})