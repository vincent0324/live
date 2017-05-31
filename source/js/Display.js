import Swiper from 'swiper';
import $ from 'jquery';

class Display {

    constructor() {
        this.init();
    }

    init() {
        this.bindEvent();
    }

    bindEvent() {
        let context = this;
        var displaySwiper;

        $(document).on('click', '.photo-single', function() {
            var url = $(this).find('img').data('url');

            $('.display-single .wrap').html('<img src="' + url + '">');
            $('.display-single').fadeIn();
        });

        $(document).on('click', '.display-single', function() {
            $('.display-single').fadeOut();
            $('.display-single .wrap').html('');
        });

        $(document).on('click', '.photo-img', function() {
            let images = $(this).parents('.stream-item-photo').find('.photo-img');
            let imagesLength = images.length;
            let index = images.index(this);
            let swiperHtml = '';

            for (let i = 0; i < imagesLength; i++) {
                let url = images.eq(i).data('url') || '';

                swiperHtml += '<div class="display-slide"><div class="display-inner"><img src="' + url + '"></div></div>';
            }

            $('.display-wrapper').html(swiperHtml);
            $('.display').fadeIn();
            $('.display-pages-sum').html(imagesLength);
            $('.display-pages-current').html(index + 1);

            displaySwiper = new Swiper('.display-container', {
                loop: false,
                grabCursor: true,
                autoplayDisableOnInteraction: false,
                wrapperClass: 'display-wrapper',
                slideClass: 'display-slide',
                observer: true,
                initialSlide: index,
                observeParents: true,
                onTouchEnd: function(swiper) {
                    $('.display-pages-current').html(displaySwiper.activeIndex + 1);
                }
            });

            displaySwiper.reInit();

        });

        $(document).on('click', '.display', function() {
            $('.display').hide();
            $('.display-wrapper').html('');
            $('.display-pages-sum').html('');
            $('.display-pages-current').html('');
            displaySwiper.destroy(true);
        });
    }
};

export default Display;
