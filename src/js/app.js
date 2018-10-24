import $ from 'jquery';
import 'slick-carousel'
import 'magnific-popup'
import './slick'

$.extend(true, $.magnificPopup.defaults, {
    tClose: 'Закрыть (Esc)', // Alt text on close button
    tLoading: 'Загрузка...', // Text that is displayed during loading. Can contain %curr% and %total% keys
    gallery: {
        tPrev: 'Назад (&larr;)', // Alt text on left arrow
        tNext: 'Далее (&rarr;)', // Alt text on right arrow
        tCounter: '%curr% из %total%', // Markup for "1 of 7" counter
    },
    image: {
        tError: '<a href="%url%">Изображение</a> не может быть загружено.', // Error message when image could not be loaded
    },
    ajax: {
        tError: '<a href="%url%">Содержимое</a> не может быть загружено.', // Error message when ajax request failed
    },
});

$(() => {
    $('.b-slider-gifts').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
        infinite: true,
        prevArrow: '<a href="#" class="b-slider-gifts__prev"></a>',
        nextArrow: '<a href="#" class="b-slider-gifts__next"></a>',
        responsive: [
            {
                breakpoint: 1080,
                settings: {
                    arrows: true,
                    dots: false,
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: true,
                    dots: false,
                    slidesToShow: 1
                }
            }
        ]
    });
});

$(document)
    // Открывашка для табов
    .on('click', '.b-tab__button', e => {
        $('.b-tab__menu').addClass('b-tab__menu_open');
        $('.b-tab__button').addClass('b-tab__button_open');
    })
    .on('click', '.b-tab__button_open', e => {
        $('.b-tab__menu').removeClass('b-tab__menu_open');
        $('.b-tab__button').removeClass('b-tab__button_open');
    })
    .on('click', '.b-tab__tab', e => {
        $('.b-tab__menu').removeClass('b-tab__menu_open');
        $('.b-tab__button').removeClass('b-tab__button_open');
    })
    // Открывашка для табов events
    .on('click', '.b-tab-events__button', e => {
        $('.b-tab-events__menu').addClass('b-tab-events__menu_open');
        $('.b-tab-events__button').addClass('b-tab-events__button_open');
    })
    .on('click', '.b-tab-events__button_open', e => {
        $('.b-tab-events__menu').removeClass('b-tab-events__menu_open');
        $('.b-tab-events__button').removeClass('b-tab-events__button_open');
    })
    .on('click', '.b-tab-events__tab', e => {
        $('.b-tab-events__menu').removeClass('b-tab-events__menu_open');
        $('.b-tab-events__button').removeClass('b-tab-events__button_open');
    })
    .on('click', '.b-header-mobile__button', e => {
        e.preventDefault();
        let $bg = $('.b-header-mobile__bg'),
            $menu = $('.b-header-mobile__menu');

        $bg.addClass('b-header-mobile__bg_open');
        $menu.addClass('b-header-mobile__menu_open');
    })
    .on('click', '.b-header-mobile__bg', e => {
        e.preventDefault();
        let $bg = $('.b-header-mobile__bg'),
            $menu = $('.b-header-mobile__menu');

        $bg.removeClass('b-header-mobile__bg_open');
        $menu.removeClass('b-header-mobile__menu_open');
    })
    .on('click', '.b-tab__tab:not(.b-tab__tab_link)', e => {
        let $target = $(e.target),
            $container = $target.closest('.b-tab'),
            $tabs = $container.find('.b-tab__tab'),
            $content = $container.find('.b-tab__content'),
            $currentTab = $target.closest('.b-tab__tab'),
            id = $currentTab.attr('data-tab');

        if ($currentTab.hasClass('b-tab__tab_disabled')) {
            return;
        }

        $tabs.removeClass('b-tab__tab_active');
        $content.removeClass('b-tab__content_active');
        $container
            .find('.b-tab__content[data-tab="' + id + '"]')
            .addClass('b-tab__content_active');

        $('.b-slider').slick("setPosition");
        $currentTab.addClass('b-tab__tab_active');
    })
    .on('click', '.b-tab-events__tab:not(.b-tab-events__tab_link)', e => {
        let $target = $(e.target),
            $container = $target.closest('.b-tab-events'),
            $tabs = $container.find('.b-tab-events__tab'),
            $content = $container.find('.b-tab-events__content'),
            $currentTab = $target.closest('.b-tab-events__tab'),
            id = $currentTab.attr('data-tab');

        if ($currentTab.hasClass('b-tab-events__tab_disabled')) {
            return;
        }

        $tabs.removeClass('b-tab-events__tab_active');
        $content.removeClass('b-tab-events__content_active');
        $container
            .find('.b-tab-events__content[data-tab="' + id + '"]')
            .addClass('b-tab-events__content_active');

        $currentTab.addClass('b-tab-events__tab_active');
    })
    .on('click', '[data-modal]', e => {
        e.preventDefault()

        let $link = $(e.target).closest('a'),
            href = $link.attr('href'),
            type = href.charAt(0) == '#' ? 'inline' : 'ajax'

        $.magnificPopup.open(
            {
                items: {
                    src: href,
                },
                delegate: 'a',
                type: type,
                removalDelay: 0,
                midClick: true,
                mainClass: 'mfp-zoom-in',
                callbacks: {
                    open: function() {
                        // lockBody();
                    },
                    close: function() {
                        // unlockBody();
                    },
                },
            },
            0
        )
    })
    .on('submit', '[data-form]', e => {
        e.preventDefault()

        const form = $(e.target)
            .closest('[data-form]')
            .get(0)

        const data = {
            ...serialize(form, { hash: true }),
            form_title: form.getAttribute('data-form'),
        }

        $.ajax({
            data: data,
            method: 'POST',
            url: '/save.php',
        })

        orion
            .createRequest({
                data,
                source: window.location.hostname,
                name:
                    'Заявка с сайта гудгид',
                request_template_id: 3,
            })
            .then(resp => {
                return orion
                    .createLead({
                        phone: data.phone,
                        name:
                            'Заявка с сайта гудгид',
                        email: data.email,
                        price: 1000,
                        request_id: resp.data.id,
                        manager_id: 3,
                        pipeline_step_id: 28,
                    })
                    .then(() => {
                        form.reset()

                        $.magnificPopup.open(
                            {
                                items: {
                                    src: '#success',
                                },
                                delegate: 'a',
                                type: 'inline',
                                removalDelay: 0,
                                midClick: true,
                                mainClass: 'mfp-zoom-in',
                            },
                            0
                        )
                    })
                    .catch(console.log)
            })
            .catch(console.log)
    });

let $slider = $('.b-slider')
    .on('init', function(slick) {
        $('.b-slider').fadeIn(3000);
    })
    .slick({
        slidesToShow: 3,
        slidesToScroll: 3,
        centerMode: true,
        centerPadding: 0,
        arrows: true,
        dots: false,
        infinite: true,
        prevArrow: '<a href="#" class="b-slider__prev"></a>',
        nextArrow: '<a href="#" class="b-slider__next"></a>',
        responsive: [
            {
                breakpoint: 1080,
                settings: {
                    arrows: false,
                    centerMode: false,
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: false,
                    slidesToShow: 1
                }
            }
        ]
    });

$slider.find(".slick-slide").on("click", function(){
    $slider.slick("slickNext");
});

