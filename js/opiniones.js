document.addEventListener('DOMContentLoaded', function() {
    var swiperOpiniones = new Swiper(".Opiniones-slider", {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        loop: true,
        effect: "coverflow",
        grabCursor: true,
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: false,
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            dynamicBullets: true,
        }
    });

    // Animación para las estrellas
    const ratings = document.querySelectorAll('.rating');
    ratings.forEach(rating => {
        rating.querySelectorAll('i').forEach((star, index) => {
            setTimeout(() => {
                star.style.opacity = '1';
                star.style.transform = 'scale(1)';
            }, index * 100);
        });
    });
}); 