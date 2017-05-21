function loadPinnedGiveawaysButton() {
    var PGBButton, PGBContainer, HTML, PGBIcon;
    PGBContainer = esgst.pinnedGiveawaysButton.previousElementSibling;
    PGBContainer.classList.add("PGBContainer");
    esgst.pinnedGiveawaysButton.remove();
    HTML = `
        <div class="PGBButton pinned-giveaways__button">
            <i class="PGBIcon fa fa-angle-down"></i>
        </div>
    `;
    PGBContainer.insertAdjacentHTML("afterEnd", HTML);
    esgst.pinnedGiveawaysButton = PGBContainer.nextElementSibling;
    PGBIcon = esgst.pinnedGiveawaysButton.firstElementChild;

    function togglePGBButton() {
        PGBContainer.classList.toggle("pinned-giveaways__inner-wrap--minimized");
        PGBIcon.classList.toggle("fa-angle-down");
        PGBIcon.classList.toggle("fa-angle-up");
    }

    esgst.pinnedGiveawaysButton.addEventListener("click", togglePGBButton);
}
