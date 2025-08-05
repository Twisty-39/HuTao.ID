// Tunggu sampai semua elemen di halaman selesai dimuat
document.addEventListener('DOMContentLoaded', function () {
    let currentPage = 1; // Halaman saat ini
    let currentGenre = ''; // ID genre yang dipilih
    let currentType = ''; // Tipe manga yang dipilih
    let currentKeyword = ''; // Kata kunci pencarian

    // Ambil referensi elemen DOM yang diperlukan
    const genreSelect = document.getElementById('genre-select');
    const typeSelect = document.getElementById('type-select');
    const resultContainer = document.getElementById('manga-search-result');
    const paginationContainer = document.getElementById('pagination');

    // =============================
    // FETCH DAFTAR GENRE MANGA
    // =============================
    fetch('https://api.jikan.moe/v4/genres/manga')
        .then(res => res.json())
        .then(json => {
            const genres = json.data || [];

            // Kosongkan option sebelumnya
            while (genreSelect.firstChild) {
                genreSelect.removeChild(genreSelect.firstChild);
            }

            // Tambahkan opsi default
            const defaultGenreOption = document.createElement('option');
            defaultGenreOption.value = '';
            defaultGenreOption.textContent = 'Semua Genre';
            genreSelect.appendChild(defaultGenreOption);

            // Tambahkan semua genre dari API
            genres.forEach(g => {
                const opt = document.createElement('option');
                opt.value = g.mal_id;
                opt.textContent = g.name;
                genreSelect.appendChild(opt);
            });
        });

    // =============================
    // ISI DAFTAR TIPE MANGA
    // =============================
    const typeList = ['manga', 'novel', 'lightnovel', 'oneshot', 'manhwa', 'manhua'];

    // Kosongkan opsi sebelumnya
    while (typeSelect.firstChild) {
        typeSelect.removeChild(typeSelect.firstChild);
    }

    // Tambahkan opsi default
    const defaultTypeOption = document.createElement('option');
    defaultTypeOption.value = '';
    defaultTypeOption.textContent = 'Semua Tipe';
    typeSelect.appendChild(defaultTypeOption);

    // Tambahkan semua tipe ke dropdown
    typeList.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        typeSelect.appendChild(opt);
    });

    // =============================
    // EVENT: Submit Form Pencarian
    // =============================
    document.getElementById('manga-search-form').addEventListener('submit', function (e) {
        e.preventDefault(); // Hindari reload halaman
        currentKeyword = document.getElementById('manga-keyword').value.trim(); // Ambil kata kunci
        currentPage = 1; // Reset ke halaman 1
        searchManga(); // Jalankan pencarian
    });

    // =============================
    // EVENT: Pilih Genre
    // =============================
    genreSelect.addEventListener('change', function () {
        currentGenre = genreSelect.value;
        currentPage = 1;
        searchManga();
    });

    // =============================
    // EVENT: Pilih Tipe
    // =============================
    typeSelect.addEventListener('change', function () {
        currentType = typeSelect.value;
        currentPage = 1;
        searchManga();
    });

    // =============================
    // Fungsi: Cari Manga
    // =============================
    function searchManga() {
        // Kosongkan hasil sebelumnya
        while (resultContainer.firstChild) {
            resultContainer.removeChild(resultContainer.firstChild);
        }

        // Susun URL berdasarkan filter
        let url = `https://api.jikan.moe/v4/manga?limit=12&page=${currentPage}`;
        if (currentKeyword) url += `&q=${encodeURIComponent(currentKeyword)}`;
        if (currentGenre) url += `&genres=${currentGenre}`;
        if (currentType) url += `&type=${currentType}`;

        // Tampilkan animasi loading saat data sedang dimuat
        const loading = document.createElement('div');
        loading.className = 'lds-ellipsis';
        for (let i = 0; i < 4; i++) {
            const dot = document.createElement('div');
            loading.appendChild(dot);
        }
        resultContainer.appendChild(loading);

        // Fetch data dari API Jikan
        fetch(url)
            .then(res => res.json())
            .then(json => {
                const data = json.data || [];

                // Hapus loading
                while (resultContainer.firstChild) {
                    resultContainer.removeChild(resultContainer.firstChild);
                }

                // Jika tidak ada hasil
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

                // Buat dan isi container kartu
                const cardContainer = document.createElement('div');
                cardContainer.className = 'card-container';

                data.forEach(manga => {
                    const card = createCard(
                        manga.title,
                        manga.images.webp?.image_url || '',
                        '', // ekstra kosong
                        manga.mal_id,
                        'manga'
                    );
                    cardContainer.appendChild(card);
                });

                // Tampilkan hasil pencarian
                resultContainer.appendChild(cardContainer);

                // Tampilkan tombol pagination
                renderPagination(json.pagination);
            });
    }

    // =============================
    // Fungsi: Render Pagination
    // =============================
    function renderPagination(pagination) {
        // Hapus tombol lama
        while (paginationContainer.firstChild) {
            paginationContainer.removeChild(paginationContainer.firstChild);
        }

        if (!pagination) return;

        const totalPages = pagination.last_visible_page || 1;
        let start = 1;
        let end = totalPages;

        // Batasi tampilan maksimal 9 halaman
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

        // Buat tombol halaman
        for (let i = start; i <= end; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.className = (i === currentPage) ? 'active' : '';
            btn.addEventListener('click', function () {
                currentPage = i;
                searchManga();
            });
            paginationContainer.appendChild(btn);
        }
    }

    // Jalankan pencarian pertama kali saat halaman dimuat
    searchManga();
});
