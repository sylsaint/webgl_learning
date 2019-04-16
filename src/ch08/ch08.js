import { createButton } from '../lib/dom';
import lightedCube from './lightedCube';
import lightedCubeAmbient from './lightedCubeAmbient';
import lightedTranslatedRotatedCube, { cubeClear } from './lightedTranslatedRotatedCube';
import pointLightedCube, { pointCubeClear } from './pointLightedCube';
import pointLightedCubeFragment, { clear as fragClear } from './pointLightedCubeFragment';
import multiplePoint, { clear as multiClear } from './multiplePoint';

const buttonContainer = document.getElementById('buttons');

const buttons = [
  { name: 'lightedCube', callback: lightedCube },
  { name: 'lightedCubeAmbient', callback: lightedCubeAmbient },
  { name: 'lightedTranslatedRotatedCube', callback: lightedTranslatedRotatedCube, clear: cubeClear },
  { name: 'pointLightedCube', callback: pointLightedCube, clear: pointCubeClear },
  { name: 'pointLightedCubeFragment', callback: pointLightedCubeFragment, clear: fragClear },
  { name: 'multiplePoint', callback: multiplePoint, clear: multiClear },
];
buttons.map(entry => {
  const btn = createButton(entry.name);
  btn.addEventListener('click', () => {
    buttons.map(prev => {
      if (prev.clear) prev.clear();
    });
    entry.callback();
  })
  buttonContainer.appendChild(btn);
})