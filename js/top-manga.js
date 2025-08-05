// Tunggu sampai semua elemen di halaman selesai dimuat
document.addEventListener('DOMContentLoaded', function () {
    let currentPage = 1; // Menyimpan halaman saat ini
    const resultContainer = document.getElementById('top-manga-result'); // Tempat hasil manga ditampilkan
    const paginationContainer = document.getElementById('pagination'); // Tempat tombol-tombol pagination

    // Fungsi utama untuk mengambil dan menampilkan data manga dari API
    function topManga() {
        // Bersihkan konten sebelumnya
        while (resultContainer.firstChild) {
            resultContainer.removeChild(resultContainer.firstChild);
        }

        // URL API berdasarkan halaman saat ini
        let url = `https://api.jikan.moe/v4/top/manga?limit=12&page=${currentPage}`;

        // Tampilkan animasi loading saat data sedang dimuat
        const loading = document.createElement('div');
        loading.className = 'lds-ellipsis'; // class CSS untuk loading
        for (let i = 0; i < 4; i++) {
            const dot = document.createElement('div');
            loading.appendChild(dot);
        }
        resultContainer.appendChild(loading); // Masukkan loading ke container

        // Lakukan permintaan fetch ke API
        fetch(url)
            .then(res => res.json()) // Ubah hasil response jadi JSON
            .then(json => {
                const data = json.data || []; // Ambil data manga

                // Hapus loading sebelum menampilkan data baru
                while (resultContainer.firstChild) {
                    resultContainer.removeChild(resultContainer.firstChild);
                }

                // Jika data kosong, tampilkan pesan tidak ditemukan
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

                // Buat elemen container untuk semua card manga
                const cardContainer = document.createElement('div');
                cardContainer.className = 'card-container';

                // Buat card untuk setiap manga dan tambahkan ke container
                data.forEach(manga => {
                    const card = createCard(
                        manga.title, // Judul manga
                        manga.images.webp?.image_url || '', // URL gambar
                        '', // ekstra kosongkan
                        manga.mal_id, // ID manga (untuk detail/link)
                        'manga' // Jenis konten
                    );
                    cardContainer.appendChild(card);
                });

                // Tampilkan semua card ke dalam result container
                resultContainer.appendChild(cardContainer);

                // Tampilkan tombol-tombol pagination
                renderPagination(json.pagination);
            });
    }

    // Fungsi untuk membuat tombol pagination
    function renderPagination(pagination) {
        // Hapus tombol pagination sebelumnya
        while (paginationContainer.firstChild) {
            paginationContainer.removeChild(paginationContainer.firstChild);
        }

        if (!pagination) return;

        const totalPages = pagination.last_visible_page || 1;
        let start = 1;
        let end = totalPages;

        // Jika total halaman lebih dari 9, tampilkan range yang relevan
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

        // Buat tombol halaman dari start sampai end
        for (let i = start; i <= end; i++) {
            const btn = document.createElement('button');
            btn.textContent = i; // Nomor halaman
            btn.className = (i === currentPage) ? 'active' : ''; // Tandai halaman aktif

            // Jika tombol diklik, set halaman baru dan panggil kembali topManga()
            btn.addEventListener('click', function () {
                currentPage = i;
                topManga();
            });

            paginationContainer.appendChild(btn);
        }
    }

    // Jalankan fungsi untuk pertama kali saat halaman dimuat
    topManga();
});
