document.addEventListener('DOMContentLoaded', function () {
    let currentPage = 1;
    const resultContainer = document.getElementById('trailers-anime-result');
    const paginationContainer = document.getElementById('pagination');

    function trailersAnime() {
        while (resultContainer.firstChild) {
            resultContainer.removeChild(resultContainer.firstChild);
        }
        let url = `https://api.jikan.moe/v4/watch/promos?page=${currentPage}`;

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

                data.forEach(trailer => {
                    const embedUrl = trailer.trailer?.embed_url;
                    if (!embedUrl) return;

                    const animeTitle = trailer.entry?.title || '';
                    const img = trailer.entry?.images?.jpg?.image_url || '';
                    const trailerTitle = trailer.title || '';

                    const card = createCard(animeTitle, img, trailerTitle, '', 'trailer');
                    card.addEventListener('click', (e) => {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        showTrailerModal(embedUrl);
                    });
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

        // Tombol Prev
        const prevBtn = document.createElement('button');
        prevBtn.textContent = 'Prev';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', function () {
            if (currentPage > 1) {
                currentPage--;
                trailersAnime();
            }
        });
        paginationContainer.appendChild(prevBtn);

        // Tombol Next
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next';
        nextBtn.disabled = currentPage >= totalPages;
        nextBtn.addEventListener('click', function () {
            if (currentPage < totalPages) {
                currentPage++;
                trailersAnime();
            }
        });
        paginationContainer.appendChild(nextBtn);
    }

    trailersAnime();
});


function showTrailerModal(url) {
    const modal = document.getElementById('trailer-modal');
    const iframe = document.getElementById('trailer-iframe');
    const closeBtn = modal.querySelector('.close');

    iframe.src = url;
    modal.style.display = 'flex';

    const closeModal = () => {
        modal.style.display = 'none';
        iframe.src = ''; // berhentiin video
        closeBtn.removeEventListener('click', closeModal);
        window.removeEventListener('click', outsideClick);
    };

    const outsideClick = (event) => {
        if (event.target === modal) {
            closeModal();
        }
    };

    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', outsideClick);
}