// Jalankan kode setelah seluruh konten halaman selesai dimuat
document.addEventListener('DOMContentLoaded', function () {
    let currentPage = 1;           // Menyimpan halaman saat ini
    let currentGenre = '';         // Genre yang dipilih
    let currentType = '';          // Tipe anime yang dipilih
    let currentKeyword = '';       // Kata kunci pencarian

    // Ambil referensi ke elemen DOM yang digunakan
    const genreSelect = document.getElementById('genre-select');
    const typeSelect = document.getElementById('type-select');
    const resultContainer = document.getElementById('anime-search-result');
    const paginationContainer = document.getElementById('pagination');

    // =============================
    // FETCH LIST GENRE ANIME
    // =============================
    fetch('https://api.jikan.moe/v4/genres/anime')
        .then(res => res.json())
        .then(json => {
            const genres = json.data || [];

            // Bersihkan isi sebelumnya 
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

    // ========================
    // ISI DROPDOWN TIPE ANIME 
    // ========================
    const typeList = ['tv', 'movie', 'ova', 'ona', 'special', 'music', 'cm', 'pv', 'tv_special'];

    // Bersihkan isi awal <select>
    while (typeSelect.firstChild) {
        typeSelect.removeChild(typeSelect.firstChild);
    }

    // Tambahkan opsi default
    const defaultTypeOption = document.createElement('option');
    defaultTypeOption.value = '';
    defaultTypeOption.textContent = 'Semua Tipe';
    typeSelect.appendChild(defaultTypeOption);

    // Tambahkan semua tipe anime
    typeList.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t.toUpperCase(); // Ditampilkan dalam huruf kapital
        typeSelect.appendChild(opt);
    });

    // =============================
    // EVENT: Submit pencarian
    // =============================
    document.getElementById('anime-search-form').addEventListener('submit', function (e) {
        e.preventDefault(); // Hindari reload halaman
        currentKeyword = document.getElementById('anime-keyword').value.trim(); // Ambil keyword
        currentPage = 1;
        searchAnime(); // Jalankan pencarian
    });

    // =============================
    // EVENT: Saat memilih genre
    // =============================
    genreSelect.addEventListener('change', function () {
        currentGenre = genreSelect.value;
        currentPage = 1;
        searchAnime();
    });

    // =============================
    // EVENT: Saat memilih tipe
    // =============================
    typeSelect.addEventListener('change', function () {
        currentType = typeSelect.value;
        currentPage = 1;
        searchAnime();
    });

    // =============================
    // FUNGSI: Ambil dan tampilkan anime berdasarkan filter
    // =============================
    function searchAnime() {
        // Kosongkan hasil sebelumnya
        while (resultContainer.firstChild) {
            resultContainer.removeChild(resultContainer.firstChild);
        }

        // Susun URL berdasarkan filter
        let url = `https://api.jikan.moe/v4/anime?limit=12&page=${currentPage}`;
        if (currentKeyword) url += `&q=${encodeURIComponent(currentKeyword)}`;
        if (currentGenre) url += `&genres=${currentGenre}`;
        if (currentType) url += `&type=${currentType}`;

        // Tampilkan animasi loading
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

                // Hapus loading
                while (resultContainer.firstChild) {
                    resultContainer.removeChild(resultContainer.firstChild);
                }

                // Tampilkan pesan jika data kosong
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

                // Buat container kartu anime
                const cardContainer = document.createElement('div');
                cardContainer.className = 'card-container';

                // Buat card dari data
                data.forEach(anime => {
                    const card = createCard(
                        anime.title,
                        anime.images.webp?.image_url || '',
                        '',
                        anime.mal_id,
                        'anime'
                    );
                    cardContainer.appendChild(card);
                });

                // Tambahkan hasil ke halaman
                resultContainer.appendChild(cardContainer);

                // Tampilkan pagination
                renderPagination(json.pagination);
            });
    }

    // =============================
    // FUNGSI: Tampilkan tombol pagination
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

        // Maksimal tampilkan 9 tombol
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

        // Buat tombol-tombol halaman
        for (let i = start; i <= end; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.className = (i === currentPage) ? 'active' : '';
            btn.addEventListener('click', function () {
                currentPage = i;
                searchAnime(); // Ambil data baru sesuai halaman
            });
            paginationContainer.appendChild(btn);
        }
    }

    // Jalankan pencarian saat pertama kali halaman dibuka
    searchAnime();
});
