const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

function refreshElementVisibility(imageList) {
  const { length } = imageList;
  document.getElementById('current-image-info').style.display = length > 1 ? 'block' : 'none';
  document.getElementById('delete-image-button').style.display = length > 0 ? 'inline' : 'none';
  document.getElementById('current-image-name').style.display = length > 0 ? 'inline' : 'none';
}

function clearImage() {
  document.getElementById('current-image').setAttribute('src', '');
}

function refreshImageCount(imageList) {
  document.getElementById('image-count').textContent = imageList.length;
}

export function getImageDimensions(image) {
  let { width, height } = image;

  // Change the resizing logic
  if (width > height) {
    if (width > MAX_WIDTH) {
      height *= MAX_WIDTH / width;
      width = MAX_WIDTH;
    }
  } else if (height > MAX_HEIGHT) {
    width *= MAX_HEIGHT / height;
    height = MAX_HEIGHT;
  }
  return { width, height };
}

export function recalculateImageIndex(index, list, action) {
  switch (action) {
    case 'delete': {
      return index === list.length ? list.length - 1 : index;
    }
    case 'next': {
      return index + 1 === list.length ? 0 : index + 1;
    }
    case 'back': {
      return index - 1 === -1 ? list.length - 1 : index - 1;
    }
    default: {
      return index;
    }
  }
}

export function refreshCurrentImageName(name) {
  document.querySelector('#current-image-name').textContent = name;
}

export function refreshCurrentImageIndex(index) {
  document.getElementById('current-index').textContent = index + 1;
}

export function refreshSavedImageList(imageList) {
  refreshElementVisibility(imageList);
  refreshImageCount(imageList);
  if (imageList.length === 0) {
    clearImage();
  }
}
