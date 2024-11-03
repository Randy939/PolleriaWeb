document.addEventListener('DOMContentLoaded', function() {
    let menu = document.querySelector('#menu-bars');
    let navbar = document.querySelector('.navbar');

    if (menu) {
        menu.onclick = () => {
            menu.classList.toggle('fa-times');
            navbar.classList.toggle('active');
        }
    }

    let section = document.querySelectorAll('section');
    let navLinks = document.querySelectorAll('header .navbar a');

    window.onscroll = () => {
        if (menu) {
            menu.classList.remove('fa-times');
            navbar.classList.remove('active');
        }

        section.forEach(sec => {
            let top = window.scrollY;
            let height = sec.offsetHeight;
            let offset = sec.offsetTop - 150;
            let id = sec.getAttribute('id');

            if (top >= offset && top < offset + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    document.querySelector('header .navbar a[href*="'+id+'"]')?.classList.add('active');
                });
            }
        });
    }

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

    var swiperInicio = new Swiper(".Inicio-slider", {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
            delay: 7500,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        slidesPerView: 1,
        loop: true,
    });

    var swiperOpiniones = new Swiper(".Opiniones-slider", {
        spaceBetween: 20,
        centeredSlides: true,
        autoplay: {
            delay: 7500,
            disableOnInteraction: false,
        },
        loop: true,
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            640: {
                slidesPerView: 2,
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
        }
    });

    function loader() {
        document.querySelector('.loader-container')?.classList.add('fade-out');
    }

    function fadeOut() {
        setInterval(loader, 3000);
    }

    window.onload = fadeOut;
});

