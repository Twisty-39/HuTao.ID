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
    } else if (type === 'news') {
        fetch(`https://api.jikan.moe/v4/anime/${id}/news`)
            .then(res => res.json())
            .then(json => {
                const data = json.data && json.data[0];
                if (!data) {
                    document.getElementById('detail').textContent = 'Detail news tidak ditemukan.';
                    return;
                }
                renderDetailNews(data);
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
    const img = document.createElement('img');
    img.src = anime.images?.jpg?.image_url || '';
    img.alt = anime.title;
    img.className = 'detail-img';
    card.appendChild(img);
    const title = document.createElement('h2');
    title.textContent = anime.title;
    card.appendChild(title);
    const info = document.createElement('div');
    info.className = 'detail-info';
    info.innerHTML = `
        <b>Type:</b> ${anime.type || '-'}<br>
        <b>Episodes:</b> ${anime.episodes || '-'}<br>
        <b>Status:</b> ${anime.status || '-'}<br>
        <b>Score:</b> ${anime.score || '-'}<br>
        <b>Rank:</b> ${anime.rank || '-'}<br>
        <b>Season:</b> ${anime.season || '-'}<br>
        <b>Year:</b> ${anime.year || '-'}<br>
    `;
    card.appendChild(info);
    const desc = document.createElement('p');
    desc.className = 'detail-desc';
    desc.textContent = anime.synopsis || 'Tidak ada sinopsis.';
    card.appendChild(desc);
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

function renderDetailNews(news) {
    const container = document.getElementById('detail');
    container.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'detail-card';
    if (news.images?.jpg?.image_url) {
        const img = document.createElement('img');
        img.src = news.images.jpg.image_url;
        img.alt = news.title;
        img.className = 'detail-img';
        card.appendChild(img);
    }
    const title = document.createElement('h2');
    title.textContent = news.title;
    card.appendChild(title);
    const info = document.createElement('div');
    info.className = 'detail-info';
    info.innerHTML = `
        <b>Author:</b> ${news.author_username || '-'}<br>
        <b>Date:</b> ${news.date || '-'}<br>
        <b>Comments:</b> ${news.comments || '-'}<br>
    `;
    card.appendChild(info);
    const desc = document.createElement('p');
    desc.className = 'detail-desc';
    desc.textContent = news.excerpt || 'Tidak ada isi berita.';
    card.appendChild(desc);
    container.appendChild(card);
}
