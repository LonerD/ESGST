function load_header_icons_refresher() {
    var created_icon, won_icon, inbox_icon, last_count, refresher;
    created_icon = document.getElementsByClassName(`nav__right-container`)[0].firstElementChild;
    won_icon = created_icon.nextElementSibling;
    inbox_icon = won_icon.nextElementSibling;
    window.addEventListener(`focus`, load_won_page);
    if (esgst.hir_b) {
        window.addEventListener(`blur`, deactivate_header_icons_refresher);
    }
    load_won_page();
    
    function load_won_page() {
        makeRequest(null, `/giveaways/won`, null, refresh_icons);
        refresher = setInterval(load_won_page, 60000);
    }
    
    function refresh_icons(response) {
        var response_html, updated_created_icon, updated_won_icon, updated_inbox_icon,
            matches, delivered, i, n, received, not_received, count;
        response_html = parseHTML(response.responseText);
        updated_created_icon = response_html.getElementsByClassName(`nav__right-container`)[0].firstElementChild;
        updated_won_icon = updated_created_icon.nextElementSibling;
        updated_inbox_icon = updated_won_icon.nextElementSibling;
        created_icon.className = updated_created_icon.className;
        created_icon.innerHTML = updated_created_icon.innerHTML;
        won_icon.className = updated_won_icon.className;
        won_icon.innerHTML = updated_won_icon.innerHTML;
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
            won_icon.classList.add(`hir_won_icon_delivered`);
            won_icon.firstElementChild.title = `Giveaways Won (${delivered} Delivered)`;
        }
        inbox_icon.className = updated_inbox_icon.className;
        inbox_icon.innerHTML = updated_inbox_icon.innerHTML;
        count = inbox_icon.getElementsByClassName(`nav__notification`)[0];
        if (count) {
            count = parseInt(count.textContent);
            if (count != last_count) {
                last_count = count;
                if (count > 9) {
                    count = 0;
                }
                esgst.icon.href = getResourceURL(`hir_icon_${count}`);
            }
        } else {
            esgst.icon.href = getResourceURL(`steamgifts_icon`);
        }
    }
    
    function deactivate_header_icons_refresher() {
        clearInterval(refresher);
    }
}
