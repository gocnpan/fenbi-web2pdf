/**
 * 需要保存的变量
 */
var pages_count = null; // 统计总计页面数
var content_arr = []; // 存放各个页面题目数据
var page_type = 0; // 页面类型 0 错题 / 1 收藏

/**
 * 启动程序
 */
function start() {
    init_var(); // 初始化数据
    chrome.tabs.getSelected(null, function (tab) {
        page_type = tab.url.includes("error") ? 0 : 1; // 获取页面类型
    });
    // document.getElementById("tt").innerHTML = page_type === 0 ? '错题' : '收藏';
    get_pages_count(); // 获取页面总计
    redirect_to_first_page();
    get_page_tiku_info();
    // setTimeout(function(){get_pages_count()}, 3350); // 计时，获取页面数
}

/**
 * 初始化变量数据
 */
function init_var() {
    pages_count = null;
    content_arr = [];
}

/**
 * 获取页面总数
 */
function get_pages_count(){
    chrome.tabs.getSelected(null, function (tab) {　　// 先获取当前页面的tabID
        chrome.tabs.sendMessage(tab.id, { greeting: "get_pages_count" }, function (response) {
            console.log('get_pages_count: ' + response);　　// 向content-script.js发送请求信息
            pages_count = parseInt(response);
        });
    });
}

/**
 * 定位到首页
 * 指令
 */
function redirect_to_first_page() {
    chrome.tabs.getSelected(null, function (tab) {　　// 先获取当前页面的tabID
        chrome.tabs.sendMessage(tab.id, { greeting: "redirect_to_first_page" }, function (response) {
            var cpn = content_arr.length + 1; // 当前页面
            console.log('当前页面：' + cpn + ', redirect_to_first_page: ' + response);　　// 向content-script.js发送请求信息
        });
    });
}

/**
 * 获取各个页面的题目信息
 * 等待一段时间再读取页面信息（随机）
 * 读取完当前页面，则判断是否还需读取下一个页面
 */
function get_page_tiku_info(){
    setTimeout(function(){
        chrome.tabs.getSelected(null, function (tab) {　　// 先获取当前页面的tabID
            chrome.tabs.sendMessage(tab.id, { greeting: "get_page_tiku_info" }, function (response) {
                var cpn = content_arr.length + 1; // 当前页面
                console.log('当前页面：' + cpn + ', get_page_tiku_info: ok');　　// 向content-script.js发送请求信息
                content_arr.push(response);
                if(content_arr.length < pages_count){ // 是否需要读取下一个页面
                    setTimeout(function(){
                        redirect_to_next_page();
                    }, Math.random() * 3000 + 1000)
                } else{
                    var tiku = '';
                    for(var i = 0; i < content_arr.length; i++){
                        tiku += content_arr[i];
                    }
                    send_tiku(tiku);
                }
            });
        });
    }, Math.random() * 2000 + 2000)
}

function redirect_to_next_page(){
    chrome.tabs.getSelected(null, function (tab) {　　// 先获取当前页面的tabID
        chrome.tabs.sendMessage(tab.id, { greeting: "redirect_to_next_page" }, function (response) {
            console.log('redirect_to_next_page: ' + response);　　// 向content-script.js发送请求信息
            get_page_tiku_info();
        });
    });
}

function send_tiku(tiku){
    chrome.tabs.getSelected(null, function (tab) {　　// 先获取当前页面的tabID
        chrome.tabs.sendMessage(tab.id, { greeting: tiku}, function (response) {
            console.log('tiku: ' + response);　　// 向content-script.js发送请求信息
        });
    });
}


/*** LISTENERS ***/
window.onload = function () {
    document.getElementById('clock_div').addEventListener('click', function () {
        start();
    });
};