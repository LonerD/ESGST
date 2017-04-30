function move_pagination_navigation_to_top() {
    esgst.pagination_navigation.classList.add(`page_heading_btn`);
    esgst.main_heading.appendChild(esgst.pagination_navigation);
}

function move_active_discussions_to_top() {
    esgst.active_discussions.classList.remove(`widget-container--margin-top`);
    esgst.active_discussions.classList.add(`eot_active_discussions`);
    var parent = esgst.active_discussions.parentElement;
    parent.insertBefore(esgst.active_discussions, parent.firstElementChild);
}
