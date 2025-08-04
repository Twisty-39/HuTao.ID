// Jalankan ketika halaman sudah selesai dimuat
document.addEventListener('DOMContentLoaded', async function () {
  // Panggil semua fungsi fetch secara async dan berurutan
  await fetchSummerAnime();
  await fetchTopAnime();
  await fetchTopManga();
  await fetchTopTrailers();
});

// Fungsi untuk melakukan fetch dengan retry otomatis
async function retryFetch(url, options = {}, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Fetch failed');
      return await response.json(); // Berhasil, return hasil JSON
    } catch (err) {
      if (i === retries - 1) throw err; // Gagal total, lempar error
      await new Promise(res => setTimeout(res, delay)); // Tunggu sebelum coba ulang
    }
  }
}

// Fetch daftar anime musim panas tahun 2025
async function fetchSummerAnime() {
  try {
    const json = await retryFetch('https://api.jikan.moe/v4/seasons/2025/summer?limit=15');
    const data = json.data || [];
    const container = document.getElementById('summer-anime-list');
    if (container) {
      // Bersihkan kontainer sebelum menampilkan data baru
      while (container.firstChild) container.removeChild(container.firstChild);

      // Render setiap anime sebagai kartu
      data.forEach(anime => {
        const card = createCard(anime.title, anime.images.webp?.image_url || '', '', anime.mal_id, 'anime');
        container.appendChild(card);
      });
    }
  } catch (err) {
    console.error('Gagal mengambil data Summer Anime:', err);
  }
}

// Fetch anime dengan rating/peringkat tertinggi
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

// Fetch manga dengan rating/peringkat tertinggi
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

// Fetch daftar trailer anime terbaru/populer
async function fetchTopTrailers() {
  try {
    const json = await retryFetch('https://api.jikan.moe/v4/watch/promos');
    const data = json.data || [];
    const container = document.getElementById('top-trailers-list');
    if (container) {
      while (container.firstChild) container.removeChild(container.firstChild);

      data.forEach(trailer => {
        const embedUrl = trailer.trailer?.embed_url;
        if (!embedUrl) return; // Skip jika tidak ada embed trailer

        const animeTitle = trailer.entry?.title || '';
        const img = trailer.entry?.images?.jpg?.image_url || '';
        const trailerTitle = trailer.title || '';

        // Buat card dan tambahkan event klik untuk membuka modal
        const card = createCard(animeTitle, img, trailerTitle, '', 'trailer');
        card.addEventListener('click', (e) => {
          e.preventDefault();
          playTrailer(embedUrl); // Tampilkan trailer
        });
        container.appendChild(card);
      });
    }
  } catch (err) {
    console.error('Gagal mengambil data Top Trailers:', err);
  }
}

// Fungsi untuk menampilkan trailer dalam modal iframe
function playTrailer(embedUrl) {
  const section = document.getElementById('embed-trailers');
  if (section) {
    section.scrollIntoView({ bottom: 0, behavior: 'smooth' });
  }

  const modal = document.getElementById('trailer-modal');
  const iframe = document.getElementById('trailer-iframe');
  const closeBtn = document.querySelector('#trailer-modal .close');

  if (!modal || !iframe || !closeBtn) return;

  iframe.src = embedUrl; // Set video trailer
  modal.style.display = 'block'; // Tampilkan modal

  // Tombol untuk menutup modal
  closeBtn.onclick = () => {
    iframe.src = ''; // Hentikan video saat modal ditutup
    modal.style.display = 'none';
  };
}
