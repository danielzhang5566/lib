//用到的样式\图片\字体等静态资源需要在这里require
//否则不会拷贝到dist目录
require('../css/index.css')
require('../img/login_logo.jpg')
require('../font/zhanku.ttf')

/* 简化选择器 */
function $(elem) {
    return document.querySelector(elem);
}

var loginBtn = $('#login-btn');
loginBtn.addEventListener('touchend', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var sno = $('#sno').value.trim();
    var sname = $('#sname').value.trim();

    if ((/^\d{10}$/.test(sno)) && (/^[a-zA-Z\u4e00-\u9fa5]+$/.test(sname))) {
        console.log('check ok');
        var param = 'uid=' + sno + '&name=' + sname + '&cmd=login';
        post(param);
    } else {
        showModal('您输入的姓名或学号格式有误,请检查后重新输入~');
    }
})

function showModal(str) {
    alert(str);
}

function post(param) {

    var xhr = new XMLHttpRequest();
    if (xhr) {
        xhr.onreadystatechange = onReadyStateChange;
        xhr.open('POST', 'http://api.lib.b612.me/easy.php', true);
        // 设置 Content-Type 为 application/x-www-form-urlencoded
        // 以表单的形式传递数据
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(param);
    }

    function onReadyStateChange() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                switch (data.code) {
                    case -3:
                        console.log('已登录');
                        window.location.pathname = '/home.html'
                        break;
                    case -2:
                    case -1:
                        showModal('您的输入有误,请检查后重新输入~');
                        console.log('输入或请求有误--' + data.code + data.msg);
                        break;
                    case 0:
                        showModal('您输入的姓名或学号有误,请重新输入~');
                        console.log('姓名与学号不对应--' + data.code + data.msg);
                        break;
                    case 1:
                        console.log('登录成功');
                        window.location.pathname = '/home.html'
                        break;
                    default:
                        showModal('出错啦~请稍后登录呗~');
                        console.log('遇到未知错误--' + data.code + data.msg);
                        break;
                }
            } else {
                showModal('出错啦~请稍后登录呗~');
                console.log('There was a problem with the request.');
            }
        }
    }
}