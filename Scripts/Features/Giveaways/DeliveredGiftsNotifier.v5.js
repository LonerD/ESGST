function loadDeliveredGiftsNotifier() {
    makeRequest(null, "/giveaways/won", null, function(Response) {
        notifyDGNGift(parseHTML(Response.responseText), document.getElementsByClassName("nav__button-container--notification")[1]);
    });
}

function notifyDGNGift(ResponseHTML, WonIcon) {
    var Matches, Delivered, I, N, Received, NotReceived;
    Matches = ResponseHTML.getElementsByClassName("table__row-inner-wrap");
    Delivered = 0;
    for (I = 0, N = Matches.length; I < N; ++I) {
        Received = Matches[I].getElementsByClassName("table__gift-feedback-received")[0];
        NotReceived = Matches[I].getElementsByClassName("table__gift-feedback-not-received")[0];
        if ((Received.classList.contains("is-hidden") && ((NotReceived && NotReceived.classList.contains("is-hidden")) || !NotReceived)) &&
            Matches[I].querySelector("[data-clipboard-text]")) {
            ++Delivered;
        }
    }
    if (Delivered) {
        GM_addStyle(
            ".DGNIcon i {" +
            "    color: #FECC66;" +
            "}"
        );
        WonIcon.classList.add("DGNIcon");
        WonIcon.firstElementChild.title = "Giveaways Won (" + Delivered + " Delivered)";
    }
}
