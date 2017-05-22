function loadGameCategories() {
    if (esgst.newGiveawayPath) {
        var table = document.getElementsByClassName(`js__autocomplete-data`)[0];
        var backup = table.innerHTML;
        window.setInterval(function() {
            if (table.innerHTML && (backup != table.innerHTML)) {
                addGameCategories(table);
                backup = table.innerHTML;
            }
        }, 500);
    } else {
        esgst.endlessFeatures.push(addGameCategories);
        addGameCategories(document);
    }
}

function addGameCategories(context) {
    if (esgst.newGiveawayPath) {
        className = `table__column__secondary-link`;
        context = document;
    } else {
        className = `giveaway__heading`;
    }
    var matches = context.getElementsByClassName(className);
    var games = GM_getValue(`Games`);
    for (var i = 0, n = matches.length; i < n; ++i) {
        var steamButton;
        if (esgst.newGiveawayPath) {
            steamButton = matches[i];
        } else {
            steamButton = matches[i].querySelector(`a[href*="store.steampowered.com"]`);
        }
        if (steamButton) {
            var id = steamButton.getAttribute(`href`).match(/\d+/)[0];
            if (games[id]) {
                addGameCategory(matches[i], games[id]);
            }
        }
    }
}

function addGameCategory(context, game) {
    if (game.bundled) {
        if (!context.parentElement.getElementsByClassName(`esgst-gc-bundled`)[0]) {
            var html = `
                <div class="nav__notification esgst-gc-bundled">Bundled</div>
            `;
            context.insertAdjacentHTML(`afterEnd`, html);
        }
    }
}
