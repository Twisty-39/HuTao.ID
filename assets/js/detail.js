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

function renderDetailAnime(anime) {
    const container = document.getElementById('detail');
    container.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'detail-card';
    // Cover Image
    const img = document.createElement('img');
    img.src = anime.images?.jpg?.image_url || '';
    img.alt = anime.title;
    img.className = 'detail-img';
    card.appendChild(img);
    // Judul semua bahasa
    const title = document.createElement('h2');
    title.textContent = anime.title;
    card.appendChild(title);
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
        card.appendChild(titleList);
    }
    // Trailer
    if (anime.trailer?.embed_url) {
        const trailerDiv = document.createElement('div');
        trailerDiv.style.margin = '1em 0';
        trailerDiv.innerHTML = `<iframe src="${anime.trailer.embed_url}" width="100%" height="320" allowfullscreen style="border-radius:8px;border:none;"></iframe>`;
        card.appendChild(trailerDiv);
    }
    // Info singkat
    const info = document.createElement('div');
    info.className = 'detail-info';
    info.innerHTML = `
        <b>Type:</b> ${anime.type || '-'}<br>
        <b>Episodes:</b> ${anime.episodes || '-'}<br>
        <b>Duration:</b> ${anime.duration || '-'}<br>
        <b>Status:</b> ${anime.status || '-'}<br>
        <b>Score:</b> ${anime.score || '-'}<br>
        <b>Ranked:</b> ${anime.rank || '-'}<br>
        <b>Popularity:</b> ${anime.popularity || '-'}<br>
        <b>Season & Year:</b> ${anime.season || '-'} ${anime.year || '-'}<br>
        <b>Rating:</b> ${anime.rating || '-'}<br>
    `;
    card.appendChild(info);
    // Genre, Theme, Demographic
    if (anime.genres?.length || anime.themes?.length || anime.demographics?.length) {
        const tagsDiv = document.createElement('div');
        tagsDiv.style.marginBottom = '0.7em';
        tagsDiv.style.fontSize = '1rem';
        tagsDiv.innerHTML = '<b>Genre/Theme/Demographic:</b> ';
        const tags = [];
        if (anime.genres) tags.push(...anime.genres.map(g => g.name));
        if (anime.themes) tags.push(...anime.themes.map(t => t.name));
        if (anime.demographics) tags.push(...anime.demographics.map(d => d.name));
        tagsDiv.innerHTML += tags.length ? tags.join(', ') : '-';
        card.appendChild(tagsDiv);
    }
    // Sinopsis
    const desc = document.createElement('p');
    desc.className = 'detail-desc';
    desc.textContent = anime.synopsis || 'Tidak ada sinopsis.';
    card.appendChild(desc);
    // Background info (collapsible)
    if (anime.background) {
        const bgDiv = document.createElement('div');
        bgDiv.style.marginTop = '1em';
        bgDiv.style.background = '#f7f3e9';
        bgDiv.style.borderRadius = '8px';
        bgDiv.style.padding = '0.7em 1em';
        bgDiv.style.maxHeight = '120px';
        bgDiv.style.overflow = 'hidden';
        bgDiv.style.position = 'relative';
        bgDiv.innerHTML = `<b>Background:</b> <span class="bg-text">${anime.background}</span>`;
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = 'Show more';
        toggleBtn.style.position = 'absolute';
        toggleBtn.style.right = '12px';
        toggleBtn.style.bottom = '8px';
        toggleBtn.style.background = '#A94438';
        toggleBtn.style.color = '#fff';
        toggleBtn.style.border = 'none';
        toggleBtn.style.borderRadius = '6px';
        toggleBtn.style.padding = '2px 10px';
        toggleBtn.style.cursor = 'pointer';
        let expanded = false;
        toggleBtn.onclick = function() {
            expanded = !expanded;
            if (expanded) {
                bgDiv.style.maxHeight = 'none';
                toggleBtn.textContent = 'Show less';
            } else {
                bgDiv.style.maxHeight = '120px';
                toggleBtn.textContent = 'Show more';
            }
        };
        bgDiv.appendChild(toggleBtn);
        card.appendChild(bgDiv);
    }
    // Studio, Producers, Licensors
    const prodDiv = document.createElement('div');
    prodDiv.style.marginTop = '1em';
    prodDiv.style.fontSize = '1rem';
    prodDiv.innerHTML = '<b>Studios:</b> ' + (anime.studios?.map(s => s.name).join(', ') || '-') + '<br>';
    prodDiv.innerHTML += '<b>Producers:</b> ' + (anime.producers?.map(p => p.name).join(', ') || '-') + '<br>';
    prodDiv.innerHTML += '<b>Licensors:</b> ' + (anime.licensors?.map(l => l.name).join(', ') || '-') + '<br>';
    card.appendChild(prodDiv);
    // Streaming links
    if (anime.streaming?.length) {
        const streamDiv = document.createElement('div');
        streamDiv.style.marginTop = '1em';
        streamDiv.innerHTML = '<b>Streaming:</b> ';
        anime.streaming.forEach(s => {
            const a = document.createElement('a');
            a.href = s.url;
            a.textContent = s.name;
            a.target = '_blank';
            a.style.marginRight = '1em';
            a.style.color = '#A94438';
            streamDiv.appendChild(a);
        });
        card.appendChild(streamDiv);
    }
    container.appendChild(card);
}

function renderDetailManga(manga) {
    const container = document.getElementById('detail');
    container.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'detail-card';
    const img = document.createElement('img');
    img.src = manga.images?.jpg?.image_url || '';
    img.alt = manga.title;
    img.className = 'detail-img';
    card.appendChild(img);
    const title = document.createElement('h2');
    title.textContent = manga.title;
    card.appendChild(title);
    const info = document.createElement('div');
    info.className = 'detail-info';
    info.innerHTML = `
        <b>Type:</b> ${manga.type || '-'}<br>
        <b>Volumes:</b> ${manga.volumes || '-'}<br>
        <b>Chapters:</b> ${manga.chapters || '-'}<br>
        <b>Status:</b> ${manga.status || '-'}<br>
        <b>Score:</b> ${manga.score || '-'}<br>
        <b>Rank:</b> ${manga.rank || '-'}<br>
        <b>Year:</b> ${manga.published?.prop?.from?.year || '-'}<br>
    `;
    card.appendChild(info);
    const desc = document.createElement('p');
    desc.className = 'detail-desc';
    desc.textContent = manga.synopsis || 'Tidak ada sinopsis.';
    card.appendChild(desc);
    container.appendChild(card);
}