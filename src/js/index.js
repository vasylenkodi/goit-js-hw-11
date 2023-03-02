import SearchQuery from "./search-query";

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};



const BASE_URL = 'https://pixabay.com/api/';
const PARAMETERS =
  '?key=34043302-c68d7a8556aecc2a40c20dbe5&image_type=photo&orientation=horizontal&safesearch=true&per_page=10';
const URL = BASE_URL + PARAMETERS;

const searchQuery = new SearchQuery(URL, refs.gallery, refs.loadMoreBtn);
  
console.log(searchQuery);

refs.searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const enteredValue = event.target.searchQuery.value;

  searchQuery.setKey(enteredValue);
  searchQuery.firstFetchImages();
})
