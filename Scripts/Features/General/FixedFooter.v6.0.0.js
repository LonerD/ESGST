function loadFixedFooter() {
    esgst.footer.classList.add(`esgst-ff`);
    esgst.pageOuterWrap.classList.add(`esgst-ff-sibling`);
    addFooterStyle();
}

function addFooterStyle() {
    var style = `
        .esgst-ff-sibling {
            margin-bottom: ${esgst.footer.offsetHeight}px;
        }
    `;
    GM_addStyle(style);
}
