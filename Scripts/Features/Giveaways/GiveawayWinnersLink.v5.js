function loadGiveawayWinnersLink(context) {
    var matches = context.getElementsByClassName(`giveaway__summary`);
    for (var i = 0, n = matches.length; i < n; ++i) {
        addGWLLink(matches[i]);
    }
}

function addGWLLink(Context) {
    var Columns, Copies, Match, Entries, URL, Link;
    Columns = Context.getElementsByClassName("giveaway__columns")[0];
    if (parseInt(Columns.querySelector("[data-timestamp]").getAttribute("data-timestamp")) < ((new Date().getTime()) / 1000)) {
        Copies = Context.getElementsByClassName("giveaway__heading__thin")[0].textContent;
        Match = Copies.match(/\((.+) Copies\)/);
        Copies = Match ? Match[1] : (Columns.textContent.match("No winners") ? 0 : 1);
        Entries = Context.getElementsByClassName("giveaway__links")[0].firstElementChild;
        URL = Entries.getAttribute("href");
        Link = URL ? (" href=\"" + URL.match(/(.+)\/entries/)[1] + "/winners\"") : "";
        Entries.insertAdjacentHTML(
            "afterEnd",
            "<a class=\"GWLLink\"" + Link + ">" +
            "    <i class=\"fa fa-trophy\"></i>" +
            "    <span>" + Copies + " winners</span>" +
            "</a>"
        );
    }
}
