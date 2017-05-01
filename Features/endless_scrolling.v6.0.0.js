function load_endless_scrolling() {
    var pagination, context, next_page, main_page_bottom, main_pagination_navigation_backup, reverse_scrolling;
    if (!esgst.fe_mph) {
        load_fixed_main_page_heading();
    }
    if (!esgst.eot_pn) {
        load_pagination_navigation_on_top();
    }
    pagination = esgst.pagination;
    context = esgst.pagination.previousElementSibling;
    next_page = esgst.page + 1;
    main_page_bottom = pagination.offsetTop;
    main_pagination_navigation_backup = esgst.pagination_navigation.innerHTML;
    document.addEventListener(`scroll`, restore_original_pagination);
    document.addEventListener(`scroll`, get_next_page);
    if (esgst.es_rs && esgst.discussion_comments_path) {
        pagination.classList.add(`esgst_hidden`);
        context.classList.add(`esgst_hidden`);
        next_page = parseInt(esgst.pagination_navigation.lastElementChild.getAttribute(`data-page-number`));
        esgst.main_page_heading_placeholder.id = `es_page_${next_page}`;
        reverse_scrolling = true;
        get_next_page();
    } else {
        esgst.main_page_heading_placeholder.id = `es_page_${next_page - 1}`;
        reverse_scrolling = false;
        get_next_page();
    }
    
    function restore_original_pagination() {
        if (window.scrollY >= 0 && window.scrollY <= main_page_bottom) {
            if (location.href != (esgst.url + esgst.page)) {
                esgst.pagination_navigation.innerHTML = main_pagination_navigation_backup;
                history.replaceState({}, null, esgst.url + esgst.page);
            }
        }
    }
    
    function get_next_page() {
        if (window.scrollY >= (document.body.offsetHeight - (window.innerHeight * 2))) {
            document.removeEventListener(`scroll`, get_next_page);
            if (reverse_scrolling) {
                html = `
                    <div>
                        <i class="fa fa-circle-o-notch fa-spin"></i>
                        <span>Reversing comments...</span>
                    </div>
                `;
                esgst.main_page_heading.insertAdjacentHTML(`afterBegin`, html);
                next_heading = esgst.main_page_heading.firstElementChlid;
            } else {
                html = `
                    <div class="es_heading page__heading">
                        <div class="page__heading__breadcrumbs">
                            <i class="fa fa-circle-o-notch fa-spin"></i>
                            <span>Loading next page...</span>
                        </div>
                    </div>
                `;
                pagination.insertAdjacentHTML(`afterEnd`, html);
                next_heading = pagination.nextElementSibling;
            }
            makeRequest(null, esgst.url + next_page, null, load_next_page);
        }
    }
    
    function load_next_page(response) {
        var parent, pagination_navigation, pagination_navigation_backup, url_backup, current_top, current_bottom;
        var response_html = parseHTML(response.responseText);
        pagination = response_html.getElementsByClassName(`pagination`)[0];
        if (reverse_scrolling) {
            next_heading.remove();
            next_heading = esgst.main_page_heading;
        } else {
            next_heading.firstElementChild.innerHTML = `Page ${next_page}`;
            next_heading.id = `es_page_${next_page}`;
        }
        context = pagination.previousElementSibling;
        loadEndlessFeatures(context);
        setESHide(context);
        setESRemoveEntry(context);
        parent = next_heading.parentElement;
        parent.insertBefore(context, next_heading.nextElementSibling);
        parent.insertBefore(pagination, context.nextElementSibling);
        pagination_navigation = pagination.getElementsByClassName(esgst.pagination_navigation_class)[0];
        pagination_navigation_backgup = pagination_navigation.innerHTML;
        if (reverse_scrolling) {
            esgst.pagination_navigation.innerHTML = pagination_navigation_backup;
        }
        url_backup = esgst.url + next_page;
        current_top = next_heading.offsetTop;
        current_bottom = pagination.offsetTop;
        pagination_navigation.remove();
        if (reverse_scrolling) {
            current_top = 0;
            reverse_scrolling = false;
        }
        if (esgst.es_rs) {
            --next_page;
            if (next_page > 0) {
                document.addEventListener(`scroll`, get_next_page);
            }
        } else {
            ++next_page;
            if (!pagination_navigation.lastElementChild.classList.contains(esgst.selected_class)) {
                document.addEventListener(`scroll`, get_next_page);
            }
        }
        document.addEventListener(`scroll`, change_pagination_navigation);
        
        function change_pagination_navigation() {
            if (window.scrollY >= current_top && window.scrollY <= current_bottom) {
                if (location.href != url_backup) {
                    esgst.pagination_navigation.innerHTML = pagination_navigation_backup;
                    history.replaceState({}, null, url_backup);
                }
            }
        }
    }
}
