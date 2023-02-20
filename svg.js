/* eslint-disable import/extensions */
import { deleteSvgTagFromLocalStorage, updateSvgTagFromLocalStorage } from './storage.js';
import { getMousePos } from './utils.js';

let allTags = [];
let selectedElement = null;
let selectedTagKey = '';

const OFFSET = 10;
export function isOnTagBorder(x, y) {
  return allTags.find((t) => (
    ((x > t.x - OFFSET && x < t.x + OFFSET) && (y > t.y - OFFSET && y < t.y + t.height + OFFSET)) // Left border
        || ((x > t.x + t.width - OFFSET && x < t.x + t.width + OFFSET) && (y > t.y - OFFSET && y < t.y + t.height + OFFSET)) // right border
        || ((x > t.x - OFFSET && x < t.x + t.width + OFFSET) && (y > t.y - OFFSET && y < t.y + OFFSET)) // top border
        || ((x > t.x - OFFSET && x < t.x + t.width + OFFSET) && (y > t.y + t.height - OFFSET && y < t.y + t.height + OFFSET)) // bottom border
  ));
}

export function startDrag(target, tagKey) {
  selectedElement = target;
  selectedTagKey = tagKey;
}

export function drag(e, canvas) {
  if (selectedElement) {
    e.preventDefault();
    const coord = getMousePos(canvas, e);
    selectedElement.children[0].setAttributeNS(null, 'x', coord.x);
    selectedElement.children[0].setAttributeNS(null, 'y', coord.y);
    selectedElement.children[1].setAttributeNS(null, 'x', coord.x + 2);
    selectedElement.children[1].setAttributeNS(null, 'y', coord.y + 16);
  }
}

export function endDrag(e, canvas) {
  const coord = getMousePos(canvas, e);
  updateSvgTagFromLocalStorage(selectedTagKey, coord.x, coord.y);
  selectedElement = '';
}

export function createTag(imageHeight, imageWidth, height, width, x, y, tag) {
  const svgns = 'http://www.w3.org/2000/svg';
  const svg = document.querySelector('svg');

  const rect = document.createElementNS(svgns, 'rect');
  rect.setAttribute('x', x);
  rect.setAttribute('y', y);
  rect.setAttribute('height', height);
  rect.setAttribute('width', width);
  rect.setAttribute('stroke', '#B1B9C0');
  rect.setAttribute('fill', 'none');
  rect.setAttribute('stroke-width', '1px');
  const text = document.createElementNS(svgns, 'text');
  text.setAttribute('x', x + 2);
  text.setAttribute('y', y + 16);
  text.setAttribute('font-size', 14);
  text.setAttribute('fill', '#B1B9C0');
  text.textContent = tag;
  const g = document.createElementNS(svgns, 'g');
  g.setAttribute('id', tag);
  g.style.cursor = 'move';
  g.appendChild(rect);
  g.appendChild(text);
  svg.appendChild(g);
  return svg;
}

export function loadTag(tag, imageName, imageHeight, imageWidth, height, width, x, y) {
  const list = document.querySelector('#tags');
  const item = document.createElement('li');
  item.textContent = tag;
  const button = document.createElement('button');
  button.textContent = 'Delete';
  const tagKey = `${imageName}_${tag}`;
  button.onclick = () => {
    deleteSvgTagFromLocalStorage(tagKey);
    item.remove();
    document.getElementById(tag).remove();
    if (list.children.length === 0) {
      document.getElementById('clear-all-tags-button').style.display = 'none';
    }
    allTags = allTags.filter((t) => t.tag === tag);
  };
  item.appendChild(button);
  list.appendChild(item);
  createTag(imageHeight, imageWidth, height, width, x, y, tag);
  allTags.push({
    tag, height, width, x, y, key: tagKey,
  });
  document.getElementById('clear-all-tags-button').style.display = 'block';
}

export function clearTags() {
  document.getElementById('tags').innerHTML = '';
  document.querySelector('svg').innerHTML = '';
  document.getElementById('clear-all-tags-button').style.display = 'none';
  allTags = [];
}
