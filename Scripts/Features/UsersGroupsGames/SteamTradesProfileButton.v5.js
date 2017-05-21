function loadSteamTradesProfileButton(Context, User) {
    var STPBButton;
    if (Context.context || esgst.userPath) {        
        if (Context.context) {
            Context = Context.context;
        } else {
            User = esgst.user;
        }
        Context = Context.getElementsByClassName("sidebar__shortcut-inner-wrap")[0];
        Context.insertAdjacentHTML(
            "beforeEnd",
            "<a class=\"STPBButton\" href=\"https://www.steamtrades.com/user/" + User.SteamID64 + "\" rel=\"nofollow\" target=\"_blank\">" +
            "    <i class=\"fa fa-fw\">" +
            "        <img src=\"https://cdn.steamtrades.com/img/favicon.ico\"/>" +
            "    </i>" +
            "</a>"
        );
        STPBButton = Context.lastElementChild;
        Context = Context.parentElement.getElementsByClassName("js-tooltip")[0];
        if (Context) {
            STPBButton.addEventListener("mouseenter", function() {
                Context.textContent = "Visit SteamTrades Profile";
                setSiblingsOpacity(STPBButton, "0.2");
            });
            STPBButton.addEventListener("mouseleave", function() {
                setSiblingsOpacity(STPBButton, "1");
            });
        }
    }
}
