import { createButton } from '../lib/dom';

import multiPoints from './multiPoints';
import helloTriangle from './helloTriangle';
import helloQuad from './helloQuad';
import translatedTriangle from './translatedTriangle';
import translatedTriangleMatrix from './translatedTriangleMatrix';
import rotatedTriangle from './rotatedTriangle';
import rotatedTriangleMatrix from './rotatedTriangleMatrix';
import scaleTriangle from './scaleTriangle';

const buttonContainer = document.getElementById('buttons');

const buttons = [
  { name: 'multiPoints', callback: multiPoints },
  { name: 'helloTriangle', callback: helloTriangle },
  { name: 'helloQuad', callback: helloQuad },
  { name: 'translatedTriangle', callback: translatedTriangle },
  { name: 'translatedTriangleMatrix', callback: translatedTriangleMatrix },
  { name: 'rotatedTriangle', callback: rotatedTriangle },
  { name: 'rotatedTriangleMatrix', callback: rotatedTriangleMatrix },
  { name: 'scaleTrianle', callback: scaleTriangle },
];
buttons.map(entry => {
  const btn = createButton(entry.name);
  btn.addEventListener('click', () => {
    entry.callback();
  })
  buttonContainer.appendChild(btn);
})