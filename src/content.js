console.log('start');
var url = window.location.href;

/**
 * 主控
 */
function main() {
    st_hide_answer();
    url_watch();
}
main();

function url_watch() {
    setInterval(function () {
        if (url !== window.location.href) {
            url = window.location.href;

            st_hide_answer();

        }
    }, 500)
}

function next_watch() {
    /**
    * 切换页面时，需要重新配置相应的内容
    * paging标签加载需要一定时间，因此设置计时器
    */
    setTimeout(function () {
        if (document.body.getElementsByClassName('paging').length > 0) {
            console.log('添加下一页按钮单击监听事件');
            document.body.getElementsByClassName('paging')[0].addEventListener('click', function () {
                st_hide_answer();
            })
        }
    }, 500); // 因切换页面的按钮一般不会快速切换，因此可以设置大一些
}

/**
 * 定位到最上方
 */
function redirect_to_top() {
    if (document.body.getElementsByClassName('goto-top').length > 0)
        document.body.getElementsByClassName('goto-top')[0].click();
    // setTimeout(function () {
    //     if (document.body.getElementsByClassName('goto-top').length > 0)
    //         document.body.getElementsByClassName('goto-top')[0].click();
    // }, 200);
}

/**
 * 自动定时开启隐藏功能
 * 因暂时未找到【页面加载完启动当前文件】的配置 / 指针/ 方法
 * 通过计时器的方式启动
 */
function st_hide_answer() {
    setTimeout(function () {
        // 如果是收藏题库，则调用计时隐藏方法
        if (url.includes('questions/solution')) {
            hide_answer();
        }

        // 自动定位到最上方
        redirect_to_top();

        // 如果有下一页的按钮，则添加该按钮监听事件
        next_watch();
    }, 500)
}

function hide_answer() {
    console.log('hide_answer');
    // 隐藏详细答案
    var ad = document.body.getElementsByClassName('question-fb-solution-detail'); // 获取答案详解元素集
    for (var i = 0; i < ad.length; i++) {
        ad[i].style.display = 'none';
    }
    // 屏蔽正确答案标识
    var rl = document.body.getElementsByClassName('right-options');
    for (; 0 < rl.length;) {
        rl[0].className = 'fb-radioInput radio-single font-color-gray-mid border-gray-ligth2';
    }

    /**
     * 增加点击题目的监听事件
     * 实现点击题目，显示或隐藏当前题目答案
     */
    var tm = document.body.getElementsByClassName('solution-item bg-color-gray-bold ng-star-inserted'); // 获取题目&答案元素集
    for (var m = 0; m < tm.length; m++) {
        tm[m].addEventListener('click', function (el) {
            click_timu(el);
        });
    }
}



/**
 * 根据当前状态，显示或隐藏答案详解
 * @param {*} tm 被点击的题目元素，含题目 & 答案详解
 */
function click_timu(tm) {
    tm.currentTarget.getElementsByClassName('question-fb-solution-detail')[0].style.display
        = tm.currentTarget.getElementsByClassName('question-fb-solution-detail')[0].style.display === 'none' ? '' : 'none';
}

// 监听来自命令板的指令
chrome.extension.onMessage.addListener(
    function (request, sender, sendMessage) {
        switch (request.greeting) {
            case 'redirect_to_first_page': // 重定向到第一个页面
                document.body.getElementsByClassName('paging')[0].children[1].click();
                sendMessage('ok');
                break;
            case 'get_pages_count': // 获取总页面数
                var pl = document.body.getElementsByClassName('paging')[0].children; // 链接页面的列表元素集
                sendMessage(pl[pl.length - 2].innerHTML);
                break;
            case 'get_page_tiku_info': // 获取当前页面，题目html集
                var tk = '';
                var tkl = document.body.getElementsByClassName('exam-detail')[0].children; // 获取题目元素集（含题号）
                for (var i = 0; i < tkl.length; i++) {
                    tk += tkl[i].innerHTML;
                }
                sendMessage(tk);
                break;
            case 'redirect_to_next_page': // 重定向到下一个页面
                var pl = document.body.getElementsByClassName('paging')[0].children; // 指向列表的元素集
                pl[pl.length - 1].click();
                sendMessage('ok');
                break;
            case 'hide_answer':
                hide_answer(); // 隐藏答案
                break;
            default: // 传输当前题库所有信息
                document.body.getElementsByClassName('exam-detail')[0].innerHTML = request.greeting;
                sendMessage('ok');
                // 删除所有script标签元素
                var se = document.body.getElementsByTagName('script');
                for (; se.length > 0;) {
                    se[0].remove();
                }
                se = document.head.getElementsByTagName('script');
                for (; se.length > 0;) {
                    se[0].remove();
                }
        }
    }
);