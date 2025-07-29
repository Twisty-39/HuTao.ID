document.addEventListener('DOMContentLoaded', function () {
    let currentPage = 1;
    let currentGenre = '';
    let currentType = '';
    let currentKeyword = '';
    const genreSelect = document.getElementById('genre-select');
    const typeSelect = document.getElementById('type-select');
    const resultContainer = document.getElementById('manga-search-result');
    const paginationContainer = document.getElementById('pagination');

    // Fetch genre list
    fetch('https://api.jikan.moe/v4/genres/manga')
        .then(res => res.json())
        .then(json => {
            const genres = json.data || [];
            while (genreSelect.firstChild) {
                genreSelect.removeChild(genreSelect.firstChild);
            }
            const defaultGenreOption = document.createElement('option');
            defaultGenreOption.value = '';
            defaultGenreOption.textContent = 'Semua Genre';
            genreSelect.appendChild(defaultGenreOption);
            genres.forEach(g => {
                const opt = document.createElement('option');
                opt.value = g.mal_id;
                opt.textContent = g.name;
                genreSelect.appendChild(opt);
            });
        });

    // Manual type list
    const typeList = ['manga', 'novel', 'lightnovel', 'oneshot', 'manhwa', 'manhua'];
    while (typeSelect.firstChild) {
        typeSelect.removeChild(typeSelect.firstChild);
    }
    const defaultTypeOption = document.createElement('option');
    defaultTypeOption.value = '';
    defaultTypeOption.textContent = 'Semua Tipe';
    typeSelect.appendChild(defaultTypeOption);
    typeList.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        typeSelect.appendChild(opt);
    });

    // Search form
    document.getElementById('manga-search-form').addEventListener('submit', function (e) {
        e.preventDefault();
        currentKeyword = document.getElementById('manga-keyword').value.trim();
        currentPage = 1;
        searchManga();
    });

    genreSelect.addEventListener('change', function () {
        currentGenre = genreSelect.value;
        currentPage = 1;
        searchManga();
    });

    typeSelect.addEventListener('change', function () {
        currentType = typeSelect.value;
        currentPage = 1;
        searchManga();
    });

    function searchManga() {
        while (resultContainer.firstChild) {
            resultContainer.removeChild(resultContainer.firstChild);
        }
        let url = `https://api.jikan.moe/v4/manga?limit=12&page=${currentPage}`;
        if (currentKeyword) url += `&q=${encodeURIComponent(currentKeyword)}`;
        if (currentGenre) url += `&genres=${currentGenre}`;
        if (currentType) url += `&type=${currentType}`;

        const loading = document.createElement('div');
        loading.className = 'lds-ellipsis';
        for (let i = 0; i < 4; i++) {
            const dot = document.createElement('div');
            loading.appendChild(dot);
        }

        resultContainer.appendChild(loading);
        fetch(url)
            .then(res => res.json())
            .then(json => {
                const data = json.data || [];
                while (resultContainer.firstChild) {
                    resultContainer.removeChild(resultContainer.firstChild);
                }
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

                data.forEach(manga => {
                    const card = createCard(manga.title, manga.images.webp?.image_url || '', '', manga.mal_id, 'manga');
                    cardContainer.appendChild(card);
                });

                resultContainer.appendChild(cardContainer);
                renderPagination(json.pagination);
            });
    }

    function renderPagination(pagination) {
        while (paginationContainer.firstChild) {
            paginationContainer.removeChild(paginationContainer.firstChild);
        }
        if (!pagination) return;

        const totalPages = pagination.last_visible_page || 1;
        let start = 1;
        let end = totalPages;

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

    searchManga();
});
