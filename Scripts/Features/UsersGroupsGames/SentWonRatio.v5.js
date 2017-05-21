function loadSentWonRatio(context, user) {
    var wonRow, sentRow;
    if (context.context) {
        wonRow = context.wonRow;
        sentRow = context.sentRow;
    } else {
        wonRow = esgst.wonRow;
        sentRow = esgst.sentRow;
        user = esgst.user;
    }
    if (wonRow && sentRow) {
        addSWRRatio(wonRow, sentRow, user);
    }

}

function addSWRRatio(Won, Sent, User) {
    var WonCount, SentCount, Ratio;
    WonCount = parseInt(Won.nextElementSibling.firstElementChild.textContent.replace(/,/, ""));
    SentCount = parseInt(Sent.nextElementSibling.firstElementChild.firstElementChild.textContent.replace(/,/, ""));
    Ratio = (WonCount > 0) ? (Math.round(SentCount / WonCount * 100) / 100) : 0;
    Sent.parentElement.insertAdjacentHTML(
        "afterEnd",
        "<div class=\"featured__table__row SWRRatio\">" +
        "    <div class=\"featured__table__row__left\">Ratio</div>" +
        "    <div class=\"featured__table__row__right\" title=\"" + User.Username + " has sent " + Ratio + " gifts for every gift won.\">" + Ratio + "</div>" +
        "</div>"
    );
}
