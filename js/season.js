// Tunggu sampai semua elemen di halaman selesai dimuat
document.addEventListener('DOMContentLoaded', function () {
    let currentPage = 1; // Menyimpan nomor halaman aktif
    const resultContainer = document.getElementById('season-anime-result'); // Tempat menampilkan anime musim
    const paginationContainer = document.getElementById('pagination'); // Tempat tombol pagination

    // Fungsi utama untuk fetch dan tampilkan data anime musim panas 2025
    function seasonAnime() {
        // Bersihkan konten lama sebelum menampilkan data baru
        while (resultContainer.firstChild) {
            resultContainer.removeChild(resultContainer.firstChild);
        }

        // URL API untuk anime musim panas 2025, sesuai halaman aktif
        let url = `https://api.jikan.moe/v4/seasons/2025/summer?limit=12&page=${currentPage}`;

        // Tampilkan animasi loading saat data sedang dimuat
        const loading = document.createElement('div');
        loading.className = 'lds-ellipsis';
        for (let i = 0; i < 4; i++) {
            const dot = document.createElement('div');
            loading.appendChild(dot);
        }
        resultContainer.appendChild(loading);

        // Lakukan fetch ke API
        fetch(url)
            .then(res => res.json())
            .then(json => {
                const data = json.data || [];

                // Hapus loading sebelum menampilkan data
                while (resultContainer.firstChild) {
                    resultContainer.removeChild(resultContainer.firstChild);
                }

                // Jika data kosong, tampilkan pesan
                if (data.length === 0) {
                    const notFound = document.createElement('p');
                    notFound.textContent = 'Tidak ditemukan.';
                    resultContainer.appendChild(notFound);

                    // Kosongkan pagination
                    while (paginationContainer.firstChild) {
                        paginationContainer.removeChild(paginationContainer.firstChild);
                    }
                    return;
                }

                // Buat container kartu
                const cardContainer = document.createElement('div');
                cardContainer.className = 'card-container';

                // Buat card untuk setiap anime
                data.forEach(anime => {
                    const card = createCard(
                        anime.title,                              // Judul
                        anime.images.webp?.image_url || '',      // Gambar
                        '',                                       // Deskripsi (kosong)
                        anime.mal_id,                             // ID untuk detail
                        'anime'                                   // Tipe konten
                    );
                    cardContainer.appendChild(card);
                });

                // Tampilkan semua card ke halaman
                resultContainer.appendChild(cardContainer);

                // Tampilkan pagination
                renderPagination(json.pagination);
            });
    }

    // Fungsi untuk membuat tombol pagination
    function renderPagination(pagination) {
        // Hapus tombol-tombol sebelumnya
        while (paginationContainer.firstChild) {
            paginationContainer.removeChild(paginationContainer.firstChild);
        }

        if (!pagination) return;

        const totalPages = pagination.last_visible_page || 1;
        let start = 1;
        let end = totalPages;

        // Tentukan rentang pagination yang ditampilkan (maks 9 tombol)
        if (totalPages > 9) {
            if (currentPage <= 5) {
                start = 1;
                end = 9;
            } else if (currentPage + 4 >= totalPages) {
                start = totalPages - 8;
                end = totalPages;
            } else {
                start = currentPage - 4;
                end = currentPage + 4;
            }
        }

        // Buat tombol untuk setiap halaman dari start ke end
        for (let i = start; i <= end; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;

            // Tambahkan class 'active' untuk halaman saat ini
            btn.className = (i === currentPage) ? 'active' : '';

            // Ketika tombol diklik, update halaman dan tampilkan data baru
            btn.addEventListener('click', function () {
                currentPage = i;
                seasonAnime(); // Panggil ulang fungsi utama
            });

            paginationContainer.appendChild(btn);
        }
    }

    // Jalankan fungsi awal saat halaman dimuat
    seasonAnime();
});
