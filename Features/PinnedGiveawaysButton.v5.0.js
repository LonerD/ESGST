function addPGBStyle() {
    var Style;
    Style = `
        .PGBContainer {
            border-radius: 0 !important;
            margin: 0! important;
        }
    `;
    GM_addStyle(Style);
}

function addPGBButton() {
    var PGBButton, PGBContainer, HTML, PGBIcon;

    addPGBStyle();

    PGBButton = document.getElementsByClassName("pinned-giveaways__button")[0];
    PGBContainer = PGBButton.previousElementSibling;

    PGBContainer.classList.add("PGBContainer");

    PGBButton.remove();

    HTML = `
        <div class="PGBButton pinned-giveaways__button">
            <i class="PGBIcon fa fa-angle-down"></i>
        </div>
    `;
    PGBContainer.insertAdjacentHTML("afterEnd", HTML);

    PGBButton = PGBContainer.nextElementSibling;
    PGBIcon = PGBButton.firstElementChild;

    function togglePGBButton() {
        PGBContainer.classList.toggle("pinned-giveaways__inner-wrap--minimized");
        PGBIcon.classList.toggle("fa-angle-down");
        PGBIcon.classList.toggle("fa-angle-up");
    }

    PGBButton.addEventListener("click", togglePGBButton);
}
