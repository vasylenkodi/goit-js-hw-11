export default class SearchQuery {
  constructor(page, url, ref) {
    this.page = page;
    this.url = url;
    this.markupRef = ref;
  }

  async fetchImages() {
    try {
      const response = await fetch(this.url);
      const data = await response.json();
      const hits = await data.hits;
      hits.map(this.getParameters);
      this.markup = this.parameters.map(this.createCard).join('');
      this.createMarkup();
    } catch (error) {
      console.log(error);
      return;
    }
  }

  getParameters() {
    this.parameters = {
      previewImg: img.webformatURL,
      originalImg: img.largeImageURL,
      about: img.tags,
      likes: img.likes,
      views: img.views,
      comments: img.comments,
      downloads: img.downloads,
    };
  }

  createCard({
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

  createMarkup() {
    this.markupRef.insertAdjacentHTML('afterbegin', this.markup);
  }
}
