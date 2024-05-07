let nav_center = document.getElementById("nav_center");
nav_center.addEventListener("click", nav_center_display);

function nav_center_display() {
    let nav_center = document.getElementById("nav_center");
    let main=document.getElementById("main");
    let is_nav_center_display = nav_center.dataset.isNavCenterDisplay
    let sheet = document.getElementById("sheet")
    if (is_nav_center_display == "0") {
        sheet.style.visibility = "visible"
        // scrControl(0, main)
    } else if (is_nav_center_display == "1") {
        sheet.style.visibility = "hidden"
        // scrControl(1, main)
    }
    nav_center.dataset.isNavCenterDisplay = 1 - is_nav_center_display

}

/* 
function bodyScroll(event) {
    event.preventDefault();
}

function scrControl(t,e) {
    if (t == 0) { //禁止滚动
        e.addEventListener('scroll', this.bodyScroll, { passive: false });
    } else if (t == 1) { //开启滚动
        e.removeEventListener('scroll', this.bodyScroll, { passive: false });
    }
} */
