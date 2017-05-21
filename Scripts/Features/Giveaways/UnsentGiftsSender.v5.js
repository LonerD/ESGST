function loadUnsentGiftsSender() {
    if (esgst.newTicketPath) {
        setUGSObserver();
    } else {
        addUGSButton(esgst.mainPageHeading);
    }
}

function setUGSObserver() {
    document.getElementsByClassName("form__submit-button")[0].addEventListener("click", function() {
        var Winner, Rerolls;
        if (document.querySelector("[name='category_id']").value == 1) {
            Winner = document.querySelector("[name='reroll_winner_id']").value;
            Rerolls = GM_getValue("Rerolls");
            if (Rerolls.indexOf(Winner) < 0) {
                Rerolls.push(Winner);
                GM_setValue("Rerolls", Rerolls);
            }
        }
    });
}

function addUGSButton(Context) {
    var Popup, UGS, UGSButton;
    Popup = createPopup();
    Popup.Icon.classList.add("fa-gift");
    Popup.Title.textContent = "Send unsent gifts:";
    UGS = {};
    createOptions(Popup.Options, UGS, [{
        Check: function() {
            return true;
        },
        Description: "Only send to users with 0 not activated / multiple wins.",
        Title: "This option will retrieve the results in real time, without using caches.",
        Name: "SendActivatedNotMultiple",
        Key: "SANM",
        ID: "UGS_SANM"
    }, {
        Check: function() {
            return true;
        },
        Description: "Only send to users who are whitelisted.",
        Title: "This option will use your whitelist cache.\nMake sure to sync it through the settings menu if you whitelisted a new user since the last sync.\n" + (
            "Whitelisted users get a pass for not activated / multiple wins."),
        Name: "SendWhitelist",
        Key: "SW",
        ID: "UGS_SW"
    }]);
    Context.insertAdjacentHTML(
        "afterBegin",
        "<a class=\"UGSButton\" title=\"Send unsent gifts.\">" +
        "    <i class=\"fa fa-gift\"></i>" +
        "    <i class=\"fa fa-send\"></i>" +
        "</a>"
    );
    UGSButton = Context.firstElementChild;
    createButton(Popup.Button, "fa-send", "Send", "fa-times-circle", "Cancel", function(Callback) {
        var Match;
        UGSButton.classList.add("rhBusy");
        UGS.Progress.innerHTML = UGS.OverallProgress.innerHTML = "";
        UGS.Sent.classList.add("rhHidden");
        UGS.Unsent.classList.add("rhHidden");
        UGS.SentCount.textContent = UGS.UnsentCount.textContent = "0";
        UGS.SentUsers.innerHTML = UGS.UnsentUsers.innerHTML = "";
        UGS.Canceled = false;
        UGS.Giveaways = [];
        UGS.Checked = [];
        UGS.Winners = GM_getValue("Winners");
        Match = window.location.href.match(/page=(\d+)/);
        getUGSGiveaways(UGS, 1, Match ? parseInt(Match[1]) : 1, function() {
            var N;
            N = UGS.Giveaways.length;
            if (N > 0) {
                getUGSWinners(UGS, 0, N, function() {
                    UGSButton.classList.remove("rhBusy");
                    UGS.Progress.innerHTML = UGS.OverallProgress.innerHTML = "";
                    GM_setValue("Winners", UGS.Winners);
                    Callback();
                });
            } else {
                UGSButton.classList.remove("rhBusy");
                UGS.Progress.innerHTML =
                    "<i class=\"fa fa-check-circle giveaway__column--positive\"></i> " +
                    "<span>You have no unsent gifts.</span>";
                UGS.OverallProgress.innerHTML = "";
                Callback();
            }
        });
    }, function() {
        clearInterval(UGS.Request);
        clearInterval(UGS.Save);
        UGS.Canceled = true;
        setTimeout(function() {
            UGS.Progress.innerHTML = UGS.OverallProgress.innerHTML = "";
        }, 500);
        UGSButton.classList.remove("rhBusy");
    });
    UGS.Progress = Popup.Progress;
    UGS.OverallProgress = Popup.OverallProgress;
    createResults(Popup.Results, UGS, [{
        Icon: "<i class=\"fa fa-check-circle giveaway__column--positive\"></i> ",
        Description: "Sent gifts to ",
        Key: "Sent"
    }, {
        Icon: "<i class=\"fa fa-times-circle giveaway__column--negative\"></i> ",
        Description: "Did not send gifts to ",
        Key: "Unsent"
    }]);
    UGSButton.addEventListener("click", function() {
        UGS.Popup = Popup.popUp();
    });
}

function getUGSGiveaways(UGS, NextPage, CurrentPage, Callback, Context) {
    var Matches, N, I, Pagination;
    if (Context) {
        Matches = Context.getElementsByClassName("fa icon-red fa-warning");
        N = Matches.length;
        if (N > 0) {
            for (I = 0; I < N; ++I) {
                UGS.Giveaways.push({
                    Name: Matches[I].closest(".table__row-inner-wrap").getElementsByClassName("table__column__heading")[0].textContent.match(/(.+?)( \(.+ Copies\))?$/)[1],
                    URL: Matches[I].nextElementSibling.getAttribute("href"),
                    Context: Matches[I]
                });
            }
            Pagination = Context.getElementsByClassName("pagination__navigation")[0];
            if (Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                getUGSGiveaways(UGS, NextPage, CurrentPage, Callback);
            } else {
                Callback();
            }
        } else {
            Callback();
        }
    } else if (!UGS.Canceled) {
        UGS.Progress.innerHTML =
            "<i class=\"fa fa-circle-o-notch\"></i> " +
            "<span>Retrieving unsent giveaways (page " + NextPage + ")...</span>";
        if (CurrentPage != NextPage) {
            queueRequest(UGS, null, "/giveaways/created/search?page=" + NextPage, function(Response) {
                getUGSGiveaways(UGS, ++NextPage, CurrentPage, Callback, parseHTML(Response.responseText));
            });
        } else {
            getUGSGiveaways(UGS, ++NextPage, CurrentPage, Callback, document);
        }
    }
}

function getUGSWinners(UGS, I, N, Callback) {
    if (!UGS.Canceled) {
        UGS.OverallProgress.textContent = I + " of " + N + " giveaways retrieved...";
        if (I < N) {
            UGS.Progress.innerHTML =
                "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                "<span>Retrieving winners...</span>";
            queueRequest(UGS, null, UGS.Giveaways[I].URL, function(Response) {
                var ResponseHTML, Matches, Winners, J, NumMatches, WinnersKeys;
                ResponseHTML = parseHTML(Response.responseText);
                Matches = ResponseHTML.getElementsByClassName("table__row-inner-wrap");
                Winners = {};
                for (J = 0, NumMatches = Matches.length; J < NumMatches; ++J) {
                    Winners[Matches[J].getElementsByClassName("table__column__heading")[0].textContent] = Matches[J].querySelector("[name='winner_id']").value;
                }
                if (NumMatches < 25) {
                    WinnersKeys = sortArray(Object.keys(Winners));
                    sendUGSGifts(UGS, 0, WinnersKeys.length, I, WinnersKeys, Winners, function() {
                        getUGSWinners(UGS, ++I, N, Callback);
                    });
                } else {
                    queueRequest(UGS, null, UGS.Giveaways[I].URL + "/search?page=2", function(Response) {
                        Matches = parseHTML(Response.responseText).getElementsByClassName("table__row-inner-wrap");
                        for (J = 0, NumMatches = Matches.length; J < NumMatches; ++J) {
                            Winners[Matches[J].getElementsByClassName("table__column__heading")[0].textContent] = Matches[J].querySelector("[name='winner_id']").value;
                        }
                        WinnersKeys = sortArray(Object.keys(Winners));
                        sendUGSGifts(UGS, 0, WinnersKeys.length, I, WinnersKeys, Winners, function() {
                            getUGSWinners(UGS, ++I, N, Callback);
                        });
                    });
                }
            });
        } else {
            Callback();
        }
    }
}

function sendUGSGifts(UGS, I, N, J, Keys, Winners, Callback) {
    var Reroll, SANM, SW, User;
    if (!UGS.Canceled) {
        UGS.OverallProgress.innerHTML = I + " of " + N + " winners checked...";
        if (I < N) {
            UGS.Progress.innerHTML =
                "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                "<span>Sending " + UGS.Giveaways[J].Name + " to " + Keys[I] + "...</span>";
            Reroll = GM_getValue("Rerolls").indexOf(Winners[Keys[I]]) < 0;
            if (Reroll && (UGS.Checked.indexOf(Keys[I] + UGS.Giveaways[J].Name) < 0)) {
                SANM = UGS.SANM.checked;
                SW = UGS.SW.checked;
                if (SANM || SW) {
                    User = {
                        Username: Keys[I]
                    };
                    queueSave(UGS, function() {
                        saveUser(User, UGS, function() {
                            var SavedUser;
                            GM_setValue("LastSave", 0);
                            SavedUser = getUser(User);
                            if (SANM) {
                                if (SW && SavedUser.Whitelisted) {
                                    sendUGSGift(UGS, Winners, Keys, I, J, N, Callback);
                                } else {
                                    User.NAMWC = SavedUser.NAMWC;
                                    updateNAMWCResults(User, UGS, function() {
                                        if (!User.NAMWC) {
                                            User.NAMWC = {
                                                Results: {}
                                            };
                                        }
                                        checkNAMWCNotActivated(UGS, User, function() {
                                            checkNAMWCMultiple(UGS, User, function() {
                                                queueSave(UGS, function() {
                                                    saveUser(User, UGS, function() {
                                                        GM_setValue("LastSave", 0);
                                                        if (User.NAMWC.Results.Activated && User.NAMWC.Results.NotMultiple) {
                                                            sendUGSGift(UGS, Winners, Keys, I, J, N, Callback);
                                                        } else {
                                                            UGS.Checked.push(Keys[I] + UGS.Giveaways[J].Name);
                                                            UGS.Unsent.classList.remove("rhHidden");
                                                            UGS.UnsentCount.textContent = parseInt(UGS.UnsentCount.textContent) + 1;
                                                            UGS.UnsentUsers.insertAdjacentHTML(
                                                                "beforeEnd",
                                                                "<span><a href=\"/user/" + Keys[I] + "\">" + Keys[I] + "</a> (<a href=\"" + UGS.Giveaways[J].URL + "\">" +
                                                                UGS.Giveaways[J].Name + "</a>)</span>"
                                                            );
                                                            sendUGSGifts(UGS, ++I, N, J, Keys, Winners, Callback);
                                                        }
                                                    });
                                                });
                                            });
                                        });
                                    });
                                }
                            } else if (SavedUser.Whitelisted) {
                                sendUGSGift(UGS, Winners, Keys, I, J, N, Callback);
                            } else {
                                UGS.Checked.push(Keys[I] + UGS.Giveaways[J].Name);
                                UGS.Unsent.classList.remove("rhHidden");
                                UGS.UnsentCount.textContent = parseInt(UGS.UnsentCount.textContent) + 1;
                                UGS.UnsentUsers.insertAdjacentHTML(
                                    "beforeEnd",
                                    "<span><a href=\"/user/" + Keys[I] + "\">" + Keys[I] + "</a> (<a href=\"" + UGS.Giveaways[J].URL + "\">" + UGS.Giveaways[J].Name + "</a>)</span>"
                                );
                                sendUGSGifts(UGS, ++I, N, J, Keys, Winners, Callback);
                            }
                        });
                    });
                } else {
                    sendUGSGift(UGS, Winners, Keys, I, J, N, Callback);
                }
            } else {
                UGS.Checked.push(Keys[I] + UGS.Giveaways[J].Name);
                UGS.Unsent.classList.remove("rhHidden");
                UGS.UnsentCount.textContent = parseInt(UGS.UnsentCount.textContent) + 1;
                UGS.UnsentUsers.insertAdjacentHTML(
                    "beforeEnd",
                    "<span><a href=\"/user/" + Keys[I] + "\">" + Keys[I] + "</a> (" + (!Reroll ? ("Being rerolled for <a href=\"" + UGS.Giveaways[J].URL + "\">" + UGS.Giveaways[J].Name +
                                                                                                  "</a>.)") : ("Already won <a href=\"" + UGS.Giveaways[J].URL + "\">" +
                                                                                                               UGS.Giveaways[J].Name + "</a> from you.)")) + "</span>"
                );
                sendUGSGifts(UGS, ++I, N, J, Keys, Winners, Callback);
            }
        } else {
            Callback();
        }
    }
}

function sendUGSGift(UGS, Winners, Keys, I, J, N, Callback) {
    if (!UGS.Canceled) {
        queueRequest(UGS, "xsrf_token=" + esgst.xsrfToken + "&do=sent_feedback&action=1&winner_id=" + Winners[Keys[I]], "/ajax.php", function(Response) {
            var Key;
            UGS.Checked.push(Keys[I] + UGS.Giveaways[J].Name);
            UGS.Sent.classList.remove("rhHidden");
            UGS.SentCount.textContent = parseInt(UGS.SentCount.textContent) + 1;
            UGS.SentUsers.insertAdjacentHTML(
                "beforeEnd",
                "<span><a href=\"/user/" + Keys[I] + "\">" + Keys[I] + "</a> (<a href=\"" + UGS.Giveaways[J].URL + "\">" + UGS.Giveaways[J].Name + "</a>)</span>"
            );
            UGS.Giveaways[J].Context.className = "fa fa-check-circle icon-green";
            UGS.Giveaways[J].Context.nextElementSibling.textContent = "Sent";
            Key = UGS.Giveaways[J].URL.match(/\/giveaway\/(.+?)\//)[1];
            if (!UGS.Winners[Key]) {
                UGS.Winners[Key] = [];
            }
            if (UGS.Winners[Key].indexOf(Keys[I]) < 0) {
                UGS.Winners[Key].push(Keys[I]);
            }
            sendUGSGifts(UGS, ++I, N, J, Keys, Winners, Callback);
        });
    }
}
