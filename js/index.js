
g_file = './json/'


function find() {

    let searchVal = document.getElementById("search_input").value
    unfind()
    if (searchVal == "") {
        return
    }
    var oDiv = document.getElementById("bookshelf");
    var sText = oDiv.innerHTML;
    var reg1 = /<script[^>]*>(.|\n)*<\/script>/gi; //去掉script标签 
    sText = sText.replace(reg1, "");
    var bgColor = bgColor || "orange";
    var num = -1;
    var rStr = new RegExp(searchVal, "gi"); //匹配传入的搜索值不区分大小写 i表示不区分大小写，g表示全局搜索
    var rHtml = new RegExp("\<.*?\>", "ig");//匹配html元素
    var aHtml = sText.match(rHtml); //存放html元素的数组
    var arr = sText.match(rStr);
    a = -1;
    sText = sText.replace(rHtml, '{~}');  //替换html标签
    sText = sText.replace(rStr, function () {
        a++;
        return "<span name='addSpan' class='highlight'</span>" + arr[a] + "</span>"
    }); //替换key
    sText = sText.replace(/{~}/g, function () {  //恢复html标签
        num++;
        return aHtml[num];
    });
    oDiv.innerHTML = sText;
    document.getElementById("search_input").value = searchVal
}
// https://blog.csdn.net/weixin_44058725/article/details/116274575
var find_debounce = debounce(find, 500)
let search_input = document.getElementById("search_input")
search_input.addEventListener("input", find_debounce)


function unfind() {
    document.getElementById("search_input").value = ""
    // let searchVal = document.getElementById("search_input").value
    var oDiv = document.getElementsByTagName("body")[0];
    var old_highlight = oDiv.getElementsByClassName("highlight")
    for (let i = 0; i < old_highlight.length; i++) {
        let item = old_highlight[i]
        let v = item.innerText
        let parent = item.parentNode
        let pHtml = parent.innerText
        parent.innerText = pHtml
    }
}

// 防抖函数
function debounce(fn, duration = 200) {
    let timer
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn(...args)
        }, duration)
    }
}


function truncateString(str, targetChar) {
    const index = str.indexOf(targetChar);
    if (index !== -1) {
        return str.substring(index);
    }
    return str;
}



function get_path() {
    var url = location.search
    if (url.match(/\?name=.*&path=.*$/)) {
        let bookshelf = document.getElementById("bookshelf")
        bookshelf.style.display = "none"
        const queryString = truncateString(url, "?");
        const params = queryString.split('&');
        let name, path;
        params.forEach(param => {
            const [key, value] = param.split('=');
            if (key === '?name') {
                name = decodeURIComponent(value);
            } else if (key === 'path') {
                path = decodeURIComponent(value);
            }
        });
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", path + "/path_info.json")

        xmlhttp.send()
        xmlhttp.onload = function () {
            if (xmlhttp.status >= 200 && xmlhttp.status < 400) {
                // 请求成功，解析JSON数据
                if (xmlhttp.responseText != "" && xmlhttp.responseText != [] && xmlhttp.responseText != "[]") {
                    let json = JSON.parse(xmlhttp.responseText);
                    json2path(json)
                } else {
                    swal({
                        title: "该课程暂时没有题目。",
                        text: "又出错了...",
                        icon: "error",
                    })
                }

            }
        }
    }
}

get_path()

// 创建一个新的XMLHttpRequest对象
var xhr = new XMLHttpRequest();

// 设置请求方法和URL
xhr.open('GET', g_file + "dir_info.json", true);

// 注册一个回调函数，当请求完成时执行
xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 400) {
        // 请求成功，解析JSON数据
        var data = JSON.parse(xhr.responseText);
        const json = data;
        let bookshelf = document.getElementById("bookshelf")
        for (let i = 0; i < json.length; i++) {
            let book_div = document.createElement("div")
            let book_a = document.createElement("a")
            book_a.className = "book_a"
            book_a.target = "_blank"
            book_a.style.display = "block"
            book_a.style.height = "100%"
            book_a.style.width = "100%"
            var href = window.location.href;
            book_a.href = href + "?name=" + json[i]["name"] + "&path=" + json[i]["path"]

            // book_div.addEventListener("click", function () {
            //     window.open(href + "?name=" + json[i]["name"] + "&path=" + json[i]["path"])
            // })
            book_div.className = "book_div"
            book_div.innerHTML = `<div class="book">${json[i]["name"]}</div>`
            book_div.append(book_a)
            bookshelf.append(book_div)
        }
    } else {
        // 请求失败，打印错误信息
        console.error('请求失败，状态码：' + xhr.status);
    }
};

// 发送请求
xhr.send();

function json2path(json) {
    if (json == null || json == []) { return }
    let container = document.getElementById("container")
    var str = ''
    for (let i = 0; i < json.length; i++) {
        let a_div = document.createElement("div")
        a_div.className = "a_div"
        let a = document.createElement("a")
        a.innerText = json[i]["name"]
        let path = json[i]["path"];
        str = path.join("@")
        a.href = "./exercise.html?name=" + json[i]["name"] + "&path=" + str
        a.target = "_blank"
        a_div.append(a)
        container.append(a_div)
    }
}


// const books53re = ["《诊断学》", "《肿瘤学概论》", "《医患沟通》", "《急诊与灾难医学》", "《麻醉学》", "《全科医学概论》", "《医学导论》", "《卫生法》", "《医学文献检索与论文写作》", "《康复医学》", "《临床流行病学与循证医学》", "《医学伦理学》", "《医学统计学》", "《临床药理学》", "《医学遗传学》", "《医学细胞生物学》", "《体育》", "《医学计算机应用》", "《中医学》", "《预防医学》", "《卫生学》", "《流行病学》", "《核医学》", "《皮肤性病学》", "《口腔科学》", "《耳鼻咽喉头颈外科学》", "《眼科学》", "《传染病学》", "《精神病学》", "《儿科学》", "《妇产科学》", "《外科学》", "《内科学》", "《医学影像学》", "《诊断学》", "《法医学》", "《医学心理学》", "《药理学》", "《病理生理学》", "《病理学》", "《医学免疫学》", "《人体寄生虫学》", "《医学微生物学》", "《生理学》", "《生物化学与分子生物学》", "《组织学与胚胎学》", "《局部解剖学》", "《系统解剖学》", "《医学生物学》", "《有机化学》", "《基础化学》", "《医学物理学》", "《医用高等数学》"]



