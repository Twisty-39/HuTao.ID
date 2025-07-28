// Pagination untuk anime summer 2025
const totalPages = Math.min(json.pagination?.last_visible_page || 1, 50);
pagination.innerHTML = '';
if (totalPages > 1) {
    let start = Math.max(1, currentPage - 4);
    let end = Math.min(totalPages, start + 8);
    if (end - start < 8) start = Math.max(1, end - 8);
    for (let i = start; i <= end; i++) {
        const btn = document.createElement('button');
        btn.className = 'pagination-btn';
        btn.textContent = i;
        if (i === currentPage) btn.classList.add('active');
        btn.onclick = () => {
            currentPage = i;
            fetchSummerAnime(currentPage);
        };
        pagination.appendChild(btn);
    }
}
