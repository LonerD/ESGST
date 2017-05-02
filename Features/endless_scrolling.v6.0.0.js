function load_endless_scrolling() {
    var pagination, context, current_page, next_page, reverse_pages,
        es_page_heading, title,
        main_page_bottom, main_search_url_backup, main_title_backup, main_pagination_navigation_backup,
        es_refresh_button, es_pause_button;
    pagination = esgst.pagination;
    context = pagination.previousElementSibling;
    if (esgst.es_rs && esgst.discussion_comments_path) {
        if (esgst.current_page == 1) {
            pagination.classList.add(`esgst_hidden`);
            context.classList.add(`esgst_hidden`);
            current_page = parseInt(esgst.pagination_navigation.lastElementChild.getAttribute(`data-page-number`));
            next_page = current_page;
            reverse_pages = true;
            activate_endless_scrolling();
        } else {
            reverse_comments(context);
            current_page = esgst.current_page;
            next_page = current_page - 1;
            reverse_pages = false;
            activate_endless_scrolling();
        }
    } else if (!esgst.pagination_navigation.lastElementChild.classList.contains(esgst.selected_class)) {
        current_page = esgst.current_page;
        next_page = current_page + 1;
        activate_endless_scrolling();
    }
    
    function activate_endless_scrolling() {
        var html;
        if (!esgst.fe_mph) {
            load_fixed_main_page_heading();
        }
        if (!esgst.eot_pn) {
            load_pagination_navigation_on_top();
        }
        esgst.main_page_heading_placeholder.id = `es_page_${current_page}`;
        title = document.title.replace(/ - Page (\d+)/, ``);
        main_search_url_backup = `${esgst.search_url}${current_page}`;
        window.history.replaceState({}, null, main_search_url_backup);
        main_title_backup = `${title} - Page ${current_page}`;
        document.title = main_title_backup;
        main_pagination_navigation_backup = esgst.pagination_navigation.innerHTML;
        document.addEventListener(`scroll`, load_next_page);
        document.addEventListener(`scroll`, restore_main_pagination_navigation);
        html = `
            <div class="page_heading_btn es_refresh_button" title="Refresh the current page.">
                <i class="fa fa-refresh"></i>
            </div>
            <div class="page_heading_btn es_pause_button" title="Pause the endless scrolling.">
                <i class="fa fa-pause"></i>
            </div>
        `;
        esgst.main_page_heading.insertAdjacentHTML(`beforeEnd`, html);
        es_pause_button = esgst.main_page_heading.lastElementChild;
        es_refresh_button = es_pause_button.previousElementSibling;
        es_refresh_button.addEventListener(`click`, refresh_page);
        es_pause_button.addEventListener(`click`, pause_endless_scrolling);
        set_es_pagination_navigation();
        load_next_page();
    }
    
    function load_next_page() {
        var html;
        if (window.scrollY >= (document.body.offsetHeight - (window.innerHeight * 2))) {
            document.removeEventListener(`scroll`, load_next_page);
            if (reverse_pages) {
                html = `
                    <div>
                        <i class="fa fa-circle-o-notch fa-spin"></i>
                        <span>Reversing pages...</span>
                    </div>
                `;
                esgst.main_page_heading.insertAdjacentHTML(`afterBegin`, html);
                es_page_heading = esgst.main_page_heading.firstElementChild;
            } else {
                html = `
                    <div class="${esgst.page_heading_class} es_page_heading">
                        <div class="${esgst.page_heading_breadcrumbs_class}">
                            <i class="fa fa-circle-o-notch fa-spin"></i>
                            <span>Loading next page...</span>
                        </div>
                    </div>
                `;
                pagination.insertAdjacentHTML(`afterEnd`, html);
                es_page_heading = pagination.nextElementSibling;
            }
            makeRequest(null, `${esgst.search_url}${next_page}`, null, set_next_page);
        }
    }
    
    function set_next_page(response) {
        var response_html, previous_pagination_backup, pagination_navigation, pagination_navigation_backup,
            search_url_backup, title_backup, pagination_backup, parent;
        response_html = parseHTML(response.responseText);
        previous_pagination_backup = pagination;
        pagination = response_html.getElementsByClassName(`pagination`)[0];
        context = pagination.previousElementSibling;
        loadEndlessFeatures(context);
        setESHide(context);
        setESRemoveEntry(context);
        pagination_navigation = pagination.getElementsByClassName(esgst.pagination_navigation_class)[0];
        pagination_navigation_backup = pagination_navigation.innerHTML;
        search_url_backup = `${esgst.search_url}${next_page}`;
        title_backup = `${title} - Page ${next_page}`;
        pagination_backup = pagination;
        if (reverse_pages) {
            es_page_heading.remove();
            es_page_heading = esgst.pagination;
            esgst.pagination_navigation.innerHTML = pagination_navigation_backup;
            set_es_pagination_navigation();
            reverse_pages = false;
        } else {
            es_page_heading.firstElementChild.innerHTML = `
                <a href="${esgst.search_url}${next_page}">Page ${next_page}</a>
            `;
            es_page_heading.id = `es_page_${next_page}`;
        }
        parent = es_page_heading.parentElement;
        parent.insertBefore(context, es_page_heading.nextElementSibling);
        parent.insertBefore(pagination, context.nextElementSibling);
        if (esgst.es_rs && esgst.discussion_comments_path) {
            reverse_comments(context);
            --next_page;
            if (next_page > 0) {
                document.addEventListener(`scroll`, load_next_page);
            }
        } else {
            ++next_page;
            if (!pagination_navigation.lastElementChild.classList.contains(esgst.selected_class)) {
                document.addEventListener(`scroll`, load_next_page);
            }
        }
        pagination_navigation.remove();
        document.addEventListener(`scroll`, change_pagination_navigation);
        load_next_page();
        
        function change_pagination_navigation() {
            var page_top, page_bottom;
            page_top = previous_pagination_backup.offsetTop - esgst.page_top;
            page_bottom = pagination_backup.offsetTop;
            if ((window.scrollY >= page_top) && (window.scrollY <= page_bottom)) {
                if (window.location.href != search_url_backup) {
                    window.history.replaceState({}, null, search_url_backup);
                    document.title = title_backup;
                    esgst.pagination_navigation.innerHTML = pagination_navigation_backup;
                    set_es_pagination_navigation();
                }
            }
        }
    }
    
    function restore_main_pagination_navigation() {
        var main_page_bottom;
        main_page_bottom = esgst.pagination.offsetTop;
        if ((window.scrollY >= 0) && (window.scrollY <= main_page_bottom)) {
            if (window.location.href != main_search_url_backup) {
                window.history.replaceState({}, null, main_search_url_backup);
                document.title = main_title_backup;
                esgst.pagination_navigation.innerHTML = main_pagination_navigation_backup;
                set_es_pagination_navigation();
            }
        }
    }
    
    function refresh_page() {
        var page;
        page = window.location.href.match(/page=(\d+)/)[1];
        makeRequest(null, window.location.href, null, set_refreshed_page);
    
        function set_refreshed_page(response) {
            var response_html, new_context, element, parent;
            response_html = parseHTML(response.responseText);
            new_context = response_html.getElementsByClassName(`pagination`)[0].previousElementSibling;
            loadEndlessFeatures(new_context);
            setESHide(new_context);
            setESRemoveEntry(new_context);
            if (esgst.es_rs && esgst.discussion_comments_path) {
                reverse_comments(new_context);
            }
            element = document.getElementById(`es_page_${page}`);
            element.nextElementSibling.remove();
            parent = element.parentElement;
            parent.insertBefore(new_context, element.nextElementSibling);
        }
    }
    
    function pause_endless_scrolling() {
        document.removeEventListener(`scroll`, load_next_page);
        es_pause_button.removeEventListener(`click`, pause_endless_scrolling);
        es_pause_button.title = `Resume the endless scrolling.`;
        es_pause_button.innerHTML = `
            <i class="fa fa-play"></i>
        `;
        es_pause_button.addEventListener(`click`, resume_endless_scrolling);
    }
    
    function resume_endless_scrolling() {
        es_pause_button.removeEventListener(`click`, resume_endless_scrolling);        
        es_pause_button.title = `Pause the endless scrolling.`;
        es_pause_button.innerHTML = `
            <i class="fa fa-pause"></i>
        `;
        es_pause_button.addEventListener(`click`, pause_endless_scrolling);
        document.addEventListener(`scroll`, load_next_page);
        load_next_page();
    }
}

function reverse_comments(context) {
    var i, n;
    for (i = 0, n = context.children.length; i < n; ++i) {
        context.appendChild(context.firstElementChild);
    }
}

function set_es_pagination_navigation() {
    var matches, i, n;
    matches = esgst.pagination_navigation.children;
    for (i = 0, n = matches.length; i < n; ++i) {
        matches[i].addEventListener(`click`, set_es_pagination_navigation_item);
    }
}

function set_es_pagination_navigation_item(event) {
    var page, id;
    event.preventDefault();
    page = event.currentTarget.getAttribute(`data-page-number`);
    id = `es_page_${page}`;
    if (document.getElementById(id)) {
        window.location.hash = id;
    } else {
        window.location.href = event.currentTarget.getAttribute(`href`);
    }
}
