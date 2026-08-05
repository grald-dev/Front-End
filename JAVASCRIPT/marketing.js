// =========================
// MARKETING PAGE
// =========================

// Initialize Marketing page components
function initializeMarketingPage() {

    const btn = document.querySelector(".btn-primary");

    if (btn) {
        btn.addEventListener("click", function () {
            alert("Generate Quotation clicked!");
        });
    }

}


// Switch between Marketing tabs
function switchTab(event, sectionId) {

    event.preventDefault();

    const links = document.querySelectorAll(".tab-nav a");

    links.forEach(link => {
        link.classList.remove("active");
    });

    event.currentTarget.classList.add("active");

    const contents = document.querySelectorAll(".tab-content");

    contents.forEach(content => {
        content.classList.remove("active-content");
        content.classList.add("hidden");
    });

    const target = document.getElementById(sectionId);

    if (target) {
        target.classList.remove("hidden");
        target.classList.add("active-content");
    }
}