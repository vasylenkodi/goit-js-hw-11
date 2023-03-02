export default class SearchQuery {
  constructor(url, markupRef, loadMoreBtn) {
    this.page = 1;
    this.url = url;
    this.markupRef = markupRef;
    this.loadMoreBtn = loadMoreBtn;
  }

  async firstFetchImages() {
    try {
      this.clearMarkup();
      this.deactivateLoadMoreBtn();
      this.url = `${this.url}&page=${this.page}`;
      const response = await fetch(this.url);
      const data = await response.json();
      const hits = await data.hits;
      this.parameters = hits.map(this.getParameters);
      this.markup = this.parameters.map(this.createCard).join('');
      this.createMarkup();
      this.activateLoadMoreBtn();
      this.page = this.page + 1;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async loadNewImages() {
    try {
      this.url = `${this.url}&page=${this.page}`;
      const response = await fetch(this.url);
      const data = await response.json();
      const hits = await data.hits;
      this.parameters = hits.map(this.getParameters);
      this.markup = this.parameters.map(this.createCard).join('');
      this.createMarkup();
      this.page = this.page + 1;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  getParameters(img) {
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
    this.markupRef.insertAdjacentHTML('beforeend', this.markup);
  }

  setKey(newKey) {
    if (this.key === newKey) {
      return;
    }
    this.key = newKey;
    this.url = `${this.url}&q=${this.key}`;
    this.page = 1;
  }

  activateLoadMoreBtn() {
    this.loadMoreBtn.classList.remove('visually-hidden');
    this.loadMoreBtn.addEventListener(
      'click',
      this.onLoadMoreButtonClick.bind(this)
    );
  }

  deactivateLoadMoreBtn() {
    this.loadMoreBtn.classList.add('visually-hidden');
    this.loadMoreBtn.removeEventListener(
      'click',
      this.onLoadMoreButtonClick.bind(this)
    );
  }

  onLoadMoreButtonClick() {
    console.log(this);
    this.loadNewImages();
  }

  clearMarkup() {
    this.markupRef.innerHTML = '';
  }
}
