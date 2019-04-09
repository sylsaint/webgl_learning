import { createButton } from '../lib/dom';
import coloredTriangle from './coloredTriangle';
import lookAtRotatedTriangles from './lookAtRotatedTriangles';
import lookAtTrianglesWithKeys from './lookAtTrianglesWithKeys';

const buttonContainer = document.getElementById('buttons');

const buttons = [
  { name: 'coloredTriangle', callback: coloredTriangle },
  { name: 'lookAtRotatedTriangles', callback: lookAtRotatedTriangles },
  { name: 'lookAtTrianglesWithKeys', callback: lookAtTrianglesWithKeys },
];
buttons.map(entry => {
  const btn = createButton(entry.name);
  btn.addEventListener('click', () => {
    entry.callback();
  })
  buttonContainer.appendChild(btn);
})