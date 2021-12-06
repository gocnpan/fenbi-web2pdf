console.log('start');

function hide_answer() {
    console.log('hide_answer');
    var ad = document.body.getElementsByClassName('question-fb-solution-detail'); // 答案详解
    for (var i = 0; i < ad.length; i++) {
        ad[i].style.display = 'none';
    }
    var rl = document.body.getElementsByClassName('right-options');
    for (; 0 < rl.length;) {
        rl[0].className = 'fb-radioInput radio-single font-color-gray-mid border-gray-ligth2';
    }
    // solution-item bg-color-gray-bold ng-star-inserted
    var tm = document.body.getElementsByClassName('solution-item bg-color-gray-bold ng-star-inserted'); // 获取题目&答案元素集
    for (var m = 0; m < tm.length; m++) {
        tm[m].addEventListener('click', function (el) {
            click_timu(el);
        });
    }

    /**
     * 切换页面时，需要重新配置相应的内容
     */
    var pc = document.body.getElementsByClassName('paging')[0].addEventListener('click', function(){
        st_hide_answer();
    })
}

function st_hide_answer(){
    setTimeout(function () {
        hide_answer();
    }, 250)
}

window.onload = function () {
    st_hide_answer();
}

function click_timu(tm) {
    tm.currentTarget.getElementsByClassName('question-fb-solution-detail')[0].style.display
        = tm.currentTarget.getElementsByClassName('question-fb-solution-detail')[0].style.display === 'none' ? '' : 'none';
}

// 监听来自命令板的指令
chrome.extension.onMessage.addListener(
    function (request, sender, sendMessage) {
        switch (request.greeting) {
            case 'redirect_to_first_page':
                document.body.getElementsByClassName('paging')[0].children[1].click();
                sendMessage('ok');
                break;
            case 'get_pages_count':
                var pl = document.body.getElementsByClassName('paging')[0].children; // 指向列表的元素集
                sendMessage(pl[pl.length - 2].innerHTML);
                break;
            case 'get_page_tiku_info':
                var tk = '';
                var tkl = document.body.getElementsByClassName('exam-detail')[0].children; // 获取题目元素集（含题号）
                for (var i = 0; i < tkl.length; i++) {
                    tk += tkl[i].innerHTML;
                }
                sendMessage(tk);
                break;
            case 'redirect_to_next_page':
                var pl = document.body.getElementsByClassName('paging')[0].children; // 指向列表的元素集
                pl[pl.length - 1].click();
                sendMessage('ok');
                break;
            case 'hide_answer':
                hide_answer();
                break;
            default: // 题库信息
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