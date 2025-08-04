//fecth data anime/manga
document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  let type = params.get('type');

  if (!id) {
    document.getElementById('detail').textContent = 'Data tidak ditemukan.';
    return;
  }
  if (type === 'anime') {
    fetch(`https://api.jikan.moe/v4/anime/${id}/full`)
      .then(res => res.json())
      .then(json => {
        const data = json.data;
        if (!data) {
          document.getElementById('detail').textContent = 'Detail anime tidak ditemukan.';
          return;
        }
        renderDetailAnime(data);
      })
      .catch(() => {
        document.getElementById('detail').textContent = 'Gagal mengambil data.';
      });
  } else if (type === 'manga') {
    fetch(`https://api.jikan.moe/v4/manga/${id}/full`)
      .then(res => res.json())
      .then(json => {
        const data = json.data;
        if (!data) {
          document.getElementById('detail').textContent = 'Detail manga tidak ditemukan.';
          return;
        }
        renderDetailManga(data);
      })
      .catch(() => {
        document.getElementById('detail').textContent = 'Gagal mengambil data.';
      });
  }
});

// Helper untuk buat tabel
function createTable(rows, rowClass, labelClass, valueClass) {
  const table = document.createElement('table');
  rows.forEach(item => {
    const tr = document.createElement('tr');
    if (rowClass) tr.className = rowClass;
    const tdLabel = document.createElement('td');
    if (labelClass) tdLabel.className = labelClass;
    tdLabel.textContent = item.label;
    const tdValue = document.createElement('td');
    if (valueClass) tdValue.className = valueClass;
    tdValue.textContent = item.value || '-';
    tr.appendChild(tdLabel);
    tr.appendChild(tdValue);
    table.appendChild(tr);
  });
  return table;
}

// render detail anime 
function renderDetailAnime(anime) {
  const container = document.getElementById('detail');
  // container.innerHTML = '';
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const card = document.createElement('div');
  card.className = 'detail-card';

  // Kiri
  const left = document.createElement('div');
  left.className = 'detail-left';

  // const inner


  const img = document.createElement('img');
  img.src = anime.images?.jpg?.image_url || '';
  img.alt = anime.title;
  img.className = 'detail-img';
  left.appendChild(img);

  // Trailer button
  if (anime.trailer?.embed_url) {
    const trailerBtn = document.createElement('button');
    trailerBtn.className = 'trailer-btn';
    trailerBtn.textContent = 'Lihat Trailer';
    trailerBtn.onclick = function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showTrailerModal(anime.trailer.embed_url);
    };
    left.appendChild(trailerBtn);
  }

  // Prod table
  const prodRows = [
    { label: 'Studios', value: anime.studios?.map(s => s.name).join(', ') },
    { label: 'Producers', value: anime.producers?.map(p => p.name).join(', ') },
    { label: 'Licensors', value: anime.licensors?.map(l => l.name).join(', ') }
  ];
  left.appendChild(createTable(prodRows, 'detail-prod-row', 'detail-prod-label', 'detail-prod-value'));

  // Streaming
  if (anime.streaming?.length) {
    const streamTable = document.createElement('table');
    const tr = document.createElement('tr');
    const tdLabel = document.createElement('td');
    tdLabel.textContent = 'Streaming';
    tdLabel.className = 'detail-stream-label';
    const tdValue = document.createElement('td');
    tdValue.className = 'detail-stream-value';
    anime.streaming.forEach(s => {
      const a = document.createElement('a');
      a.href = s.url;
      a.textContent = s.name;
      a.target = '_blank';
      a.className = 'detail-stream-link';
      tdValue.appendChild(a);
    });
    tr.appendChild(tdLabel);
    tr.appendChild(tdValue);
    streamTable.appendChild(tr);
    left.appendChild(streamTable);
  }
  card.appendChild(left);

  // Kanan
  const right = document.createElement('div');
  right.className = 'detail-right';
  const title = document.createElement('h2');
  title.textContent = anime.title;
  right.appendChild(title);

  if (anime.titles && Array.isArray(anime.titles)) {
    const titleList = document.createElement('div');
    titleList.style.fontSize = '1rem';
    titleList.style.margin = '0';
    anime.titles.forEach(t => {
      const p = document.createElement('p');
      p.textContent = `${t.type} : ${t.title}`;
      p.style.marginRight = '1em';
      p.style.color = '#6d2b2b';
      titleList.appendChild(p);
    });
    right.appendChild(titleList);
  }

  // Info table
  const infoRows = [
    { label: 'Type', value: anime.type },
    { label: 'Episodes', value: anime.episodes },
    { label: 'Duration', value: anime.duration },
    { label: 'Status', value: anime.status },
    { label: 'Score', value: anime.score },
    { label: 'Season & Year', value: `${anime.season || '-'} ${anime.year || '-'}` },
    { label: 'Rating', value: anime.rating },
  ];
  if (anime.genres?.length || anime.themes?.length || anime.demographics?.length) {
    const tags = [];
    if (anime.genres) tags.push(...anime.genres.map(g => g.name));
    if (anime.themes) tags.push(...anime.themes.map(t => t.name));
    if (anime.demographics) tags.push(...anime.demographics.map(d => d.name));
    infoRows.push({ label: 'Genre', value: tags.length ? tags.join(', ') : '-' });
  }
  right.appendChild(createTable(infoRows, 'detail-info-row', 'detail-info-label', 'detail-info-value'));

  const desc = document.createElement('p');
  desc.className = 'detail-desc';
  desc.textContent = anime.synopsis || 'Tidak ada sinopsis.';
  right.appendChild(desc);

  card.appendChild(right);
  container.appendChild(card);
}

// render detail manga 
function renderDetailManga(manga) {
  const container = document.getElementById('detail');
  container.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'detail-card';
  // Kiri
  const left = document.createElement('div');
  left.className = 'detail-left';
  const img = document.createElement('img');
  img.src = manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url || '';
  img.alt = manga.title;
  img.className = 'detail-img';
  left.appendChild(img);
  card.appendChild(left);
  // Kanan
  const right = document.createElement('div');
  right.className = 'detail-right';
  const title = document.createElement('h2');
  title.className = 'detail-title';
  title.textContent = manga.title;
  right.appendChild(title);
  // Info table
  const items = [
    { label: 'Type', value: manga.type || '-' },
    { label: 'Volumes', value: manga.volumes || '-' },
    { label: 'Chapters', value: manga.chapters || '-' },
    { label: 'Status', value: manga.status || '-' },
    { label: 'Score', value: manga.score || '-' },
    { label: 'Year', value: manga.published?.prop?.from?.year || '-' }
  ];
  if (manga.genres?.length || manga.themes?.length || manga.demographics?.length) {
    const tags = [];
    if (manga.genres) tags.push(...manga.genres.map(g => g.name));
    if (manga.themes) tags.push(...manga.themes.map(t => t.name));
    if (manga.demographics) tags.push(...manga.demographics.map(d => d.name));
    items.push({ label: 'Tags', value: tags.length ? tags.join(', ') : '-' });
  }
  right.appendChild(createTable(items, 'detail-info-row', 'detail-info-label', 'detail-info-value'));
  // Sinopsis
  const synopsis = document.createElement('p');
  synopsis.className = 'detail-desc';
  synopsis.textContent = manga.synopsis || 'Tidak ada sinopsis.';
  right.appendChild(synopsis);
  card.appendChild(right);
  container.appendChild(card);
}