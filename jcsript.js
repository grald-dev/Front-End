// Selecting the sidebar and buttons
const sidebar = document.querySelector(".sidebar");
const sidebarOpenBtn = document.querySelector("#sidebar-open");
const sidebarCloseBtn = document.querySelector("#sidebar-close");
const sidebarLockBtn = document.querySelector("#lock-icon");

// Toggle lock
const toggleLock = () => {

    sidebar.classList.toggle("locked");

    if (sidebar.classList.contains("locked")) {

        sidebar.classList.remove("hoverable");

        sidebarLockBtn.classList.replace(
            "bx-lock-open-alt",
            "bx-lock"
            
        );

    } else {

        sidebar.classList.add("hoverable");

        sidebarLockBtn.classList.replace(
            "bx-lock",
            "bx-lock-open-alt"

        );

    }

};

// Hide sidebar
const hideSidebar = () => {

    if (sidebar.classList.contains("hoverable")) {
        sidebar.classList.add("close");
    }

};

// Show sidebar
const showSidebar = () => {

    if (sidebar.classList.contains("hoverable")) {
        sidebar.classList.remove("close");
    }

};

// Sidebar events
sidebarOpenBtn.addEventListener("click", () => {
    sidebar.classList.remove("close");
});

sidebarCloseBtn.addEventListener("click", () => {
    sidebar.classList.add("close");
});

sidebarLockBtn.addEventListener("click", toggleLock);

sidebar.addEventListener("mouseenter", showSidebar);
sidebar.addEventListener("mouseleave", hideSidebar);


// =========================
// PAGE LOADER
// =========================

const menuLinks = document.querySelectorAll(".link");
const mainContent = document.getElementById("main-content");

function loadPage(page) {

    fetch(`pages/${page}.html`)
        .then(response => {

            if (!response.ok) {
                throw new Error("Page not found");
            }

            return response.text();

        })
        .then(html => {

            mainContent.innerHTML = html;

        })
        .catch(error => {

            console.error(error);

            mainContent.innerHTML = `
                <h2>Page Not Found</h2>
                <p>The page "${page}.html" does not exist.</p>
            `;

        });

}

menuLinks.forEach(link => {

    link.addEventListener("click", function (e) {

        e.preventDefault();

        menuLinks.forEach(item => {
            item.classList.remove("active-link");
        });

        this.classList.add("active-link");

        const page = this.dataset.page.toLowerCase();

        loadPage(page);

    });

});

// Load Analytics when website opens
loadPage("analytics");

let subMenu = document.getElementById("subMenu");

function toggleMenu(){
    subMenu.classList.toggle("open-menu");
}
