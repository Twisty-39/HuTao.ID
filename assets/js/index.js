// tunggu index selesai dimuat
document.addEventListener('DOMContentLoaded', function () {
  fetchSummerAnime();
  fetchTopAnime();
  fetchTopManga();
  fetchTopTrailers();
});

//fech summer anime
function fetchSummerAnime() {
  fetch('https://api.jikan.moe/v4/seasons/2025/summer?limit=15')
    .then(res => res.json())
    .then(json => {
      const data = json.data || [];
      const container = document.getElementById('summer-anime-list');
      if (container) {
        while (container.firstChild) container.removeChild(container.firstChild);
        data.forEach(anime => {
          const card = createCard(anime.title, anime.images.webp?.image_url || '', '', anime.mal_id, 'anime'); //lempar ke create card (script.js)
          container.appendChild(card);
        });
      }
    });
}

//fech top anime
function fetchTopAnime() {
  fetch('https://api.jikan.moe/v4/top/anime?limit=15')
    .then(res => res.json())
    .then(json => {
      const data = json.data || [];
      const container = document.getElementById('top-anime-list');
      if (container) {
        while (container.firstChild) container.removeChild(container.firstChild);
        data.forEach(anime => {
          const card = createCard(anime.title, anime.images.webp?.image_url || '', '', anime.mal_id, 'anime');
          container.appendChild(card);
        });
      }
    });
}

//fech top manga
function fetchTopManga() {
  fetch('https://api.jikan.moe/v4/top/manga?limit=15')
    .then(res => res.json())
    .then(json => {
      const data = json.data || [];
      const container = document.getElementById('top-manga-list');
      if (container) {
        while (container.firstChild) container.removeChild(container.firstChild);
        data.forEach(manga => {
          const card = createCard(manga.title, manga.images.webp?.image_url || '', '', manga.mal_id, 'manga');
          container.appendChild(card);
        });
      }
    });
}

//fech top trailer
function fetchTopTrailers() {
  fetch('https://api.jikan.moe/v4/watch/promos')
  .then(res => res.json())
  .then(json => {
      const data = json.data || [];
      const container = document.getElementById('top-trailers-list');
      if (container) {
        while (container.firstChild) container.removeChild(container.firstChild);
        data.forEach(trailer => {
          const embedUrl = trailer.trailer?.embed_url;
          if (!embedUrl) return;

          const animeTitle = trailer.entry?.title || '';
          const img = trailer.entry?.images?.jpg?.image_url || '';
          const trailerTitle = trailer.title || '';

          const card = createCard(animeTitle, img, trailerTitle, '', 'trailer');
          card.addEventListener('click', (e) => {
            e.preventDefault();
            playTrailer(embedUrl);
          });
          container.appendChild(card);
        });
      }
    });
}

function playTrailer(embedUrl) {
  const section = document.getElementById('embed-trailers');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  const modal = document.getElementById('trailer-modal');
  const iframe = document.getElementById('trailer-iframe');
  const closeBtn = document.querySelector('#trailer-modal .close');
  if (!modal || !iframe || !closeBtn) return;
  iframe.src = embedUrl;
  modal.style.display = 'block';
  closeBtn.onclick = () => {
    iframe.src = '';
    modal.style.display = 'none';
  };
}
