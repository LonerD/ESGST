function loadEntriesRemover() {
    if (esgst.enteredPath) {
        addERButton(esgst.mainPageHeading);
    } else {
        addERButton();
    }
}

function addERButton(Context) {
    var HTML, Button, Popup, URL, CurrentPage, NextPage, OwnedGames, RemovedEntries;
    if (Context) {
        HTML = `
            <div class="ERButton" title="Remove entries for owned games.">
                <i class="fa fa-tag"></i>
                <i class="fa fa-times-circle"></i>
            </div>
        `;
        Context.insertAdjacentHTML(`afterBegin`, HTML);
        Button = Context.firstElementChild;
    } else {
        Button = document.getElementsByClassName(`form__sync-default`)[0];
    }
    if (Button) {
        Popup = createPopup();
        Popup.Popup.classList.add(`rhPopupLarge`);
        Popup.Icon.classList.add(`fa-times`);
        Popup.Title.textContent = `Remove entries for owned games:`;
        URL = `/giveaways/entered/search?page=`;
        if (window.location.pathname.match(/^\/giveaways\/entered/)) {
            CurrentPage = esgst.currentPage;
        } else {
            CurrentPage = 0;
        }
        NextPage = 1;
        Button.addEventListener(`click`, openPopup);
    }

    function openPopup() {
        Button.classList.add(`rhBusy`);
        Popup.popUp(getResult);
    }

    function getResult() {
        var games = GM_getValue(`Games`);
        syncOwnedGames(Popup, games, checkResult);
    }

    function checkResult(Result) {
        Popup.OverallProgress.textContent = `Removing entries...`;
        switch (Result) {
            case 1:
                OwnedGames = GM_getValue(`OwnedGames`);
                RemovedEntries = {};
                checkNextPage();
                break;
            case 2:
                showResult(`<strong>0 new games found.</strong>`);
                break;
            case 3:
                showResult(`<strong>Invalid Steam API key. Please enter a valid key in the settings menu.</strong>`);
                break;
            case 4:
                showResult(`<strong>No Steam API Key found. Please enter a key in the settings menu.</strong>`);
                break;
        }
    }

    function showResult(Result) {
        Popup.Progress.innerHTML = Popup.OverallProgress.innerHTML = ``;
        Popup.Results.innerHTML = Result;
        Button.classList.remove(`rhBusy`);
    }

    function checkNextPage() {
        Popup.Progress.innerHTML = `
            <i class="fa fa-circle-o-notch fa-spin"></i>
            <span>Checking page ${NextPage}...</span>
        `;
        if (CurrentPage != NextPage) {
            queueRequest(Popup, null, `${URL}${NextPage}`, getNextPage);
        } else {
            goToNextPage(document);
        }
    }

    function getNextPage(Response) {
        goToNextPage(parseHTML(Response.responseText));
    }

    function goToNextPage(Context) {
        ++NextPage;
        setTimeout(getEntries, 0, Context);
    }

    function getEntries(Context) {
        var Entries, N;
        Entries = Context.getElementsByClassName(`table__remove-default`);
        N = Entries.length;
        if (N > 0) {
            checkEntries(0, N, Entries, Context);
        } else {
            checkRemovedEntries();
        }
    }

    function checkEntries(I, N, Entries, Context) {
        checkEntry();

        function checkEntry() {
            var Entry, Container, Image, Match, ID, Type, Title, Code, Data, Pagination;
            if (I < N) {
                Entry = Entries[I];
                Container = Entry.closest(`.table__row-inner-wrap`);
                Image = Container.getElementsByClassName(`global__image-inner-wrap`)[0];
                if (Image) {
                    Match = Image.getAttribute(`style`).match(/\/(apps|subs)\/(\d+)/);
                    ID = parseInt(Match[2]);
                    if (OwnedGames.indexOf(ID) >= 0) {
                        Type = Match[1].replace(/s$/, ``);
                        Title = Container.getElementsByClassName(`table__column__heading`)[0].textContent;
                        if (!RemovedEntries[ID]) {
                            RemovedEntries[ID] = {
                                Type: Type,
                                Title: Title,
                                Entries: 0
                            };
                        }
                        ++RemovedEntries[ID].Entries;
                        if (Context == document) {
                            Entry.click();
                            goToNextEntry();
                        } else {
                            Code = Container.querySelector(`[name="code"]`).value;
                            Data = `xsrf_token=${esgst.xsrfToken}&do=entry_delete&code=${Code}`;
                            queueRequest(Popup, Data, `/ajax.php`, goToNextEntry);
                        }
                    } else {
                        goToNextEntry();
                    }
                } else {
                    goToNextEntry();
                }
            } else {
                Pagination = Context.getElementsByClassName(`pagination__navigation`)[0];
                if (Pagination && !Pagination.lastElementChild.classList.contains(`is-selected`)) {
                    checkNextPage();
                } else {
                    checkRemovedEntries();
                }
            }
        }

        function goToNextEntry() {
            ++I;
            setTimeout(checkEntry, 0);
        }
    }

    function checkRemovedEntries() {
        var Results, N, Key, Entry, Result;
        Results = [];
        N = 0;
        for (Key in RemovedEntries) {
            Entry = RemovedEntries[Key];
            Result = `
                <a href="https://store.steampowered.com/${Entry.Type}/${Key}" target="_blank">
                    ${Entry.Title} (${Entry.Entries})
                </a>
            `;
            Results.push(Result);
            N += Entry.Entries;
        }
        if (Results.length) {
            Result = `
                <strong>${N} entries removed:</strong>
                <span class="popup__actions">
                    ${Results.join(``)}
                </span>
            `;
            showResult(Result);
        } else {
            showResult(`<strong>0 entries removed.</strong>`);
        }
    }
}
