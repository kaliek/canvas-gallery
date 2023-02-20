/* eslint-disable import/extensions */
import { saveSvgTagToLocalStorage } from './storage.js';
import { getMousePos } from './utils.js';
import { loadTag } from './svg.js';

let isDrawing = false;
let start = { x: 0, y: 0 };

export function startPosition(e, canvas) {
  e.preventDefault();
  e.stopPropagation();
  isDrawing = true;
  start = getMousePos(canvas, e);
}

export function endPosition(e, canvas, context, imageName, imageWidth, imageHeight) {
  e.preventDefault();
  e.stopPropagation();
  isDrawing = false;

  const end = getMousePos(canvas, e);
  const width = end.x - start.x;
  const height = end.y - start.y;
  // eslint-disable-next-line no-alert
  const tag = prompt('Please type the tag text', 'your tag');
  context.clearRect(0, 0, imageWidth, imageHeight);
  loadTag(tag, imageName, imageHeight, imageWidth, height, width, start.x, start.y);
  saveSvgTagToLocalStorage(tag, imageName, height, width, start.x, start.y);
}

export function draw(e, canvas, context) {
  e.preventDefault();
  e.stopPropagation();
  if (!isDrawing || !canvas.getContext) return;
  context.clearRect(0, 0, canvas.width, canvas.height);
  const pos = getMousePos(canvas, e);
  const width = pos.x - start.x;
  const height = pos.y - start.y;
  context.beginPath();
  context.fillStyle = 'rgba(198,230,255, 0.4)';
  context.lineWidth = 1;
  context.strokeStyle = '#047DFF';
  context.rect(start.x, start.y, width, height);
  context.stroke();
  context.fill();
}
