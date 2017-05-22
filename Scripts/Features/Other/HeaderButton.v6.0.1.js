function loadHeaderButton() {
    var html = `
        <div class="nav__button-container nav_btn_container">
            <div class="nav__relative-dropdown dropdown ${esgst.hiddenClass}">
                <div class="nav__absolute-dropdown">
                    <a class="nav__row dropdown_btn" href="https://github.com/revilheart/ESGST/raw/master/ESGST.user.js">
                        <i class="icon-blue blue fa fa-fw fa-refresh"></i>
                        <div class="nav__row__summary">
                            <p class="nav__row__summary__name">Update</p>
                            ${esgst.sg ? `
                                <p class="nav__row__summary__description">Check for updates.</p>
                            ` : ``}
                        </div>
                    </a>
                    <a class="nav__row dropdown_btn" href="https://github.com/revilheart/ESGST">
                        <i class="icon-grey grey fa fa-fw fa-github"></i>
                        <div class="nav__row__summary">
                            <p class="nav__row__summary__name">GitHub</p>
                            ${esgst.sg ? `
                                <p class="nav__row__summary__description">Visit the GitHub page.</p>
                            ` : ``}
                        </div>
                    </a>
                    <a class="nav__row dropdown_btn" href="https://www.steamgifts.com/discussion/TDyzv/">
                        <i class="icon-green green fa fa-fw fa-commenting"></i>
                        <div class="nav__row__summary">
                            <p class="nav__row__summary__name">Discussion</p>
                            ${esgst.sg ? `
                                <p class="nav__row__summary__description">Visit the discussion page.</p>
                            ` : ``}
                        </div>
                    </a>
                    ${esgst.uh ? `
                        <div class="nav__row dropdown_btn SMRecentUsernameChanges">
                            <i class="icon-red red fa fa-fw fa-user"></i>
                            <div class="nav__row__summary">
                                <p class="nav__row__summary__name">Recent Username Changes</p>
                                ${esgst.sg ? `
                                    <p class="nav__row__summary__description">Check out the recent username changes.</p>
                                ` : ``}
                            </div>
                        </div>
                    ` : ``}
                    ${esgst.ch ? `
                        <div class="nav__row dropdown_btn SMCommentHistory">
                            <i class="icon-yellow yellow fa fa-fw fa-comments"></i>
                            <div class="nav__row__summary">
                                <p class="nav__row__summary__name">Comment History</p>
                                ${esgst.sg ? `
                                    <p class="nav__row__summary__description">Check out your comment history.</p>
                                ` : ``}
                            </div>
                        </div>
                    ` : ``}
                </div>
            </div>
            <a class="nav__button nav__button--is-dropdown nav_btn nav_btn_left" href="https://www.steamgifts.com/account#ESGST">
                <i class="fa"><img src="${GM_getResourceURL(`esgstIcon`)}"/></i>
                <span>ESGST</span>
            </a>
            <div class="nav__button nav__button--is-dropdown-arrow nav_btn nav_btn_right nav_btn_dropdown">
                <i class="fa fa-angle-down"></i>
            </div>
        </div>
    `;
    var className;
    if (esgst.sg) {
        className = `nav__left-container`;
        insertPosition = `beforeEnd`;
        getPosition = `lastElementChild`;
    } else {
        className = `nav_logo`;
        insertPosition = `afterEnd`;
        getPosition = `nextElementSibling`;
    }
    var context = document.getElementsByClassName(className)[0];
    context.insertAdjacentHTML(insertPosition, html);
    var menu = context[getPosition];
    var SMRecentUsernameChanges = menu.getElementsByClassName("SMRecentUsernameChanges")[0];
    var SMCommentHistory = menu.getElementsByClassName("SMCommentHistory")[0];
    if (SMRecentUsernameChanges) {
        setSMRecentUsernameChanges(SMRecentUsernameChanges);
    }
    if (SMCommentHistory) {
        setSMCommentHistory(SMCommentHistory);
    }
    var button = menu.lastElementChild;
    button.addEventListener(`click`, toggleHeaderButton);

    function toggleHeaderButton(e) {
        if (esgst.sg) {
            $("nav .nav__button").removeClass("is-selected");
            $("nav .nav__relative-dropdown").addClass("is-hidden");
            $(this).addClass("is-selected").siblings(".nav__relative-dropdown").removeClass("is-hidden");
            e.stopPropagation();
        } else {
            $(".nav_btn_dropdown").removeClass("is_selected");
            $(".page_heading_btn_dropdown").removeClass("is_selected");
            $(".dropdown").addClass("is_hidden");
            $(this).addClass("is_selected").siblings(".dropdown").removeClass("is_hidden");
            e.stopPropagation()
        }
    }
}
