import images from "./gallery-items.js";

const refs = {
  galleryImages: document.querySelector(".js-gallery"),
  lightbox: document.querySelector(".js-lightbox"),
  lightboxBtn: document.querySelector(".lightbox__button"),
  lightboxImg: document.querySelector(".lightbox__image"),
};
let activeIdx;
const current = 0;

function setImages(images, i) {
  refs.galleryImages.insertAdjacentHTML(
    "afterbegin",
    images.reduce((acc, image, i) => (acc += getImageMarkup(images[i], i)), "")
  );
}

setImages(images, current);

function getImageMarkup(image, idx) {
  return `
  <li class="gallery__item">
  <a
    class="gallery__link"
    href="${image.preview}"
  >
    <img
      class="gallery__image"
      src="${image.preview}"
      data-source="${image.original}"
      alt="${image.description}"
      data-index = "${idx}"
    />
  </a>
</li>`;
}

refs.galleryImages.addEventListener("click", onImagesClick);
refs.lightbox.addEventListener("click", onClickOverlay);
refs.lightboxBtn.addEventListener("click", onCloseModal);
document.addEventListener("keydown", onCloseModalBtn);
refs.galleryImages.addEventListener("keydown", onLeafThrough);

function onImagesClick(event) {
  event.preventDefault();
  const imageRef = event.target;
  const imgIndex = imageRef.dataset.index;
  if (imageRef.nodeName === "IMG") {
    const refImageBig = imageRef.getAttribute("data-source");
    refs.lightbox.classList.add("is-open");
    refs.lightboxImg.setAttribute("src", refImageBig);
    refs.lightboxImg.setAttribute("alt", imageRef.alt);
    refs.lightboxImg.setAttribute("click", imgIndex);
    activeIdx = Number(imgIndex);
  }
}

function onCloseModal(event) {
  refs.lightbox.classList.remove("is-open");
  refs.lightboxImg.removeAttribute("src");
}

function onCloseModalBtn(event) {
  if (event.code == "Escape") {
    return onCloseModal(event);
  }
}

function onClickOverlay(event) {
  const refOverlay = event.target;
  if (refOverlay.nodeName !== "IMG") {
    return onCloseModal(event);
  }
}

function onLeafThrough(event) {
  const imagesList = [...refs.galleryImages.getElementsByTagName("IMG")];
  if (refs.lightbox.classList.contains("is-open")) {
    if (event.code === "ArrowRight" && activeIdx < imagesList.length - 1) {
      activeIdx += 1;
      refs.lightboxImg.setAttribute(
        "src",
        imagesList[activeIdx].getAttribute("data-source")
      );
    }
    if (event.code === "ArrowLeft" && activeIdx > 0) {
      activeIdx -= 1;
      refs.lightboxImg.setAttribute(
        "src",
        imagesList[activeIdx].getAttribute("data-source")
      );
    }
  }
}
