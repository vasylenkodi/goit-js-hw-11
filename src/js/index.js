import fetchImages from "./fetch-images";

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

// const BASE_URL = 'https://pixabay.com/api/';
// const PARAMETERS =
//   '?key=34043302-c68d7a8556aecc2a40c20dbe5&image_type=photo&orientation=horizontal&safesearch=true';

refs.searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const enteredValue = event.target.searchQuery.value;

    fetchImages(enteredValue);
})