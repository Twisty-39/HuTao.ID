// Manga Search Page
// Fitur: search by keyword, filter genre, filter alphabet, pagination (limit 10)

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('anime-search-form');
    const keywordInput = document.getElementById('anime-keyword');
    const genreSelect = document.getElementById('genre-select');
    const alphabetFilter = document.getElementById('alphabet-filter');
    const resultSection = document.getElementById('manga-search-result');
    const pagination = document.getElementById('pagination');
    let currentPage = 1;
    let currentGenre = '';
    let currentAlpha = '';
    let currentKeyword = '';
    const LIMIT = 12;

    // Ambil genre manga dari Jikan
    fetch('https://api.jikan.moe/v4/genres/manga')
        .then(res => res.json())
        .then(json => {
            genreSelect.innerHTML = '<option value="">Semua Genre</option>';
            json.data.forEach(genre => {
                const opt = document.createElement('option');
                opt.value = genre.mal_id;
                opt.textContent = genre.name;
                genreSelect.appendChild(opt);
            });
        });

    // Buat filter alfabet
    const alfabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    alfabet.forEach(huruf => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'alphabet-btn';
        btn.textContent = huruf;
        btn.onclick = () => {
            currentAlpha = huruf;
            currentPage = 1;
            searchManga();
        };
        alphabetFilter.appendChild(btn);
    });

    // Event submit form
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        currentKeyword = keywordInput.value.trim();
        currentPage = 1;
        searchManga();
    });

    // Event genre
    genreSelect.addEventListener('change', function () {
        currentGenre = genreSelect.value;
        currentPage = 1;
        searchManga();
    });

    // Fungsi pencarian manga
    function searchManga() {
        resultSection.innerHTML = '';
        let url = `https://api.jikan.moe/v4/manga?limit=${LIMIT}&page=${currentPage}`;
        if (currentKeyword) url += `&q=${encodeURIComponent(currentKeyword)}`;
        if (currentGenre) url += `&genres=${currentGenre}`;
        if (currentAlpha) url += `&letter=${currentAlpha}`;

        fetch(url)
            .then(res => res.json())
            .then(json => {
                resultSection.innerHTML = '';
                if (!json.data || json.data.length === 0) {
                    resultSection.textContent = 'Tidak ditemukan.';
                    pagination.innerHTML = '';
                    return;
                }
                const container = document.createElement('div');
                container.className = 'card-container';
                container.style.justifyContent = 'center';
                json.data.forEach(manga => {
                    const card = createCard(
                        manga.title,
                        manga.images?.jpg?.image_url || '',
                        null,
                        manga.mal_id,
                        'manga'
                    );
                    container.appendChild(card);
                });
                resultSection.appendChild(container);

                // Pagination
                const totalPages = Math.min(json.pagination?.last_visible_page || 1, 50);
                pagination.innerHTML = '';
                if (totalPages > 1) {
                    let start = Math.max(1, currentPage - 4);
                    let end = Math.min(totalPages, start + 8);
                    if (end - start < 8) start = Math.max(1, end - 8);

                    for (let i = start; i <= end; i++) {
                        const btn = document.createElement('button');
                        btn.className = 'alphabet-btn';
                        btn.textContent = i;
                        if (i === currentPage) btn.classList.add('active');
                        btn.onclick = () => {
                            currentPage = i;
                            searchManga();
                        };
                        pagination.appendChild(btn);
                    }
                }
            });
    }
    searchManga();
});
