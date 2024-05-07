



let input = document.getElementById("input")


let download = document.getElementById("download")
download.addEventListener("click", function () {
    let input = document.getElementById("input")
    let filename = document.getElementById("filename").innerText
    // console.log(document.getElementById("filename") ,filename)
    if (isJSON(input.value)) {
        if (filename == "") {
            filename = "测试数据"
        }
        handleDownload(input.value, filename)

    } else {
        alert("输入的不是json格式")
    }
})





let handleDownload = function (content, name) {
    // download = document.getElementById("download")
    // download.style.display = 'block'
    // download.download = name + '.json';
    // var data = content
    // // var data = JSON.stringify(content, undefined, 4);

    // var blob = new Blob([data], { type: "text/json" });
    // download.href = URL.createObjectURL(blob);


    download_a = document.createElement("a")
    download_a.style.display = 'none'
    download_a.download = name + '.json';
    var data = content
    var blob = new Blob([data], { type: "text/json" });
    download_a.href = URL.createObjectURL(blob);
    console.log(download_a)
    download_a.click()


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
    } else {
        console.log('It is not a string!')
    }

}