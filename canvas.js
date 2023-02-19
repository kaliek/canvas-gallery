let isDrawing = false;
let start = { x: 0, y: 0 };
function getMousePos(canvas, e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
}

export function startPosition(e, canvas) {
  e.preventDefault();
  e.stopPropagation();
  isDrawing = true;
  start = getMousePos(canvas, e);
}
export function endPosition(e, canvas, context, imageWidth, imageHeight) {
  e.preventDefault();
  e.stopPropagation();
  isDrawing = false;

  const end = getMousePos(canvas, e);
  const width = end.x - start.x;
  const height = end.y - start.y;
  const list = document.querySelector('#tags');
  // eslint-disable-next-line no-alert
  const tag = prompt('Please type the tag text', 'your tag');
  context.clearRect(0, 0, imageWidth, imageHeight);
  const item = document.createElement('li');
  item.textContent = tag;
  list.appendChild(item);

  const svgns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgns, 'svg');
  svg.setAttribute(
    'style',
    `position: absolute;height: ${imageHeight}px;width:${imageWidth}px;`,
  );
  const g = document.createElementNS(svgns, 'g');
  g.setAttribute('style', `height: ${imageHeight}px;width:${imageWidth}px;`);
  const rect = document.createElementNS(svgns, 'rect');
  rect.setAttribute('x', start.x);
  rect.setAttribute('y', start.y);
  rect.setAttribute('height', height);
  rect.setAttribute('width', width);
  rect.setAttribute('stroke', '#B1B9C0');
  rect.setAttribute('fill', 'none');
  rect.setAttribute('stroke-width', '1px');
  const text = document.createElementNS(svgns, 'text');
  text.setAttribute('x', start.x + 2);
  text.setAttribute('y', start.y + 16);
  text.setAttribute('font-size', 14);
  text.setAttribute('fill', '#B1B9C0');
  text.textContent = tag;
  g.appendChild(rect);
  g.appendChild(text);
  svg.appendChild(g);
  const parent = document.getElementById('image');
  parent.insertBefore(svg, document.querySelector('canvas'));
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
