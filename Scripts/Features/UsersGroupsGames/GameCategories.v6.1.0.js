function loadGameCategories() {
    if (esgst.newGiveawayPath) {
        var table = document.getElementsByClassName(`js__autocomplete-data`)[0];
        var backup = table.innerHTML;
        var games = GM_getValue(`Games`);
        window.setInterval(function() {
            if (table.innerHTML && (backup != table.innerHTML)) {
                var matches = table.getElementsByClassName(`table__column__secondary-link`);
                for (var i = 0, n = matches.length; i < n; ++i) {
                    var id = matches[i].getAttribute(`href`).match(/\d+/)[0];
                    if (games[id]) {
                        if (!matches[i].parentElement.getElementsByClassName(`esgst-gc bundled`)[0]) {
                            var html = `
                                <div class="nav__notification esgst-gc bundled">Bundled</div>
                            `;
                            matches[i].insertAdjacentHTML(`afterEnd`, html);
                        }
                    }
                }
                backup = table.innerHTML;
            }
        }, 500);
    } else {
        esgst.endlessFeatures.push(setGameCategories);
        setGameCategories(document);
    }
}

function setGameCategories(context) {
    var query;
    if (esgst.newGiveawayPath) {
        query = `.table__column__secondary-link`;
        context = document;
    } else {
        query = `.giveaway__heading, .featured__heading`;
    }
    var matches = context.querySelectorAll(query);
    var games = GM_getValue(`Games`);
    addGameCategories(0, matches.length, matches, games);
}

function addGameCategories(i, n, matches, games) {
    if (i < n) {
        var steamButton;
        if (esgst.newGiveawayPath) {
            steamButton = matches[i];
        } else {
            steamButton = matches[i].querySelector(`a[href*="store.steampowered.com"]`);
        }
        if (steamButton) {
            var id = steamButton.getAttribute(`href`).match(/\d+/)[0];
            if (!games[id]) {
                games[id] = {};
            }
            addGameCategory(matches[i], games, id, function () {
                window.setTimeout(addGameCategories, 0, ++i, n, matches, games);
            });
        } else {
            window.setTimeout(addGameCategories, 0, ++i, n, matches, games);
        }
    } else {
        queueSave({}, function() {
            updateGames(games);
            GM_setValue(`LastSave`, 0);
        });
    }
}

function addGameCategory(context, games, id, callback) {
    if ((typeof games[id].lastCheck == `undefined`) || (((new Date().getTime()) - games[id].lastCheck) > 8640000)) {
        makeRequest(null, `http://store.steampowered.com/api/appdetails?appids=${id}`, null, function(response) {
            var responseJson = parseJSON(response.responseText);
            if (responseJson[id].success) {
                games[id].type = responseJson[id].data.type;
                if (games[id].type == `dlc`) {
                    games[id].dlc = true;
                }
                games[id].windows = responseJson[id].data.platforms.windows;
                games[id].linux = responseJson[id].data.platforms.linux;
                games[id].mac = responseJson[id].data.platforms.mac;
                for (var i = 0, n = responseJson[id].data.categories.length; i < n; ++i) {
                    if (responseJson[id].data.categories[i].description == `Steam Achievements`) {
                        games[id].achievements = true;
                    } else if (responseJson[id].data.categories[i].description == `Steam Trading Cards`) {
                        games[id].tradingCards = true;
                    } else if (responseJson[id].data.categories[i].description == `Multi-player`) {
                        games[id].multiplayer = true;
                    } else if (responseJson[id].data.categories[i].description == `Steam Cloud`) {
                        games[id].steamCloud = true;
                    }
                }
                games[id].genres = [];
                for (var i = 0, n = responseJson[id].data.genres.length; i < n; ++i) {
                    games[id].genres.push(responseJson[id].data.genres[i].description);
                }
            }
            games[id].lastCheck = new Date().getTime();
            addGameCategory(context, games, id, callback);
        });
    } else {
        var categories = [
            {
                id: `gc_b`,
                key: `bundled`,
                name: `Bundled`
            },
            {
                id: `gc_tc`,
                key: `tradingCards`,
                name: `Trading Cards`
            },
            {
                id: `gc_a`,
                key: `achievements`,
                name: `Achievements`
            },
            {
                id: `gc_m`,
                key: `multiplayer`,
                name: `Multiplayer`
            },
            {
                id: `gc_sc`,
                key: `steamCloud`,
                name: `Steam Cloud`
            },
            {
                id: `gc_l`,
                key: `linux`,
                name: `Linux`
            },
            {
                id: `gc_m`,
                key: `mac`,
                name: `Mac`
            },
            {
                id: `gc_dlc`,
                key: `dlc`,
                name: `DLC`
            },
            {
                id: `gc_g`,
                key: `genres`,
                name: `Genres`
            }
        ];
        for (var i = 0, n = categories.length - 1; i <= n; ++i) {
            var category = categories[n - i];
            if (esgst[category.id] && ((category.id == `gc_b` && esgst.newGiveawayPath) || !esgst.newGiveawayPath)) {
                var value = games[id][category.key];
                if (value) {
                    if (!context.parentElement.getElementsByClassName(`esgst-gc-${category.key}`)[0]) {
                        var text;
                        if (category.key == `genres`) {
                            text = value.join(`, `);
                        } else {
                            text = category.name;
                        }
                        var html = `
                            <div class="nav__notification esgst-gc ${category.key}">${text}</div>
                        `;
                        context.insertAdjacentHTML(`afterEnd`, html);
                    }
                }
            }
        }
        callback();
    }
}
