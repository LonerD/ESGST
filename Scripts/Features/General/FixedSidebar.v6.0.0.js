function loadFixedSidebar() {
    esgst.sidebarAd = esgst.sidebar.getElementsByClassName(`sidebar__mpu`)[0];
    esgst.sidebarSibling = esgst.sidebar.nextElementSibling;
    document.addEventListener(`scroll`, fixSidebar);
    addSidebarStyle();
    fixSidebar();
}

function fixSidebar() {
    esgst.sidebarTop = esgst.sidebar.offsetTop - esgst.pageTop;
    if (window.scrollY > esgst.sidebarTop) {
        document.removeEventListener(`scroll`, fixSidebar);
        toggleFixedSidebar();
        document.addEventListener(`scroll`, unfixSidebar);
    }
}

function unfixSidebar() {
    if (window.scrollY <= esgst.sidebarTop) {
        document.removeEventListener(`scroll`, unfixSidebar);
        toggleFixedSidebar();
        document.addEventListener(`scroll`, fixSidebar);
    }
}

function toggleFixedSidebar() {
    esgst.sidebar.classList.toggle(`esgst-fs`);
    if (esgst.sidebarAd) {
        esgst.sidebarAd.classList.toggle(`esgst-hidden`);
    }
    esgst.sidebarSibling.classList.toggle(`esgst-fs-sibling`);
}

function addSidebarStyle() {
    var style= `
        .esgst-fs {
            top: ${esgst.pageTop}px;
        }

        .esgst-fs-sibling {
            margin-left: ${esgst.sidebar.offsetWidth + 25}px !important;
        }
    `;
    GM_addStyle(style);
}
