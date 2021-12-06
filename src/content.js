console.log('start');

// 监听指令
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
            default: // 题库信息
                document.body.getElementsByClassName('exam-detail')[0].innerHTML = request.greeting;
                sendMessage('ok');

        }
    }
);