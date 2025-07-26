document.addEventListener('DOMContentLoaded', function () {
    fetchSummerAnime();
    fetchTopAnime();
    fetchTopManga();
    fetchLatestEpisodes();
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
                    const card = createCard(anime.title, anime.images.webp?.image_url || '', '', anime.mal_id, 'anime');
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

//fech lastes eps
function fetchLatestEpisodes() {
    fetch('https://api.jikan.moe/v4/watch/episodes?limit=15')
        .then(res => res.json())
        .then(json => {
            const data = json.data || [];
            const container = document.getElementById('latest-episode-list');
            if (container) {
                while (container.firstChild) container.removeChild(container.firstChild);
                data.forEach(ep => {
                    const judul = ep.entry?.title || '';
                    const img = ep.entry?.images.webp?.image_url || '';
                    const epNum = ep.episodes?.[0]?.mal_id ? `Episode ${ep.episodes[0].mal_id}` : '';
                    const card = createCard(judul, img, epNum, ep.entry?.mal_id, 'anime');
                    container.appendChild(card);
                });
            }
        });
}

// Fetch top trailers
// function fetchTopTrailers() {
//     fetch('https://api.jikan.moe/v4/watch/promos?limit=15')
//         .then(res => res.json())
//         .then(json => {
//             const data = json.data || [];
//             const container = document.getElementById('top-trailers-list');
//             if (container) {
//                 while (container.firstChild) container.removeChild(container.firstChild);
//                 data.forEach(trailer => {
//                     const animeTitle = trailer.entry?.title || '';
//                     const img = trailer.entry?.images?.jpg?.image_url || '';
//                     const ytUrl = trailer.trailer?.url || '';
//                     const trailerTitle = trailer.title || '';

//                     // extra diisi dengan judul trailer
//                     const card = createCard(animeTitle, img, trailerTitle, '', 'trailer');
//                     card.href = ytUrl || '#';
//                     card.target = '_blank';

//                     const gambar = card.querySelector('img');
//                     if (gambar) {
//                         gambar.style.width = '100%';
//                         gambar.style.height = '180px';
//                         gambar.style.objectFit = 'cover';
//                     }

//                     container.appendChild(card);
//                 });
//             }
//         });
// }

function fetchTopTrailers() {
  fetch('https://api.jikan.moe/v4/watch/promos?limit=15')
    .then(res => res.json())
    .then(json => {
      const data = json.data || [];
      const container = document.getElementById('top-trailers-list');
      const modal = document.getElementById('trailer-modal');
      const iframe = document.getElementById('trailer-iframe');
      const closeBtn = document.querySelector('#trailer-modal .close');

      if (!container || !modal || !iframe || !closeBtn) {
        console.error("Element modal/iframe/container tidak ditemukan");
        return;
      }

      container.innerHTML = '';

      data.forEach(trailer => {
        const embedUrl = trailer.trailer?.embed_url;
        if (!embedUrl) return; // Skip kalau gak ada embed

        const animeTitle = trailer.entry?.title || '';
        const img = trailer.entry?.images?.jpg?.image_url || '';
        const trailerTitle = trailer.title || '';

        const card = document.createElement('div');
        card.classList.add('anime-card');
        card.style.cursor = 'pointer';

        const imageEl = document.createElement('img');
        imageEl.src = img;
        imageEl.alt = animeTitle;
        imageEl.style.width = '100%';
        imageEl.style.height = '180px';
        imageEl.style.objectFit = 'cover';

        const titleEl = document.createElement('p');
        titleEl.textContent = trailerTitle;
        titleEl.style.color = 'white';
        titleEl.style.margin = '8px';

        card.appendChild(imageEl);
        card.appendChild(titleEl);

        card.addEventListener('click', () => {
          iframe.src = embedUrl;
          modal.style.display = 'block';
        });

        container.appendChild(card);
      });

      // Close modal
      closeBtn.addEventListener('click', () => {
        iframe.src = '';
        modal.style.display = 'none';
      });

      // Klik luar modal
      window.addEventListener('click', (event) => {
        if (event.target === modal) {
          iframe.src = '';
          modal.style.display = 'none';
        }
      });
    });
}

const modal = document.getElementById('trailer-modal');
const iframe = document.getElementById('trailer-iframe');
const closeBtn = modal.querySelector('.close');

// Saat klik trailer
card.addEventListener('click', () => {
  if (ytUrl) {
    iframe.src = ytUrl;
    modal.style.display = 'block';
    
    // Scroll ke modal jika perlu
    modal.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});

// Saat klik X
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  iframe.src = ''; // stop video
});
