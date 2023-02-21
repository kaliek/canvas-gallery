/* eslint-disable import/extensions */
import {
  getListFromLocalStorage,
  saveItemToListLocalStorage,
  deleteItemToListLocalStorage,
  getItemFromListLocalStorage,
  getSvgTagsFromLocalStorage,
  deleteAllSvgTagsFromLocalStorage,
} from './storage.js';
import {
  getImageDimensions,
  recalculateImageIndex,
  refreshCurrentImageName,
  refreshCurrentImageIndex,
  refreshSavedImageList,
} from './image.js';
import { startPosition, endPosition, draw } from './canvas.js';
import {
  startDrag,
  endDrag,
  drag,
  loadTag,
  clearTags,
  isOnTagBorder,
} from './svg.js';
import { getMousePos } from './utils.js';

const IMAGES_KEY = 'IMAGES_LIST';

window.addEventListener('load', () => {
  const pad = document.getElementById('pad');
  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');
  const image = document.getElementById('current-image');
  const svg = document.querySelector('svg');
  let maxWidth = 0;
  let maxHeight = 0;
  function setSize(height, width) {
    maxHeight = height;
    maxWidth = width;
    canvas.height = height;
    canvas.width = width;
    image.height = height;
    image.width = width;
    svg.setAttribute('height', height);
    svg.setAttribute('width', width);
  }

  let currentImageName = '';
  let currentImageIndex = 0;
  let savedImageList = getListFromLocalStorage(IMAGES_KEY);

  function loadImage(src) {
    image.src = src;
    image.onload = () => {
      const imageDimensions = getImageDimensions(image, maxHeight, maxWidth);
      setSize(imageDimensions.height, imageDimensions.width);
    };
  }

  function setCurrentImageName(name) {
    currentImageName = name;
  }

  function loadCurrentTagList(imageName) {
    clearTags();
    const currentTags = getSvgTagsFromLocalStorage(imageName);
    if (currentTags.length > 0) {
      currentTags.forEach((t) => {
        loadTag(
          t.tag,
          imageName,
          maxHeight,
          maxWidth,
          t.height,
          t.width,
          t.x,
          t.y,
        );
      });
    }
  }

  function refreshImage(name, src) {
    loadImage(src);
    refreshCurrentImageName(name);
    loadCurrentTagList(name);
  }

  function loadCurrentImage(imageIndex, list) {
    const savedImage = getItemFromListLocalStorage(imageIndex, list);
    if (savedImage) {
      setCurrentImageName(savedImage.key);
      refreshCurrentImageIndex(imageIndex);
      refreshImage(currentImageName, savedImage.value);
    }
  }

  let isDragging = false;
  function mouseDown(e) {
    if (image.getAttribute('src') === '') {
      return;
    }
    const { x, y } = getMousePos(canvas, e);
    const tag = isOnTagBorder(x, y);
    if (!tag) {
      startPosition(e, canvas);
    } else {
      isDragging = true;
      startDrag(document.getElementById(tag.tag), tag.key);
    }
  }

  function mouseUp(e) {
    if (image.getAttribute('src') === '') {
      return;
    }
    if (!isDragging) {
      endPosition(
        e,
        canvas,
        context,
        currentImageName,
        maxWidth,
        maxHeight,
      );
    } else {
      isDragging = false;
      endDrag(e, canvas);
    }
  }

  function mouseMove(e) {
    if (image.getAttribute('src') === '') {
      return;
    }
    if (!isDragging) {
      draw(e, canvas, context);
    } else {
      drag(e, canvas);
    }
  }
  pad.addEventListener('mousedown', mouseDown);
  pad.addEventListener('mouseup', mouseUp);
  pad.addEventListener('mousemove', mouseMove);
  document.querySelector('#selectedFile').addEventListener('change', (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0]; // First file for now
    reader.readAsDataURL(file);

    reader.onload = () => {
      setCurrentImageName(file.name.replace(/\.[^/.]+$/, ''));
      refreshImage(currentImageName, reader.result);
      savedImageList = saveItemToListLocalStorage(
        currentImageName,
        reader.result,
        IMAGES_KEY,
        savedImageList,
      );
      refreshSavedImageList(savedImageList);
    };
  });
  document
    .getElementById('delete-image-button')
    .addEventListener('click', () => {
      if (currentImageName) {
        savedImageList = deleteItemToListLocalStorage(
          currentImageName,
          IMAGES_KEY,
          savedImageList,
        );
        deleteAllSvgTagsFromLocalStorage(currentImageName);
        refreshSavedImageList(savedImageList);
        currentImageIndex = recalculateImageIndex(
          currentImageIndex,
          savedImageList,
          'delete',
        );
        loadCurrentImage(currentImageIndex, savedImageList);
      }
    });
  document.getElementById('back-button').addEventListener('click', () => {
    currentImageIndex = recalculateImageIndex(
      currentImageIndex,
      savedImageList,
      'back',
    );
    loadCurrentImage(currentImageIndex, savedImageList);
  });
  document.getElementById('next-button').addEventListener('click', () => {
    currentImageIndex = recalculateImageIndex(
      currentImageIndex,
      savedImageList,
      'next',
    );
    loadCurrentImage(currentImageIndex, savedImageList);
  });
  document
    .getElementById('clear-all-tags-button')
    .addEventListener('click', () => {
      deleteAllSvgTagsFromLocalStorage(currentImageName);
      clearTags();
    });

  window.addEventListener('resize', (e) => {
    setSize(e.target.innerHeight, e.target.innerWidth);
  });
  // Initial loading
  setSize(window.innerHeight, window.innerWidth);
  refreshSavedImageList(savedImageList);
  loadCurrentImage(currentImageIndex, savedImageList);
});
