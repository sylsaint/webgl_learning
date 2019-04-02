import { createButton } from '../lib/dom';

import helloPoint1 from './helloPoint1';
import helloPoint2 from './helloPoint2';
import clickedPoints from './clickedPoints';
import coloredPoints from './coloredPoints';

const buttonContainer = document.getElementById('buttons');

const buttons = [
  { name: 'helloPoint1', callback: helloPoint1 },
  { name: 'helloPoint2', callback: helloPoint2 },
  { name: 'clickedPoints', callback: clickedPoints },
  { name: 'coloredPoints', callback: coloredPoints },
];
buttons.map(entry => {
  const btn = createButton(entry.name);
  btn.addEventListener('click', () => {
    entry.callback();
  })
  buttonContainer.appendChild(btn);
})