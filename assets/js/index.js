document.addEventListener('DOMContentLoaded', async function () {
  await fetchSummerAnime();
  await fetchTopAnime();
  await fetchTopManga();
  await fetchTopTrailers();
});

// Fungsi retryFetch
async function retryFetch(url, options = {}, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Fetch failed');
      return await response.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

// Fetch Summer Anime
async function fetchSummerAnime() {
  try {
    const json = await retryFetch('https://api.jikan.moe/v4/seasons/2025/summer?limit=15');
    const data = json.data || [];
    const container = document.getElementById('summer-anime-list');
    if (container) {
      while (container.firstChild) container.removeChild(container.firstChild);
      data.forEach(anime => {
        const card = createCard(anime.title, anime.images.webp?.image_url || '', '', anime.mal_id, 'anime');
        container.appendChild(card);
      });
    }
  } catch (err) {
    console.error('Gagal mengambil data Summer Anime:', err);
  }
}

// Fetch Top Anime
async function fetchTopAnime() {
  try {
    const json = await retryFetch('https://api.jikan.moe/v4/top/anime?limit=15');
    const data = json.data || [];
    const container = document.getElementById('top-anime-list');
    if (container) {
      while (container.firstChild) container.removeChild(container.firstChild);
      data.forEach(anime => {
        const card = createCard(anime.title, anime.images.webp?.image_url || '', '', anime.mal_id, 'anime');
        container.appendChild(card);
      });
    }
  } catch (err) {
    console.error('Gagal mengambil data Top Anime:', err);
  }
}

// Fetch Top Manga
async function fetchTopManga() {
  try {
    const json = await retryFetch('https://api.jikan.moe/v4/top/manga?limit=15');
    const data = json.data || [];
    const container = document.getElementById('top-manga-list');
    if (container) {
      while (container.firstChild) container.removeChild(container.firstChild);
      data.forEach(manga => {
        const card = createCard(manga.title, manga.images.webp?.image_url || '', '', manga.mal_id, 'manga');
        container.appendChild(card);
      });
    }
  } catch (err) {
    console.error('Gagal mengambil data Top Manga:', err);
  }
}

// Fetch Top Trailers
async function fetchTopTrailers() {
  try {
    const json = await retryFetch('https://api.jikan.moe/v4/watch/promos');
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
  } catch (err) {
    console.error('Gagal mengambil data Top Trailers:', err);
  }
}

// Fungsi untuk menampilkan trailer di modal
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
