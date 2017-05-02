function load_header_icons_refresher() {
    var refresher, last_count;
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
        var response_html, created_icon, won_icon, inbox_icon,
            matches, delivered, i, n, received, not_received, count;
        response_html = parseHTML(response.responseText);
        created_icon = response_html.getElementsByClassName(`nav__right-container`)[0].firstElementChild;
        won_icon = created_icon.nextElementSibling;
        inbox_icon = won_icon.nextElementSibling;
        esgst.created_icon.className = created_icon.className;
        esgst.created_icon.innerHTML = created_icon.innerHTML;
        esgst.won_icon.className = won_icon.className;
        esgst.won_icon.innerHTML = won_icon.innerHTML;
        if (esgst.dgn) {
            check_delivered_gifts(response);
        }
        esgst.inbox_icon.className = inbox_icon.className;
        esgst.inbox_icon.innerHTML = inbox_icon.innerHTML;
        count = esgst.inbox_icon.getElementsByClassName(`nav__notification`)[0];
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
