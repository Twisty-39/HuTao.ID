// Jalankan setelah seluruh dokumen HTML dimuat
document.addEventListener('DOMContentLoaded', function () {
    let currentPage = 1; // Halaman yang sedang aktif
    const resultContainer = document.getElementById('rec-manga-result'); // Elemen kontainer hasil
    const paginationContainer = document.getElementById('pagination'); // Kontainer untuk tombol pagination

    // Fungsi utama untuk ambil dan tampilkan data rekomendasi manga
    function recManga() {
        // Kosongkan hasil sebelumnya
        while (resultContainer.firstChild) {
            resultContainer.removeChild(resultContainer.firstChild);
        }

        // Endpoint API rekomendasi manga
        const url = `https://api.jikan.moe/v4/recommendations/manga?page=${currentPage}`;

        // tampilkan indikator loading
        const loading = document.createElement('div');
        loading.className = 'lds-ellipsis';
        for (let i = 0; i < 4; i++) {
            const dot = document.createElement('div');
            loading.appendChild(dot);
        }
        resultContainer.appendChild(loading);

        // Fetch data dari API
        fetch(url)
            .then(res => res.json())
            .then(json => {
                const data = json.data || [];

                // Hapus loading setelah data diterima
                while (resultContainer.firstChild) {
                    resultContainer.removeChild(resultContainer.firstChild);
                }

                // Jika data kosong, tampilkan pesan "Tidak ditemukan"
                if (data.length === 0) {
                    const notFound = document.createElement('p');
                    notFound.textContent = 'Tidak ditemukan.';
                    resultContainer.appendChild(notFound);
                    while (paginationContainer.firstChild) {
                        paginationContainer.removeChild(paginationContainer.firstChild);
                    }
                    return;
                }

                // Buat container kartu manga
                const cardContainer = document.createElement('div');
                cardContainer.className = 'card-container';

                let mangaCount = 0; // Hitung manga yang sudah ditampilkan
                let id = new Set(); // Untuk memastikan manga yang sama tidak muncul dua kali

                // Looping grup rekomendasi
                for (const group of data) {
                    for (const manga of group.entry) {
                        if (mangaCount >= 12) break; // Batas maksimal 12 manga per halaman
                        if (id.has(manga.mal_id)) continue; // Skip jika manga sudah ditampilkan

                        id.add(manga.mal_id); // Simpan ID manga yang ditampilkan
                        const card = createCard(
                            manga.title,
                            manga.images.webp?.image_url || '',
                            '',
                            manga.mal_id,
                            'manga'
                        );
                        cardContainer.appendChild(card);
                        mangaCount++;
                    }
                    if (mangaCount >= 12) break; // Keluar dari loop jika sudah 12 manga
                }

                resultContainer.appendChild(cardContainer); // Tampilkan semua kartu
                renderPagination(json.pagination); // Render pagination
            })
            .catch(err => {
                // catch untuk penanganan error
                const errorMsg = document.createElement('p');
                errorMsg.textContent = 'Gagal memuat data.';
                resultContainer.appendChild(errorMsg);
                console.error('Error:', err);
            });


    }

    // Fungsi untuk render tombol pagination
    function renderPagination(pagination) {
        while (paginationContainer.firstChild) {
            paginationContainer.removeChild(paginationContainer.firstChild);
        }
        if (!pagination) return;

        const totalPages = pagination.last_visible_page || 1;
        let start = 1;
        let end = totalPages;

        // Batasi jumlah tombol pagination menjadi maksimal 9
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

        // Loop tombol halaman
        for (let i = start; i <= end; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.className = (i === currentPage) ? 'active' : ''; // Tandai halaman aktif
            btn.addEventListener('click', function () {
                currentPage = i;
                recManga(); // Panggil ulang fungsi utama
            });
            paginationContainer.appendChild(btn);
        }
    }

    recManga(); // Jalankan saat pertama kali halaman dibuka
});
