import { createButton } from '../lib/dom';
import multiAttributeSize from './multiAttributeSize';
import multiAttributeSizeInter from './multiAttributeSizeInter';
import multiAttributeColor from './multiAttributeColor';
import textureQuad from './textureQuad';
import textQuadVs from './textQuadVs';
import multiTexture from './multiTexture';
import textNoise from './textureNoise';

const buttonContainer = document.getElementById('buttons');

const buttons = [
  { name: 'multiAttributeSize', callback: multiAttributeSize },
  { name: 'multiAttributeSizeInter', callback: multiAttributeSizeInter },
  { name: 'multiAttributeColor', callback: multiAttributeColor },
  { name: 'textureQuad', callback: textureQuad },
  { name: 'textQuadVs', callback: textQuadVs },
  { name: 'multiTexture', callback: multiTexture },
  { name: 'textureNoise', callback: textNoise },
];
buttons.map(entry => {
  const btn = createButton(entry.name);
  btn.addEventListener('click', () => {
    entry.callback();
  })
  buttonContainer.appendChild(btn);
})
