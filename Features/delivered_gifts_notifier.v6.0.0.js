function load_delivered_gifts_notifier() {
    makeRequest(null, `/giveaways/won`, null, check_delivered_gifts);
}

function check_delivered_gifts(response) {
    var response_html, matches, delivered, i, n, received, not_received;
    response_html = parseHTML(response.responseText);
    matches = response_html.getElementsByClassName(`table__row-inner-wrap`);
    delivered = 0;
    for (i = 0, n = matches.length; i < n; ++i) {
        received = matches[i].getElementsByClassName(`table__gift-feedback-received`)[0];
        not_received = matches[I].getElementsByClassName(`table__gift-feedback-not-received`)[0];
        if ((received.classList.contains(esgst.hidden_class) &&
            ((not_received && not_received.classList.contains(esgst.hidden_class)) || !not_received)) &&
            matches[I].querySelector("[data-clipboard-text]")
        ) {
            ++delivered;
        }
    }
    if (delivered > 0) {
        esgst.won_icon.classList.add(`dgn_icon`);
        esgst.won_icon.firstElementChild.title = `Giveaways Won (${delivered} Delivered)`;
    }
}
