const BASE_URL = 'https://pixabay.com/api/';
const PARAMETERS =
    '?key=34043302-c68d7a8556aecc2a40c20dbe5&image_type=photo&orientation=horizontal&safesearch=true&per_page=4';
  
    const refs = {
      searchForm: document.querySelector('#search-form'),
      gallery: document.querySelector('.gallery'),
    };

export default async function fetchImages(tag) {
  const url = `${BASE_URL}${PARAMETERS}&q=${tag}`;
try {
      const response = await fetch(url);
      const data = await response.json();
    const hits = await data.hits;
        const parameters = hits.map(getParameters);
        const markup = parameters.map(createCard).join('');
        refs.gallery.insertAdjacentHTML('afterbegin', markup);
} catch (error) {
    console.log(error);
    return;
}

    console.log(data);
    console.log(hits);
    console.log(parameters);
    console.log(markup);
}

function getParameters(img) {
    return {
      previewImg: img.webformatURL,
      originalImg: img.largeImageURL,
      about: img.tags,
      likes: img.likes,
      views: img.views,
      comments: img.comments,
      downloads: img.downloads,
    };
}

function createCard({
  previewImg,
  originalImg,
  about,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card"><img src="${previewImg}" alt="${about}" loading="lazy" /><div class="info"><p class="info-item"><b>Likes: ${likes}</b></p><p class="info-item"><b>Views: ${views}</b></p><p class="info-item"><b>Comments: ${comments}</b></p><p class="info-item"><b>Downloads: ${downloads}</b></p></div></div>`;
}