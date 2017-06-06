//项目需要require的资源:图片,字体等
require('./resources.js')

require('../css/index.css')

var God = {
    init: function () {
        this.initPage();
        this.wechatAction();
    },

    initPage: function () {
        var me = this,
            $loginBtn = $('#login-btn'),
            $no = $('#sno'),
            $sname = $('#sname');

        $loginBtn.addEventListener('touchstart', function (e) {
            var no = $no.value.trim(),
                name = $sname.value.trim();

            me.changeLoginBtn();
            me.verify(no, name, function (param) {
                me.ajax('POST', me.s(param, 'login', name, 'gdutlib'), './api/interface.php', function (data) {
                    switch (data.code) {
                        case -3:
                            //超出限制登录帐号(5个,不按次数,有效期2小时)
                            me.showAlert('您已经超过登录帐号限制，请稍后再登录~');
                            //console.log('超过登录帐号限制');
                            me.sendMsg('E311', 'beyondLogin')
                            break;
                        case -2:
                        case -1:
                            me.showAlert('您的输入有误，请检查后重新输入~');
                            console.log('输入或请求有误');
                            break;
                        case 0:
                            me.showAlert('您输入的姓名或学号有误，请重新输入~');
                            console.log('姓名与学号不对应');
                            break;
                        case 1:
                            console.log('登录成功');
                            window.location = './home.html'
                            break;
                        case 2:
                            me.showAlert('很遗憾，您大学期间未借过书，无法进入『馆藏记忆』~');
                            console.log('借书0本');
                            break;
                        default:
                            me.showAlert('出错啦~请稍后登录呗~');
                            //console.log('遇到未知错误--' + data.code + data.msg);
                            me.sendMsg('E211', 'responseErr--' + data.code + data.msg)
                            break;
                    }
                    me.changeLoginBtn();
                });
            });
        })

        console.log('初始化页面成功')
    },

    verify: function (no, name, callback) {
        var me = this;

        if ((/^\d{10}$/.test(no)) && (/^[\u4e00-\u9fa5·•﹒]+$/.test(name))) {
            console.log('check ok');
            var param = 'uid=' + no + '&name=' + name + '&cmd=login';

            if (no[3] == '3') {
                callback && callback(param);
            } else if (no[3] == '6' || no[3] == '5' || no[3] == '4') {
                if (me.showConfirm('本纪念册为毕业生而设计，您不是大四毕业生，确定要继续访问吗？')) {
                    callback && callback(param);
                } else {
                    me.changeLoginBtn();
                }

                //me.showConfirm('本纪念册为毕业生而设计，您不是大四毕业生，确定要访问吗003？', function (isLogin) {
                //    if (isLogin == true) {
                //        callback && callback(param);
                //    } else {
                //        console.log('非大四在读本科生用户取消了登录操作');
                //        me.changeLoginBtn();
                //    }
                //    return false;
                //});

            } else {    //非在读本科生
                me.showAlert('抱歉，本纪念册仅向在读本科生开放。');
                me.changeLoginBtn();
            }

        } else {    //正则不通过
            me.showAlert('您输入的姓名或学号格式有误，请检查后重新输入~');
            me.changeLoginBtn();
        }

    },

    changeLoginBtn: function () {
        var $loginBtn = $('#login-btn')
        if ($loginBtn.className == 'login-submit login-waiting') {
            $loginBtn.className = 'login-submit';
            $loginBtn.setAttribute('value', '登录')
        } else {
            $loginBtn.className = 'login-submit login-waiting';
            $loginBtn.setAttribute('value', '登录中...')
        }
        return
    },

    //执行微信分享操作
    //注意只有在[登录页]才会有这一步,[分享页]不进行分享设置
    wechatAction: function () {
        var me = this;

        if (me.isWechat()) {
            console.log('微信内,开始执行分享设置');
            var url = window.location.href.split('#')[0],//注意这里的url要带上参数,否则无法通过微信验证
                param = 'cmd=wx&url=' + TK.en(url);

            me.ajax('POST', param, './api/interface.php', function (data) {
                switch (data.code) {
                    case 1:
                        //传入微信分享配置和14个基础数据项
                        me.setWechatConf(data.msg);
                        break;
                    default:
                        me.showAlert('设置分享内容失败,请稍后再试~');
                        //console.log('遇到未知错误--' + data.code + data.msg);
                        me.sendMsg('E212', 'responseErr--' + data.code + data.msg)
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

    setWechatConf: function (conf) {
        var me = this,
            url = 'https://www.igdut.cn/',
            title = '2017 | 馆藏记忆',
            desc = '缤纷毕业季，青春不散场！欢迎来到图书馆2017届毕业纪念册“馆藏记忆”。',
            imgUrl = 'https://www.igdut.cn/img/2.0/login_logo.png';//为了防止触发cdn防盗链,这里url设为服务器

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
                    me.sendMsg('S111', 'onMenuShareTimeline')
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
                    me.sendMsg('S211', 'onMenuShareAppMessage')
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
                    me.sendMsg('S311', 'onMenuShareQQ')
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });

        });

        wx.error(function (res) {
            me.showAlert('设置分享内容失败,请稍后再试~');
            //console.log('获取分享信息失败--' + res);
            me.sendMsg('S411', 'wxConfigErr--' + res)
        });
    },

    //封装模拟触发事件
    triggerEvent: function (element, type) {
        var event = document.createEvent('HTMLEvents');
        event.eventName = type;
        event.initEvent(type, true, true);
        return !element.dispatchEvent(event);
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
     * 加密重构请求参数函数
     * @param  {String}    param       原始参数
     * @param  {String}    cmd         命令
     * @param  {String}    name        姓名
     * @param  {String}    str         约定密串
     * @return {String}    重构后的参数
     */
    s: function (param, cmd, name, str) {
        var secu = AK(cmd + name + str);
        return (param + '&secu=' + secu);
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

        me.ajax('POST', param, './api/interface.php', function (data) {
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
                        me.sendMsg('E411', 'responseTextErr--' + err.message);
                        return false
                    }
                    callback && callback(data);
                } else {
                    me.showAlert('出错啦~请稍后登录呗~');
                    //console.log('请求遇到错误--status code:' + xhr.status);
                    me.sendMsg('E111', 'requestErr');
                    location.reload();
                }
            }
        }
        xhr.onerror = function (e) {
            me.showAlert('出错啦~请稍后登录呗~');
            me.sendMsg('E112', 'requestErr' + e.message);
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


document.addEventListener("DOMContentLoaded", function (event) {
    God.init();
});
