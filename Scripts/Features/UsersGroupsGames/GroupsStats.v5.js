function loadGroupsStats(context) {
    if (context == document) {
        addGSHeading();
    }
    var matches = document.getElementsByClassName(`table__row-inner-wrap`);
    for (var i = 0, n = matches.length; i < n; ++i) {
        loadGSStatus(matches[i]);
    }
}

function addGSHeading() {
    var Context;
    Context = document.getElementsByClassName("table__heading")[0];
    Context.insertAdjacentHTML(
        "beforeEnd",
        "<div class=\"table__column--width-small text-center\">Sent</div>" +
        "<div class=\"table__column--width-small text-center\">Received</div>" +
        "<div class=\"table__column--width-small text-center\">Gift Difference</div>" +
        "<div class=\"table__column--width-small text-center\">Value Difference</div>"
    );
}

function loadGSStatus(Context) {
    var GS, URL;
    Context.insertAdjacentHTML(
        "beforeEnd",
        "<div class=\"table__column--width-small text-center\">" +
        "    <i class=\"fa fa-circle-o-notch fa-spin\"></i>" +
        "    <span>Loading group stats...</span>" +
        "</div>"
    );
    GS = {
        Progress: Context.lastElementChild
    };
    URL = Context.getElementsByClassName("table__column__heading")[0].getAttribute("href") + "/users/search?q=" + GM_getValue("Username");
    queueRequest(GS, null, URL, function(Response) {
        var Matches, I, N;
        GS.Progress.remove();
        Matches = parseHTML(Response.responseText).getElementsByClassName("table__row-inner-wrap")[0].getElementsByClassName("table__column--width-small");
        for (I = 0, N = Matches.length; I < N; ++I) {
            Context.appendChild(Matches[0]);
        }
    });
}
