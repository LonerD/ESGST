function loadFixedHeader() {
    esgst.header.classList.add(`esgst-fh`);
    var headerSibling;
    if (esgst.featuredContainer && ((esgst.hfc && !esgst.giveawaysPath) || !esgst.hfc)) {
        headerSibling = esgst.featuredContainer;
    } else {
        headerSibling = esgst.pageOuterWrap;
    }
    headerSibling.classList.add(`esgst-fh-sibling`);
    addHeaderStyle();
}

function addHeaderStyle() {
    var height = esgst.header.offsetHeight;
    var style = `
        .esgst-fh-sibling {
            margin-top: ${height}px;
        }
    `;
    GM_addStyle(style);
    esgst.pageTop += height;
    esgst.commentsTop += height;
}
