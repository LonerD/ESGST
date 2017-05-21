function loadGamesHighlighter() {
    if (esgst.giveawayCommentsPath) {
        setEGHHighlighter();
    }
    highlightEGHGames();
    esgst.endlessFeatures.push(highlightEGHGames);
}

function setEGHHighlighter() {
    var EnterButton, Context;
    EnterButton = document.getElementsByClassName("sidebar__entry-insert")[0];
    if (EnterButton) {
        Context = document.getElementsByClassName("featured__heading")[0];
        EnterButton.addEventListener("click", function() {
            saveEGHGame(Context);
        });
    }
}

function saveEGHGame(Context) {
    var Game, SavedGames;
    Game = Context.querySelector("[href*='store.steampowered.com']").getAttribute("href").match(/\d+/)[0];
    SavedGames = GM_getValue("Games");
    if (SavedGames[Game]) {
        SavedGames[Game].Entered = true;
        GM_setValue("Games", SavedGames);
    } else {
        SavedGames[Game] = {
            Entered: true
        };
        GM_setValue("Games", SavedGames);
    }
}

function highlightEGHGames() {
    var SavedGames = GM_getValue("Games");
    for (var Game in SavedGames) {
        if (esgst.currentGames[Game]) {
            if (SavedGames[Game].Entered) {
                highlightEGHGame(SavedGames, Game, esgst.currentGames[Game]);
            }
        }
    }
}

function highlightEGHGame(SavedGames, Game, Matches) {
    var I, N, Context;
    if (SavedGames[Game] && SavedGames[Game].Entered) {
        for (I = 0, N = Matches.length; I < N; ++I) {
            Context = Matches[I].match.closest(".featured__summary, .giveaway__row-inner-wrap, .table__row-inner-wrap")
                .querySelector(".featured__heading, .giveaway__heading, .table__column--width-fill p");
            Context.insertAdjacentHTML("afterBegin", "<i class=\"fa fa-star EGHIcon\" title=\"You have entered giveaways for this game before. Click to unhighlight it.\"></i>");
            setEGHRemove(Context.firstElementChild, Game);
        }
    }
}

function setEGHRemove(EGHIcon, Game) {
    EGHIcon.addEventListener("click", function() {
        Games = GM_getValue("Games");
        Games[Game].Entered = false;
        GM_setValue("Games", Games);
        EGHIcon.remove();
    });
}
