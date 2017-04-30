function fix_header() {
    esgst.header.classList.add(`fe_header`);
    var header_element;
    if (esgst.featured_container) {
        if (esgst.he_fc && esgst.giveaways_path) {
            header_element = esgst.outer_wrap;
        } else {
            header_element = esgst.featured_container;
        }
    } else {
        header_element = esgst.outer_wrap;
    }
    header_element.classList.add(`fe_header_element`);
    var header_height = esgst.header.offsetHeight;
    esgst.page_top += header_height;
    add_header_style();
    
    function add_header_style() {
        var style = `
            .fe_header_element {
                margin-top: ${header_height}px;
            }
        `;
        GM_addStyle(style);
    }
}

function fix_sidebar() {
    var sidebar_top;
    var ad;
    if (esgst.giveaway_comments_path) {
        ad = esgst.sidebar.getElementsByClassName(`sidebar__search-container`)[0].nextElementSibling;
    } else {
        ad = esgst.sidebar.getElementsByClassName(`sidebar__mpu`)[0];
    }
    var sidebar_element = esgst.sidebar.nextElementSibling;
    document.addEventListener(`scroll`, fix);
    fix();
    add_sidebar_style();
    
    function fix() {
        sidebar_top = esgst.sidebar.offsetTop - esgst.page_top;
        if (window.scrollY > sidebar_top) {
            document.removeEventListener(`scroll`, fix);
            toggle_sidebar_fixed();
            document.addEventListener(`scroll`, unfix);
        }
    }
    
    function unfix() {
        if (window.scrollY <= sidebar_top) {
            document.removeEventListener(`scroll`, unfix);
            toggle_sidebar_fixed();
            document.addEventListener(`scroll`, fix);
        }
    }
    
    function toggle_sidebar_fixed() {
        esgst.sidebar.classList.toggle(`fe_sidebar`);
        if (ad) {
            ad.classList.toggle(`esgst_hidden`);
        }
        sidebar_element.classList.toggle(`fe_sidebar_element`);
    }
    
    function add_sidebar_style() {
        var style = `
            .fe_sidebar {
                top: ${esgst.page_top}px;
            }
            .fe_sidebar_element {
                margin-left: ${esgst.sidebar.offsetWidth + 25}px !important;
            }
        `;
        GM_addStyle(style);
    }
}

function fix_main_heading() {
    esgst.main_heading.classList.add(`fe_main_heading`);
    var main_heading_top;
    var main_heading_background_html = `
        <div class="fe_main_heading_background ${esgst.outer_wrap_class}"></div>
    `;
    var main_heading_background;
    var main_heading_placeholder_html = `
        <div class="fe_main_heading_placeholder"></div>
    `;
    var main_heading_placeholder;
    var main_heading_width = esgst.main_heading.offsetWidth;
    var main_heading_height = esgst.main_heading.offsetHeight;
    document.addEventListener(`scroll`, fix);
    fix();
    add_main_heading_style();
    
    function fix() {
        main_heading_top = esgst.main_heading.offsetTop - esgst.page_top;
        if (window.scrollY > main_heading_top) {
            document.removeEventListener(`scroll`, fix);
            esgst.main_heading.classList.add(`fe_main_heading_fixed`);
            esgst.main_heading.insertAdjacentHTML(`afterEnd`, main_heading_background_html);
            main_heading_background = esgst.main_heading.nextElementSibling;
            esgst.main_heading.insertAdjacentHTML(`afterEnd`, main_heading_placeholder_html);            
            main_heading_placeholder = esgst.main_heading.nextElementSibling;
            document.addEventListener(`scroll`, unfix);
        }
    }

    function unfix() {
        if (window.scrollY <= main_heading_top) {
            document.removeEventListener(`scroll`, unfix);
            esgst.main_heading.classList.remove(`fe_main_heading_fixed`);
            main_heading_placeholder.remove();
            main_heading_background.remove();
            document.addEventListener(`scroll`, fix);
        }
    }
    
    function add_main_heading_style() {
        var style = `
            .fe_main_heading_fixed {
                top: ${esgst.page_top}px;
                width: ${main_heading_width}px;
            }
            .fe_main_heading_placeholder {
                height: ${main_heading_height}px;
            }
            .fe_main_heading_background {
                height: ${esgst.page_top + main_heading_height + 5}px;
                width: ${main_heading_width}px;
            }
        `;
        GM_addStyle(style);
    }
}

function fix_footer() {
    esgst.footer.classList.add(`fe_footer`);
    esgst.outer_wrap.classList.add(`fe_footer_element`);
    add_footer_style();
    
    function add_footer_style() {
        var style = `
            .fe_footer_element {
                margin-bottom: ${esgst.footer.offsetHeight}px;
            }
        `;
        GM_addStyle(style);
    }
}
