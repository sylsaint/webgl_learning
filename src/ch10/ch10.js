import { createButton } from '../lib/dom';

const buttonContainer = document.getElementById('buttons');

const buttons = [

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
