document.addEventListener('DOMContentLoaded', function () {
    let currentPage = 1;
    const resultContainer = document.getElementById('rec-anime-result');
    const paginationContainer = document.getElementById('pagination');

    function recAnime() {
        while (resultContainer.firstChild) {
            resultContainer.removeChild(resultContainer.firstChild);
        }
        const url = `https://api.jikan.moe/v4/recommendations/anime?page=${currentPage}`;

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

                let animeCount = 0;
                let id = new Set();

                for (const group of data) {
                    for (const anime of group.entry) {
                        if (animeCount >= 12) break;
                        if (id.has(anime.mal_id)) continue;

                        id.add(anime.mal_id);
                        const card = createCard(anime.title, anime.images.webp?.image_url || '', '', anime.mal_id, 'anime');
                        cardContainer.appendChild(card);
                        animeCount++;
                    }
                    if (animeCount >= 12) break;
                }

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
                recAnime();
            });
            paginationContainer.appendChild(btn);
        }
    }

    recAnime();
});
