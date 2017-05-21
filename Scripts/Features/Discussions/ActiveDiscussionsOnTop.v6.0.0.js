function loadActiveDiscussionsOnTop() {
    esgst.activeDiscussions.classList.remove(`widget-container--margin-top`);
    esgst.activeDiscussions.classList.add(`esgst-adot`);
    var parent = esgst.activeDiscussions.parentElement;
    parent.insertBefore(esgst.activeDiscussions, parent.firstElementChild);
}
