export function createButton(name) {
  const button = document.createElement('button');
  button.setAttribute('name', name);
  button.innerHTML = name;
  return button;
}