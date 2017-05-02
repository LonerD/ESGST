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

function load_main_comment_box_on_top() {
    var html, eot_main_comment_box;
    html = `
        <div class="eot_main_comment_box"></div>
    `;
    esgst.main_page_heading_background.insertAdjacentHTML(`afterEnd`, html);
    eot_main_comment_box = esgst.main_page_heading_background.nextElementSibling;
    eot_main_comment_box.appendChild(esgst.main_comment_box);
}
