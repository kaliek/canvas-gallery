import { getListFromLocalStorage } from "./storage.js";
import { getMousePos } from "./image.js";

const IMAGES_KEY = "IMAGES_LIST";
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

window.addEventListener("load", () => {
  const canvas = document.querySelector("canvas");
  const context = canvas.getContext("2d");
  let imageWidth = canvas.width;
  let imageHeight = canvas.height;
  let isDrawing = false;
  let start = { x: 0, y: 0 };
  let currentImageName = "";
  let currentImageIndex = 0;
  let savedImageList = getListFromLocalStorage(IMAGES_KEY);

  function getImageFromLocalStorage() {
    if (currentImageIndex >= savedImageList.length) {
      return undefined;
    }
    const name = savedImageList[currentImageIndex];
    const src = localStorage.getItem(name);
    if (src) {
      return { name, src };
    }
    return undefined;
  }
  function saveImageToLocalStorage(name, src) {
    savedImageList.unshift(name);
    localStorage.setItem(IMAGES_KEY, JSON.stringify(savedImageList));
    localStorage.setItem(name, src);
  }
  function loadImage(src) {
    const image = document.getElementById("current-image");
    image.src = src;
    image.onload = () => {
      imageWidth = image.width;
      imageHeight = image.height;

      // Change the resizing logic
      if (imageWidth > imageHeight) {
        if (imageWidth > MAX_WIDTH) {
          imageHeight = imageHeight * (MAX_WIDTH / imageWidth);
          imageWidth = MAX_WIDTH;
        }
      } else {
        if (imageHeight > MAX_HEIGHT) {
          imageWidth = imageWidth * (MAX_HEIGHT / imageHeight);
          imageHeight = MAX_HEIGHT;
        }
      }
      canvas.width = imageWidth;
      canvas.height = imageHeight;
      image.width = imageWidth;
      image.height = imageHeight;
    };
  }
  function refreshImage() {
    const savedImage = getImageFromLocalStorage();
    if (savedImage) {
      loadImage(savedImage.src);
      setCurrentImageName(savedImage.name);
    }
  }
  function startPosition(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log("starting");
    isDrawing = true;
    start = getMousePos(canvas, e);
  }
  function endPosition(e) {
    e.preventDefault();
    e.stopPropagation();
    isDrawing = false;

    const end = getMousePos(canvas, e);
    const width = end.x - start.x;
    const height = end.y - start.y;
    const list = document.querySelector("#tags");
    let tag = prompt("Please type the tag text", "your tag");
    context.clearRect(0, 0, imageWidth, imageHeight);
    const item = document.createElement("li");
    item.textContent = tag;
    list.appendChild(item);

    var svgns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgns, "svg");
    svg.setAttribute(
      "style",
      `position: absolute;height: ${imageHeight}px;width:${imageWidth}px;`
    );
    const g = document.createElementNS(svgns, "g");
    g.setAttribute("style", `height: ${imageHeight}px;width:${imageWidth}px;`);
    const rect = document.createElementNS(svgns, "rect");
    rect.setAttribute("x", start.x);
    rect.setAttribute("y", start.y);
    rect.setAttribute("height", height);
    rect.setAttribute("width", width);
    rect.setAttribute("stroke", "#B1B9C0");
    rect.setAttribute("fill", "none");
    rect.setAttribute("stroke-width", "1px");
    const text = document.createElementNS(svgns, "text");
    text.setAttribute("x", start.x + 2);
    text.setAttribute("y", start.y + 16);
    text.setAttribute("font-size", 14);
    text.setAttribute("fill", "#B1B9C0");
    text.textContent = tag;
    g.appendChild(rect);
    g.appendChild(text);
    svg.appendChild(g);
    const parent = document.getElementById("image");
    parent.insertBefore(svg, document.querySelector("canvas"));
  }
  function draw(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isDrawing || !canvas.getContext) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    const pos = getMousePos(canvas, e);
    const width = pos.x - start.x;
    const height = pos.y - start.y;
    context.beginPath();
    context.fillStyle = "rgba(198,230,255, 0.4)";
    context.lineWidth = 1;
    context.strokeStyle = "#047DFF";
    context.rect(start.x, start.y, width, height);
    context.stroke();
    context.fill();
  }
  function setCurrentImageName(name) {
    currentImageName = name;
    document.querySelector("#current-image-name").textContent = name;
  }
  function setCurrentIndex(index) {
    document.getElementById("current-index").textContent = index + 1;
  }

  function toggleElementVisibility(imageList) {
    const length = imageList.length;
    document.getElementById("current-image-info").style.display =
      length > 1 ? "block" : "none";
    document.getElementById("delete-image-button").style.display =
      length > 0 ? "inline" : "none";
    document.getElementById("current-image-name").style.display =
      length > 0 ? "inline" : "none";
  }

  function clearImage() {
    document.getElementById("current-image").setAttribute("src", "");
  }

  function setImageCount(imageList) {
    document.getElementById("image-count").textContent = imageList.length;
  }

  function updateSavedImageList(imageList) {
    toggleElementVisibility(imageList);
    setImageCount(imageList);
    if (imageList.length === 0) {
      clearImage();
    }
  }

  canvas.addEventListener("mousedown", startPosition);
  canvas.addEventListener("mouseup", endPosition);
  canvas.addEventListener("mousemove", draw);
  document.querySelector("#selectedFile").addEventListener("change", (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0]; // First file for now
    reader.readAsDataURL(file);
    const imageName = file.name;

    reader.onload = () => {
      loadImage(reader.result);
      setCurrentImageName(imageName);
      saveImageToLocalStorage(imageName, reader.result);
      updateSavedImageList(savedImageList);
      setCurrentIndex(currentImageIndex);
      refreshImage();
    };
  });
  document
    .getElementById("delete-image-button")
    .addEventListener("click", (e) => {
      if (currentImageName) {

        savedImageList = savedImageList.filter((i) => i !== currentImageName);
        localStorage.setItem(IMAGES_KEY, JSON.stringify(savedImageList));
        localStorage.removeItem(currentImageName);
        updateSavedImageList(savedImageList);
        console.log(currentImageIndex, savedImageList.length);
        if (currentImageIndex === savedImageList.length) {
            currentImageIndex-=1;
            setCurrentIndex(currentImageIndex);
        }
        refreshImage();
      }
    });
  document.getElementById("back-button").addEventListener("click", (e) => {
    currentImageIndex =
      currentImageIndex === 0
        ? savedImageList.length - 1
        : currentImageIndex - 1;
    refreshImage();
    setCurrentIndex(currentImageIndex);

  });
  document.getElementById("next-button").addEventListener("click", (e) => {
    currentImageIndex =
      currentImageIndex === savedImageList.length - 1
        ? 0
        : currentImageIndex + 1;
    refreshImage();
    setCurrentIndex(currentImageIndex);

  });

  // Initial loading
  updateSavedImageList(savedImageList);
  setCurrentIndex(currentImageIndex + 1);
  refreshImage();
});
