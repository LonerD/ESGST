function loadRealCvCalculator() {
    var table = document.getElementsByClassName(`table--summary`)[0];
    if (table) {
        var id = GM_getValue(`rcvcId`);
        if (id) {
            var headings = document.getElementsByClassName(`featured__heading__small`);
            var copiesHeading, pointsHeading;
            if (headings.length > 1) {
                copiesHeading = headings[0];
                pointsHeading = headings[1];
            } else {
                pointsHeading = headings[0];
            }
            var copies;
            if (copiesHeading) {
                copies = parseInt(copiesHeading.textContent.match(/\d+/)[0]);
            } else {
                copies = 1;
            }
            var value = parseInt(pointsHeading.textContent.match(/\d+/)[0]);
            var games = GM_getValue(`Games`);
            if (games[id] && games[id].bundled) {
                value *= 0.15;
            }
            var user = {
                Username: GM_getValue(`Username`),
                SteamID64: GM_getValue(`SteamID64`)
            };
            var savedUser = getUser(user);
            var sent = 0;
            if (savedUser && savedUser.UGD && savedUser.UGD.Sent && savedUser.UGD.Sent[id]) {
                var giveaways = savedUser.UGD.Sent[id];
                for (var i = 0, n = giveaways.length; i < n; ++i) {
                    var giveaway = giveaways[i];
                    if (((giveaways.Entries < 5) && !giveaway.Private && !giveaway.Group && !giveaway.Whitelist) ||
                        (giveaway.Entries >= 5)
                    ) {
                        if (giveaway.Entries >= giveaway.Copies) {
                            sent += giveaway.Copies;
                        } else {
                            sent += giveaway.Entries;
                        }
                    }
                }
                if (sent > 5) {
                    for (var i = 0, n = sent - 5; i < n; ++i) {
                        value *= 0.90;
                    }
                }
            }
            var cv;
            if (copies > 1) {
                var total = copies + sent;
                if (total > 5) {
                    n = total - 5;
                    cv = (copies - n) * value;
                    for (var i = 0; i < n; ++i) {
                        value *= 0.90;
                        cv += value;
                    }
                } else {
                    cv = value * copies;
                }
            } else if ((sent + 1) > 5) {
                cv = value * 0.90;
            } else {
                cv = value;
            }
            cv = Math.round(cv * 100) / 100;
            var html = `
                <div class="table__row-outer-wrap">
                    <div class="table__row-inner-wrap">
                        <div class="table__column--width-medium table__column--align-top">
                            <strong>Real CV</strong>
                        </div>
                    <div class="table__column--width-fill">You should get ~$${cv} real CV for this giveaway.</div>
            		</div>
            	</div>
            `;
            table.insertAdjacentHTML(`beforeEnd`, html);
            var button = document.getElementsByClassName(`js__submit-form`)[0];
            button.addEventListener(`click`, function() {
                GM_deleteValue(`rcvc`);
            })
        }
    } else {
        var button = document.getElementsByClassName(`js__submit-form`)[0];
        var input = document.querySelector(`[name="game_id"]`);
        button.addEventListener(`click`, function() {
            var selectedId = input.value;
            var selected = document.querySelector(`[data-autocomplete-id="${selectedId}"]`);
            var id = parseInt(selected.getElementsByClassName(`table__column__secondary-link`)[0].textContent.match(/\d+/)[0]);
            GM_setValue(`rcvcId`, id);
        });
    }
}
