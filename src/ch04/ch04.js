import { createButton } from '../lib/dom';
import rotatedTriangleMatrix4 from './rotatedTriangleMatrix4';
import rotatedTransaltedTriangle from './rotatedTranslatedTriangle';
import rotatingTriangle from './rotatingTriangle';

const buttonContainer = document.getElementById('buttons');

const buttons = [
  { name: 'rotatedTriangleMatrix4', callback: rotatedTriangleMatrix4 },
  { name: 'rotatedTransaltedTriangle', callback: rotatedTransaltedTriangle },
  { name: 'rotatingTriangle', callback: rotatingTriangle },
];
buttons.map(entry => {
  const btn = createButton(entry.name);
  btn.addEventListener('click', () => {
    entry.callback();
  })
  buttonContainer.appendChild(btn);
})