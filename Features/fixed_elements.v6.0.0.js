function load_fixed_header() {
    var header_sibling;
    esgst.header.classList.add(`fe_header`);
    if (esgst.featured_container) {
        if (esgst.giveaways_path && esgst.he_fc) {
            header_sibling = esgst.page_outer_wrap;
        } else {
            header_sibling = esgst.featured_container;
        }
    } else {
        header_sibling = esgst.page_outer_wrap;
    }
    header_sibling.classList.add(`fe_header_sibling`);
    add_header_style();
    
    function add_header_style() {
        var header_height, header_style;
        header_height = esgst.header.offsetHeight;
        header_style = `
            .fe_header_sibling {
                margin-top: ${header_height}px;
            }
        `;
        GM_addStyle(header_style);
        esgst.page_top += header_height;
        esgst.comments_top += header_height;
    }
}

function load_fixed_sidebar() {
    var sidebar_top, ad, sidebar_sibling;
    if (esgst.giveaway_comments_path) {
        ad = esgst.sidebar.getElementsByClassName(`sidebar__search-container`)[0].nextElementSibling;
    } else {
        ad = esgst.sidebar.getElementsByClassName(`sidebar__mpu`)[0];
    }
    sidebar_sibling = esgst.sidebar.nextElementSibling;
    document.addEventListener(`scroll`, fix_sidebar);
    fix_sidebar();
    add_sidebar_style();
    
    function fix_sidebar() {
        sidebar_top = esgst.sidebar.offsetTop - esgst.page_top;
        if (window.scrollY > sidebar_top) {
            document.removeEventListener(`scroll`, fix_sidebar);
            toggle_fixed_sidebar();
            document.addEventListener(`scroll`, unfix_sidebar);
        }
    }
    
    function unfix_sidebar() {
        if (window.scrollY <= sidebar_top) {
            document.removeEventListener(`scroll`, unfix_sidebar);
            toggle_fixed_sidebar();
            document.addEventListener(`scroll`, fix_sidebar);
        }
    }
    
    function toggle_fixed_sidebar() {
        esgst.sidebar.classList.toggle(`fe_sidebar`);
        if (ad) {
            ad.classList.toggle(`esgst_hidden`);
        }
        sidebar_sibling.classList.toggle(`fe_sidebar_sibling`);
    }
    
    function add_sidebar_style() {
        var sidebar_style;
        sidebar_style = `
            .fe_sidebar {
                top: ${esgst.page_top}px;
            }
            .fe_sidebar_sibling {
                margin-left: ${esgst.sidebar.offsetWidth + 25}px !important;
            }
        `;
        GM_addStyle(sidebar_style);
    }
}

function load_fixed_main_page_heading() {
    var main_page_heading_html, main_page_heading_top,
        main_page_heading_width, main_page_heading_height;
    esgst.main_page_heading.classList.add(`fe_main_page_heading`);
    main_page_heading_html = `
        <div class="fe_main_page_heading_placeholder esgst_hidden"></div>
        <div class="${esgst.page_outer_wrap_class} fe_main_page_heading_background esgst_hidden"></div>
    `;
    esgst.main_page_heading.insertAdjacentHTML(`afterEnd`, main_page_heading_html);
    esgst.main_page_heading_placeholder = esgst.main_page_heading.nextElementSibling;
    esgst.main_page_heading_background = main_page_heading_placeholder.nextElementSibling;
    main_page_heading_width = esgst.main_page_heading.offsetWidth;
    main_page_heading_height = esgst.main_page_heading.offsetHeight;
    esgst.comments_top += main_page_heading_height + 5;
    document.addEventListener(`scroll`, fix_main_page_heading);
    fix_main_page_heading();
    add_main_page_heading_style();
    
    function fix_main_page_heading() {
        main_page_heading_top = esgst.main_page_heading.offsetTop - esgst.page_top;
        if (window.scrollY > main_page_heading_top) {
            document.removeEventListener(`scroll`, fix_main_page_heading);
            toggle_fixed_main_page_heading();
            document.addEventListener(`scroll`, unfix_main_page_heading);
        }
    }

    function unfix_main_page_heading() {
        if (window.scrollY <= main_page_heading_top) {
            document.removeEventListener(`scroll`, unfix_main_page_heading);
            toggle_fixed_main_page_heading();            
            document.addEventListener(`scroll`, fix_main_page_heading);
        }
    }
    
    function toggle_fixed_main_page_heading() {
        esgst.main_page_heading.classList.toggle(`fe_main_page_heading_fixed`);
        esgst.main_page_heading_placeholder.classList.toggle(`esgst_hidden`);
        esgst.main_page_heading_background.classList.toggle(`esgst_hidden`);
    }
    
    function add_main_page_heading_style() {
        var main_page_heading_style;
        main_page_heading_style = `
            .fe_main_page_heading_fixed {
                top: ${esgst.page_top}px;
                width: ${main_page_heading_width}px;
            }
            .fe_main_page_heading_placeholder {
                height: ${main_page_heading_height}px;
            }
            .fe_main_page_heading_background {
                height: ${esgst.page_top + main_page_heading_height + 5}px;
                width: ${main_page_heading_width}px;
            }
        `;
        GM_addStyle(main_page_heading_style);
    }
}

function load_fixed_footer() {
    esgst.footer.classList.add(`fe_footer`);
    esgst.page_outer_wrap.classList.add(`fe_footer_sibling`);
    add_footer_style();
    
    function add_footer_style() {
        var footer_style;
        footer_style = `
            .fe_footer_sibling {
                margin-bottom: ${esgst.footer.offsetHeight}px;
            }
        `;
        GM_addStyle(footer_style);
    }
}
