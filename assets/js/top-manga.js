document.addEventListener('DOMContentLoaded', function () {
    let currentPage = 1;
    const resultContainer = document.getElementById('top-manga-result');
    const paginationContainer = document.getElementById('pagination');

    function topManga() {
        while (resultContainer.firstChild) {
            resultContainer.removeChild(resultContainer.firstChild);
        }
        let url = `https://api.jikan.moe/v4/top/manga?limit=12&page=${currentPage}`;

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
                topManga();
            });
            paginationContainer.appendChild(btn);
        }
    }

    topManga();
});
