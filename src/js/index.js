//用到的样式\图片\字体等静态资源需要在这里require
//否则不会拷贝到dist目录
require('../css/index.css')
//require('../img/login_logo.jpg')

var God = {
    init: function () {
        this.initPage();
    },

    initPage: function () {
        var me = this,
            $loginBtn = $('#login-btn'),
            $no = $('#sno'),
            $sname = $('#sname');

        $loginBtn.addEventListener('touchend', function (e) {
            e.preventDefault();
            e.stopPropagation();

            me.changeLoginBtn();
            me.verify($no.value,$sname.value);

        })

        console.log('初始化页面成功')
    },

    verify: function(no,name) {
        var me = this,
            sno = no.trim(),
            sname = name.trim();

        if ((/^\d{10}$/.test(sno)) && (/^[\u4e00-\u9fa5·•﹒]+$/.test(sname))) {
            console.log('check ok');
            var param = 'uid=' + sno + '&name=' + sname + '&cmd=login';

            if (sno[3] == '6' || sno[3] == '5' || sno[3] == '4' || sno[3] == '3') {
                me.ajax('POST', param, './easy.php', function (data) {
                    switch (data.code) {
                        case -3:
                            console.log('已登录');
                            window.location.pathname = './home.html'
                            break;
                        case -2:
                        case -1:
                            me.showModal('您的输入有误,请检查后重新输入~');
                            console.log('输入或请求有误--' + data.code + data.msg);
                            me.changeLoginBtn();
                            break;
                        case 0:
                            me.showModal('您输入的姓名或学号有误,请重新输入~');
                            console.log('姓名与学号不对应--' + data.code + data.msg);
                            me.changeLoginBtn();
                            break;
                        case 1:
                            console.log('登录成功');
                            window.location.pathname = './home.html'
                            break;
                        default:
                            me.showModal('A1:出错啦~请稍后登录呗~');
                            console.log('遇到未知错误--' + data.code + data.msg);
                            me.changeLoginBtn();
                            break;
                    }
                });
            } else {    //非在读本科生
                me.showModal('抱歉，本纪念册仅向在读本科生开放。');
                me.changeLoginBtn();
            }

        } else {    //正则不通过
            me.showModal('您输入的姓名或学号格式有误,请检查后重新输入~');
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
    },

    //封装模拟触发事件
    triggerEvent: function (element, type) {
        var event = document.createEvent('HTMLEvents');
        event.eventName = type;
        event.initEvent(type, true, true);
        return !element.dispatchEvent(event);
    },

    showModal: function (str) {
        return window.alert(str);
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
                    me.showModal('A2:出错啦~请稍后登录呗~');
                    console.log('There was a problem with the request--status code:' + xhr.status);
                    location.reload();
                }
            }
        }
        xhr.onerror = function (e) {
            me.showModal('A3:出错啦~请稍后登录呗~');
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


document.addEventListener("DOMContentLoaded", function (event) {
    God.init();
});
