// render card anime dan manga
function createCard(judul, img, extra, id, type) {
    const card = document.createElement('a');
    card.className = 'isi-card';

    const tipe = type;
    card.href = id ? `/detail.html?id=${id}&type=${tipe}` : '#'; // Link ke detail dengan type & id

    const gambar = document.createElement('img');
    gambar.src = img;
    gambar.alt = judul;
    gambar.className = 'card-img';
    card.appendChild(gambar);

    const title = document.createElement('div');
    title.className = 'scroll-title';
    if (judul.length > 12) {
        title.classList.add('scrollable');
        const span = document.createElement('span');
        span.textContent = judul;
        title.appendChild(span);
    } else {
        title.textContent = judul;
    }
    card.appendChild(title);

    // extra info
    if (extra) {
        const extraDiv = document.createElement('div');
        extraDiv.className = 'extra';
        extraDiv.textContent = extra;
        card.appendChild(extraDiv);
    }
    return card;
}