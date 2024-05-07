window.onbeforeunload = function (e) {
    localStorage.clear()
}
json = ""
json_new = {}
window.addEventListener("scroll", left_scroll_fun)

let main_div = document.getElementById("main")
function left_scroll_fun() {
    // 1.移除
    let sheet_li_show = document.getElementsByClassName("sheet_li_show")
    if (sheet_li_show.length != 0) {
        sheet_li_show[0].classList.remove("sheet_li_show")
    }

    // 2.添加
    let wrap = document.getElementsByClassName("wrap")
    let top = document.documentElement.scrollTop + window.innerHeight / 2
    for (let i = 0; i < wrap.length - 1; i++) {
        if (wrap[i].offsetTop <= top && wrap[i + 1].offsetTop > top) {
            let index = i
            let sheet_li = document.getElementsByClassName("sheet_li")
            sheet_li[index].classList.add("sheet_li_show")
            break;
        }

    }
}
// 防抖函数
// function debounce(fn, duration = 500) {
//     let timer
//     return function (...args) {
//         clearTimeout(timer)
//         timer = setTimeout(() => {
//             fn(...args)
//         }, duration)
//     }
// }
function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.log('error：not a json!!!');
            return false;
        }
    }
    console.log('It is not a string!')
}

let new_read_json = document.getElementById("new_read_json")
new_read_json.addEventListener("click", new_reader)
async function new_reader() {
    let is_new_reader = await swal({
        title: "Are you sure?",
        text: "读取新的json文件将覆盖你以前的内容！",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    if (is_new_reader) {


        let sheet = document.getElementById("sheet")
        sheet.style.display = "none"

        let main = document.getElementById("main")
        while (main.children.length > 2) {
            main.removeChild(main.lastChild)
        }
        let sheet_wrap = document.getElementById("sheet_wrap")
        sheet_wrap.innerHTML = ""
        let drop_box = document.getElementById("drop_box")
        drop_box.style.display = "block"
        let drop_dir_box = document.getElementById("drop_dir_box")
        drop_dir_box.style.display = "block"

        let back_top = document.getElementById("back_top")
        back_top.style.visibility = "hidden"

        // 导航栏的题目数量
        let json_all_num = document.getElementById("json_all_num")
        json_all_num.innerHTML = `&nbsp;&nbsp;&nbsp;`
        removeEventListener_main_click_and_is_submit()
        addEventListener_main_click_and_is_submit()
    }
}

let file_input = document.getElementById("file_input")
file_input.addEventListener("input", read_file)
function read_file(e) {
    let file_name = e.target.files[0].name
    let file_type = file_name.split('.').slice(-1)[0].toLowerCase();
    if (file_type == "json") {
        let file = e.target.files[0]
        let file_reader = new FileReader()
        file_reader.readAsText(file)
        file_reader.onload = (event) => {
            let content = event.target.result
            if (isJSON(content)) {
                json = JSON.parse(content)
                json2paper(json)
            }
        }
    }
}

// 文件夹
let dir_input = document.getElementById("dir_input")
dir_input.addEventListener("input", read_dir)
function read_dir(dir_input) {
    var json_temp = {
        "head": {},
        "body": []
    }
    let dir = dir_input.target.files

    // console.log(dir)
    for (let i = 0; i < dir.length; i++) {
        let file_reader = new FileReader()
        let file = dir[i]
        let file_name = file.name
        let file_type = file_name.split('.').slice(-1)[0].toLowerCase();
        if (file_type != "json") {
            continue
        }
        file_reader.readAsText(file)
        file_reader.onload = (event) => {
            let content = event.target.result
            if (isJSON(content)) {
                json_each = JSON.parse(content)
                if (i == 0) {
                    json_temp["head"] = json_each["head"]
                }
                json_temp["body"].push(...json_each["body"])
                if (i == dir.length - 1) {
                    json = json_temp
                    json2paper(json)
                }
            }
        }
    }
}

function main_click(e) {
    // console.log(e.target)
    if (e.target.classList.contains("option_wrap") || e.target.classList.contains("option_code") || e.target.classList.contains("option")) {
        // 题型索引
        let order = e.target.getAttribute("data-order")
        // 全局索引
        let index = e.target.getAttribute("data-index")
        // 选项字母
        let option_code = e.target.dataset.optionCode
        // 通过索引获取wrap单位
        let wrap = document.getElementsByClassName("wrap")[index]
        let type_code = wrap.dataset.typeCode
        // 原来的选择字母
        let answer_my = wrap.dataset.answerMy
        // 原来的选择字母元素
        let answers_matching_index_new = wrap.dataset.answersMatchingIndexNew
        // 获取答题卡li元素
        let sheet_li = document.getElementsByClassName("sheet_li")[index]
        // console.log(sheet_li)
        // 选择逻辑

        if (type_code == 1 || type_code == 3) {
            // 单选和判断
            // console.log(typeof answer_my, answer_my)
            if (answer_my) {
                answer_my = JSON.parse(answer_my).toString()
            }
            let option_code_index = option_code.charCodeAt(0) - 65
            if (answer_my.length != 0 && answer_my.indexOf(option_code_index) > -1) {
                // 选项一样的答案
                wrap.dataset.answerMy = "[]"
                let option_back = wrap.getElementsByClassName("option_code")[option_code_index]
                option_back.classList.remove("checked")
                // 答题卡样式
                sheet_li.classList.remove("checked")
            } else if (answer_my.length != 0) {
                // 选择一个新的答案
                wrap.dataset.answerMy = "[" + option_code_index + "]"
                // 颜色取消显示
                let option_back = wrap.getElementsByClassName("option_code")[answer_my[0]]
                option_back.classList.remove("checked")
                let option_new = wrap.getElementsByClassName("option_code")[option_code_index]
                option_new.classList.add("checked")
                // 答题卡样式
            } else if (answer_my.length == 0) {
                // 之前没有选择答案
                wrap.dataset.answerMy = "[" + option_code_index + "]"
                let option_new = wrap.getElementsByClassName("option_code")[option_code_index]
                option_new.classList.add("checked")
                // 答题卡样式
                sheet_li.classList.add("checked")
            }


        } else if (type_code == 2) {
            // 多选题
            // console.log(answer_my, answer_my.length)
            if (answer_my) {
                answer_my = JSON.parse(answer_my)
            }
            let option_code_index = option_code.charCodeAt(0) - 65
            // console.log(answer_my, option_code)
            if (answer_my.length != 0 && answer_my.indexOf(option_code_index) > -1) {
                // 选项一样的答案
                answer_my.splice(answer_my.indexOf(option_code_index), 1)
                wrap.dataset.answerMy = JSON.stringify(answer_my)
                let option_back = wrap.getElementsByClassName("option_code")[option_code_index]
                option_back.classList.remove("checked")
                // 答题卡样式
                if (answer_my.length == 0) {
                    sheet_li.classList.remove("checked")
                }
            } else if (answer_my.length != 0) {
                // 选择一个新的答案
                answer_my.push(option_code_index)
                wrap.dataset.answerMy = JSON.stringify(answer_my)
                let option_new = wrap.getElementsByClassName("option_code")[option_code_index]
                option_new.classList.add("checked")
            } else if (answer_my.length == 0) {
                wrap.dataset.answerMy = "[" + option_code_index + "]"
                let option_new = wrap.getElementsByClassName("option_code")[option_code_index]
                option_new.classList.add("checked")
                // 答题卡样式
                sheet_li.classList.add("checked")
            }

        }

    }
}


async function is_submit() {
    let is_submit_result = await swal({
        title: "Are you sure?",
        text: "提交之后无法再次提交！",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    // 在弹窗关闭后执行的代码
    if (is_submit_result) {
        submit()
    } else {
        // console.log("取消提交")
    }
}
// 是否收藏逻辑
let mian = document.getElementById("main")
mian.addEventListener("click", is_favourite_fun)


function is_favourite_fun(e) {
    if (e.target.classList.contains("favourite")) {
        var favourite = e.target
        var wrap = favourite.parentNode.parentNode
    } else if (e.target.parentNode.classList.contains("favourite")) {
        var favourite = e.target.parentNode
        var wrap = favourite.parentNode.parentNode
    } else {
        return 0
    }
    let index = wrap.dataset.index
    let sheet_li = document.getElementsByClassName("sheet_li")[index]
    if (wrap.dataset.isFavourite == "0") {
        wrap.dataset.isFavourite = "1"
        sheet_li.dataset.isFavourite = "1"
        favourite.classList.add("favourite_active")
        sheet_li.classList.add("favourite_active")
    } else if (wrap.dataset.isFavourite == "1") {
        wrap.dataset.isFavourite = "0"
        sheet_li.dataset.isFavourite = "0"
        sheet_li.classList.remove("favourite_active")
        favourite.classList.remove("favourite_active")
    }

}

function submit() {
    removeEventListener_main_click_and_is_submit()
    let wrap = document.getElementsByClassName("wrap")
    let sheet_wrap = document.getElementById("sheet_wrap")

    correct_num = 0
    wrong_num = 0

    for (let i = 0; i < wrap.length; i++) {
        let order = i
        let wrap_each = document.getElementsByClassName("wrap")[order]
        let q = wrap_each.getElementsByClassName("q")[0]
        let options_wrap = wrap_each.getElementsByClassName("options_wrap")[0]
        let type_code = wrap_each.dataset.typeCode
        let answer_my = wrap_each.dataset.answerMy
        let answer_my_div = wrap_each.getElementsByClassName("answer_my")[0]
        let answer_true_display = wrap_each.getElementsByClassName("answer_true_display")[0]
        input_str = ""
        let input = wrap_each.getElementsByClassName("input")
        for (let x = 0; x < input.length; x++) {
            input_str = input_str + input[x].value
        }
        let sheet_li = sheet_wrap.getElementsByClassName("sheet_li")[order]
        if (!answer_my && !input_str) {
            is_answer_true = false
            answer_true_display_fun(is_answer_true, sheet_li, answer_my_div, answer_true_display, wrap_each)
            let answers_matching_index_new = wrap_each.dataset.answersMatchingIndexNew
            answers_matching_index_new = JSON.parse(answers_matching_index_new)
            answers_matching_index_new.sort()
            option_true_display_fun(options_wrap, answers_matching_index_new)

        } else {
            if (type_code == 1 || type_code == 2 || type_code == 3) {
                answer_my = JSON.parse(answer_my)
                answer_my.sort()
                let answer_my_div = wrap_each.getElementsByClassName("answer_my")[0]
                for (let j = 0; j < answer_my.length; j++) {
                    answer_my_div.innerText = answer_my_div.innerText + String.fromCharCode(answer_my[j] + 65)
                }
                answer_my = answer_my.toString()

                let answers_matching_index_new = wrap_each.dataset.answersMatchingIndexNew
                answers_matching_index_new = JSON.parse(answers_matching_index_new)
                answers_matching_index_new.sort()
                answers_matching_index_new_ = answers_matching_index_new.toString()

                if (answers_matching_index_new_ == answer_my) {
                    is_answer_true = true
                } else {
                    is_answer_true = false
                }
                answer_true_display_fun(is_answer_true, sheet_li, answer_my_div, answer_true_display, wrap_each)
                option_true_display_fun(options_wrap, answers_matching_index_new)

            } else if (type_code == 4 || type_code == 5) {
                let input = wrap_each.getElementsByClassName("input")
                let answers = wrap_each.dataset.answers
                answers = JSON.parse(answers)
                flag = true
                for (let i = 0; i < input.length; i++) {
                    if (input[i].value == answers[i]) {
                    } else {
                        flag = false
                    }
                }
                let is_answer_true = flag
                answer_true_display_fun(is_answer_true, sheet_li, answer_my_div, answer_true_display, wrap_each)
            }
        }
    }
    let answer_wrap = document.getElementsByClassName("answer_wrap")
    Array.from(answer_wrap).forEach((e) => {
        e.style.display = "block"
    })

    let analysis = document.getElementsByClassName("analysis")
    Array.from(analysis).forEach((e) => {
        let analysis_content = e.dataset.analysisContent
        if (analysis_content == 1) {
            e.style.display = "block"
        }
    })
    // 正确答案是否隐藏
    let answer_true = document.getElementsByClassName("answer_true")
    let is_hide_answer_true_input = document.getElementById("is_hide_answer_true")
    let is_hide_answer_true = is_hide_answer_true_input.dataset.isHideAnswerTrue

    // console.log(is_hide_answer_true)
    if (is_hide_answer_true == "1") {
        Array.from(answer_true).forEach((e) => {
            e.classList.add("answer_true_hide")
        })
    } else if (is_hide_answer_true == "0") {
        Array.from(answer_true).forEach((e) => {
            e.classList.remove("answer_true_hide")
        })
    }

    // 自动展开设置
    let is_auto_unfold_setting_input = document.getElementById("is_auto_unfold_setting")
    let is_auto_unfold_setting = is_auto_unfold_setting_input.dataset.isAutoUnfoldSetting
    if (is_auto_unfold_setting == "1") {
        let setting_icon_div = document.getElementById("setting_icon_div")
        setting_icon_div.click()
    }

    swal({
        title: "恭喜您！",
        text: `答对${correct_num}道题，答错${wrong_num}道题，正确率${(correct_num / (correct_num + wrong_num) * 100).toFixed(2)}%。`,
        icon: "success",
    })
}

function option_true_display_fun(options_wrap, answers_matching_index_new) {
    let option_wrap_arr = options_wrap.getElementsByClassName("option_wrap")
    for (let i = 0; i < answers_matching_index_new.length; i++) {
        let index = answers_matching_index_new[i]
        option_wrap_arr[index].classList.add("option_right")
    }

}

function answer_true_display_fun(is_answer_true, sheet_li, answer_my, answer_true_display, wrap_each) {
    if (is_answer_true) {
        wrap_each.dataset.isAnswerTrue = "1"
        sheet_li.style.backgroundColor = "green"
        sheet_li.dataset.isAnswerTrue = "1"
        correct_num += 1
        answer_my.style.color = "#00B86E"
        answer_true_display.classList.add("answer_true_display_correct")
    } else {
        wrap_each.dataset.isAnswerTrue = "0"
        sheet_li.dataset.isAnswerTrue = "1"
        sheet_li.style.backgroundColor = "rgb(255 0 0 / 87%)"
        wrong_num += 1
        answer_my.style.color = "rgb(255 0 0 / 87%)"
        answer_true_display.classList.add("answer_true_display_wrong")
    }
}
function get_json_num(json) {
    let json_num = document.getElementById("json_num").value

    let json_all_num = document.getElementById("json_all_num")
    json_all_num.innerText = json.length

    // console.log(json)
    if (json_num >= json.length || json_num <= 0) {
        let json_num = json.length
        return json_num
    }
    return json_num


}
// js从数组中随机抽取n个元素构成新数组
function getRandomElementsFromArray(arr, n) {
    // console.log(arr)
    // 先确保 n 不超过数组的长度
    n = Math.min(n, arr.length);

    // 复制数组以避免修改原始数组
    const shuffledArray = arr.slice();

    // 使用 Fisher-Yates 算法对数组进行洗牌
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    // 从洗牌后的数组中截取前 n 个元素
    const resultArray = shuffledArray.slice(0, n);

    return resultArray;
}

function shuffle(arr) {
    let i = arr.length;
    while (i) {
        let j = Math.floor(Math.random() * i--);
        [arr[j], arr[i]] = [arr[i], arr[j]];
    }
    return arr;
}
// 深拷贝
function deepCopy(arr) {
    return arr.map(item => Array.isArray(item) ? deepCopy(item) : item);
}
function string_to_name(string, value) {
    let _name = string + "=" + value
    eval(_name)
    return _name
}

let url = location.search

function json_create_original_index(json) {
    var json_body = json["body"]
    for (let i = 0; i < json_body.length; i++) {
        // 创建唯一原始索引,方便查找
        json_body[i]["original_index"] = i
    }
    json["head"]["create_original_index"] = "1"
}


function json2paper(json, is_order = "0") {
    // console.log("json2paper", json)

    clear_old_paper_sheet()
    if (json["head"]["create_original_index"] != "1") {
        json_create_original_index(json)
    }
    var json_body = json["body"]
    let drop_box = document.getElementById("drop_box")
    drop_box.style.display = "none"

    let sheet = document.getElementById("sheet")
    sheet.style.visibility = "hidden"
    sheet.style.display = "block"

    json_body = sort_json(json_body, is_order)
    let type_code_2_type = {
        "1": "单选题",
        "2": "多选题",
        "3": "判断题",
        "4": "填空题",
        "5": "简答题",
        "6": "自定义",
    }
    let type_code_123456 = ["一.", "二.", "三.", "四.", "五.", "六."]
    var timer = 0
    let main_div = document.getElementById("main")
    let sheet_wrap = document.getElementById("sheet_wrap")
    // 全局索引
    let index = 0
    for (let i = 1; i < 7; i++) {
        if (json_body[i] == 0) {
            continue
        }
        timer++
        // 答题卡的
        let sheet_type_div = document.createElement("div")
        sheet_type_div.className = "sheet_type_div"
        sheet_type_div.dataset.sheetTypeNum = json_body[i].length
        sheet_type_div.dataset.sheetTypeCode = i
        sheet_type_div.dataset.isDisplay = "1"
        sheet_type_div.innerHTML = type_code_123456[timer - 1] + type_code_2_type[i] + "（共" + json_body[i].length + "个）"

        // 主页面的
        let wrap_type_div = document.createElement("div")
        wrap_type_div.className = "wrap_type_div"
        wrap_type_div.dataset.wrapTypeNum = json_body[i].length
        wrap_type_div.dataset.typeCode = i
        wrap_type_div.dataset.isDisplay = "1"
        wrap_type_div.innerHTML = type_code_123456[timer - 1] + type_code_2_type[i] + "（共" + json_body[i].length + "个）"
        main_div.append(wrap_type_div)

        let ul = document.createElement("ul")
        ul.className = "sheet_ul ul_" + i

        for (let j = 0; j < json_body[i].length; j++) {
            let order = j
            let wrap = main(json_body[i][order], order, index, is_order)[0]
            main_div.append(wrap)
            let sheet_li = main(json_body[i][order], order, index, is_order)[1]
            ul.appendChild(sheet_li)
            index = index + 1
        }


        sheet_wrap.appendChild(sheet_type_div)
        sheet_wrap.appendChild(ul)
    }

    addEventListener_main_click_and_is_submit()
}


function back_top_fun(e) {
    document.documentElement.scrollTop = 0
}



/**
 *对题目类型排序，乱序
 *
 *传入的是全局变量json的body中的索引
 * @param {arr} json_body_arr
 * 
 * @returns {arr} json_body_arr_new
 * @description 
 */


function sort_json(json_body_arr, is_order) {
    // console.log(json_body_arr)
    let temp_arr = {
        "1": [],
        "2": [],
        "3": [],
        "4": [],
        "5": [],
        "6": []
    }
    let json_body_arr_new = []

    var json_num = get_json_num(json_body_arr)
    if (is_order == "0") {
        var json_body_arr = getRandomElementsFromArray(json_body_arr, json_num)
        for (let index = 0; index < json_body_arr.length; index++) {
            let type_code = json_body_arr[index]["type_code"]
            temp_arr[type_code].push(json_body_arr[index])
        }
        for (let i = 1; i < 7; i++) {
            // 题目乱序,排序
            // json_body_arr_new = [...json_body_arr_new, ...shuffle(temp_arr[i])]
            temp_arr[i] = shuffle(temp_arr[i])
        }
    } else if (is_order == "1") {
        for (let index = 0; index < json_body_arr.length; index++) {
            let type_code = json_body_arr[index]["type_code"]
            temp_arr[type_code].push(json_body_arr[index])
        }
    }
    json_body_arr_new = temp_arr
    return json_body_arr_new
}






let xmlhttp = new XMLHttpRequest()
xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        if (xmlhttp.responseText) {
            json = JSON.parse(xmlhttp.responseText)
            json2paper(json)
        }
    }
}
if (url.match(/\?path=/mg)) {
    let decode_url = decodeURIComponent(url.replace("?path=", ""))
    xmlhttp.open("GET", decode_url)
    xmlhttp.send()
} else if (url.match(/\?rewrite=/mg)) {
    let json_str = localStorage.getItem("json_str")
    if (json_str) {
        json = JSON.parse(json_str)
        if (json["body"] || json["body"] == "null" || json["body"] == "undefined" || json["body"] == "") {
            json2paper(json, "1")
        }
    }
} else if (url.match(/\?preview/mg)) {
    let json_str = localStorage.getItem("json_str")
    if (json_str) {
        json = JSON.parse(json_str)
        if (json["body"] || json["body"] == "null" || json["body"] == "undefined" || json["body"] == "") {
            json2paper(json, "1")
        }
    }
}



function clear_old_paper_sheet() {

    let main = document.getElementById("main")
    while (main.children.length > 2) {
        main.removeChild(main.lastChild)
    }
    let sheet = document.getElementById("sheet")
    sheet.innerHTML = `
           <div id="sheet_wrap">
        </div>
    `
    let drop_box = document.getElementById("drop_box")
    drop_box.style.display = "none"
    let drop_dir_box = document.getElementById("drop_dir_box")
    drop_dir_box.style.display = "none"
    let back_top = document.getElementById("back_top")
    // back_top.style.visibility = "visible"
    back_top.style.visibility = "hidden"
}

async function unorder_json() {
    let is_new_reader = await swal({
        title: "Are you sure?",
        text: "重新生成将覆盖您以前的内容！",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    if (is_new_reader) {
        // json = json
        json2paper(json)
        addEventListener_main_click_and_is_submit()
    }
}

async function order_json() {
    let is_new_reader = await swal({
        title: "Are you sure?",
        text: "重新生成将覆盖您以前的内容！",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    if (is_new_reader) {
        // json = json
        json2paper(json, "1")
        addEventListener_main_click_and_is_submit()
    }
}

// 设置的逻辑

let setting_icon_div = document.getElementById("setting_icon_div")
// 隐藏与样式逻辑
setting_icon_div.addEventListener("click", function () {
    let setting_div = document.getElementById("setting_div")
    let setting_show = setting_div.dataset.settingShow
    let setting_div_style = setting_div.style
    if (setting_show == "0") {
        setting_div.dataset.settingShow = "1"
        // setting_div_style.transform = "scaleY(1)"
        setting_div_style.transform = "scale(1)"
    } else if (setting_show == "1") {
        setting_div.dataset.settingShow = "0"
        // setting_div_style.transform = "scaleY(0)"
        setting_div_style.transform = "scale(0)"
    }
})


// pc和手机设置球拖动逻辑
let offsetX, offsetY; // 将 offsetX 和 offsetY 移到共同的作用域

function drag_fun(e) {
    let bar_height = 36;
    let setting_icon_div_width = 48;
    // 与边框的距离
    let distanse = 10
    let setting = document.getElementById("setting")
    let setting_icon_div = document.getElementById("setting_icon_div")
    let setting_div = document.getElementById("setting_div")
    let setting_show = setting_div.dataset.settingShow
    if (setting_show == "0") {
        var _h = window.innerHeight - (setting_icon_div.offsetHeight + distanse)
        var _w = window.innerWidth - (setting_icon_div.offsetWidth + distanse)
    } else if (setting_show == "1") {
        var _h = window.innerHeight - (setting_div.offsetHeight + distanse)
        var _w = window.innerWidth - (setting_div.offsetWidth + setting_icon_div_width + distanse)
    }
    let div_top = e.clientY - offsetY
    let div_left = e.clientX - offsetX
    div_top = Math.min(Math.max(bar_height + distanse, div_top), _h)
    div_left = Math.min(Math.max(distanse, div_left), _w)
    setting.style.top = div_top + "px"
    setting.style.left = div_left + setting_icon_div_width + "px"
}

// PC拖拽逻辑
// let setting_icon_div = document.getElementById("setting_icon_div");
// 变量上面有了
setting_icon_div.addEventListener("dragstart", function (e) {
    offsetX = e.offsetX; // 将 offsetX 和 offsetY 赋值在共同的作用域内
    offsetY = e.offsetY;

    document.addEventListener("dragover", drag_fun)
})

setting_icon_div.addEventListener("dragend", function (e) {
    document.removeEventListener("dragover", drag_fun)
})

// 手机触摸拖动逻辑
let isDragging = false;

setting_icon_div.addEventListener("touchstart", function (e) {
    isDragging = true;
    let touch = e.touches[0];
    offsetX = touch.clientX - setting_icon_div.getBoundingClientRect().left;
    offsetY = touch.clientY - setting_icon_div.getBoundingClientRect().top;
}, { passive: false });

document.addEventListener("touchmove", function (e) {
    if (isDragging) {
        e.preventDefault();
        let touch = e.touches[0];
        let setting = document.getElementById("setting");
        let bar_height = 4;
        let distanse = 4;
        let setting_icon_div_width = 48;
        let setting_div = document.getElementById("setting_div");
        let setting_show = setting_div.dataset.settingShow;
        let _h, _w;

        if (setting_show == "0") {
            _h = window.innerHeight - (setting_icon_div.offsetHeight + distanse);
            _w = window.innerWidth - (setting_icon_div.offsetWidth + distanse);
        } else if (setting_show == "1") {
            _h = window.innerHeight - (setting_div.offsetHeight + distanse);
            _w = window.innerWidth - (setting_div.offsetWidth + setting_icon_div_width + distanse);
        }

        let div_top = touch.clientY - offsetY;
        let div_left = touch.clientX - offsetX;
        div_top = Math.min(Math.max(bar_height + distanse, div_top), _h);
        div_left = Math.min(Math.max(distanse, div_left), _w);
        setting.style.top = div_top + "px";
        setting.style.left = div_left + setting_icon_div_width + "px";
    }
}, { passive: false });

document.addEventListener("touchend", function () {
    isDragging = false;
})


/* // PC拖拽逻辑
let offsetX, offsetY; // 将 offsetX 和 offsetY 移到共同的作用域

function drag_fun(e) {
    let bar_height = 36;
    let setting_icon_div_width = 48;
    // 与边框的距离
    let distanse = 20
    let setting = document.getElementById("setting")
    let setting_icon_div = document.getElementById("setting_icon_div")
    let setting_div = document.getElementById("setting_div")
    let setting_show = setting_div.dataset.settingShow
    if (setting_show == "0") {
        var _h = window.innerHeight - (setting_icon_div.offsetHeight + distanse)
        var _w = window.innerWidth - (setting_icon_div.offsetWidth + distanse)
    } else if (setting_show == "1") {
        var _h = window.innerHeight - (setting_div.offsetHeight + distanse)
        var _w = window.innerWidth - (setting_div.offsetWidth + setting_icon_div_width + distanse)
    }
    let div_top = e.clientY - offsetY
    let div_left = e.clientX - offsetX
    div_top = Math.min(Math.max(bar_height + distanse, div_top), _h)
    div_left = Math.min(Math.max(distanse, div_left), _w)
    setting.style.top = div_top + "px"
    setting.style.left = div_left + setting_icon_div_width + "px"

}

setting_icon_div.addEventListener("dragstart", function (e) {
    offsetX = e.offsetX; // 将 offsetX 和 offsetY 赋值在共同的作用域内
    offsetY = e.offsetY;

    document.addEventListener("dragover", drag_fun)
})

setting_icon_div.addEventListener("dragend", function (e) {
    document.removeEventListener("dragover", drag_fun)
})
 */
// 手机触摸拖动逻辑
/* let startTouchX, startTouchY; // 将 startTouchX 和 startTouchY 移到共同的作用域

function touchDragFun(e) {
    let bar_height = 36;
    let setting_icon_div_width = 48;
    // 与边框的距离
    let distanse = 2;
    let setting = document.getElementById("setting");
    let setting_icon_div = document.getElementById("setting_icon_div");
    let setting_div = document.getElementById("setting_div");
    let setting_show = setting_div.dataset.settingShow;

    if (setting_show == "0") {
        var _h = window.innerHeight - (setting_icon_div.offsetHeight + distanse);
        var _w = window.innerWidth - (setting_icon_div.offsetWidth + distanse);
    } else if (setting_show == "1") {
        var _h = window.innerHeight - (setting_div.offsetHeight + distanse);
        var _w = window.innerWidth - (setting_div.offsetWidth + setting_icon_div_width + distanse);
    }

    let divTop = e.touches[0].clientY - startTouchY;
    let divLeft = e.touches[0].clientX - startTouchX;
    console.log(e.touches[0].pageY, startTouchY, divTop, "----", e.touches[0].pageX, startTouchX, divLeft);

    divTop = Math.min(Math.max(bar_height + distanse, divTop), _h);
    divLeft = Math.min(Math.max(distanse, divLeft), _w);

    setting.style.top = divTop + "px";
    setting.style.left = divLeft + setting_icon_div_width + "px";
    // console.log(divTop, divLeft + setting_icon_div_width)
}

setting_icon_div.addEventListener("touchstart", function (e) {
    startTouchX = e.touches[0].pageX; // 将 startTouchX 和 startTouchY 赋值在共同的作用域内
    startTouchY = e.touches[0].pageY;

    document.addEventListener("touchmove", touchDragFun);
}, { passive: true });

setting_icon_div.addEventListener("touchend", function (e) {
    document.removeEventListener("touchmove", touchDragFun);
}); */




// 设置里面的各功能
// 1.1正确选项前显示“√”
function option_right_display(option_right_display_input) {
    let is_option_right_display = option_right_display_input.dataset.isOptionRightDisplay
    let main = document.getElementById("main")
    let option_right_display = window.getComputedStyle(main, null).getPropertyPriority("--optionRightDisplay")
    // console.log(option_right_display)
    if (is_option_right_display == "0") {
        mian.style.setProperty("--optionRightDisplay", "1")
    } else if (is_option_right_display == "1") {
        mian.style.setProperty("--optionRightDisplay", "0")
    }
    option_right_display_input.dataset.isOptionRightDisplay = 1 - is_option_right_display

}

// 1.2隐藏正确答案，鼠标悬停显示  answer_true
function is_hide_answer_true_fun(is_hide_answer_true_input) {

    let answer_true_arr = document.getElementsByClassName("answer_true")
    let is_hide_answer_true = is_hide_answer_true_input.dataset.isHideAnswerTrue
    let main = document.getElementById("main")
    if (is_hide_answer_true == "0") {
        for (let i = 0; i < answer_true_arr.length; i++) {
            let answer_true = answer_true_arr[i]
            answer_true.dataset.isShow = "1"
            answer_true.classList.add("answer_true_hide")
        }
    } else if (is_hide_answer_true == "1") {
        for (let i = 0; i < answer_true_arr.length; i++) {
            let answer_true = answer_true_arr[i]
            answer_true.dataset.isShow = "0"
            answer_true.classList.remove("answer_true_hide")
        }
    }
    is_hide_answer_true_input.dataset.isHideAnswerTrue = 1 - is_hide_answer_true

}

// 1.3提交后自动展开设置
function auto_unfold_setting_fun(is_auto_unfold_setting_input) {
    let is_auto_unfold_setting = is_auto_unfold_setting_input.dataset.isAutoUnfoldSetting
    is_auto_unfold_setting_input.dataset.isAutoUnfoldSetting = 1 - is_auto_unfold_setting
}
var elem = document.documentElement;

/* 全屏查看 */
function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari 和 Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

/* 关闭全屏 */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari 和 Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
}

// 1.4沉浸模式
function immerse_setting_fun(immerse_setting_input) {
    let is_immerse_setting = immerse_setting_input.dataset.isImmerseSetting
    let nav = document.getElementById("nav")
    let back_top = document.getElementById("back_top")
    if (is_immerse_setting == "0") {
        nav.style.display = "none"
        back_top.style.display = "none"
        openFullscreen(elem)

    } else if (is_immerse_setting == "1") {
        nav.style.display = "block"
        back_top.style.display = "block"
        closeFullscreen(elem)

    }
    immerse_setting_input.dataset.isImmerseSetting = 1 - is_immerse_setting
}
// 1.5禁止选择和复制
function copy_setting_fun(is_copy_setting_div) {
    let is_copy_setting = is_copy_setting_div.dataset.isCopySetting
    let main = document.getElementById("main")
    if (is_copy_setting == "0") {
        main.style.userSelect = "none"
    } else if (is_copy_setting == "1") {
        main.style.userSelect = "auto"
    }
    is_copy_setting_div.dataset.isCopySetting = 1 - is_copy_setting


}



// 2.题目显示
let Setting2_public_fun = {
    wrap_sheet_type_div_display_fun: function (wrap, display) {
        let type_code = wrap.dataset.typeCode
        let wrap_type_div = document.getElementsByClassName("wrap_type_div")
        let sheet_type_div = document.getElementsByClassName("sheet_type_div")
        let is_show = wrap_type_div.dataset.is_show

    },
    is_answer_true_fun: function () {
        let is_answer_true_display_input = document.getElementById("is_answer_true_display")
        let is_answer_true_display = is_answer_true_display_input.dataset.isAnswerTrueDisplay
        if (is_answer_true_display == "1") {
            is_answer_true_display_input.click()
        }
    },
    favourite_display_fun: function () {
        let is_favourite_display_input = document.getElementById("is_favourite_display")
        let is_favourite_display = is_favourite_display_input.dataset.isFavouriteDisplay
        if (is_favourite_display == "1") {
            is_favourite_display_input.click()
        }
    },
    is_answer_true_favourite_display_fun: function () {
        let is_answer_true_favourite_display_input = document.getElementById("is_answer_true_favourite_display")
        let is_answer_true_favourite_display = is_answer_true_favourite_display_input.dataset.isAnswerTrueFavouriteDisplay
        if (is_answer_true_favourite_display == "1") {
            is_answer_true_favourite_display_input.click()
        }
    }

}
function is_answer_true_fun(is_answer_true_display_input) {
    let wrap_arr = document.getElementsByClassName("wrap")

    let is_answer_true_display = is_answer_true_display_input.dataset.isAnswerTrueDisplay
    if (is_answer_true_display == "0") {
        // 仅收藏
        Setting2_public_fun.favourite_display_fun()
        // 错题 + 收藏
        Setting2_public_fun.is_answer_true_favourite_display_fun()
        for (let i = 0; i < wrap_arr.length; i++) {
            let is_answer_true = wrap_arr[i].dataset.isAnswerTrue
            if (is_answer_true == "1") {
                let wrap = wrap_arr[i]
                wrap.style.display = "none"
                let index = wrap.dataset.index
                let sheet_li = document.getElementsByClassName("sheet_li")[index]
                sheet_li.style.display = "none"
            }
        }
    } else if (is_answer_true_display == "1") {
        for (let i = 0; i < wrap_arr.length; i++) {
            let is_answer_true = wrap_arr[i].dataset.isAnswerTrue
            if (is_answer_true == "1") {
                let wrap = wrap_arr[i]
                wrap.style.display = "block"
                let index = wrap.dataset.index
                let sheet_li = document.getElementsByClassName("sheet_li")[index]
                sheet_li.style.display = "block"
            }
        }
    }
    is_answer_true_display_input.dataset.isAnswerTrueDisplay = 1 - is_answer_true_display


}

// 仅收藏显示功能

function favourite_display_fun(is_favourite_display_input) {
    let wrap_type_div = document.getElementsByClassName("wrap_type_div")
    let wrap_arr = document.getElementsByClassName("wrap")
    let is_favourite_display = is_favourite_display_input.dataset.isFavouriteDisplay
    if (is_favourite_display == "0") {
        // 仅错题
        Setting2_public_fun.is_answer_true_fun()
        // 错题 + 收藏
        Setting2_public_fun.is_answer_true_favourite_display_fun()
        for (let i = 0; i < wrap_arr.length; i++) {
            let is_favourite = wrap_arr[i].dataset.isFavourite
            if (is_favourite == "0") {
                let wrap = wrap_arr[i]
                wrap.style.display = "none"
                let index = wrap.dataset.index
                let sheet_li = document.getElementsByClassName("sheet_li")[index]
                sheet_li.style.display = "none"
            }
        }
    } else if (is_favourite_display == "1") {
        for (let i = 0; i < wrap_arr.length; i++) {
            let is_favourite = wrap_arr[i].dataset.isFavourite
            if (is_favourite == "0") {
                let wrap = wrap_arr[i]
                wrap.style.display = "block"
                let index = wrap.dataset.index
                let sheet_li = document.getElementsByClassName("sheet_li")[index]
                sheet_li.style.display = "block"
            }
        }
    }
    is_favourite_display_input.dataset.isFavouriteDisplay = 1 - is_favourite_display
}



// 错题 + 收藏
function is_answer_true_favourite_display_fun(is_answer_true_favourite_display_input) {
    let is_answer_true_favourite_display = is_answer_true_favourite_display_input.dataset.isAnswerTrueFavouriteDisplay
    let wrap_arr = document.getElementsByClassName("wrap")
    if (is_answer_true_favourite_display == "0") {
        // 仅错题
        Setting2_public_fun.is_answer_true_fun()
        // 仅收藏
        Setting2_public_fun.favourite_display_fun()
        for (let i = 0; i < wrap_arr.length; i++) {
            let is_answer_true = wrap_arr[i].dataset.isAnswerTrue
            let is_favourite = wrap_arr[i].dataset.isFavourite
            if (is_favourite == "0" && is_answer_true == "1") {
                let wrap = wrap_arr[i]
                wrap.style.display = "none"
                let index = wrap.dataset.index
                let sheet_li = document.getElementsByClassName("sheet_li")[index]
                sheet_li.style.display = "none"
            }
        }
    } else if (is_answer_true_favourite_display == "1") {
        for (let i = 0; i < wrap_arr.length; i++) {
            let is_answer_true = wrap_arr[i].dataset.isAnswerTrue
            let is_favourite = wrap_arr[i].dataset.isFavourite
            if (is_favourite == "0" && is_answer_true == "1") {
                let wrap = wrap_arr[i]
                wrap.style.display = "block"
                let index = wrap.dataset.index
                let sheet_li = document.getElementsByClassName("sheet_li")[index]
                sheet_li.style.display = "block"
            }
        }
    }
    is_answer_true_favourite_display_input.dataset.isAnswerTrueFavouriteDisplay = 1 - is_answer_true_favourite_display

}

// 3.在新页面重做
function rewrite_fun(rewrite_a, is_output = "0") {
    let url = window.location.origin + window.location.pathname
    if (!json && !json["head"]["create_original_index"]) {
        window.open(url)
        return 0
    }
    let type = rewrite_a.dataset.type
    let wrap_arr = document.getElementsByClassName("wrap")

    json_new = {
        "head": json["head"],
        "body": []
    }
    var original_index_arr = []
    switch (type) {
        case "0":
            original_index_arr = ["0"]
            break;
        case "1":
            for (let i = 0; i < wrap_arr.length; i++) {
                let wrap = wrap_arr[i]
                let original_index = wrap.dataset.originalIndex
                original_index_arr.push(original_index)
            }
            break;
        case "2":
            for (let i = 0; i < wrap_arr.length; i++) {
                let wrap = wrap_arr[i]
                let original_index = wrap.dataset.originalIndex
                let is_answer_true = wrap.dataset.isAnswerTrue
                if (is_answer_true == "0") {
                    original_index_arr.push(original_index)
                }
            }
            break;
        case "3":
            for (let i = 0; i < wrap_arr.length; i++) {
                let wrap = wrap_arr[i]
                let original_index = wrap.dataset.originalIndex
                let is_favourite = wrap.dataset.isFavourite

                if (is_favourite == "1") {
                    original_index_arr.push(original_index)
                }
            }
            break;
        case "4":
            for (let i = 0; i < wrap_arr.length; i++) {
                let wrap = wrap_arr[i]
                let original_index = wrap.dataset.originalIndex
                let is_favourite = wrap.dataset.isFavourite
                let is_answer_true = wrap.dataset.isAnswerTrue
                if (is_favourite == "1" || is_answer_true == "0") {
                    original_index_arr.push(original_index)
                }
            }
            break;
        default:
    }
    if (original_index_arr.length == 0) {
        window.open(url)
        return 0
    }

    if (type == "0") {
        var json_str = JSON.stringify(json)
    } else {
        for (let i = 0; i < original_index_arr.length; i++) {
            json_new["body"][i] = json["body"][original_index_arr[i]]
        }
        json_new["head"]["create_original_index"] = "0"
        var json_str = JSON.stringify(json_new)
    }
    // 函数劫持
    if (is_output == "1") {
        return json_str
    }

    localStorage.setItem("json_str", json_str)
    window.open(url + "?rewrite=" + type)
}
// 下载函数
let handleDownload = function (content, name = "测试数据") {
    let download = document.createElement("a")
    download.style.display = 'block'
    download.download = name + '.json';
    var blob = new Blob([content], { type: "text/json" });
    download.href = URL.createObjectURL(blob);
    download.click()
}

function output_fun(output_div) {
    let output_type = output_div.dataset.type
    let rewrite = document.getElementsByClassName("rewrite")[output_type]
    let json_str = rewrite_fun(rewrite, "1")
    let name = "导出"
    handleDownload(json_str, name)
}

// 更多
function more_setting_fun(e) {
    let is_more_setting = e.dataset.isMoreSetting
    let setting_item = document.getElementsByClassName("setting_item")
    if (is_more_setting == "0") {
        for (let i = 3; i < setting_item.length; i++) {
            setting_item[i].style.display = "block"
        }
        e.innerHTML = `
                        更少
  <svg t="1706003866752" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3681" width="16" height="16"><path d="M195.2 704L512 387.84 828.8 704a32 32 0 0 0 45.44-45.44L534.4 320a32 32 0 0 0-45.44 0l-339.2 339.2a32 32 0 0 0 45.44 45.44z" fill="#2C2C2C" p-id="3682"></path></svg>
        `
    } else if (is_more_setting == "1") {
        for (let i = 3; i < setting_item.length; i++) {
            setting_item[i].style.display = "none"
        }
        e.innerHTML = `
                        更多
                <svg t="1706003531374" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2579"
                    width="16" height="16">
                    <path
                        d="M538.112 639.488l379.904-365.568c13.824-13.824 36.352-13.824 50.176 0 13.824 13.824 13.824 35.84 0 49.664L563.2 724.48c-13.824 13.824-36.352 13.824-50.176 0L108.032 323.584c-13.824-13.824-13.824-35.84 0-49.664s36.352-13.824 50.176 0l379.904 365.568z"
                        fill="#333333" p-id="2580"></path>
                </svg>
        `
    }
    e.dataset.isMoreSetting = 1 - is_more_setting

}
// 分割线

// 乱序与非乱序生成
let unorder_json_button = document.getElementById("unorder_json")
unorder_json_button.addEventListener("click", unorder_json)

let order_json_button = document.getElementById("order_json")
order_json_button.addEventListener("click", order_json)
function addEventListener_main_click_and_is_submit() {
    let main_div = document.getElementById("main")
    main_div.addEventListener("click", main_click)

    let submit_div = document.getElementById("submit")
    submit_div.addEventListener("click", is_submit)
}

function removeEventListener_main_click_and_is_submit() {
    // 移除事件监听
    let main_div = document.getElementById("main")
    main_div.removeEventListener("click",
        main_click
    )
    let submit_div = document.getElementById("submit")
    submit_div.removeEventListener("click",
        is_submit
    )
}

// window.isCloseHint = true;
//初始化关闭
// window.addEventListener("beforeunload", function (e) {
//     if (window.isCloseHint) {
//         var confirmationMessage = "要记得保存！你确定要离开我吗？";
//         (e || window.event).returnValue = confirmationMessage; // 兼容 Gecko + IE
//         this.alert(confirmationMessage);
//         return confirmationMessage; // 兼容 Gecko + Webkit, Safari, Chrome
//     }
// });
function main(json_body_each, order, index, is_order) {
    let original_index = json_body_each["original_index"]
    let type_code = json_body_each["type_code"]
    let answers_matching_index = json_body_each["answers_matching_index"]
    let answers_matching_index_new = []
    let wrap = document.createElement("div")
    wrap.className = "wrap"
    wrap.id = "q_typeCode" + type_code + "_" + order
    wrap.dataset.answerMy = "[]"
    wrap.dataset.order = order
    wrap.dataset.index = index
    wrap.dataset.originalIndex = original_index
    wrap.dataset.typeCode = json_body_each["type_code"]
    wrap.dataset.isFavourite = "0"
    wrap.dataset.isAnswerTrue = "-1"

    // 收藏功能
    let favourite_div = document.createElement("span")
    favourite_div.className = "favourite_div"
    favourite_div.innerHTML = `
    <svg width="32" height="32" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" class="favourite">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M19.8071 9.26152C18.7438 9.09915 17.7624 8.36846 17.3534 7.39421L15.4723 3.4972C14.8998 2.1982 13.1004 2.1982 12.4461 3.4972L10.6468 7.39421C10.1561 8.36846 9.25639 9.09915 8.19315 9.26152L3.94016 9.91102C2.63155 10.0734 2.05904 11.6972 3.04049 12.6714L6.23023 15.9189C6.96632 16.6496 7.29348 17.705 7.1299 18.7605L6.39381 23.307C6.14844 24.6872 7.62063 25.6614 8.84745 25.0119L12.4461 23.0634C13.4276 22.4951 14.6544 22.4951 15.6359 23.0634L19.2345 25.0119C20.4614 25.6614 21.8518 24.6872 21.6882 23.307L20.8703 18.7605C20.7051 17.705 21.0339 16.6496 21.77 15.9189L24.9597 12.6714C25.9412 11.6972 25.3687 10.0734 24.06 9.91102L19.8071 9.26152Z" fill="currentColor">
    </path></svg>
    `
    favourite_div.dataset.order = order
    wrap.append(favourite_div)
    let type = json_body_each["type"]
    // 问题
    let q = document.createElement("h3")
    q.className = "q"
    // let index_ = index + 1
    let index_ = order + 1
    q.innerHTML = index_ + ". （" + type + "） "
    // q.innerHTML = json_body_each["question"]
    for (let i = 0; i < json_body_each["questions"].length; i++) {
        q.innerHTML = q.innerHTML + "\n" + json_body_each["questions"][i];
    }
    wrap.append(q)
    // 选项
    if (type_code == 1 || type_code == 2 || type_code == 3) {

        var options = json_body_each["options"]
        var options_wrap = document.createElement("div")
        options_wrap.className = "options_wrap"
        answers_matching_index = json_body_each["answers_matching_index"]
        var options_new = deepCopy(options)
        if (is_order == "0") {
            shuffle(options_new);
        }
        for (let i = 0; i < answers_matching_index.length; i++) {
            answers_matching_index_new.push(options_new.indexOf(options[answers_matching_index[i]]))
        }
        answers_matching_index_new.sort()
        var options = options_new
        for (let i = 0; i < options.length; i++) {
            var option_wrap = document.createElement("div")
            option_wrap.className = "option_wrap"

            var option_code = document.createElement("span")
            option_code.className = "option_code"

            // 根据题目类型，设置不同样式
            if (type_code == "1") {
                option_code.className = "option_code option_code_1"
            } else if (type_code == "3") {
                option_code.className = "option_code option_code_3"
            } else if (type_code == "2") {
                option_code.className = "option_code option_code_2"
            }

            // if (type_code == 1 || type_code == 2 || type_code == 3) {
            option_code.innerHTML = String.fromCharCode(65 + i)
            var option = document.createElement("span")
            option.className = "option"
            option.innerHTML = options[i]
            // } 

            option_wrap.append(option_code)
            option_wrap.append(option)
            options_wrap.append(option_wrap)

            wrap.append(options_wrap)

            option_wrap.dataset.order = order
            option_wrap.dataset.optionCode = option_code.innerHTML
            option_code.dataset.order = order
            option_code.dataset.optionCode = option_code.innerHTML
            option.dataset.order = order
            option.dataset.optionCode = option_code.innerHTML

            option_wrap.dataset.index = index
            option_wrap.dataset.optionCode = option_code.innerHTML
            option_code.dataset.index = index
            option_code.dataset.optionCode = option_code.innerHTML
            option.dataset.index = index
            option.dataset.optionCode = option_code.innerHTML

        }
        wrap.dataset.answersMatchingIndexNew = JSON.stringify(answers_matching_index_new)
    } else if (type_code == 4 || type_code == 5) {
        let answers = json_body_each["answers"]
        if (answers.length == 0) {
            answers.push("空")
        }
        for (let i = 0; i < answers.length; i++) {
            var input_wrap = document.createElement("div")
            input_wrap.className = "input_wrap"
            var input_code = document.createElement("span")
            input_code.className = "input_code"
            input_code.innerHTML = i + 1 + ".  "
            var input = document.createElement("input")
            input.className = "input"
            input.name = "input"
            input.innerHTML = answers[i]
            input_wrap.append(input_code)
            input_wrap.append(input)
            wrap.append(input_wrap)
            input_wrap.dataset.order = order
            input_wrap.dataset.inputCode = input_code.innerHTML
            input_code.dataset.order = order
            input_code.dataset.inputCode = input_code.innerHTML
            input.dataset.order = order
            input.dataset.inputCode = input_code.innerHTML
        }
        wrap.dataset.answers = JSON.stringify(answers)
    }
    // 答案
    let answer_wrap = document.createElement("div")
    answer_wrap.className = "answer_wrap"
    let answer_my = document.createElement("span")
    answer_my.className = "answer_my"
    answer_my.innerHTML = "我的答案："
    let answer_true = document.createElement("span")
    answer_true.className = "answer_true"
    answer_true.innerHTML = "正确答案："
    if (type_code == 1 || type_code == 2 || type_code == 3) {
        for (let i = 0; i < answers_matching_index_new.length; i++) {
            answer_true.innerHTML = answer_true.innerHTML + String.fromCharCode(65 + answers_matching_index_new[i])
        }
    } else if (type_code == 4 || type_code == 5) {
        let temp_str = ""
        for (let i = 0; i < json_body_each["answers"].length; i++) {
            temp_str = temp_str + (i + 1) + "." + json_body_each["answers"][i] + "  "
        }
        answer_true.innerHTML = answer_true.innerHTML + temp_str
    }
    let answer_true_display = document.createElement("span")
    answer_true_display.className = "answer_true_display"
    answer_wrap.append(answer_my)
    answer_wrap.append(answer_true)
    answer_wrap.append(answer_true_display)
    let answer_true_arr = []
    answer_true_arr.push(json_body_each["answer"])
    wrap.append(answer_wrap)
    // 解析
    let analysis = document.createElement("div")
    analysis.className = "analysis"
    analysis.innerHTML = "解析：" + json_body_each["analysis"]
    if (json_body_each["analysis"]) {
        analysis.dataset.analysisContent = 0
    } else {
        analysis.dataset.analysisContent = 1
    }
    wrap.append(analysis)
    // 自定义属性: 全局索引
    answer_wrap.dataset.order = order
    answer_my.dataset.order = order
    answer_true.dataset.order = order
    analysis.dataset.order = order
    // 答题卡
    let sheet_li = document.createElement("li")
    sheet_li.className = "sheet_li"
    sheet_li.dataset.originalIndex = original_index

    // 根据题目类型，设置答题卡不同样式
    if (type_code == "1") {
        sheet_li.className = "sheet_li sheet_li_1"
    } else if (type_code == "3") {
        sheet_li.className = "sheet_li sheet_li_3"
    } else if (type_code == "2") {
        sheet_li.className = "sheet_li sheet_li_2"
    } else if (type_code == "4") {
        sheet_li.className = "sheet_li sheet_li_4"
    } else if (type_code == "5") {
        sheet_li.className = "sheet_li sheet_li_5"
    }

    let sheet_li_a = document.createElement("a")
    sheet_li_a.href = "#q_typeCode" + type_code + "_" + order
    sheet_li_a.innerHTML = order + 1
    sheet_li_a.className = "sheet_li_a"
    sheet_li.append(sheet_li_a)
    return [wrap, sheet_li]
}




