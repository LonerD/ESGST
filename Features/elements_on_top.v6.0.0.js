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
    var html, element, eot_main_comment_box, cancel_button;
    html = `
        <div class="eot_main_comment_box"></div>
    `;
    if (esgst.main_page_heading_background) {
        element = esgst.main_page_heading_background;
    } else {
        element = esgst.main_page_heading;
    }
    element.insertAdjacentHTML(`afterEnd`, html);
    eot_main_comment_box = element.nextElementSibling;
    eot_main_comment_box.appendChild(esgst.main_comment_box);
    cancel_button = esgst.main_comment_box.getElementsByClassName(`js__comment-reply-cancel`)[0];
    cancel_button.classList.remove(`js__comment-reply-cancel`);
    cancel_button.addEventListener(`click`, restore);
    
    function restore_main_comment_box() {
        eot_main_comment_box.appendChild(esgst.main_comment_box);
    }
}
