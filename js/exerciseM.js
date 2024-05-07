let nav_center = document.getElementById("nav_center");
nav_center.addEventListener("click", nav_center_display);

function nav_center_display() {
    let nav_center = document.getElementById("nav_center");
    let is_nav_center_display = nav_center.dataset.isNavCenterDisplay
    let sheet = document.getElementById("sheet")
    if (is_nav_center_display == "0") {
        sheet.style.visibility = "visible"
    } else if (is_nav_center_display == "1") {
        sheet.style.visibility = "hidden"
    }
    nav_center.dataset.isNavCenterDisplay = 1 - is_nav_center_display

}
