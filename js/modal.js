// Menunggu seluruh isi halaman dimuat
document.addEventListener('DOMContentLoaded', function () {
    let currentPage = 1; // Halaman saat ini
    const resultContainer = document.getElementById('trailers-anime-result'); // Kontainer hasil trailer
    const paginationContainer = document.getElementById('pagination'); // Kontainer tombol pagination

    // Fungsi utama untuk memuat daftar trailer anime
    function trailersAnime() {
        // Hapus isi sebelumnya dari kontainer
        while (resultContainer.firstChild) {
            resultContainer.removeChild(resultContainer.firstChild);
        }

        let url = `https://api.jikan.moe/v4/watch/promos?page=${currentPage}`; // API endpoint trailer

        // Tampilkan indikator loading
        const loading = document.createElement('div');
        loading.className = 'lds-ellipsis';
        for (let i = 0; i < 4; i++) {
            const dot = document.createElement('div');
            loading.appendChild(dot);
        }
        resultContainer.appendChild(loading);

        // Ambil data trailer dari API
        fetch(url)
            .then(res => res.json())
            .then(json => {
                const data = json.data || [];

                // Bersihkan loading
                while (resultContainer.firstChild) {
                    resultContainer.removeChild(resultContainer.firstChild);
                }

                // Jika data kosong
                if (data.length === 0) {
                    const notFound = document.createElement('p');
                    notFound.textContent = 'Tidak ditemukan.';
                    resultContainer.appendChild(notFound);
                    
                    while (paginationContainer.firstChild) {
                        paginationContainer.removeChild(paginationContainer.firstChild);
                    }
                    return;
                }

                // Buat container kartu trailer
                const cardContainer = document.createElement('div');
                cardContainer.className = 'card-container';

                // Loop tiap trailer
                data.forEach(trailer => {
                    const embedUrl = trailer.trailer?.embed_url;
                    if (!embedUrl) return; // skip jika tidak ada embed_url

                    const animeTitle = trailer.entry?.title || '';
                    const img = trailer.entry?.images?.jpg?.image_url || '';
                    const trailerTitle = trailer.title || '';

                    // Buat elemen kartu menggunakan createCard (fungsi buatanmu sendiri)
                    const card = createCard(animeTitle, img, trailerTitle, '', 'trailer');

                    // Saat diklik, tampilkan modal trailer
                    card.addEventListener('click', (e) => {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll ke atas
                        showTrailerModal(embedUrl); // Buka modal dengan trailer
                    });

                    cardContainer.appendChild(card);
                });

                resultContainer.appendChild(cardContainer);
                renderPagination(json.pagination); // Render tombol pagination
            });
    }

    // Fungsi untuk membuat tombol pagination
    function renderPagination(pagination) {
        // Hapus pagination lama
        while (paginationContainer.firstChild) {
            paginationContainer.removeChild(paginationContainer.firstChild);
        }

        if (!pagination) return;

        const totalPages = pagination.last_visible_page || 1;

        // Tombol Sebelumnya (Prev)
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

        // Tombol Selanjutnya (Next)
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

    trailersAnime(); // Jalankan pertama kali
});

// Fungsi untuk menampilkan trailer dalam modal
function showTrailerModal(url) {
    const modal = document.getElementById('trailer-modal'); // Modal elemen
    const iframe = document.getElementById('trailer-iframe'); // Tempat video
    const closeBtn = modal.querySelector('.close');

    iframe.src = url; // Set embed URL
    modal.style.display = 'flex'; // Tampilkan modal

    // Fungsi untuk menutup modal
    const closeModal = () => {
        modal.style.display = 'none';
        iframe.src = ''; // Kosongkan iframe agar video berhenti
        closeBtn.removeEventListener('click', closeModal);
        window.removeEventListener('click', outsideClick);
    };

    // Tutup jika klik di luar konten modal
    const outsideClick = (event) => {
        if (event.target === modal) {
            closeModal();
        }
    };

    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', outsideClick);
}
