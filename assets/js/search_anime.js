document.addEventListener('DOMContentLoaded', function() {
    let currentPage = 1;
    let currentGenre = '';
    let currentAlpha = '';
    let currentKeyword = '';
    const resultContainer = document.getElementById('anime-search-result');
    const paginationContainer = document.getElementById('pagination');
    const genreSelect = document.getElementById('genre-select');
    const alphabetFilter = document.getElementById('alphabet-filter');

    // Fetch genre list
    fetch('https://api.jikan.moe/v4/genres/anime')
        .then(res => res.json())
        .then(json => {
            const genres = json.data || [];
            genreSelect.innerHTML = '<option value="">Semua Genre</option>';
            genres.forEach(g => {
                const opt = document.createElement('option');
                opt.value = g.mal_id;
                opt.textContent = g.name;
                genreSelect.appendChild(opt);
            });
        });

    // Alphabet filter
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    alphabet.forEach(char => {
        const btn = document.createElement('button');
        btn.textContent = char;
        btn.addEventListener('click', function() {
            currentAlpha = char;
            currentPage = 1;
            updateAlphabetUI();
            searchAnime();
        });
        alphabetFilter.appendChild(btn);
    });
    function updateAlphabetUI() {
        Array.from(alphabetFilter.children).forEach(btn => {
            btn.classList.toggle('active', btn.textContent === currentAlpha);
        });
    }

    // Search form
    document.getElementById('anime-search-form').addEventListener('submit', function(e) {
        e.preventDefault();
        currentKeyword = document.getElementById('anime-keyword').value.trim();
        currentPage = 1;
        searchAnime();
    });
    genreSelect.addEventListener('change', function() {
        currentGenre = genreSelect.value;
        currentPage = 1;
        searchAnime();
    });

    function searchAnime() {
        resultContainer.innerHTML = '';
        let url = `https://api.jikan.moe/v4/anime?limit=12&page=${currentPage}`;
        if (currentKeyword) url += `&q=${encodeURIComponent(currentKeyword)}`;
        if (currentGenre) url += `&genres=${currentGenre}`;
        if (currentAlpha) url += `&letter=${currentAlpha}`;
        // Loading indicator
        const loading = document.createElement('div');
        loading.textContent = 'Loading...';
        resultContainer.appendChild(loading);
        fetch(url)
            .then(res => res.json())
            .then(json => {
                const data = json.data || [];
                resultContainer.innerHTML = '';
                if (data.length === 0) {
                    resultContainer.textContent = 'Tidak ditemukan.';
                    paginationContainer.innerHTML = '';
                    return;
                }
                // Use card style from style.css (card-container)
                const cardContainer = document.createElement('div');
                cardContainer.className = 'card-container';
                data.forEach(anime => {
                    const card = document.createElement('a');
                    card.className = 'card anime-item';
                    card.href = `detail.html?id=${anime.mal_id}&type=anime`;
                    card.style.textDecoration = 'none';
                    card.style.color = 'inherit';
                    // Card image
                    const img = document.createElement('img');
                    img.src = anime.images?.jpg?.image_url || '';
                    img.alt = anime.title;
                    img.className = 'card-img anime-img';
                    card.appendChild(img);
                    // Card title
                    const title = document.createElement('div');
                    title.className = 'scroll-title card-title';
                    if (anime.title.length > 12) {
                        title.classList.add('scrollable');
                        const span = document.createElement('span');
                        span.textContent = anime.title;
                        title.appendChild(span);
                    } else {
                        title.textContent = anime.title;
                    }
                    card.appendChild(title);
                    cardContainer.appendChild(card);
                });
                resultContainer.appendChild(cardContainer);
                // Pagination
                renderPagination(json.pagination);
            });
    }

    function renderPagination(pagination) {
        paginationContainer.innerHTML = '';
        if (!pagination) return;
        const totalPages = pagination.last_visible_page || 1;
        let start = 1;
        let end = totalPages;
        // Show max 9 buttons, center current page
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
            btn.addEventListener('click', function() {
                currentPage = i;
                searchAnime();
            });
            paginationContainer.appendChild(btn);
        }
    }
    searchAnime();
});
