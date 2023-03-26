import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightBox from 'simplelightbox';

export default class SearchQuery {
  constructor(url, markupRef, btnRef) {
    this.page = 1;
    this.url = url;
    this.markupRef = markupRef;
    this.loadMoreBtnEl = btnRef;
    this.key = '';
    this.imagesParameters = [];
    this.markup = [];
    this.totalHits;
  }

  async fetchImages() {
    this.reset();
    try {
      const urlToFetch = `${this.url}&page=${this.page}&q=${this.key}`;
      const response = await fetch(urlToFetch);
      const data = await response.json();
      const images = await data.hits;
      const isFound = images.join('');
      if (!isFound) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      this.totalHits = data.totalHits;
      Notify.success(`Hooray! We found ${this.totalHits} images.`);
      this.getParametersFromImages(images);
      this.createCards();
      this.createMarkup();
      this.createLightbox();
      this.currentAmountOfImages = this.page * 10;
      const endReached = this.currentAmountOfImages >= this.totalHits;
      if (endReached) {
        this.endOfCollection();
        return;
      }
      // this.activateLoadMoreBtn();
      this.page += 1;
    } catch (error) {
      console.log(error);
    }
  }

  async loadMore() {
    try {
      this.imagesParameters = [];
      this.markup = [];
      const urlToFetch = `${this.url}&page=${this.page}&q=${this.key}`;
      const response = await fetch(urlToFetch);
      const data = await response.json();
      const images = await data.hits;
      const endReached = this.currentAmountOfImages >= this.totalHits;
      if (endReached) {
        this.endOfCollection();
        return;
      }
      this.getParametersFromImages(images);
      this.createCards();
      this.createMarkup();
      this.scrollDown();
      this.lightbox.refresh();
      this.currentAmountOfImages = this.page * 10;
      this.page += 1;
    } catch (error) {
      console.log(error);
    }
  }

  setKey(newKey) {
    this.key = newKey;
  }

  getParametersFromImages(images) {
    images.map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        this.imagesParameters.push({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        });
      }
    );
  }

  createCards() {
    this.imagesParameters.map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        this.markup.push(
          `<a href="${largeImageURL}" class="gallery-link"><div class="photo-card"><img src="${webformatURL}" alt="${tags}" loading="lazy"><div class="info"><p class="info-item"><b>Likes: ${likes}</b></p><p class="info-item"><b>Views: ${views}</b></p><p class="info-item"><b>Comments: ${comments}</b></p><p class="info-item"><b>Downloads: ${downloads}</b></p></div></div></a>`
        );
      }
    );
  }

  createLightbox() {
    this.lightbox = new SimpleLightbox('.gallery a', {});
  }

  createMarkup() {
    this.markupRef.insertAdjacentHTML('beforeend', this.markup.join(''));
  }

  scrollDown() {
    const { height: cardHeight } =
      this.markupRef.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }

  activateLoadMoreBtn() {
    this.loadMoreBtnEl.classList.remove('visually-hidden');
  }

  deactivateLoadMoreBtn() {
    this.loadMoreBtnEl.classList.add('visually-hidden');
  }

  endOfCollection() {
    // this.deactivateLoadMoreBtn();
    Notify.info('Were sorry, but youve reached the end of search results.');
  }

  reset() {
    // this.deactivateLoadMoreBtn();
    this.markupRef.innerHTML = '';
    this.page = 1;
    this.imagesParameters = [];
    this.markup = [];
  }
}
