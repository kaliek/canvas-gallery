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
import {
  startPosition, endPosition, draw, loadTag,
} from './canvas.js';

const IMAGES_KEY = 'IMAGES_LIST';

window.addEventListener('load', () => {
  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');
  const image = document.getElementById('current-image');
  let imageWidth = canvas.width;
  let imageHeight = canvas.height;
  let currentImageName = '';
  let currentImageIndex = 0;
  let savedImageList = getListFromLocalStorage(IMAGES_KEY);

  function loadImage(src) {
    image.src = src;
    image.onload = () => {
      const imageDimensions = getImageDimensions(image);
      imageWidth = imageDimensions.width;
      imageHeight = imageDimensions.height;
      canvas.width = imageWidth;
      canvas.height = imageHeight;
      image.width = imageWidth;
      image.height = imageHeight;
    };
  }

  function setCurrentImageName(name) {
    currentImageName = name;
  }

  function clearTags() {
    document.getElementById('tags').innerHTML = '';
    document.querySelector('svg').innerHTML = '';
    document.getElementById('clear-all-tags-button').style.display = 'none';
  }

  function loadCurrentTagList(imageName) {
    clearTags();
    const currentImageTags = getSvgTagsFromLocalStorage(imageName);
    if (currentImageTags.length > 0) {
      currentImageTags.forEach((t) => {
        loadTag(t.tag, imageName, imageHeight, imageWidth, t.height, t.width, t.x, t.y);
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
  canvas.addEventListener('mousedown', (e) => startPosition(e, canvas));
  canvas.addEventListener('mouseup', (e) => endPosition(e, canvas, context, currentImageName, imageWidth, imageHeight));
  canvas.addEventListener('mousemove', (e) => draw(e, canvas, context));
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
  document.getElementById('clear-all-tags-button').addEventListener('click', () => {
    deleteAllSvgTagsFromLocalStorage(currentImageName);
    clearTags();
  });

  // Initial loading
  refreshSavedImageList(savedImageList);
  loadCurrentImage(currentImageIndex, savedImageList);
});
