//get data anime/manga
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    let type = params.get('type') || 'anime';

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

// tampilkan anime detail   
function renderDetailAnime(anime) {
  const container = document.getElementById('detail');
  container.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'detail-card';

  const left = document.createElement('div');
  left.className = 'detail-left';
  const img = document.createElement('img');
  img.src = anime.images?.jpg?.image_url || '';
  img.alt = anime.title;
  img.className = 'detail-img';
  left.appendChild(img);
  card.appendChild(left);

  const right = document.createElement('div');
  right.className = 'detail-right';
  const title = document.createElement('h2');
  title.textContent = anime.title;
  right.appendChild(title);

  if (anime.titles && Array.isArray(anime.titles)) {
    const titleList = document.createElement('div');
    titleList.style.fontSize = '1rem';
    titleList.style.marginBottom = '0.5em';
    anime.titles.forEach(t => {
      const span = document.createElement('span');
      span.textContent = `${t.type}: ${t.title}`;
      span.style.marginRight = '1em';
      span.style.color = '#6d2b2b';
      titleList.appendChild(span);
    });
    right.appendChild(titleList);
  }

  const infoTable = document.createElement('table');
  infoTable.className = 'detail-info-table';
  const infoRows = [
    { label: 'Type', value: anime.type },
    { label: 'Episodes', value: anime.episodes },
    { label: 'Duration', value: anime.duration },
    { label: 'Status', value: anime.status },
    { label: 'Score', value: anime.score },
    { label: 'Season & Year', value: `${anime.season || '-'} ${anime.year || '-'}` },
    { label: 'Rating', value: anime.rating },
  ];
  // Gabungkan genre/theme/demographic ke infoRows
  if (anime.genres?.length || anime.themes?.length || anime.demographics?.length) {
    const tags = [];
    if (anime.genres) tags.push(...anime.genres.map(g => g.name));
    if (anime.themes) tags.push(...anime.themes.map(t => t.name));
    if (anime.demographics) tags.push(...anime.demographics.map(d => d.name));
    infoRows.push({ label: 'Genre/Theme/Demographic', value: tags.length ? tags.join(', ') : '-' });
  }
  infoRows.forEach(item => {
    const tr = document.createElement('tr');
    tr.className = 'detail-info-row';
    const tdLabel = document.createElement('td');
    tdLabel.className = 'detail-info-label';
    tdLabel.textContent = item.label;
    const tdValue = document.createElement('td');
    tdValue.className = 'detail-info-value';
    tdValue.textContent = item.value || '-';
    tr.appendChild(tdLabel);
    tr.appendChild(tdValue);
    infoTable.appendChild(tr);
  });
  right.appendChild(infoTable);

  const desc = document.createElement('p');
  desc.className = 'detail-desc';
  desc.textContent = anime.synopsis || 'Tidak ada sinopsis.';
  right.appendChild(desc);

  // background dihapus

  const prodTable = document.createElement('table');
  prodTable.className = 'detail-prod-table';
  [
    { label: 'Studios', value: anime.studios?.map(s => s.name).join(', ') },
    { label: 'Producers', value: anime.producers?.map(p => p.name).join(', ') },
    { label: 'Licensors', value: anime.licensors?.map(l => l.name).join(', ') }
  ].forEach(item => {
    const tr = document.createElement('tr');
    tr.className = 'detail-prod-row';
    const tdLabel = document.createElement('td');
    tdLabel.className = 'detail-prod-label';
    tdLabel.textContent = item.label;
    const tdValue = document.createElement('td');
    tdValue.className = 'detail-prod-value';
    tdValue.textContent = item.value || '-';
    tr.appendChild(tdLabel);
    tr.appendChild(tdValue);
    prodTable.appendChild(tr);
  });
  right.appendChild(prodTable);

  if (anime.streaming?.length) {
    const streamTable = document.createElement('table');
    streamTable.className = 'detail-stream-table';
    const tr = document.createElement('tr');
    tr.className = 'detail-stream-row';
    const tdLabel = document.createElement('td');
    tdLabel.className = 'detail-stream-label';
    tdLabel.textContent = 'Streaming';
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
    right.appendChild(streamTable);
  }

  // Trailer: tombol pop up modal
  if (anime.trailer?.embed_url) {
    const trailerBtn = document.createElement('button');
    trailerBtn.className = 'trailer-btn';
    trailerBtn.textContent = 'Lihat Trailer';
    trailerBtn.onclick = function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showTrailerModal(anime.trailer.embed_url);
    };
    left.appendChild(trailerBtn);
  }
  card.appendChild(right);
  container.appendChild(card);
}

// Modal trailer logic
function showTrailerModal(embedUrl) {
  let modal = document.getElementById('trailer-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'trailer-modal';
    modal.className = 'trailer-modal';
    modal.innerHTML = `
      <div class="trailer-modal-content">
        <span class="close">&times;</span>
        <iframe src="" frameborder="0" allowfullscreen style="width:100%;height:340px;border-radius:8px;"></iframe>
      </div>
    `;
    document.body.appendChild(modal);
  }
  modal.style.display = 'block';
  modal.querySelector('iframe').src = embedUrl;
  modal.querySelector('.close').onclick = function() {
    modal.style.display = 'none';
    modal.querySelector('iframe').src = '';
  };
  // Tutup modal jika klik di luar konten
  modal.onclick = function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
      modal.querySelector('iframe').src = '';
    }
  };
  card.appendChild(right);
  container.appendChild(card);
}

// tampilkan manga detail
function renderDetailManga(manga) {
    const container = document.getElementById('detail');
    container.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'detail-card';

    // Gambar cover
    const left = document.createElement('div');
    left.className = 'detail-left';
    const img = document.createElement('img');
    img.src = manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url || '';
    img.alt = manga.title;
    img.className = 'detail-img';
    left.appendChild(img);
    card.appendChild(left);

    // Info bagian kanan
    const right = document.createElement('div');
    right.className = 'detail-right';

    // Judul
    const title = document.createElement('h2');
    title.className = 'detail-title';
    title.textContent = manga.title;
    right.appendChild(title);

    // Informasi detail sebagai tabel, tags digabung
    const infoTable = document.createElement('table');
    infoTable.className = 'detail-info-table';
    const items = [
        { label: 'Type', value: manga.type || '-' },
        { label: 'Volumes', value: manga.volumes || '-' },
        { label: 'Chapters', value: manga.chapters || '-' },
        { label: 'Status', value: manga.status || '-' },
        { label: 'Score', value: manga.score || '-' },
        { label: 'Year', value: manga.published?.prop?.from?.year || '-' }
    ];
    // Gabungkan tags
    if (manga.genres?.length || manga.themes?.length || manga.demographics?.length) {
        const tags = [];
        if (manga.genres) tags.push(...manga.genres.map(g => g.name));
        if (manga.themes) tags.push(...manga.themes.map(t => t.name));
        if (manga.demographics) tags.push(...manga.demographics.map(d => d.name));
        items.push({ label: 'Tags', value: tags.length ? tags.join(', ') : '-' });
    }
    items.forEach(item => {
        const tr = document.createElement('tr');
        tr.className = 'detail-info-row';
        const tdLabel = document.createElement('td');
        tdLabel.className = 'detail-info-label';
        tdLabel.textContent = item.label;
        const tdValue = document.createElement('td');
        tdValue.className = 'detail-info-value';
        tdValue.textContent = item.value;
        tr.appendChild(tdLabel);
        tr.appendChild(tdValue);
        infoTable.appendChild(tr);
    });
    right.appendChild(infoTable);

    // Sinopsis
    const synopsis = document.createElement('p');
    synopsis.className = 'detail-desc';
    synopsis.textContent = manga.synopsis || 'Tidak ada sinopsis.';
    right.appendChild(synopsis);

    card.appendChild(right);
    container.appendChild(card);
}
