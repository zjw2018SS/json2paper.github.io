


let input = document.getElementById("input").value;
let output = document.getElementById("output").value;

let is_auto_comma = document.getElementById("is_auto_comma")
let is_auto_copy = document.getElementById("is_auto_copy")

is_auto_comma.addEventListener("click", function () {
    let flag = is_auto_comma.dataset.isAutoComma
    if (flag == 0) {
        is_auto_comma.dataset.isAutoComma = 1
        is_auto_comma.innerText = "自动添加逗号开"
        console.log(is_auto_copy.classList)
        is_auto_comma.classList.add("on")
        is_auto_comma.classList.remove("off")
    } else if (flag == 1) {
        is_auto_comma.dataset.isAutoComma = 0
        is_auto_comma.innerText = "自动添加逗号关"
        is_auto_comma.classList.add("off")
        is_auto_comma.classList.remove("on")
    }
})
is_auto_copy.addEventListener("click", function () {
    let flag = is_auto_copy.dataset.isAutoCopy
    if (flag == 0) {
        is_auto_copy.dataset.isAutoCopy = 1
        is_auto_copy.innerText = "自动复制开"
        console.log(is_auto_copy.classList)
        is_auto_copy.classList.add("on")
        is_auto_copy.classList.remove("off")
    } else if (flag == 1) {
        is_auto_copy.dataset.isAutoCopy = 0
        is_auto_copy.innerText = "自动复制关"
        is_auto_copy.classList.add("off")
        is_auto_copy.classList.remove("on")
    }
})
function x() {

    let input = document.getElementById("input").value;
    let output = document.getElementById("output").value;
    let is_auto_copy = document.getElementById("is_auto_copy")
    let is_auto_comma = document.getElementById("is_auto_comma")
    let flag = isJSON(input)
    console.log(flag)
    if (flag) {
        json = JSON.parse(input);
        json_body = JSON.stringify(json["body"]).slice(1, -1)

        if (is_auto_comma.dataset.isAutoComma == 1) {
            json_body = "," + json_body
        }
        document.getElementById("output").value = json_body
        if (is_auto_copy.dataset.isAutoCopy == 1) {
            copy()
        }
    }
}

function add() {
    let input = document.getElementById("input").value;
    let output = document.getElementById("output").value;

}
function copy() {
    let output = document.getElementById("output").value;
    navigator.clipboard.writeText(output)
}
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