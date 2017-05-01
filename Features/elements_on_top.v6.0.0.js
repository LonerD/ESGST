function load_pagination_navigation_on_top() {
    esgst.pagination_navigation.classList.add(`page_heading_btn`);
    esgst.main_page_heading.appendChild(esgst.pagination_navigation);
}

function load_active_discussions_on_top() {
    esgst.active_discussions.classList.remove(`widget-container--margin-top`);
    esgst.active_discussions.classList.add(`eot_active_discussions`);
    var parent = esgst.active_discussions.parentElement;
    parent.insertBefore(esgst.active_discussions, parent.firstElementChild);
}
