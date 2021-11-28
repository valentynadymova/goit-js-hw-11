import "./css/styles.css";
import { getImages } from "./backend/backend.js";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import "notiflix/dist/notiflix-3.2.2.min.css";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formRef = document.querySelector("#search-form");
const galleryRef = document.querySelector(".gallery");
const btnLoadRef = document.querySelector(".load-more");

btnLoadRef.classList.add("hidden");
let page = 1;
const per_page = 40;
let inputName = "";
let gallery = {};

formRef.addEventListener("submit", onSubmitForm);
btnLoadRef.addEventListener("click", onBtnLoadClick)

async function onSubmitForm(e) {
    e.preventDefault();
    galleryRef.innerHTML = "";
    page = 1;
    btnLoadRef.classList.add("hidden");
    inputName = e.target.searchQuery.value;

  if (inputName.trim() === "") {
      return;
    };
  
    try {
      const data = await getImages(inputName.trim(), page, per_page);
      
        if (data.hits.length===0) {
          Notify.failure("Sorry, there are no images matching your search query. Please try again.", { timeout: 3000 });
        } else {
          Notify.success(`Hooray! We found ${data.totalHits} images`, { timeout: 2500 });
          markupImageCard(data.hits);
          gallery = new SimpleLightbox('.gallery a', { captionsData: "alt", captionDelay: 250 });
         
          (page * per_page) <= data.totalHits && btnLoadRef.classList.remove("hidden");
          
           page += 1;
        }
      
    }
    catch(error) {
      console.log(error.message);
    }
};

async function onBtnLoadClick() {
  try {
    const data = await getImages(inputName.trim(), page, per_page);
    
      if ((page * per_page) >= data.totalHits) {
        btnLoadRef.classList.add("hidden");
        Notify.info("We're sorry, but you've reached the end of search results.", { timeout: 4000 },);
       }
      
    markupImageCard(data.hits);
    gallery.refresh();
    page += 1;

      const {height} = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: height * 2,
        behavior: 'smooth',
      });
    }
    catch(error) {
      console.log(error.message)
    }
}


function markupImageCard(images) {
  const markUp = images.map(image => {
    const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = image;
    return `<a class="gallery__item" href="${largeImageURL}">
    <div class="photo-card">
      <div class="wrapper-img">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </div>  
      <div class="info">
        <p class="info-item">
          <b>Likes </b>${likes}
        </p>
        <p class="info-item">
          <b>Views </b>${views}
        </p>
        <p class="info-item">
          <b>Comments </b>${comments}
        </p>
        <p class="info-item">
          <b>Downloads </b>${downloads}
        </p>
      </div>
    </div>
  </a>`;
  }).join("");
  galleryRef.insertAdjacentHTML("beforeend", markUp)
};






