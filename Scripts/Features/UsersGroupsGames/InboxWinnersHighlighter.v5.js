function loadInboxWinnersHighlighter(context) {
    var className;
    var callback;
    if (esgst.winnersPath) {
        className = `table__gift-not-sent`;
        callback = setIWHObserver;
    } else {
        className = `comments__entity`;
        callback = highlightIWHWinner;
    }
    var matches = context.getElementsByClassName(className);
    for (var i = 0, n = matches.length; i < n; ++i) {
        callback(matches[i]);
    }
}

function setIWHObserver(Context) {
    var Key, Username;
    Key = window.location.pathname.match(/\/giveaway\/(.+?)\//)[1];
    Username = Context.closest(".table__row-inner-wrap").getElementsByClassName("table__column__heading")[0].querySelector("a[href*='/user/']").textContent;
    Context.addEventListener("click", function() {
        var Winners;
        Winners = GM_getValue("Winners");
        if (!Winners[Key]) {
            Winners[Key] = [];
        }
        if (Winners[Key].indexOf(Username) < 0) {
            Winners[Key].push(Username);
        }
        GM_setValue("Winners", Winners);
    });
}

function highlightIWHWinner(Context) {
    var Match, Key, Winners, Matches, I, N, Username;
    Match = Context.firstElementChild.firstElementChild.getAttribute("href").match(/\/giveaway\/(.+?)\//);
    if (Match) {
        Key = Match[1];
        Winners = GM_getValue("Winners");
        if (Winners[Key]) {
            Matches = Context.nextElementSibling.children;
            for (I = 0, N = Matches.length; I < N; ++I) {
                Context = Matches[I].getElementsByClassName("comment__username")[0];
                Username = Context.textContent;
                if (Winners[Key].indexOf(Username) >= 0) {
                    Context.insertAdjacentHTML("afterEnd", "<i class=\"fa fa-trophy IWHIcon\" title=\"This is the winner or one of the winners of this giveaway.\"></i>");
                }
            }
        }
    }
}
