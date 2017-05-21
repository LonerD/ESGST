function loadNotReceivedFinder(Context, User) {
    if (Context.context) {
        Context = Context.sentRow;
        addNRFButton(Context, User);
    } else {
        Context = esgst.sentRow;
        User = esgst.user;
        if (Context) {
            addNRFButton(Context, User);
        }
    }
}

function addNRFButton(Context, User) {
    var NRF;
    NRF = {
        N: parseInt(Context.nextElementSibling.firstElementChild.getAttribute("title").match(/, (.+) Not Received/)[1])
    };
    if (NRF.N > 0) {
        NRF.I = 0;
        NRF.Multiple = [];
        Context.insertAdjacentHTML(
            "beforeEnd",
            " <span class=\"NRFButton\">" +
            "    <i class=\"fa fa-times-circle\" title=\"Find not received giveaways.\"></i>" +
            "</span>"
        );
        setNRFPopup(NRF, Context.lastElementChild, User);
    }
}
function setNRFPopup(NRF, NRFButton, User) {
    var Popup;
    Popup = createPopup();
    Popup.Popup.classList.add("rhPopupLarge");
    Popup.Icon.classList.add("fa-times");
    Popup.Title.textContent = "Find " + User.Username + "'s not received giveaways:";
    createOptions(Popup.Options, NRF, [{
        Check: function() {
            return true;
        },
        Description: "Also search inside giveaways with multiple copies.",
        Title: "If disabled, only giveaways with visible not received copies will be found (faster).",
        Name: "FullSearch",
        Key: "FS",
        ID: "NRF_FS"
    }]);
    Popup.Options.insertAdjacentHTML("afterEnd", createDescription("If you're blacklisted / not whitelisted / not a member of the same Steam groups, not all giveaways will be found."));
    createButton(Popup.Button, "fa-search", "Find", "fa-times-circle", "Cancel", function(Callback) {
        NRFButton.classList.add("rhBusy");
        setNRFSearch(NRF, User, function() {
            NRF.Progress.innerHTML = "";
            NRFButton.classList.remove("rhBusy");
            Callback();
        });
    }, function() {
        clearInterval(NRF.Request);
        clearInterval(NRF.Save);
        NRF.Canceled = true;
        setTimeout(function() {
            NRF.Progress.innerHTML = "";
        }, 500);
        NRFButton.classList.remove("rhBusy");
    });
    NRF.Progress = Popup.Progress;
    NRF.OverallProgress = Popup.OverallProgress;
    NRF.Results = Popup.Results;
    NRFButton.addEventListener("click", function() {
        NRF.Popup = Popup.popUp();
    });
}

function setNRFSearch(NRF, User, Callback) {
    NRF.Progress.innerHTML = NRF.OverallProgress.innerHTML = NRF.Results.innerHTML = "";
    NRF.Popup.reposition();
    NRF.Canceled = false;
    queueSave(NRF, function() {
        saveUser(User, NRF, function() {
            var Match;
            GM_setValue("LastSave", 0);
            User.NRF = getUser(User).NRF;
            if (!User.NRF) {
                User.NRF = {
                    LastSearch: 0,
                    OverallProgress: "",
                    Results: ""
                };
            }
            if (((new Date().getTime()) - User.NRF.LastSearch) > 604800000) {
                Match = window.location.href.match(new RegExp("\/user\/" + User.Username + "(\/search\?page=(\d+))?"));
                searchNRFUser(NRF, User, 1, Match ? (Match[2] ? parseInt(Match[2]) : 1) : 0, "/user/" + User.Username + "/search?page=", function() {
                    User.NRF.LastSearch = new Date().getTime();
                    User.NRF.OverallProgress = NRF.OverallProgress.innerHTML;
                    User.NRF.Results = NRF.Results.innerHTML;
                    loadEndlessFeatures(NRF.Results);
                    queueSave(NRF, function() {
                        saveUser(User, NRF, function() {
                            GM_setValue("LastSave", 0);
                            Callback();
                        });
                    });
                });
            } else {
                NRF.OverallProgress.innerHTML = User.NRF.OverallProgress;
                NRF.Results.innerHTML = User.NRF.Results;
                NRF.Popup.reposition();
                loadEndlessFeatures(NRF.Results);
                Callback();
            }
        });
    });
}

function searchNRFUser(NRF, User, NextPage, CurrentPage, URL, Callback, Context) {
    var Matches, I, N, Match, Pagination;
    if (Context) {
        Matches = Context.querySelectorAll("div.giveaway__column--negative");
        for (I = 0, N = Matches.length; I < N; ++I) {
            NRF.I += Matches[I].querySelectorAll("a[href*='/user/']").length;
            NRF.Results.appendChild(Matches[I].closest(".giveaway__summary").cloneNode(true));
            NRF.Popup.reposition();
        }
        NRF.OverallProgress.innerHTML = NRF.I + " of " + NRF.N + " not received giveaways found...";
        if (NRF.I < NRF.N) {
            if (NRF.FS.checked) {
                Matches = Context.getElementsByClassName("giveaway__heading__thin");
                for (I = 0, N = Matches.length; I < N; ++I) {
                    Match = Matches[I].textContent.match(/\((.+) Copies\)/);
                    if (Match && (parseInt(Match[1]) > 3)) {
                        NRF.Multiple.push(Matches[I].closest(".giveaway__summary").cloneNode(true));
                    }
                }
            }
            Pagination = Context.getElementsByClassName("pagination__navigation")[0];
            if (Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                searchNRFUser(NRF, User, NextPage, CurrentPage, URL, Callback);
            } else if (NRF.FS.checked && NRF.Multiple.length) {
                searchNRFMultiple(NRF, 0, NRF.Multiple.length, Callback);
            } else {
                Callback();
            }
        } else {
            Callback();
        }
    } else if (!NRF.Canceled) {
        NRF.Progress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>Searching " + User.Username + "'s giveaways (page " + NextPage + ")...</span>";
        if (CurrentPage != NextPage) {
            queueRequest(NRF, null, URL + NextPage, function(Response) {
                searchNRFUser(NRF, User, ++NextPage, CurrentPage, URL, Callback, parseHTML(Response.responseText));
            });
        } else {
            searchNRFUser(NRF, User, ++NextPage, CurrentPage, URL, Callback, document);
        }
    }
}

function searchNRFMultiple(NRF, I, N, Callback) {
    if (!NRF.Canceled) {
        NRF.Progress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>Searching inside giveaways with multiple copies (" + I + " of " + N + ")...</span>";
        if (I < N) {
            searchNRFGiveaway(NRF, NRF.Multiple[I].getElementsByClassName("giveaway__heading__name")[0].getAttribute("href") + "/winners/search?page=", 1, function(Found) {
                if (Found) {
                    NRF.Results.appendChild(NRF.Multiple[I].cloneNode(true));
                }
                if (NRF.I < NRF.N) {
                    searchNRFMultiple(NRF, ++I, N, Callback);
                } else {
                    Callback();
                }
            });
        } else {
            Callback();
        }
    }
}

function searchNRFGiveaway(NRF, URL, NextPage, Callback) {
    if (!NRF.Canceled) {
        queueRequest(NRF, null, URL + NextPage, function(Response) {
            var ResponseHTML, Matches, I, N, Found, Pagination;
            ResponseHTML = parseHTML(Response.responseText);
            Matches = ResponseHTML.getElementsByClassName("table__column--width-small");
            for (I = 0, N = Matches.length; I < N; ++I) {
                if (Matches[I].textContent.match(/Not Received/)) {
                    Found = true;
                    ++NRF.I;
                    NRF.OverallProgress.innerHTML = NRF.I + " of " + NRF.N + " not received giveaways found...";
                    if (NRF.I >= NRF.N) {
                        break;
                    }
                }
            }
            Pagination = ResponseHTML.getElementsByClassName("pagination__navigation")[0];
            if ((NRF.I < NRF.N) && Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                searchNRFGiveaway(NRF, URL, ++NextPage, Callback);
            } else {
                Callback(Found);
            }
        });
    }
}
