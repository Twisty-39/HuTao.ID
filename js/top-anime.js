// Tunggu sampai semua elemen di halaman selesai dimuat
document.addEventListener('DOMContentLoaded', function () {
    let currentPage = 1; // Menyimpan halaman saat ini
    const resultContainer = document.getElementById('top-anime-result'); // Tempat hasil anime akan ditampilkan
    const paginationContainer = document.getElementById('pagination'); // Tempat tombol pagination

    // Fungsi utama untuk mengambil dan menampilkan data anime
    function topAnime() {
        // Bersihkan isi sebelumnya
        while (resultContainer.firstChild) {
            resultContainer.removeChild(resultContainer.firstChild);
        }

        // URL untuk ambil top anime dari Jikan API
        let url = `https://api.jikan.moe/v4/top/anime?limit=12&page=${currentPage}`;

        // Tampilkan animasi loading saat data sedang dimuat
        const loading = document.createElement('div');
        loading.className = 'lds-ellipsis';
        for (let i = 0; i < 4; i++) {
            const dot = document.createElement('div');
            loading.appendChild(dot);
        }

        // Tampilkan loading ke layar
        resultContainer.appendChild(loading);

        // Ambil data dari API
        fetch(url)
            .then(res => res.json())
            .then(json => {
                const data = json.data || [];

                // Bersihkan loading
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

                // Buat container untuk kartu-kartu anime
                const cardContainer = document.createElement('div');
                cardContainer.className = 'card-container';

                // Loop setiap anime, buat card-nya, dan masukkan ke container
                data.forEach(anime => {
                    const card = createCard(
                        anime.title,                              // Judul anime
                        anime.images.webp?.image_url || '',      // Gambar anime
                        '',                                       // ekstra kosongk
                        anime.mal_id,                             // ID anime
                        'anime'                                   // Tipe konten
                    );
                    cardContainer.appendChild(card);
                });

                // Tampilkan card ke halaman
                resultContainer.appendChild(cardContainer);

                // Tampilkan tombol pagination
                renderPagination(json.pagination);
            });
    }

    // Fungsi untuk menampilkan tombol pagination
    function renderPagination(pagination) {
        // Kosongkan tombol-tombol sebelumnya
        while (paginationContainer.firstChild) {
            paginationContainer.removeChild(paginationContainer.firstChild);
        }

        if (!pagination) return;

        const totalPages = pagination.last_visible_page || 1;
        let start = 1;
        let end = totalPages;

        // Tampilkan maksimal 9 tombol pagination di layar
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

        // Buat tombol dari start sampai end
        for (let i = start; i <= end; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;

            // Tambahkan class 'active' untuk tombol halaman saat ini
            btn.className = (i === currentPage) ? 'active' : '';

            // Event ketika tombol diklik
            btn.addEventListener('click', function () {
                currentPage = i; // Update halaman
                topAnime();      // Ambil data baru
            });

            paginationContainer.appendChild(btn);
        }
    }

    // Jalankan fungsi awal saat halaman dibuka
    topAnime();
});
