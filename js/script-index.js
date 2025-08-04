// Fungsi untuk membuat kartu tampilan (anime/manga)
// Parameter:
// judul: judul anime/manga
// img: URL gambar
// extra: teks tambahan pv
// id: id item (untuk link ke halaman detail)
// type: tipe konten (anime atau manga)
function createCard(judul, img, extra, id, type) {
    // Buat elemen <a> sebagai wadah kartu
    const card = document.createElement('a');
    card.className = 'isi-card';

    // Buat URL href ke halaman detail
    const tipe = type;
    card.href = id ? `html/detail.html?id=${id}&type=${tipe}` : '#';

    // Buat elemen gambar dan set src, alt, class
    const gambar = document.createElement('img');
    gambar.src = img;
    gambar.alt = judul;
    gambar.className = 'card-img';
    card.appendChild(gambar); // Masukkan ke dalam card

    // Buat div untuk judul
    const title = document.createElement('div');
    title.className = 'scroll-title';

    // Jika judul lebih dari 12 karakter, buat efek scroll
    if (judul.length > 12) {
        title.classList.add('scrollable'); // class CSS untuk animasi scroll
        const span = document.createElement('span');
        span.textContent = judul;
        title.appendChild(span);
    } else {
        title.textContent = judul;
    }

    card.appendChild(title); // Masukkan judul ke dalam card

    // Jika ada info tambahan (extra), tampilkan
    if (extra) {
        const extraDiv = document.createElement('div');
        extraDiv.className = 'extra';
        extraDiv.textContent = extra;
        card.appendChild(extraDiv);
    }

    // Kembalikan elemen kartu yang sudah lengkap
    return card;
}
