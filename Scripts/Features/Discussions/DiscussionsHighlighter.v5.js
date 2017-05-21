function loadDiscussionsHighlighter() {
    if (esgst.discussionPath) {
        highlightDHDiscussion();
    } else {
        getDHDiscussions(document);
        esgst.endlessFeatures.push(getDHDiscussions);
    }
}

function getDHDiscussions(context) {
    var matches = context.getElementsByClassName(`table__row-outer-wrap`);
    highlightDHDiscussions(matches);
}

function highlightDHDiscussions(Matches) {
    var Comments, I, N, Match, Key, Container;
    Comments = GM_getValue("Comments");
    for (I = 0, N = Matches.length; I < N; ++I) {
        Match = Matches[I].getElementsByClassName("table__column__heading")[0].getAttribute("href").match(/\/discussion\/(.+?)\//);
        if (Match) {
            Key = Match[1];
            if (!Comments[Key]) {
                Comments[Key] = {
                    Highlighted: false
                };
            }
            Container = Matches[I].getElementsByClassName("table__column--width-fill")[0].firstElementChild;
            if (Comments[Key].Highlighted) {
                Matches[I].classList.add("DHHighlight");
                Container.insertAdjacentHTML("afterBegin", "<i class=\"fa fa-star DHIcon\" title=\"Unhighlight discussion.\"></i>");
            } else {
                Container.insertAdjacentHTML("afterBegin", "<i class=\"fa fa-star-o DHIcon\" title=\"Highlight discussion.\"></i>");
            }
            setDHIcon(Container.firstElementChild, Matches[I], Key);
        }
    }
    GM_setValue("Comments", Comments);
}

function highlightDHDiscussion() {
    var Comments, Key, Context, Container;
    Comments = GM_getValue("Comments");
    Key = window.location.pathname.match(/\/discussion\/(.+?)\//)[1];
    if (!Comments[Key]) {
        Comments[Key] = {
            Highlighted: false
        };
    }
    Context = document.getElementsByClassName("page__heading")[0];
    Container = Context.firstElementChild;
    if (Comments[Key].Highlighted) {
        Container.classList.add("DHHighlight");
        Context.insertAdjacentHTML(
            "afterBegin",
            "<div>" +
            "    <i class=\"fa fa-star DHIcon\" title=\"Unhighlight discussion.\"></i>" +
            "</div>"
        );
    } else {
        Context.insertAdjacentHTML(
            "afterBegin",
            "<div>" +
            "    <i class=\"fa fa-star-o DHIcon\" title=\"Highlight discussion.\"></i>" +
            "</div>"
        );
    }
    setDHIcon(Context.firstElementChild.firstElementChild, Container, Key);
    GM_setValue("Comments", Comments);
}

function setDHIcon(DHIcon, Context, Key) {
    DHIcon.addEventListener("click", function() {
        var Comments;
        DHIcon.classList.toggle("fa-star");
        DHIcon.classList.toggle("fa-star-o");
        DHIcon.title = DHIcon.classList.contains("fa-star") ? "Unhighlight discussion." : "Highlight discussion.";
        if (Context) {
            Context.classList.toggle("DHHighlight");
        }
        Comments = GM_getValue("Comments");
        Comments[Key].Highlighted = Comments[Key].Highlighted ? false : true;
        GM_setValue("Comments", Comments);
    });
}
