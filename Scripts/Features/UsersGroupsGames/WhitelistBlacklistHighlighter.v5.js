function loadWhitelistBlacklistHighlighter() {
    if (Object.keys(esgst.currentUsers).length) {
        var SavedUsers = GM_getValue("Users");
        for (var I = 0, N = SavedUsers.length; I < N; ++I) {
            var UserID = esgst.sg ? SavedUsers[I].Username : SavedUsers[I].SteamID64;
            if (esgst.currentUsers[UserID]) {
                addWBHIcon(SavedUsers[I], esgst.currentUsers[UserID]);
            }
        }
    }
}

function addWBHIcon(User, Matches) {
    var Message, Icon, HTML, I, N, Context, Container;
    if (User.Whitelisted || User.Blacklisted) {
        if (User.Whitelisted) {
            Message = "whitelisted";
            Icon = "whitelist fa-heart";
        } else {
            Message = "blacklisted";
            Icon = "blacklist fa-ban";
        }
        HTML =
            "<span class=\"sidebar__shortcut-inner-wrap WBHIcon rhWBIcon\" title=\"You have " + Message + " " + User.Username + ".\">" +
            "    <i class=\"fa sidebar__shortcut__" + Icon + " is-disabled is-selected\" style=\"background: none !important;\"></i>" +
            "</span>";
        for (I = 0, N = Matches.length; I < N; ++I) {
            Context = Matches[I];
            Container = Context.parentElement;
            if (Container.classList.contains("comment__username")) {
                Context = Container;
            }
            Context.insertAdjacentHTML("beforeBegin", HTML);
        }
    }
}
