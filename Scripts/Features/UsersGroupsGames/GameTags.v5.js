function loadGameTags() {
    for (var key in esgst.currentGames) {
        for (var i = 0, n = esgst.currentGames[key].length; i < n; ++i) {
            addGTButton(esgst.currentGames[key][i].match, key, esgst.currentGames[key][i].title);
        }
    }
    if (Object.keys(esgst.currentGames).length) {
        var SavedGames = GM_getValue("Games");
        for (var Game in SavedGames) {
            if (esgst.currentGames[Game] && SavedGames[Game].Tags) {
                addGTTags(Game, SavedGames[Game].Tags);
            }
        }
    }
}

function addGTButton(Context, Game, Title) {
    Context.insertAdjacentHTML(
        "beforeEnd",
        "<a class=\"GTButton\">" +
        "    <i class=\"fa fa-tag\"></i>" +
        "    <span class=\"GTTags\"></i>" +
        "</a>"
    );
    Context.lastElementChild.addEventListener("click", function() {
        var Popup, SavedGames;
        Popup = createPopup(true);
        Popup.Icon.classList.add("fa-tag");
        Popup.Title.innerHTML = "Edit game tags for <span>" + Title + "</span>:";
        Popup.TextInput.classList.remove("rhHidden");
        Popup.TextInput.insertAdjacentHTML("afterEnd", createDescription("Use commas to separate tags, for example: Tag1, Tag2, ..."));
        createButton(Popup.Button, "fa-check", "Save", "fa-circle-o-notch fa-spin", "Saving...", function(Callback) {
            SavedGames = GM_getValue("Games");
            if (!SavedGames[Game]) {
                SavedGames[Game] = {};
            }
            SavedGames[Game].Tags = Popup.TextInput.value.replace(/(,\s*)+/g, function(Match, P1, Offset, String) {
                return (((Offset === 0) || (Offset == (String.length - Match.length))) ? "" : ", ");
            });
            GM_setValue("Games", SavedGames);
            addGTTags(Game, SavedGames[Game].Tags);
            Callback();
            Popup.Close.click();
        });
        Popup.popUp(function() {
            Popup.TextInput.focus();
            SavedGames = GM_getValue("Games");
            if (SavedGames[Game]) {
                Popup.TextInput.value = SavedGames[Game].Tags;
            }
        });
    });
}

function addGTTags(Game, Tags) {
    var Matches, Prefix, Suffix, HTML, I, N;
    Matches = esgst.games[Game];
    Prefix = "<span class=\"global__image-outer-wrap author_avatar is_icon\">";
    Suffix = "</span>";
    HTML = Tags ? Tags.replace(/^|,\s|$/g, function(Match, Offset, String) {
        return ((Offset === 0) ? Prefix : ((Offset == (String.length - Match.length)) ? Suffix : (Suffix + Prefix)));
    }) : "";
    for (I = 0, N = Matches.length; I < N; ++I) {
        Matches[I].getElementsByClassName("GTTags")[0].innerHTML = HTML;
    }
}
