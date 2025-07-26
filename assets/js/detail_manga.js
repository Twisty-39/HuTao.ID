// Script detail manga
// Ambil id dari query string: ?id=xxx
// Fetch detail dari Jikan API dan render ke #ldetail

document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const mangaId = params.get('id');
    if (!mangaId) {
        document.getElementById('ldetail').textContent = 'Manga tidak ditemukan.';
        return;
    }
    fetch(`https://api.jikan.moe/v4/manga/${mangaId}`)
        .then(res => res.json())
        .then(json => {
            const data = json.data;
            if (!data) {
                document.getElementById('ldetail').textContent = 'Detail manga tidak ditemukan.';
                return;
            }
            renderDetailManga(data);
        })
        .catch(() => {
            document.getElementById('ldetail').textContent = 'Gagal mengambil data.';
        });
});

function renderDetailManga(manga) {
    const container = document.getElementById('ldetail');
    container.innerHTML = '';
    // Card detail
    const card = document.createElement('div');
    card.className = 'detail-card';
    // Gambar
    const img = document.createElement('img');
    img.src = manga.images?.jpg?.image_url || '';
    img.alt = manga.title;
    img.className = 'detail-img';
    card.appendChild(img);
    // Judul
    const title = document.createElement('h2');
    title.textContent = manga.title;
    card.appendChild(title);
    // Info
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
    // Sinopsis
    const desc = document.createElement('p');
    desc.className = 'detail-desc';
    desc.textContent = manga.synopsis || 'Tidak ada sinopsis.';
    card.appendChild(desc);
    container.appendChild(card);
}
