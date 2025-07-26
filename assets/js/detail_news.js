// Script detail news
// Ambil id dari query string: ?id=xxx&type=anime|manga
// Fetch detail dari Jikan API dan render ke #ldetail

document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const newsId = params.get('id');
    const type = params.get('type') || 'anime';
    if (!newsId) {
        document.getElementById('ldetail').textContent = 'News tidak ditemukan.';
        return;
    }
    // News endpoint: /anime/{id}/news atau /manga/{id}/news
    fetch(`https://api.jikan.moe/v4/${type}/${newsId}/news`)
        .then(res => res.json())
        .then(json => {
            const data = json.data && json.data[0];
            if (!data) {
                document.getElementById('ldetail').textContent = 'Detail news tidak ditemukan.';
                return;
            }
            renderDetailNews(data);
        })
        .catch(() => {
            document.getElementById('ldetail').textContent = 'Gagal mengambil data.';
        });
});

function renderDetailNews(news) {
    const container = document.getElementById('ldetail');
    container.innerHTML = '';
    // Card detail
    const card = document.createElement('div');
    card.className = 'detail-card';
    // Gambar
    if (news.images?.jpg?.image_url) {
        const img = document.createElement('img');
        img.src = news.images.jpg.image_url;
        img.alt = news.title;
        img.className = 'detail-img';
        card.appendChild(img);
    }
    // Judul
    const title = document.createElement('h2');
    title.textContent = news.title;
    card.appendChild(title);
    // Info
    const info = document.createElement('div');
    info.className = 'detail-info';
    info.innerHTML = `
        <b>Author:</b> ${news.author_username || '-'}<br>
        <b>Date:</b> ${news.date || '-'}<br>
        <b>Comments:</b> ${news.comments || '-'}<br>
    `;
    card.appendChild(info);
    // Isi berita
    const desc = document.createElement('p');
    desc.className = 'detail-desc';
    desc.textContent = news.excerpt || 'Tidak ada isi berita.';
    card.appendChild(desc);
    container.appendChild(card);
}
