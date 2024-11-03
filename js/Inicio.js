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
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    slidesPerView: 1,
    loop: true,
    speed: 1000,
    effect: "fade",
    fadeEffect: {
        crossFade: true
    },
    on: {
        slideChangeTransitionStart: function () {
            const activeSlide = this.slides[this.activeIndex];
            const content = activeSlide.querySelector('.content');
            const image = activeSlide.querySelector('.image');
            
            if (content) {
                content.style.opacity = '0';
                content.style.transform = 'translateX(-50px)';
                setTimeout(() => {
                    content.style.opacity = '1';
                    content.style.transform = 'translateX(0)';
                }, 100);
            }
            
            if (image) {
                image.style.opacity = '0';
                image.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    image.style.opacity = '1';
                    image.style.transform = 'scale(1)';
                }, 100);
            }
        }
    }
}); 