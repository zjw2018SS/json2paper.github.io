window.onbeforeunload = function (e) {
    localStorage.clear()
}

g_file = './json/'
get_path()
let search_input = document.getElementById("search_input")
var url = location.search
if (url.match(/\?name=.*&path=.*$/)) {
    let container_find_debounce = debounce(container_find, 200)
    search_input.addEventListener("input", container_find_debounce)

} else {
    let bookshelf_find_debounce = debounce(bookshelf_find, 200)
    search_input.addEventListener("input", bookshelf_find_debounce)
}
function unfind() {
    document.getElementById("search_input").value = ""
    if (url.match(/\?name=.*&path=.*$/)) {
        let container = document.getElementById("container")
        let a_div = container.getElementsByClassName("a_div")
        for (let i = 0; i < a_div.length; i++) {
            let a_div_each = a_div[i]
            a_div_each.style.display = "block"
        }
    } else {
        let bookshelf = document.getElementById("bookshelf")
        let book_div = bookshelf.getElementsByClassName("book_div")
        for (let i = 0; i < book_div.length; i++) {
            let book_div_each = book_div[i]
            book_div_each.style.display = "block"
        }
    }

}
function bookshelf_find() {
    let match_num = 0
    let search_input = document.getElementById("search_input")
    let search_value = search_input.value
    let bookshelf = document.getElementById("bookshelf")
    let book = bookshelf.getElementsByClassName("book")
    if (search_value == "") {
        for (let i = 0; i < book.length; i++) {
            let book_each = book[i]
            book_each.parentNode.style.display = "block"
        }
        return
    }
    for (let i = 0; i < book.length; i++) {
        let book_each = book[i]
        // console.log(book_each.innerText, search_value);
        // 1.字符匹配率（正向，反向）
        let match_raw_rate = strSimilarity2Percent([book_each.innerText, search_value], [0, 0])
        let match_processed_rate = strSimilarity2Percent([book_each.innerText.replace(/大.[上下中末始] /, ""), search_value], [0, 0])
        // 2.正则表达式原始字符匹配（正向，反向）
        let reg_raw_forward = book_each.innerText.match(search_value)
        let reg_raw_back = search_value.match(book_each.innerText)
        // 2.正则表达式删减字符匹配（正向，反向）
        let reg_processed_forward = book_each.innerText.replace(/大.[上下中末始] /, "").match(search_value)
        let reg_processed_back = search_value.match(book_each.innerText.replace(/大.[上下中末始] /, ""))
        /*      match() 方法将字符串与正则表达式进行匹配。
                提示：如果搜索值为字符串，则转换为正则表达式。
                match() 方法返回包含匹配项的数组。
                如果未找到匹配项，则 match() 方法返回 null。 */

        // console.log(match_raw_rate, match_processed_rate, reg_raw_forward, reg_raw_back, reg_processed_forward, reg_processed_back)
        if (match_raw_rate >= 0.5 || match_processed_rate > 0.5 || reg_raw_forward != null || reg_raw_back != null || reg_processed_forward != null || reg_processed_back != null) {
            match_num += 1
            book_each.parentNode.style.display = "block"

        } else {
            book_each.parentNode.style.display = "none"
        }
    }
    if (match_num == 0) {

        for (let i = 0; i < book.length; i++) {
            let book_each = book[i]
            book_each.parentNode.style.display = "block"
        }
    }
}

function container_find() {
    let match_num = 0
    let search_input = document.getElementById("search_input")
    let search_value = search_input.value
    let container = document.getElementById("container")
    let a_tag = container.getElementsByClassName("a_tag")
    if (search_value == "") {
        for (let i = 0; i < a_tag.length; i++) {
            let a_tag_each = a_tag[i]
            a_tag_each.parentNode.style.display = "block"
        }
        return
    }
    for (let i = 0; i < a_tag.length; i++) {
        let a_tag_each = a_tag[i]
        // console.log(a_tag_each.innerText, search_value);
        // 1.字符匹配率（正向，反向）
        let match_raw_rate = strSimilarity2Percent([a_tag_each.innerText, search_value], [0, 0])
        let match_processed_rate = strSimilarity2Percent([a_tag_each.innerText.replace(/\d+=> /, ""), search_value], [0, 0])
        // 2.正则表达式原始字符匹配（正向，反向）
        let reg_raw_forward = a_tag_each.innerText.match(search_value)
        let reg_raw_back = search_value.match(a_tag_each.innerText)
        // 2.正则表达式删减字符匹配（正向，反向）
        let reg_processed_forward = a_tag_each.innerText.replace(/\d+=> /, "").match(search_value)
        let reg_processed_back = search_value.match(a_tag_each.innerText.replace(/\d+=> /, ""))
        /*      match() 方法将字符串与正则表达式进行匹配。
                提示：如果搜索值为字符串，则转换为正则表达式。
                match() 方法返回包含匹配项的数组。
                如果未找到匹配项，则 match() 方法返回 null。 */

        // console.log(match_raw_rate, match_processed_rate, reg_raw_forward, reg_raw_back, reg_processed_forward, reg_processed_back)
        if (match_raw_rate >= 0.85 || match_processed_rate > 0.85 || reg_raw_forward != null || reg_raw_back != null || reg_processed_forward != null || reg_processed_back != null) {
            match_num += 1
            a_tag_each.parentNode.style.display = "block"

        } else {
            a_tag_each.parentNode.style.display = "none"
        }
    }
    if (match_num == 0) {

        for (let i = 0; i < a_tag.length; i++) {
            let a_tag_each = a_tag[i]
            a_tag_each.parentNode.style.display = "block"
        }
    }
}

let container = document.getElementById("container")

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
        let container = document.getElementById("container")
        container.id = "container"
        container.style.display = "block"

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
    } else {

        // 创建一个新的XMLHttpRequest对象
        var xhr = new XMLHttpRequest();
        // 设置请求方法和URL
        xhr.open('GET', g_file + "dir_info.json", true);
        // 注册一个回调函数，当请求完成时执行
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 400) {
                // 请求成功，解析JSON数据
                var data = JSON.parse(xhr.responseText);
                let local_file = {
                    "name": "从本地json文件开始",
                    "path": "",
                }
                var json = []
                json.push(local_file)
                json.push(...data);
                let bookshelf = document.getElementById("bookshelf")
                for (let i = 0; i < json.length; i++) {
                    let book_div = document.createElement("div")
                    let book_a = document.createElement("a")
                    book_a.className = "book_a"
                    book_a.target = "_blank"
                    book_a.style.display = "block"
                    book_a.style.height = "100%"
                    book_a.style.width = "100%"
                    book_a.style.zIndex = "9"
                    var href = window.location.href;
                    if (!json[i]["path"] == "") {
                        book_a.href = href + "?name=" + json[i]["name"] + "&path=" + json[i]["path"]
                    } else {
                        book_a.href = "/exercise.html"
                    }

                    book_div.className = "book_div"
                    book_div.innerHTML = `<div class="book">${json[i]["name"]}</div>`
                    book_div.append(book_a)
                    bookshelf.append(book_div)
                    // 😄网络题目、免费的、没有学分、没有对错、没有问答、没有考试、想来就来、想去就去。欢迎带你的朋友、伙伴一起来。 
                    // 马原（3）+习思想（3）=病理（4）+医学分子生物学D(1) + 大学体育4(1)
                }
                // let message = "较大更新，出问题及时反馈，谢谢。<hr style='border:1px solid white'>课程和作业的搜索功能完善，多种算法加持，快去点击顶部的搜索框体验吧。<hr style='border:1px solid white'>  <a href='demo.html' target='_blank'>查看教程</a>&nbsp; &nbsp;&nbsp;<a href='course.html' style='color:blue' target='_blank'>课程学分</a> &nbsp; <a href='https://f.wps.cn/g/zMpvWD5Q' target='_blank'>问题反馈</a>"
                let message = "较大更新，出问题及时反馈，谢谢。<hr style='border:1px solid white'>课程和作业的搜索功能完善，多种算法加持，快去点击顶部的搜索框体验吧。<hr style='border:1px solid white'>  <a href='demo.html' target='_blank'>查看教程</a>&nbsp; &nbsp<a href='course.html' style='color:blue' target='_blank'>课程学分</a>&nbsp; &nbsp; <a href='dream.html' style='color:blue' target='_blank'>到梦学分</a>&nbsp; &nbsp;<a href='https://f.wps.cn/g/zMpvWD5Q' target='_blank'>问题反馈</a>"
                setTimeout(() => {
                    notie.alert({
                        type: 1,
                        text: message,
                        stay: true,
                        time: 5,
                        position: "bottom"
                    })
                }, 2000)
            } else {
                swal({
                    title: "请求的文件溜走了---",
                    text: "不要检查您的网络，就是网站的原因~~",
                    icon: "error",
                })
                // 请求失败，打印错误信息
                console.error('请求失败，状态码：' + xhr.status);
            }
        };
        // 发送请求
        xhr.send();
    }
}
function json2path(json) {
    if (json == null || json == []) { return }
    let container = document.getElementById("container")
    var str = ''
    for (let i = 0; i < json.length; i++) {
        let a_div = document.createElement("div")
        a_div.className = "a_div"
        let a = document.createElement("a")
        a.className = "a_tag"
        let name = json[i]["name"]
        a.innerText = i + 1 + "=>" + " " + extractBeforeMatch(name)
        let path = json[i]["path"];
        str = path.join("@")
        a.href = "./exercise.html?name=" + json[i]["name"] + "&path=" + str
        a.target = "_blank"
        a_div.append(a)
        container.append(a_div)
    }
}
function extractBeforeMatch(str) {
    var regex = /-\d+年\d+月\d+日\d+小时\d+分\d+秒\.json/;
    var matchResult = str.match(regex);
    if (matchResult == null) {
        if (str.match(/\.json/) != null) return str.replace(/\.json/, "")
        return str
    } else {
        return str.replace(matchResult, "")
    }
}


// js匹配两个字符串
function strSimilarity2Number([s, t], [s_re, t_re]) {
    // console.log(s, t, s_re, t_re)
    if (s_re !== 0) {
        s_re = new RegExp(s_re, "mg")
        // console.log(s,s_re)
        s = s.replace(s_re, "")
        // console.log(s)
    }
    if (t_re !== 0) {
        t_re = new RegExp(t_re, "mg")
        t = t.replace(t_re, "")
        // console.log(t)
    }

    var n = s.length, m = t.length, d = [];
    var i, j, s_i, t_j, cost;
    if (n == 0) return m;
    if (m == 0) return n;
    for (i = 0; i <= n; i++) {
        d[i] = [];
        d[i][0] = i;
    }
    for (j = 0; j <= m; j++) {
        d[0][j] = j;
    }
    for (i = 1; i <= n; i++) {
        s_i = s.charAt(i - 1);
        for (j = 1; j <= m; j++) {
            t_j = t.charAt(j - 1);
            if (s_i == t_j) {
                cost = 0;
            } else {
                cost = 1;
            }
            d[i][j] = Minimum(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        }
    }
    return d[n][m];
}
//两个字符串的相似程度，并返回相似度百分比
function strSimilarity2Percent([s, t], [s_re = 0, t_re = 0]) {
    var l = s.length > t.length ? s.length : t.length;
    var d = strSimilarity2Number(...arguments);
    return (1 - d / l).toFixed(4);
}
function Minimum(a, b, c) {
    return a < b ? (a < c ? a : c) : (b < c ? b : c);
}