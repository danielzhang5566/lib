require('../css/home.css')
require('../font/zhanku.ttf')

//require('../img/book_loading.gif')
//require('../img/bg.png')
//require('../img/bg1_welcome.png')
//require('../img/bg2_firsttime.png')
//require('../img/bg3_firstbook.png')
//require('../img/bg4_total.png')
//require('../img/bg6_interest.png')
//require('../img/bg7_lastbook.png')
//require('../img/bg8_final.png')
//require('../img/arrow.png')

var God = {
    init: function () {
        this.initPage();
        this.loadImg();
        this.userData();
        this.music();
    },

    initPage: function () {
        var me = this;

        //设置全屏
        me.setPageSize();

        //设置Swiper
        var globalSwiper = new Swiper('.swiper-container', {
            speed: 400,
            direction: "vertical",
            //pagination: ".swiper-pagination",
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

                if (swiper.activeIndex == 4) { //滑到了第五页
                    me.convertArray($('.borrowlist-container').querySelectorAll('.font-abc')).forEach(function (el) {
                        el.style.display = 'block';
                    });
                }
                if (swiper.activeIndex != 4) { //滑走第五页
                    me.convertArray($('.borrowlist-container').querySelectorAll('.font-abc')).forEach(function (el) {
                        el.style.display = 'none';
                    });
                }
            }
        });

        console.log('初始化页面成功')
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
        var me = this,
            imgList = ['bg1_welcome.png', 'bg2_firsttime.png', 'bg3_firstbook.png', 'bg4_total.png', 'bg6_interest.png', 'bg7_lastbook.png', 'bg8_final.png'];

        var imgLocation = 'http://source.igdut.cn/',
        //imgLocation = window.location.origin + '/img/',
            $progress = $('.progress'),
        //$pagination = $('.swiper-pagination-bullets'),
            successCount = 0,
            len = imgList.length;

        for (var i = 0; i < len; i++) {
            var oneImg = new Image();
            oneImg.src = imgLocation + imgList[i];
            oneImg.onload = function () {
                successCount++;
                $progress.innerHTML = Math.floor(successCount / len * 100) + '%';

                //所有图片成功加载
                if (successCount == len) {
                    console.log('所有图片预加载成功');
                    me.showPage();
                }
            }
            oneImg.onerror = function () {
                console.log('图片并未成功加载');
                me.showPage()
            }
        }
    },

    userData: function () {
        var me = this;

        me.ajax('POST', 'cmd=getinfo', './easy.php', function (data) {
            switch (data.code) {
                case 0:
                    me.showAlert('未能获取到信息，请返回重新登录。');
                    console.log('获取失败(未登录等原因)' + data.code + data.msg);
                    window.location.pathname = './index.html'
                    break;
                case 1:
                    console.log('获取信息成功');
                    userType(data.msg);
                    break;
                default:
                    me.showAlert('B1:出错啦~请稍后登录呗~');
                    console.log('遇到未知错误--' + data.code + data.msg);
                    break;
            }
        });

        //判断用户类型(可能会分性别,分学生和教工,分是否读者之星等)
        var userType = function (msg) {

            //if(info.sex == 1) {
            //    //切换设计稿\音乐等
            //}
            //if(info.type == 'teacher') {
            //    //切换展示内容\音乐等
            //}

            //填数据
            fillData(msg);
        }

        var fillData = function (msg) {
            //1.先处理一下后台传过来的数据

            var setTime1 = function (time) {
                var timeArr = time.split('-');
                return "<span>" + timeArr[0] + "</span>年<span>" + timeArr[1] + "</span>月<span>" + timeArr[2] + "</span>日"
            }

            var setTime2 = function (time) {
                var timeArr = time.split('-');
                return "在<span>" + timeArr[0] + "</span>年的<span>" + timeArr[1] + "</span>月<span>" + timeArr[2] + "</span>日"
            }

            var setTitle = function (bookcount) {
                if (bookcount >= 80) {
                    return '“工大学霸”'
                } else if (bookcount >= 30) {
                    return '“热情读者”'
                } else {
                    return '"最具潜力读者"'
                }

            }

            var setReadingList = function (books,charCounts) {
                var html = '',
                    pages = Math.ceil(books.length / 10);

                //for一次添加一页,i表示当前页
                for (var i = 1; i <= pages; i++) {
                    //每个分页开始计数的书的编号
                    var start = (i - 1) * 10 + 1;

                    if(charCounts[i - 1] < 80) {            //0-79     书名几乎都是一行,用大字号 font-big
                        html += ("<div class='swiper-slide h-slide h-slide" + i + "'><ul class='font-abc font-borrowlist-books font-big'>");
                    }else if(charCounts[i - 1] < 120) {     //80-119   书名部分两行,用默认中字号
                        html += ("<div class='swiper-slide h-slide h-slide" + i + "'><ul class='font-abc font-borrowlist-books'>");
                    }else if(charCounts[i - 1] < 190) {     //120-189  书名平均两行,用小字号 font-small
                        html += ("<div class='swiper-slide h-slide h-slide" + i + "'><ul class='font-abc font-borrowlist-books font-small'>");
                    }else {                                 //190-     书名平均三行以上,用特小字号 font-very-small
                        html += ("<div class='swiper-slide h-slide h-slide" + i + "'><ul class='font-abc font-borrowlist-books font-very-small'>");
                    }

                    //1.非尾页时
                    if (i != pages) {
                        //for一次添加一条
                        for (var j = 0; j < 10; j++) {
                            html += "<li>" + (start + j) + ".《" + books.shift() + "》</li>";
                        }
                    }
                    //2.尾页时
                    if (i == pages) {
                        var j = 0;
                        while (books.length > 0) {
                            html += "<li>" + (start + j) + ".《" + books.shift() + "》</li>";
                            j++;
                        }
                    }

                    html += "</ul><div class='h-bottom-style'></div></div>"
                }

                $('.data10').innerHTML = html;

                var listSwiper = new Swiper('.borrowlist-container', {
                    direction: "horizontal",
                    slidesPerView: "auto",
                    centeredSlides: true,
                    spaceBetween: 25
                })
            }


            //2.然后再填进DOM
            $('.data1').innerHTML = msg.name;
            $('.data2').innerHTML = setTime1(msg.entertime);
            $('.data3').innerHTML = setTime1(msg.firstbooktime);
            $('.data4').innerHTML = msg.gap;
            $('.data5').innerHTML = '《' + msg.firstbook + '》';
            $('.data6').innerHTML = msg.grade;
            $('.data7').innerHTML = msg.bookcount;
            $('.data8').innerHTML = +msg.rankingrade * 100 + '%';
            $('.data9').innerHTML = setTitle(msg.bookcount);
            setReadingList(msg.books,msg.booknum);
            $('.data11').innerHTML = msg.favorite.split(',')[0];
            $('.data12').innerHTML = msg.bookcount;
            $('.data13').innerHTML = msg.favorite.split(',')[1];
            $('.data14').innerHTML = setTime2(msg.lastbooktime);
            $('.data15').innerHTML = '《' + msg.lastbook + '》';

        }
    },

    showPage: function () {
        var $slide1 = $('.slide1'),
            $loading = $('.loading-content'),
            $music = $('.music');

        //延时1s确保页面重绘完成
        setTimeout(function () {
            //显示欢迎页(隐藏加载元素)
            $loading.style.display = 'none';

            //显示音乐图标
            $music.style.display = 'block';

            //显示右边导航栏
            //$pagination.style.display = 'block';

            //激活可向下滑动
            $slide1.setAttribute('class', $slide1.getAttribute('class').replace(' swiper-no-swiping', ''));
        }, 1000)
    },

    music: function () {
        var me = this,
            $music = $('.music'),
            $audio = $('.audio'),
            isPlaying = true;

        $music.addEventListener('touchstart', function () {
            if (isPlaying) {
                $music.setAttribute('class', 'music music-play');
                $audio.play();
            } else {
                $music.setAttribute('class', 'music');
                $audio.pause();
            }
            isPlaying = !isPlaying;
        });

        me.triggerEvent($music, 'touchstart');


    },

    //封装模拟触发事件
    triggerEvent: function (element, type) {
        var event = document.createEvent('HTMLEvents');
        event.eventName = type;
        event.initEvent(type, true, true);
        return !element.dispatchEvent(event);
    },

    convertArray: function (arrayLike) {
        return Array.prototype.slice.call(arrayLike, 0);
    },

    showAlert: function (str) {
        window.alert(str);
    },

    showConfirm: function (str, callback) {
        var isConfirm = window.confirm(str);
        callback && callback(isConfirm);
    },

    /**
     * 封装的ajax
     * @param  {String}    method    请求类型
     * @param  {String}    param     请求参数(没有请传null)
     * @param  {String}    url       请求地址
     * @param  {Function}  callback  请求成功后执行的回调函数(可选)
     * @return {Object}  无
     */
    ajax: function (method, param, url, callback) {
        var me = this,
            method = method || 'GET',
            param = param || null,
            url = url || '';

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    var data = JSON.parse(xhr.responseText);
                    callback && callback(data);
                } else {
                    me.showAlert('A2:出错啦~请稍后登录呗~');
                    console.log('There was a problem with the request--status code:' + xhr.status);
                    location.reload();
                }
            }
        }
        xhr.onerror = function (e) {
            me.showAlert('A3:出错啦~请稍后登录呗~');
            console.log(e);
            location.reload();
        };

        xhr.open(method, url, true);

        if (method == 'POST') {
            // 设置 Content-Type 为 application/x-www-form-urlencoded
            // 以表单的形式传递数据
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }

        xhr.send(param);
    }
}

/**
 * 简化选择器
 * @param  {String} ele 选择元素 ('body')/('#idName')/('.banner a')
 * @return {Object} 返回匹配的第一个元素对象
 */
function $(elem) {
    return document.querySelector(elem);
}

//document.body.addEventListener('touchmove',function(e){
//    e.preventDefault();
//});

document.addEventListener("DOMContentLoaded", function (event) {
    God.init();
});
