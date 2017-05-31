//项目需要require的资源:图片,字体等
require('./resources.js')

require('../css/index.css')

var God = {
    init: function () {
        this.initPage();
    },

    initPage: function () {
        var me = this,
            $loginBtn = $('#login-btn'),
            $no = $('#sno'),
            $sname = $('#sname');

        $loginBtn.addEventListener('touchstart', function (e) {
            me.changeLoginBtn();
            me.verify($no.value, $sname.value, function (param) {
                me.ajax('POST', param, './easy.php', function (data) {
                    switch (data.code) {
                        case -3:
                            //超出限制登录帐号(5个,不按次数,有效期2小时)
                            me.showAlert('您已经超过登录帐号限制，请稍后再登录~');
                            console.log('超过登录帐号限制');
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
                            window.location.pathname = './home.html'
                            break;
                        case 2:
                            me.showAlert('很遗憾，您大学期间未借过书，无法进入『馆藏记忆』~');
                            console.log('借书0本');
                            break;
                        default:
                            me.showAlert('A1:出错啦~请稍后登录呗~');
                            console.log('遇到未知错误--' + data.code + data.msg);
                            break;
                    }
                    me.changeLoginBtn();
                });
            });
        })

        console.log('初始化页面成功')
    },

    verify: function (no, name, callback) {
        var me = this,
            sno = no.trim(),
            sname = name.trim();

        if ((/^\d{10}$/.test(sno)) && (/^[\u4e00-\u9fa5·•﹒]+$/.test(sname))) {
            console.log('check ok');
            var param = 'uid=' + sno + '&name=' + sname + '&cmd=login';

            if (sno[3] == '3') {
                callback && callback(param);
            } else if (sno[3] == '6' || sno[3] == '5' || sno[3] == '4') {
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
                        var data = JSON.parse(xhr.responseText);
                    } catch (e) {
                        me.showAlert('Z1:系统出错,请联系管理员~');
                        console.log('后台响应体不正常:' + xhr.responseText);
                    }
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


document.addEventListener("DOMContentLoaded", function (event) {
    God.init();
});
