function loadFixedMainPageHeading() {
    var html = `
        <div class="esgst-fmph-placeholder esgst-hidden"></div>
        <div class="${esgst.pageOuterWrapClass} esgst-fmph-background esgst-hidden"></div>
    `;
    esgst.mainPageHeading.insertAdjacentHTML(`afterEnd`, html);
    esgst.mainPageHeadingPlaceholder = esgst.mainPageHeading.nextElementSibling;
    esgst.mainPageHeadingBackground = esgst.mainPageHeadingPlaceholder.nextElementSibling;
    document.addEventListener(`scroll`, fixMainPageHeading);
    addMainPageHeadingStyle();
    fixMainPageHeading();
}

function fixMainPageHeading() {
    if (window.scrollY > (esgst.mainPageHeading.offsetTop - esgst.pageTop)) {
        document.removeEventListener(`scroll`, fixMainPageHeading);
        toggleFixedMainPageHeading();
        document.addEventListener(`scroll`, unfixMainPageHeading);
    }
}

function unfixMainPageHeading() {
    if (window.scrollY <= (esgst.mainPageHeadingPlaceholder.offsetTop - esgst.pageTop)) {
        document.removeEventListener(`scroll`, unfixMainPageHeading);
        toggleFixedMainPageHeading();
        document.addEventListener(`scroll`, fixMainPageHeading);
    }
}

function toggleFixedMainPageHeading() {
    esgst.mainPageHeading.classList.toggle(`esgst-fmph`);
    esgst.mainPageHeadingPlaceholder.classList.toggle(`esgst-hidden`);
    esgst.mainPageHeadingBackground.classList.toggle(`esgst-hidden`);
}

function addMainPageHeadingStyle() {
    var width = esgst.mainPageHeading.offsetWidth;
    var height = esgst.mainPageHeading.offsetHeight;
    var style = `
        .esgst-fmph {
            top: ${esgst.pageTop}px;
            width: ${width}px;
        }

        .esgst-fmph-placeholder {
            height: ${height}px;
        }

        .esgst-fmph-background {
            height: ${esgst.pageTop + height + 5}px;
            width: ${width}px;
        }
    `;
    GM_addStyle(style);
    esgst.commentsTop += height + 30;
}
