require('../css/home.css')

var God = {
    init: function () {
        this.initPage();
        this.loadImg();
        this.userData();
        this.music();
    },

    initPage: function () {
        var me = this,
            $showMine = $('.show-mine'),
            $again = $('.once-again'),
            $share = $('.share-info'),
            $showGuide = $('.share-guide'),
            $music = $('.music'),
            $firstPageText = $('.not-share .font-welcome'),
            $showMine = $('.show-mine');

        //设置全屏
        me.setPageSize();

        //设置Swiper
        var globalSwiper = new Swiper('.swiper-container', {
            speed: 400,
            direction: "vertical",
            //pagination: ".swiper-pagination",
            onSlideChangeStart: function (swiper) {

                //1.先把所有页面的文字隐藏
                me.convertArray(document.querySelectorAll('.font-abc')).forEach(function (ele) {
                    ele.style.display = 'none';
                });

                //2.然后滑到当前页面,文字显示
                if (swiper.slides[swiper.activeIndex].querySelector('.font-abc')) {
                    swiper.slides[swiper.activeIndex].querySelector('.font-abc').style.display = 'block';
                }


                //滑到了第一页
                if (swiper.activeIndex == 0) {
                    $showMine.style.display = 'none'
                }
                //滑走第一页
                if (swiper.activeIndex != 0) {
                    $showMine.style.display = 'block'
                }

                //滑到了第五页
                if (swiper.activeIndex == 4) {
                    me.convertArray($('.borrowlist-container').querySelectorAll('.font-abc')).forEach(function (ele) {
                        ele.style.display = 'block';
                    });
                }
                //滑走第五页
                if (swiper.activeIndex != 4) {
                    me.convertArray($('.borrowlist-container').querySelectorAll('.font-abc')).forEach(function (ele) {
                        ele.style.display = 'none';
                    });
                }
            }
        });

        //点击[查看我的]
        $showMine.addEventListener('touchstart', function () {
            window.location = './home.html'
        });

        //点击[再看一遍]
        $again.addEventListener('touchstart', function () {
            globalSwiper.forEach(function (ele) {
                ele.slideTo(0, 1500, false)
            });
            $firstPageText.style.display = 'block';
        });

        //点击[分享给朋友]
        $share.addEventListener('touchstart', function () {
            //弹出分享引导蒙版
            $showGuide.style.display = 'block';
            //隐藏音乐图标
            $music.style.display = 'none';

        });

        //点击[分享蒙版]
        $showGuide.addEventListener('touchstart', function () {
            //隐藏分享引导蒙版
            $showGuide.style.display = 'none';
            //显示音乐图标
            $music.style.display = 'block';
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

        me.convertArray(els).forEach(function (ele) {
            ele.style.width = designWidth + 'px';
            ele.style.height = designHeight + 'px';
            ele.style.position = 'absolute';
            ele.style.top = '50%';
            ele.style.left = '50%';
            var targetScaleX = docWidth / designWidth,
                targetScaleY = docHeight / designHeight;
            if (docScale >= scale) {

            } else {
                // targetScale = docHeight / designHeight;
            }
            ele.style.transformOrigin = '0 0';
            ele.style.transform = 'scale(' + targetScaleX + ',' + targetScaleY + ')translate(-50%, -50%)';
        });
    },

    //图片预加载
    loadImg: function () {
        var me = this,
            imgList = ['pg1_welcome.png', 'pg2_firsttime.png', 'pg3_firstbook.png', 'pg4_total.png', 'pg5_booklist_bottom.png', 'pg6_interest.png', 'pg7_lastbook.png', 'pg8_epilogue.png', 'pg9_final.png'];

        var imgLocation = 'http://source.igdut.cn/1.4/',
        //imgLocation = window.location.origin + '/img/',
        //$pagination = $('.swiper-pagination-bullets'),
            successCount = 0,
            len = imgList.length;

        for (var i = 0; i < len; i++) {
            var oneImg = new Image();
            oneImg.src = imgLocation + imgList[i];
            oneImg.onload = function () {
                successCount++;
                me.convertArray(document.querySelectorAll('.progress')).forEach(function (ele) {
                    ele.innerHTML = Math.floor(successCount / len * 100) + '%';
                });

                //所有图片成功加载
                if (successCount == len) {
                    console.log('所有图片预加载成功');
                    me.showPage();
                }
            }
            oneImg.onerror = function () {
                console.log('图片并未成功加载');
                me.sendMsg('E5', 'imgLoadErr');
                me.showPage()
            }
        }
    },

    //填好用户数据
    userData: function () {
        var me = this,
            search = window.location.search,
            $notShare = $('.not-share'),//[B个人登录页面]DOM
            $isShare = $('.is-share');//[A分享页面]DOM

        //判断是否分享页面
        if (search.indexOf('share=') == true) { //[A分享页面]
            me.getQueryString(function (userInfoArr) {
                $notShare.style.display = 'none';
                me.fillShareData(userInfoArr);
            })
        } else {                                 //[B个人登录页面]
            $isShare.style.display = 'none';
            me.ajax('POST', 'cmd=getinfo', './interface.php', function (data) {
                switch (data.code) {
                    case 0:
                        me.showAlert('未能获取到信息，请返回重新登录。');
                        window.location = './index.html'
                        break;
                    case 1:
                        console.log('获取信息成功');
                        //填数据
                        me.fillRequestData(data.msg, function (userInfo) {
                            me.wechatAction(userInfo)
                        })
                        //如果需要判断用户类型,换成:
                        //userType(data.msg);
                        break;
                    default:
                        me.showAlert('出错啦~请稍后登录呗~');
                        //console.log('遇到未知错误--' + data.code + data.msg);
                        me.sendMsg('E2', 'responseErr-211' + data.code + data.msg)
                        window.location = './index.html'
                        break;
                }
            });

            /*
             //判断用户类型(可能会分性别,分学生和教工,分是否读者之星等)
             var userType = function (msg) {

             //if(info.sex == 1) {
             //    //切换设计稿\音乐等
             //}
             //if(info.type == 'teacher') {
             //    //切换展示内容\音乐等
             //}

             //填数据
             me.fillRequestData(msg);
             }
             */

        }
    },

    //[A分享页]的填数据
    fillShareData: function (userInfoArr) {
        var me = this;

        //填数据进DOM(这里拿到14个.data)
        me.convertArray(document.querySelectorAll('.is-share .data')).forEach(function (ele, index) {
            ele.innerHTML = userInfoArr[index];
        });

        document.title = '2017 | 馆藏记忆 一一 ' + userInfoArr[0] + '的图书馆时光'
    },

    //[B登录页]的填数据
    fillRequestData: function (data, callback) {
        var me = this,
            userInfo = [];

        //1.先处理一下后台传过来的数据

        var setTime1 = function (time) {
            var timeArr = time.split('-');
            return "<span class='highlight'>" + timeArr[0] + "</span>年<span class='highlight'>" + timeArr[1] + "</span>月<span class='highlight'>" + timeArr[2] + "</span>日"
        }

        var setTime2 = function (time) {
            var timeArr = time.split('-');
            return "在<span class='highlight'>" + timeArr[0] + "</span>年的<span class='highlight'>" + timeArr[1] + "</span>月<span class='highlight'>" + timeArr[2] + "</span>日"
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

        var setReadingList = function (books, charCounts) {
            var html = '',
                pages = Math.ceil(books.length / 10);

            //如果是只有一页,隐藏提示左右滑动的手势
            if (pages == 1) {
                $('.hand-tip').style.display = 'none'
            }

            //for一次添加一页,i表示当前页
            for (var i = 1; i <= pages; i++) {
                //每个分页开始计数的书的编号
                var start = (i - 1) * 10 + 1;

                if (charCounts[i - 1] < 80) {            //0-79     书名几乎都是一行,用大字号 font-big
                    html += ("<div class='swiper-slide h-slide h-slide" + i + "'><ul class='font-abc font-borrowlist-books font-big'>");
                } else if (charCounts[i - 1] < 120) {     //80-119   书名部分两行,用默认中字号
                    html += ("<div class='swiper-slide h-slide h-slide" + i + "'><ul class='font-abc font-borrowlist-books'>");
                } else if (charCounts[i - 1] < 190) {     //120-189  书名平均两行,用小字号 font-small
                    html += ("<div class='swiper-slide h-slide h-slide" + i + "'><ul class='font-abc font-borrowlist-books font-small'>");
                } else {                                 //190-     书名平均三行以上,用特小字号 font-very-small
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

            $('.not-share .data10').innerHTML = html;

            var listSwiper = new Swiper('.borrowlist-container', {
                direction: "horizontal",
                slidesPerView: "auto",
                centeredSlides: true,
                spaceBetween: 25
            })
        }


        //整理格式,存进数组(14个数据项)
        userInfo[0] = data.name;
        userInfo[1] = setTime1(data.entertime);
        userInfo[2] = setTime1(data.firstbooktime);
        userInfo[3] = data.gap;
        userInfo[4] = '《' + data.firstbook + '》';
        userInfo[5] = data.grade;
        userInfo[6] = data.bookcount;
        userInfo[7] = (+data.rankingrade * 100).toFixed(1) + '%';
        userInfo[8] = setTitle(data.bookcount);
        userInfo[9] = data.favorite.split(',')[0];
        userInfo[10] = data.bookcount;
        userInfo[11] = data.favorite.split(',')[1];
        userInfo[12] = setTime2(data.lastbooktime);
        userInfo[13] = '《' + data.lastbook + '》';


        //2.然后再填进DOM(这里拿到14个.data)
        me.convertArray(document.querySelectorAll('.not-share .data')).forEach(function (ele, index) {
            ele.innerHTML = userInfo[index];
        });
        //这里补充.data10--借阅书单
        setReadingList(data.books, data.booknum);


        //填完数据执行微信操作
        callback && callback(userInfo);
    },

    showPage: function () {
        var me = this,
            $music = $('.music');

        //延时1s确保页面重绘完成
        setTimeout(function () {
            //显示欢迎页(隐藏加载元素)
            me.convertArray(document.querySelectorAll('.loading-content')).forEach(function (ele) {
                ele.style.display = 'none';
            });

            //显示音乐图标
            $music.style.display = 'block';

            //显示右边导航栏
            //$pagination.style.display = 'block';

            //激活可向下滑动
            me.convertArray(document.querySelectorAll('.slide1')).forEach(function (ele) {
                ele.setAttribute('class', ele.getAttribute('class').replace(' swiper-no-swiping', ''));
            });
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

    //提取url查询字符信息,回调函数为启用分享页的操作
    getQueryString: function (callback) {
        var me = this,
            urlUserInfoArr = [],
            urlUserInfoStr = window.location.href.split('?')[1].split('&')[0].split('=')[1];

        try {
            //TK解码
            urlUserInfoStr = TK.de(urlUserInfoStr);
        } catch (e) {
            me.showAlert('分享链接失效，请返回重新登录~');
            //console.log('链接提取参数解码出错--' + e.message);
            me.sendMsg('S5', 'shareInfoErr-611' + e.message);
            window.location = './index.html'
        }

        urlUserInfoArr = urlUserInfoStr.split(';')

        //校验,正确的是14个数据项
        if (urlUserInfoArr.length == 14) {
            callback && callback(urlUserInfoArr);
        } else {
            me.showAlert('分享链接失效，请返回重新登录~');
            me.sendMsg('S5', 'shareInfoErr-612');
            window.location = './index.html'
        }
    },

    //设置分享链接数据,示例:'?share=xxx',注意后面的xxx值经过base64编码
    //userInfo为读者数据的数组,含14个数据项
    setQueryString: function (userInfo) {
        var str = '';

        userInfo.forEach(function (ele, index) {
            if (index != 13) {
                str += (ele + ';');
            } else {
                str += (ele);
            }

        });

        return '?share=' + TK.en(str);
    },

    //执行微信分享操作
    //注意只有在[登录页]才会有这一步,[分享页]不进行分享设置
    wechatAction: function (userInfo) {
        var me = this;

        if (me.isWechat()) {
            console.log('微信内,开始执行分享设置');
            var url = window.location.href.split('#')[0],
                param = 'cmd=wx&url=' + TK.en(url);

            me.ajax('POST', param, './interface.php', function (data) {
                switch (data.code) {
                    case 1:
                        //传入微信分享配置和14个基础数据项
                        me.setWechatConf(data.msg, userInfo);
                        break;
                    default:
                        me.showAlert('设置分享内容失败,请稍后再试~');
                        //console.log('遇到未知错误--' + data.code + data.msg);
                        me.sendMsg('E2', 'responseErr-212' + data.code + data.msg)
                        break;
                }
            });
        }
    },

    isWechat: function () {
        if ((navigator.userAgent.indexOf("MicroMessenger") >= 0) && window.wx) {
            return true;
        } else {
            return false;
        }
    },

    setWechatConf: function (conf, userInfo) {
        var me = this,
            url = window.location.href.split('?')[0] + me.setQueryString(userInfo),//拿到当前页面不带参数的url,再加上shareInfo
            title = '2017 | 馆藏记忆 一一 ' + $('.not-share .data1').innerHTML + '的图书馆时光',
            desc = '欢迎来到2017广东工业大学图书馆毕业纪念册',
            imgUrl = 'http://source.igdut.cn/1.4/login_logo.png';

        wx.config({
            debug: false,
            appId: conf.appid,
            timestamp: conf.timestamp,
            nonceStr: conf.nonceStr,
            signature: conf.signature,
            jsApiList: [
                'onMenuShareTimeline',   //分享到朋友圈
                'onMenuShareAppMessage', //分享给朋友
                'onMenuShareQQ'          //分享到QQ
            ]
        });

        wx.ready(function () {
            //分享到朋友圈
            wx.onMenuShareTimeline({
                title: title, // 分享标题
                link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    //console.log('分享成功')
                    me.sendMsg('S1', 'onMenuShareTimeline')
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });

            //分享给朋友
            wx.onMenuShareAppMessage({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                    //console.log('分享成功')
                    me.sendMsg('S2', 'onMenuShareAppMessage')
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });

            //分享到QQ
            wx.onMenuShareQQ({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: url, // 分享链接
                imgUrl: imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    //console.log('分享成功')
                    me.sendMsg('S3', 'onMenuShareQQ')
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });

        });

        wx.error(function (res) {
            me.showAlert('设置分享内容失败,请稍后再试~');
            //console.log('获取分享信息失败--' + res);
            me.sendMsg('S4', 'wxConfigErr' + res)
        });
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

    showAlert: function (message) {
        var iframe = document.createElement("IFRAME");
        iframe.style.display = "none";
        iframe.setAttribute("src", 'data:text/plain,');
        document.documentElement.appendChild(iframe);
        window.frames[0].window.alert(message);
        iframe.parentNode.removeChild(iframe);
    },

    showConfirm: function (message) {
        var iframe = document.createElement("IFRAME");
        iframe.style.display = "none";
        iframe.setAttribute("src", 'data:text/plain,');
        document.documentElement.appendChild(iframe);
        var alertFrame = window.frames[0];
        var result = alertFrame.window.confirm(message);
        iframe.parentNode.removeChild(iframe);
        return result;
    },

    /**
     * 给服务器发送信息
     * @param  {String}    type        信息类型
     * @param  {String}    message     信息内容
     * @return {Object}    无
     */
    sendMsg: function (type, message) {
        var me = this,
            param = 'cmd=log&info=' + type + ':' + message;

        me.ajax('POST', param, './interface.php', function (data) {
            switch (data.code) {
                case 1:
                    console.log('发送信息成功');
                    break;
                default:
                    console.log('发送信息失败,遇到未知错误--' + data.code + data.msg);
                    break;
            }
        })
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
                    try {
                        //var data = JSON.parse(xhr.responseText);
                        //解码解析
                        var data = JSON.parse(TK.de(xhr.responseText.slice(9)));
                    } catch (err) {
                        me.showAlert('系统出错,请联系管理员~');
                        //console.log('后台响应体出错:' + xhr.responseText);
                        me.sendMsg('E4', 'responseTextErr-' + err.message);
                        return false
                    }
                    callback && callback(data);
                } else {
                    me.showAlert('出错啦~请稍后登录呗~');
                    //console.log('请求遇到错误--status code:' + xhr.status);
                    me.sendMsg('E1', 'requestErr-101');
                    location.reload();
                }
            }
        }
        xhr.onerror = function (e) {
            me.showAlert('出错啦~请稍后登录呗~');
            me.sendMsg('E1', 'requestErr-102' + e.message);
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
