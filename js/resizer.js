const resizer = document.getElementById('resizer');
const leftPanel = document.getElementById('leftPanel');
const rightPanel = document.getElementById('rightPanel');
const container = document.querySelector('.hero');

let isDragging = false;

resizer.addEventListener('mousedown', (e) => {
  e.preventDefault();
  isDragging = true;
  document.body.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const containerRect = container.getBoundingClientRect();
  const pointerRelativeXpos = e.clientX - containerRect.left;

  const minWidth = 150;
  const maxWidth = container.clientWidth - 150;

  if (pointerRelativeXpos >= minWidth && pointerRelativeXpos <= maxWidth) {
    leftPanel.style.width = `${pointerRelativeXpos}px`;
  }
});

document.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
    document.body.style.cursor = 'default';
  }
});
