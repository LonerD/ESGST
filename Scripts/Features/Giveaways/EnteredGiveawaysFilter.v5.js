function loadEnteredGiveawaysFilter(context) {
    var matches = context.getElementsByClassName(`giveaway__row-inner-wrap is-faded`);
    for (var i = 0, n = matches.length; i < n; ++i) {
        matches[i].parentElement.classList.add(`esgst-hidden`);
    }
}
