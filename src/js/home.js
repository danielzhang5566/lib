require('../css/home.css')
require('../font/zhanku.ttf')
require('../img/book_loading.gif')
require('../img/bg.png')
require('../img/bg1_welcome.png')
require('../img/bg2_firsttime.png')
require('../img/bg3_firstbook.png')
require('../img/bg4_total.png')
require('../img/bg6_interest.png')
require('../img/bg7_lastbook.png')
require('../img/bg8_final.png')
require('../img/arrow.png')

var God = {
    init: function () {
        this.initPage();
        this.loadImg();
        this.getUserData();
        this.music();
    },

    initPage: function () {
        var me = this;

        //设置全屏
        me.setPageSize();

        //设置Swiper
        var mySwiper = new Swiper('.swiper-container', {
            speed: 400,
            direction: "vertical",
            pagination: ".swiper-pagination",
            onSlideChangeStart: function (swiper) {
                if (swiper.activeIndex == swiper.slides.length - 1) { //判断滑到了最后一页

                }

                //先把所有页面的文字隐藏
                me.convertArray(document.querySelectorAll('.font-abc')).forEach(function (element) {
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
                    me.convertArray(document.querySelectorAll('.xuexiao4 img')).forEach(function (el) {
                        el.style.display = 'block';
                    });
                }
                if (swiper.activeIndex != 5) { //滑走第六页
                    me.convertArray(document.querySelectorAll('.xuexiao4 img')).forEach(function (el) {
                        el.style.display = 'none';
                    });
                }
            }
        });
    },

    //设置全屏
    setPageSize: function () {
        var me = this,
            docWidth = document.documentElement.clientWidth,
            docHeight = document.documentElement.clientHeight,
            docScale = docHeight / docWidth,
            designWidth = 750, designHeight = 1334,
            els = document.querySelectorAll('.swiper-content'),
            scale = designHeight / designWidth;

        me.convertArray(els).forEach(function (el) {
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
    },

    //图片预加载
    loadImg: function () {
        var imgList = ['bg1_welcome.png', 'bg2_firsttime.png', 'bg3_firstbook.png', 'bg4_total.png', 'bg6_interest.png', 'bg7_lastbook.png', 'bg8_final.png'];

        var server =  window.location.origin,
            $loading = $('.loading-content'),
            $progress = $('.progress'),
            $pagination = $('.swiper-pagination-bullets'),
            successCount = 0,
            len = imgList.length;

        for (var i = 0; i < len; i++) {
            var oneImg = new Image();
            oneImg.src = server + '/img/' + imgList[i];
            oneImg.onload = function () {
                successCount++;
                $progress.innerHTML = Math.floor(successCount / len * 100) + '%';

                //所有图片成功加载
                if (successCount == len) {
                    //隐藏加载元素(显示欢迎页)
                    $loading.style.display = 'none';
                    //显示右边导航栏
                    $pagination.style.display = 'block';
                }
            }
            oneImg.onerror = function() {
                console.log('Failed to load the image');
                //隐藏加载元素(显示欢迎页)
                $loading.style.display = 'none';
                //显示右边导航栏
                $pagination.style.display = 'block';
            }
        }
    },

    getUserData: function () {

    },

    music: function () {

    },

    convertArray: function (arrayLike) {
        return Array.prototype.slice.call(arrayLike, 0);
    }
}

//document.body.addEventListener('touchmove',function(e){
//    e.preventDefault();
//});

document.addEventListener("DOMContentLoaded", function (event) {
    God.init();
});

/**
 * 简化选择器
 * @param  {String}  选择元素 ('body')/('#idName')/('.banner a')
 * @return {Object}  返回匹配的第一个元素对象
 */
function $(elem) {
    return document.querySelector(elem);
}