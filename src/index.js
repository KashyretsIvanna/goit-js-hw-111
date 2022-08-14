import { Notify } from 'notiflix/build/notiflix-notify-aio';
import * as basicLightbox from 'basiclightbox';

// let elem = document.querySelector('.gallery');
// let infScroll = new InfiniteScroll( elem, {
//   // options
//   path: '.pagination__next',
//   append: '.post',
//   history: false,
// });

// // element argument can be a selector string
// //   for an individual element
// let infScroll = new InfiniteScroll( '.container', {
//   // options
// });

const links = {
  INPUT: document.querySelector('input[name=searchQuery]'),
  FORM: document.querySelector('form'),
  BTN: document.querySelector('button[type=submit]'),
  LOAD: document.querySelector('button[type=button]'),
  GALLERY: document.querySelector('.gallery'),
  CARTS: [...document.getElementsByClassName('web-img')],
  PAGE: 2,
};

links.LOAD.style.display = 'none';

links.FORM.addEventListener('submit', e => {
  links.PAGE = 1;
  e.preventDefault();
  fetchFunc('change');
});

links.LOAD.addEventListener('click', e => {
  links.PAGE = links.PAGE + 1;
  e.preventDefault();
  fetchFunc('add');
});

function fetchFunc(way) {
  fetch(
    `https://pixabay.com/api/?key=28662580-e80c32ef76301f2cc10b9678d&q=${links.INPUT.value}&image_type=photo&orientation=horizontal&safesearch=true&page=${links.PAGE}`
  )
    .then(response => response.json())
    .then(el => {
      let htmlText = el.hits
        .map(
          hit => `<div data-photo=${hit.largeImageURL} class="photo-card">
    <img class="web-img" src=${hit.webformatURL} alt=${el.tags} loading="lazy" />
    <div class="info">
      <div class="info-item">
      <div>${hit.likes}</div>
        <b>Likes</b>
      </div>
      <div class="info-item">
      <div>${hit.views}</div>
        <b>Views</b>
      </div>
      <div class="info-item">
      <div>${hit.comments}</div>
        <b>Comments</b>
      </div>
      <div class="info-item">
      <div>${hit.downloads}</div>
        <b>Downloads</b>
      </div>
    </div>
  </div>`
        )
        .join('');

      if (el.totalHits <= 20 * links.PAGE && htmlText.trim() !== '') {
        Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
        links.LOAD.style.display = 'none';
      }
      if (htmlText.trim() !== '') {
        links.LOAD.style.display = 'block';
      } else {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        links.LOAD.style.display = 'none';
      }

      if (way === 'change' && htmlText.trim() !== '') {
        Notify.success('Hooray! We found totalHits images.');

        links.GALLERY.innerHTML = htmlText;
      } else if (way === 'add') {
        links.GALLERY.innerHTML += htmlText;
      }

      let array = [...document.getElementsByClassName('photo-card')];

      array.forEach(el => {
        el.addEventListener('click', e => {
          let instance = basicLightbox.create(
            `
          <div>
        <img src=${e.currentTarget.dataset.photo} alt=""></img>
        </div>
      `,
            { className: 'lightbox' }
          );
          instance.show(() => console.log('lightbox now visible'));
        });
      });
      if (links.PAGE !== 1) {
        let { height: cardHeight } = document
          .querySelector('.gallery')
          .firstElementChild.getBoundingClientRect();

        window.scrollBy({
          top: cardHeight * 2 + 120,
          behavior: 'smooth',
        });
      }
    });
}

// window.addEventListener('scroll', () => {
//   if(window.scrollY>1000){

//   }
// });

////////////////////////////////////////////////

// links.LOAD.style = 'display:none';

// let page = 1;
// function newPage(n) {
//   page = page + n;
//   return page;
// }
// console.log(newPage(1));

// links.INPUT.addEventListener('input', e => {
//   debaunced(e, 1);
// });
// links.LOAD.addEventListener('click', e => {
//   fetchItems(e, newPage(1));
// });

// let debaunced = debaunce(fetchItems, 300);

// function fetchItems(e, addpage) {
//   console.log(addpage);

//   fetch(
//     `https://pixabay.com/api/?key=28662580-e80c32ef76301f2cc10b9678d&q=${e.target.value}&image_type=photo&orientation=horizontal&per_page=5&safesearch=true&page=${addpage}`
//   )
//     .then(items => items.json())
//     .then(el => {
//       if (addpage === 1) {
//         Notify.warning('Hooray! We found totalHits images.');
//       }
//       total = el.totalHits;
//       if (total > 0) {
//         links.BTN.disabled = false;

//         links.BTN.addEventListener('click', e => {
//           // Notify.warning('Hooray! We found totalHits images.');
//           console.log('abled');
//           if (total < addpage * 20) {
//             Notify.warning(
//               "We're sorry, but you've reached the end of search results."
//             );
//             links.LOAD.style = 'display:none';
//           } else {
//             links.LOAD.style = 'display:block';
//           }

//           e.preventDefault();
//           let htmlText = el.hits
//             .map(
//               hit => `<div onclick={fn(e)} data-photo=${hit.largeImageURL} class="photo-card">
//             <img class="web-img" src=${hit.webformatURL} alt=${el.tags} loading="lazy" />
//             <div class="info">
//               <div class="info-item">
//               <div>${hit.likes}</div>
//                 <b>Likes</b>
//               </div>
//               <div class="info-item">
//               <div>${hit.views}</div>
//                 <b>Views</b>
//               </div>
//               <div class="info-item">
//               <div>${hit.comments}</div>
//                 <b>Comments</b>
//               </div>
//               <div class="info-item">
//               <div>${hit.downloads}</div>
//                 <b>Downloads</b>
//               </div>
//             </div>
//           </div>`
//             )
//             .join('');
//           if (addpage === 1) {
//             links.GALLERY.innerHTML = htmlText;
//           } else {
//             links.GALLERY.innerHTML += htmlText;
//           }

//           // buttonClicked(e, 0, el);
//         });
//         links.LOAD.addEventListener('click', e => {
//           // Notify.warning('Hooray! We found totalHits images.');
//           console.log('abled');
//           if (el.totalHits < addpage * 20) {
//             Notify.warning(
//               "We're sorry, but you've reached the end of search results."
//             );
//             links.LOAD.style = 'display:none';
//           } else {
//             links.LOAD.style = 'display:block';
//           }

//           e.preventDefault();
//           let htmlText = el.hits
//             .map(
//               hit => `<div onclick={fn(e)} data-photo=${hit.largeImageURL} class="photo-card">
//             <img class="web-img" src=${hit.webformatURL} alt=${el.tags} loading="lazy" />
//             <div class="info">
//               <div class="info-item">
//               <div>${hit.likes}</div>
//                 <b>Likes</b>
//               </div>
//               <div class="info-item">
//               <div>${hit.views}</div>
//                 <b>Views</b>
//               </div>
//               <div class="info-item">
//               <div>${hit.comments}</div>
//                 <b>Comments</b>
//               </div>
//               <div class="info-item">
//               <div>${hit.downloads}</div>
//                 <b>Downloads</b>
//               </div>
//             </div>
//           </div>`
//             )
//             .join('');
//           if (page === 0) {
//             links.GALLERY.innerHTML = htmlText;
//           } else {
//             links.GALLERY.innerHTML += htmlText;
//           }
//         });
//       } else {
//         links.BTN.addEventListener('click', e => {
//           console.log('disabled');
//           e.preventDefault();
//           links.BTN.disabled = true;
//           links.GALLERY.innerHTML = null;
//         });

//         Notify.failure(
//           'Sorry, there are no images matching your search query. Please try again.'
//         );
//       }
//     })
//     .catch(err => {
//       console.log(err);
//     });
// }

// function buttonClicked(e, page, el) {}
