//用到的样式\图片\字体等静态资源需要在这里require
//否则不会拷贝到dist目录
require('../css/index.css')
require('../img/login_logo.jpg')

window.onload = function () {

    var loginBtn = document.querySelector('#login-btn');
    loginBtn.addEventListener('touchend', function (e) {
        e.preventDefault();
        e.stopPropagation();

        changeLoginBtn();

        var sno = document.querySelector('#sno').value.trim();
        var sname = document.querySelector('#sname').value.trim();

        if ((/^\d{10,11}$/.test(sno)) && (/^[a-zA-Z\u4e00-\u9fa5]+$/.test(sname))) {
            console.log('check ok');
            var param = 'uid=' + sno + '&name=' + sname + '&cmd=login';

            if (sno[3] == '6' || sno[3] == '5' || sno[3] == '4' || sno[3] == '3') {
                ajax('POST', param, './easy.php', function (data) {
                    switch (data.code) {
                        case -3:
                            console.log('已登录');
                            window.location.pathname = './home.html'
                            break;
                        case -2:
                        case -1:
                            showModal('您的输入有误,请检查后重新输入~');
                            console.log('输入或请求有误--' + data.code + data.msg);
                            changeLoginBtn();
                            break;
                        case 0:
                            showModal('您输入的姓名或学号有误,请重新输入~');
                            console.log('姓名与学号不对应--' + data.code + data.msg);
                            changeLoginBtn();
                            break;
                        case 1:
                            console.log('登录成功');
                            window.location.pathname = './home.html'
                            break;
                        default:
                            showModal('A1:出错啦~请稍后登录呗~');
                            console.log('遇到未知错误--' + data.code + data.msg);
                            changeLoginBtn();
                            break;
                    }
                });
            } else {
                showModal('抱歉，本纪念册仅向在读本科生开放。');
                changeLoginBtn();
            }

        } else {
            showModal('您输入的姓名或学号格式有误,请检查后重新输入~');
            changeLoginBtn();
        }

    })

    function showModal(str) {
        return window.alert(str);
    }

    function changeLoginBtn() {
        if (loginBtn.className == 'login-submit login-waiting') {
            loginBtn.className = 'login-submit';
            loginBtn.setAttribute('value', '登录')
        } else {
            loginBtn.className = 'login-submit login-waiting';
            loginBtn.setAttribute('value', '登录中...')
        }
    }

    /**
     * 封装的ajax
     * @param  {String}  method    请求类型
     * @param  {String}  param     请求参数(没有请传null)
     * @param  {String}  url       请求地址
     * @param  {Function}  callback  请求成功后执行的回调函数(可选)
     * @return {Object}  无
     */
    function ajax(method, param, url, callback) {
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
                    showModal('A2:出错啦~请稍后登录呗~');
                    console.log('There was a problem with the request--status code:' + xhr.status);
                    location.reload();
                }
            }
        }
        xhr.onerror = function (e) {
            showModal('A3:出错啦~请稍后登录呗~');
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
