require('../css/home.css')
require('../font/zhanku.ttf')
require('../img/bg.png')
require('../img/bg1_welcome.png')
require('../img/bg2_firsttime.png')
require('../img/bg3_firstbook.png')
require('../img/bg4_total.png')
require('../img/bg6_interest.png')
require('../img/bg7_lastbook.png')
require('../img/bg8_final.png')


document.addEventListener("DOMContentLoaded", function (event) {

    /*loading*/
    //var load = 0;
    //var loading = setInterval(function () {
    //    if (load > 95) return;
    //    load++;
    //    convertArray(document.querySelectorAll('.loading-content p')).forEach(function (el) {
    //        el.innerHTML = load + '%';
    //    });
    //}, 100);
    //
    //window.addEventListener('load', function () {
    //    load = 100;
    //    convertArray(document.querySelectorAll('.loading-content p')).forEach(function (el) {
    //        el.innerHTML = load + '%';
    //    });
    //
    //    clearInterval(loading);
    //
    //    setTimeout(function () {
    //        convertArray(document.querySelectorAll('.loading-content')).forEach(function (el) {
    //            el.style.display = 'none';
    //        });
    //        convertArray(document.querySelectorAll('.bg-ground')).forEach(function (el) {
    //            el.setAttribute('class', el.getAttribute('class').replace(' swiper-no-swiping', ''));
    //        });
    //        convertArray(document.querySelectorAll('.swiper-pagination')).forEach(function (el) {
    //            el.style.display = 'block';
    //        });
    //    }, 500);
    //
    //});

    var docWidth = document.documentElement.clientWidth,
        docHeight = document.documentElement.clientHeight,
        docScale = docHeight / docWidth,
        designWidth = 750, designHeight = 1334, els = document.querySelectorAll('.swiper-content'),
        scale = designHeight / designWidth;

    convertArray(els).forEach(function (el) {
        el.style.width = designWidth + 'px';
        el.style.height = designHeight + 'px';
        el.style.position = 'absolute';
        el.style.top = '50%';
        el.style.left = '50%';
        var targetScaleX = docWidth / designWidth,
            targetScaleY = docHeight / designHeight;
        if (docScale >= scale) {

        } else {
            // targetScale = docHeight / designHeight;
        }
        el.style.transformOrigin = '0 0';
        el.style.transform = 'scale(' + targetScaleX + ',' + targetScaleY + ')translate(-50%, -50%)';
    });

    var mySwiper = new Swiper('.swiper-container', {
        speed: 400,
        direction: "vertical",
        pagination: ".swiper-pagination",
        onSlideChangeStart: function (swiper) {
            if (swiper.activeIndex == swiper.slides.length - 1) { //判断滑到了最后一页

            }

            //先把所有页面的文字隐藏
            convertArray(document.querySelectorAll('.font-abc')).forEach(function (element) {
                element.style.display = 'none';
            });

            if (swiper.slides[swiper.activeIndex].querySelector('.font-abc')) { //当前页面,文字显示
                swiper.slides[swiper.activeIndex].querySelector('.font-abc').style.display = 'block';
            }

            if (swiper.activeIndex == 0) { //滑到了第一页
            }
            if (swiper.activeIndex != 0) { //滑走第一页
            }

            if (swiper.activeIndex == 5) { //滑到了第六页
                convertArray(document.querySelectorAll('.xuexiao4 img')).forEach(function (el) {
                    el.style.display = 'block';
                });
            }
            if (swiper.activeIndex != 5) { //滑走第六页
                convertArray(document.querySelectorAll('.xuexiao4 img')).forEach(function (el) {
                    el.style.display = 'none';
                });
            }
        }
    });


    function convertArray(arrayLike) {
        return Array.prototype.slice.call(arrayLike, 0);
    }
});