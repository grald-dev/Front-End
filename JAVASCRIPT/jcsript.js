// =====================================================
// GLOBAL JAVASCRIPT
// MiRhema Graphics Inc. ERP System
// =====================================================


// =====================================================
// SIDEBAR
// =====================================================

const sidebar = document.querySelector(".sidebar");
const sidebarToggleBtn = document.getElementById("sidebar-toggle");
const sidebarLockBtn = document.getElementById("lock-icon");

let isLocked = true;


// -----------------------------------------------------
// Toggle Sidebar
// -----------------------------------------------------

function toggleSidebar() {

    if (!sidebar) return;

    sidebar.classList.toggle("close");

}


// -----------------------------------------------------
// Toggle Sidebar Lock
// -----------------------------------------------------

function toggleLock() {

    if (!sidebar || !sidebarLockBtn) return;

    isLocked = !isLocked;

    if (isLocked) {

        // Locked
        sidebarLockBtn.classList.remove("bx-lock-open-alt");
        sidebarLockBtn.classList.add("bx-lock");

    } else {

        // Unlocked
        sidebarLockBtn.classList.remove("bx-lock");
        sidebarLockBtn.classList.add("bx-lock-open-alt");

    }

}


// -----------------------------------------------------
// Sidebar Hover
// Works only when sidebar is unlocked
// -----------------------------------------------------

if (sidebar) {

    sidebar.addEventListener("mouseenter", () => {

        if (!isLocked) {
            sidebar.classList.remove("close");
        }

    });


    sidebar.addEventListener("mouseleave", () => {

        if (!isLocked) {
            sidebar.classList.add("close");
        }

    });

}


// -----------------------------------------------------
// Sidebar Buttons
// -----------------------------------------------------

if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener("click", toggleSidebar);
}

if (sidebarLockBtn) {
    sidebarLockBtn.addEventListener("click", toggleLock);
}



// =====================================================
// PAGE LOADER
// =====================================================

const menuLinks = document.querySelectorAll(".link");
const mainContent = document.getElementById("main-content");


// -----------------------------------------------------
// Page Initializers
// -----------------------------------------------------
// These functions should be defined in their own JS files.
//
// Example:
// marketing.js  → initializeMarketingPage()
// technical.js  → initializeTechnicalPage()
// finance.js    → initializeFinancePage()
// hr.js         → initializeHRPage()
// admin.js      → initializeAdminPage()
// logistics.js  → initializeLogisticsPage()
// -----------------------------------------------------

function initializePage(page) {

    switch (page) {

        case "marketing":

            if (typeof initializeMarketingPage === "function") {
                initializeMarketingPage();
            }

            break;


        case "technical":

            if (typeof initializeTechnicalPage === "function") {
                initializeTechnicalPage();
            }

            break;


        case "finance":

            if (typeof initializeFinancePage === "function") {
                initializeFinancePage();
            }

            break;


        case "hr":

            if (typeof initializeHRPage === "function") {
                initializeHRPage();
            }

            break;


        case "admin":

            if (typeof initializeAdminPage === "function") {
                initializeAdminPage();
            }

            break;


        case "logistics":

            if (typeof initializeLogisticsPage === "function") {
                initializeLogisticsPage();
            }

            break;


        default:

            console.log(`No specific JS for ${page}`);

            break;
    }

}


// -----------------------------------------------------
// Load Page
// -----------------------------------------------------

function loadPage(page) {

    if (!mainContent) {
        console.error("Main content container not found.");
        return;
    }


    // Show loading message
    mainContent.innerHTML = `
        <div class="page-loading">
            Loading...
        </div>
    `;


    fetch(`../main-content/${page}.html`)

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    `${page}.html not found (${response.status})`
                );
            }

            return response.text();

        })


        .then(html => {

            // Insert HTML
            mainContent.innerHTML = html;


            // Initialize page-specific JS
            initializePage(page);


            console.log(`${page}.html loaded successfully.`);

        })


        .catch(error => {

            console.error("Page loading error:", error);


            mainContent.innerHTML = `
                <div class="page-error">

                    <h2>404 - Page Not Found</h2>

                    <p>
                        The page
                        <strong>${page}.html</strong>
                        could not be loaded.
                    </p>

                </div>
            `;

        });

}


// =====================================================
// MENU LINKS
// =====================================================

menuLinks.forEach(link => {

    link.addEventListener("click", function (event) {

        event.preventDefault();


        // Remove active class from all links
        menuLinks.forEach(item => {
            item.classList.remove("active-link");
        });


        // Add active class to clicked link
        this.classList.add("active-link");


        // Get page name
        const page = this.dataset.page;


        if (!page) {
            console.error("Menu link has no data-page attribute.");
            return;
        }


        // Load page
        loadPage(page);

    });

});



// =====================================================
// DEFAULT PAGE
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    // Find Analytics link
    const analyticsLink = document.querySelector(
        '.link[data-page="analytics"]'
    );


    // Set Analytics as active
    if (analyticsLink) {

        menuLinks.forEach(item => {
            item.classList.remove("active-link");
        });

        analyticsLink.classList.add("active-link");

    }


    // Load default page
    loadPage("analytics");

});



// =====================================================
// PROFILE MENU
// =====================================================

const subMenu = document.getElementById("subMenu");


// -----------------------------------------------------
// Toggle Profile Menu
// -----------------------------------------------------

function toggleMenu() {

    if (!subMenu) return;

    subMenu.classList.toggle("open-menu");

}


// -----------------------------------------------------
// Close Profile Menu When Clicking Outside
// -----------------------------------------------------

document.addEventListener("click", function (event) {

    if (!subMenu) return;


    const clickedInsideHeader =
        event.target.closest(".header-right");

    const clickedInsideMenu =
        event.target.closest(".sub-menu-wrap");


    if (!clickedInsideHeader && !clickedInsideMenu) {

        subMenu.classList.remove("open-menu");

    }

});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('./SW_CachedSite.js')
            .then(reg => console.log('Service Worker: Registered'))
            .catch(err => console.log(`Service Worker: Error: ${err}`));
            
    });
}
