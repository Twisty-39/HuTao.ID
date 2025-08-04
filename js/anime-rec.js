// Eksekusi saat halaman sudah dimuat
document.addEventListener('DOMContentLoaded', function () {
    let currentPage = 1; // Halaman saat ini
    const resultContainer = document.getElementById('rec-anime-result'); // Kontainer hasil rekomendasi
    const paginationContainer = document.getElementById('pagination');   // Kontainer pagination

    // Fungsi utama untuk mengambil dan menampilkan rekomendasi anime
    function recAnime() {
        // Kosongkan hasil sebelumnya
        while (resultContainer.firstChild) {
            resultContainer.removeChild(resultContainer.firstChild);
        }

        // URL API untuk rekomendasi anime
        const url = `https://api.jikan.moe/v4/recommendations/anime?page=${currentPage}`;

        // Animasi loading
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

                // Bersihkan loading sebelum menampilkan data
                while (resultContainer.firstChild) {
                    resultContainer.removeChild(resultContainer.firstChild);
                }

                // Jika tidak ada data, tampilkan pesan "Tidak ditemukan"
                if (data.length === 0) {
                    const notFound = document.createElement('p');
                    notFound.textContent = 'Tidak ditemukan.';
                    resultContainer.appendChild(notFound);
                    while (paginationContainer.firstChild) {
                        paginationContainer.removeChild(paginationContainer.firstChild);
                    }
                    return;
                }

                const cardContainer = document.createElement('div');
                cardContainer.className = 'card-container';

                let animeCount = 0;         // Hitung jumlah anime yang ditampilkan
                let id = new Set();         // Untuk menyaring agar tidak ada ID duplikat

                for (const group of data) {
                    for (const anime of group.entry) {
                        if (animeCount >= 12) break;       // Maksimum 12 ditampilkan
                        if (id.has(anime.mal_id)) continue; // Skip jika sudah ditampilkan

                        id.add(anime.mal_id); // Tambahkan ke set
                        const card = createCard(anime.title, anime.images.webp?.image_url || '', '', anime.mal_id, 'anime');
                        cardContainer.appendChild(card);
                        animeCount++;
                    }
                    if (animeCount >= 12) break;
                }

                resultContainer.appendChild(cardContainer);
                renderPagination(json.pagination); // Render tombol halaman
            })
            .catch(err => {
                // catch untuk penanganan error
                const errorMsg = document.createElement('p');
                errorMsg.textContent = 'Gagal memuat data.';
                resultContainer.appendChild(errorMsg);
                console.error('Error:', err);
            });
    }

    // Fungsi untuk membuat pagination tombol halaman
    function renderPagination(pagination) {
        while (paginationContainer.firstChild) {
            paginationContainer.removeChild(paginationContainer.firstChild);
        }
        if (!pagination) return;

        const totalPages = pagination.last_visible_page || 1;
        let start = 1;
        let end = totalPages;

        // Menampilkan maksimal 9 halaman
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

        // Render tombol untuk setiap halaman
        for (let i = start; i <= end; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.className = (i === currentPage) ? 'active' : '';
            btn.addEventListener('click', function () {
                currentPage = i;
                recAnime(); // Panggil ulang saat klik tombol
            });
            paginationContainer.appendChild(btn);
        }
    }

    recAnime(); // Panggilan awal saat halaman dimuat
});
