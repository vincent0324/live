import $ from 'jquery';

class Tab {

    constructor() {
        this.init();
    }

    init() {
        this.bindEvent();
    }

    bindEvent() {
        // let tabButton = document.querySelectorAll('.live-tab-button a');
        // let tabContent = document.querySelectorAll('.live-tab-item');
        //
        // for (let i = 0; i < tabButton.length; i++) {
        //     tabButton[i].addEventListener('click', function() {
        //         for (let j = 0; j < tabButton.length; j++) {
        //             tabButton[j].className = '';
        //             tabContent[j].className = 'live-tab-item fn-hide';
        //         }
        //
        //         tabButton[i].className = 'current';
        //         tabContent[i].className = 'live-tab-item';
        //     }, false);
        // }
        //
        $(window).on('scroll', function() {
            var tabHeight = $('.live-tab-button').offset().top;
            var docTop = $(document).scrollTop();

            if (tabHeight < docTop) {
                $('.live-tab-holder').addClass('fixed');
            } else {
                $('.live-tab-holder').removeClass('fixed');
            }
        });

        $('.live-tab-holder a').on('click', function() {
            $('html,body').animate({
                scrollTop: 0
            }, 400);
        });

        $('#content').on('focus', function() {
            $(this).addClass('open');
        });

        $('#content').on('blur', function() {
            $(this).removeClass('open');
        });

        $('.live-like').on('click', function() {
            var self = $(this);

            self.find('i').addClass('niceIn');
            
            setTimeout(function() {
                self.find('i').removeClass('niceIn');
            }, 1000);
        });
    }
};

export default Tab;
