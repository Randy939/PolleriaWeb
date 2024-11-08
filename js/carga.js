document.addEventListener('DOMContentLoaded', function() {
    const loaderContainer = document.querySelector('.loader-container');
    
    if (loaderContainer) {
        setTimeout(() => {
            loaderContainer.classList.add('fade-out');
            setTimeout(() => {
                loaderContainer.style.display = 'none';
            }, 500);
        }, 2000);
    }
}); 