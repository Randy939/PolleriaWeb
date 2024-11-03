document.addEventListener('DOMContentLoaded', function() {
    const searchIcon = document.querySelector('#search-icon');
    const searchForm = document.querySelector('#search-form');
    const closeBtn = document.querySelector('#close');

    if (searchIcon && searchForm) {
        searchIcon.onclick = () => {
            searchForm.classList.toggle('active');
        }
    }

    if (closeBtn && searchForm) {
        closeBtn.onclick = () => {
            searchForm.classList.remove('active');
        }
    }
}); 