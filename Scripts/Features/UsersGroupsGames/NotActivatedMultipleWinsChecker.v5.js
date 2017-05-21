function loadNotActivatedMultipleWinsChecker() {
    if (esgst.user) {
        addNAMWCProfileButton(esgst.wonRow, esgst.user);
    } else if (esgst.winnersPath) {
        addNAMWCButton(esgst.mainPageHeading);
    } else if (esgst.esgstHash){
        addNAMWCButton();
    }
    if (esgst.ap) {
        esgst.profileFeatures.push(addNAMWCProfileButton);
    }
    if (esgst.namwc_h) {
        highlightNamwcUsers();
        esgst.endlessFeatures.push(highlightNamwcUsers);
    }
}

function addNAMWCProfileButton(Context, User) {
    if (Context.wonRow) {
        Context = Context.wonRow;
    }
    Context.insertAdjacentHTML(
        "beforeEnd",
        " <span class=\"NAMWCButton\">" +
        "    <i class=\"fa fa-question-circle\" title=\"Check for not activated / multiple wins.\"></i>" +
        "</span>"
    );
    setNAMWCPopup(Context, User);
}

function addNAMWCButton(Context) {
    if (Context) {
        Context.insertAdjacentHTML(
            "afterBegin",
            "<a class=\"NAMWCButton\" title=\"Check for not activated / multiple wins.\">" +
            "    <i class=\"fa fa-trophy\"></i>" +
            "    <i class=\"fa fa-question-circle\"></i>" +
            "</a>"
        );
    }
    setNAMWCPopup(Context);
}

function setNAMWCPopup(Context, User) {
    var Popup, NAMWC, NAMWCButton;
    Popup = createPopup();
    Popup.Popup.classList.add("rhPopupLarge");
    Popup.Icon.classList.add(Context ? "fa-question" : "fa-cog");
    NAMWC = {
        User: (User ? User : null)
    };
    Popup.Title.textContent = (Context ? "Check for " + (NAMWC.User ? (NAMWC.User.Username + "'s ") : "") + "not activated / multiple wins" :
                               "Manage Not Activated / Multiple Wins Checker caches") + ":";
    NAMWCButton = (Context ? Context : document).getElementsByClassName("NAMWCButton")[0];
    if (Context) {
        createOptions(Popup.Options, NAMWC, [{
            Check: function() {
                return true;
            },
            Description: "Only check for not activated wins.",
            Title: "If enabled, multiple wins will not be checked (faster).",
            Name: "NotActivatedCheck",
            Key: "NAC",
            ID: "NAMWC_NAC",
            Dependency: "MultipleCheck"
        }, {
            Check: function() {
                return true;
            },
            Description: "Only check for multiple wins.",
            Title: "If enabled, not activated wins will not be checked (faster).",
            Name: "MultipleCheck",
            Key: "MC",
            ID: "NAMWC_MC",
            Dependency: "NotActivatedCheck"
        }]);
        Popup.Options.insertAdjacentHTML("afterEnd", createDescription("If an user is highlighted, that means they have been either checked for the first time or updated."));
        createButton(Popup.Button, "fa-question-circle", "Check", "fa-times-circle", "Cancel", function(Callback) {
            NAMWC.ShowResults = false;
            NAMWCButton.classList.add("rhBusy");
            setNAMWCCheck(NAMWC, function() {
                NAMWCButton.classList.remove("rhBusy");
                Callback();
            });
        }, function() {
            clearInterval(NAMWC.Request);
            clearInterval(NAMWC.Save);
            NAMWC.Canceled = true;
            setTimeout(function() {
                NAMWC.Progress.innerHTML = "";
            }, 500);
            NAMWCButton.classList.remove("rhBusy");
        });
    }
    NAMWC.Progress = Popup.Progress;
    NAMWC.OverallProgress = Popup.OverallProgress;
    createResults(Popup.Results, NAMWC, [{
        Icon: "<i class=\"fa fa-check-circle giveaway__column--positive\"></i> ",
        Description: "Users with 0 not activated wins",
        Key: "Activated"
    }, {
        Icon: "<i class=\"fa fa-check-circle giveaway__column--positive\"></i> ",
        Description: "Users with 0 multiple wins",
        Key: "NotMultiple"
    }, {
        Icon: "<i class=\"fa fa-times-circle giveaway__column--negative\"></i> ",
        Description: "Users with not activated wins",
        Key: "NotActivated"
    }, {
        Icon: "<i class=\"fa fa-times-circle giveaway__column--negative\"></i> ",
        Description: "Users with multiple wins",
        Key: "Multiple"
    }, {
        Icon: "<i class=\"fa fa-question-circle\"></i> ",
        Description: "Users who cannot be checked for not activated wins either because they have a private profile or SteamCommunity is down",
        Key: "Unknown"
    }]);
    NAMWCButton.addEventListener("click", function() {
        NAMWC.Popup = Popup.popUp(function() {
            if (!Context) {
                NAMWC.ShowResults = true;
                setNAMWCCheck(NAMWC);
            }
        });
    });
}

function setNAMWCCheck(NAMWC, Callback) {
    var SavedUsers, I, N, Username;
    NAMWC.Progress.innerHTML = NAMWC.OverallProgress.innerHTML = "";
    NAMWC.Activated.classList.add("rhHidden");
    NAMWC.NotMultiple.classList.add("rhHidden");
    NAMWC.NotActivated.classList.add("rhHidden");
    NAMWC.Multiple.classList.add("rhHidden");
    NAMWC.Unknown.classList.add("rhHidden");
    NAMWC.ActivatedCount.textContent = NAMWC.NotMultipleCount.textContent = NAMWC.NotActivatedCount.textContent = NAMWC.MultipleCount.textContent = NAMWC.UnknownCount.textContent = "0";
    NAMWC.ActivatedUsers.innerHTML = NAMWC.NotMultipleUsers.textContent = NAMWC.NotActivatedUsers.innerHTML = NAMWC.MultipleUsers.innerHTML = NAMWC.UnknownUsers.innerHTML = "";
    NAMWC.Popup.reposition();
    NAMWC.Users = [];
    NAMWC.Canceled = false;
    if (NAMWC.ShowResults) {
        SavedUsers = GM_getValue("Users");
        for (I = 0, N = SavedUsers.length; I < N; ++I) {
            if (SavedUsers[I].NAMWC && SavedUsers[I].NAMWC.Results) {
                NAMWC.Users.push(SavedUsers[I].Username);
            }
        }
        NAMWC.Users = sortArray(NAMWC.Users);
        for (I = 0, N = NAMWC.Users.length; I < N; ++I) {
            setNAMWCResult(NAMWC, SavedUsers[getUserIndex({
                Username: NAMWC.Users[I]
            }, SavedUsers)], false);
        }
    } else if (NAMWC.User) {
        NAMWC.Users.push(NAMWC.User.Username);
        checkNAMWCUsers(NAMWC, 0, 1, Callback);
    } else {
        for (Username in esgst.users) {
            if (Username != GM_getValue("Username")) {
                if (NAMWC.Users.length < 26) {
                    NAMWC.Users.push(Username);
                } else {
                    break;
                }
            }
        }
        NAMWC.Users = sortArray(NAMWC.Users);
        checkNAMWCUsers(NAMWC, 0, NAMWC.Users.length, Callback);
    }
}

function checkNAMWCUsers(NAMWC, I, N, Callback) {
    var User, Results, Key, New;
    if (!NAMWC.Canceled) {
        NAMWC.Progress.innerHTML = "";
        NAMWC.OverallProgress.textContent = I + " of " + N + " users checked...";
        if (I < N) {
            User = NAMWC.User ? NAMWC.User : {
                Username: NAMWC.Users[I]
            };
            queueSave(NAMWC, function() {
                saveUser(User, NAMWC, function() {
                    GM_setValue("LastSave", 0);
                    User.NAMWC = getUser(User).NAMWC;
                    updateNAMWCResults(User, NAMWC, function() {
                        if (User.NAMWC && User.NAMWC.Results) {
                            Results = User.NAMWC.Results;
                        }
                        checkNAMWCUser(NAMWC, User, function() {
                            if (Results) {
                                for (Key in Results) {
                                    if (Results[Key] != User.NAMWC.Results[Key]) {
                                        New = true;
                                        break;
                                    }
                                }
                            } else {
                                New = true;
                            }
                            setTimeout(setNAMWCResult, 0, NAMWC, User, New, I, N, Callback);
                        });
                    });
                });
            });
        } else if (Callback) {
            Callback();
        }
    }
}

function updateNAMWCResults(User, NAMWC, Callback) {
    var Results;
    if (User.NAMWC && User.NAMWC.Results && (typeof User.NAMWC.Results.None != "undefined")) {
        Results = User.NAMWC.Results;
        User.NAMWC.Results = {
            Activated: Results.None,
            NotMultiple: Results.None,
            NotActivated: Results.NotActivated,
            Multiple: Results.Multiple,
            Unknown: Results.PrivateDown
        };
        queueSave(NAMWC, function() {
            saveUser(User, NAMWC, function() {
                GM_setValue("LastSave", 0);
                Callback();
            });
        });
    } else {
        Callback();
    }
}

function setNAMWCResult(NAMWC, User, New, I, N, Callback) {
    var Key;
    if (!NAMWC.Canceled) {
        for (Key in User.NAMWC.Results) {
            if (User.NAMWC.Results[Key]) {
                NAMWC[Key].classList.remove("rhHidden");
                NAMWC[Key + "Count"].textContent = parseInt(NAMWC[Key + "Count"].textContent) + 1;
                NAMWC[Key + "Users"].insertAdjacentHTML(
                    "beforeEnd",
                    "<a " + (New ? "class=\"rhBold rhItalic\" " : "") + "href=\"http://www.sgtools.info/" + (Key.match(/Multiple/) ? "multiple" : "nonactivated") + "/" + User.Username +
                    "\" target=\"_blank\">" + User.Username + (Key.match(/^(NotActivated|Multiple)$/) ? (" (" + User.NAMWC.Results[Key] + ")") : "") + "</a>"
                );
            }
        }
        if (!NAMWC.ShowResults) {
            NAMWC.Popup.reposition();
            queueSave(NAMWC, function() {
                saveUser(User, NAMWC, function() {
                    GM_setValue("LastSave", 0);
                    setTimeout(checkNAMWCUsers, 0, NAMWC, ++I, N, Callback);
                });
            });
        }
    }
}

function checkNAMWCUser(NAMWC, User, Callback) {
    if (!NAMWC.Canceled) {
        if (!User.NAMWC) {
            User.NAMWC = {
                LastSearch: 0,
                Results: {}
            };
        }
        if (((new Date().getTime()) - User.NAMWC.LastSearch) > 604800000) {
            if (NAMWC.NAC.checked) {
                checkNAMWCNotActivated(NAMWC, User, Callback);
            } else if (NAMWC.MC.checked) {
                checkNAMWCMultiple(NAMWC, User, Callback);
            } else {
                checkNAMWCNotActivated(NAMWC, User, function() {
                    checkNAMWCMultiple(NAMWC, User, Callback);
                });
            }
        } else {
            Callback();
        }
    }
}

function checkNAMWCNotActivated(NAMWC, User, Callback) {
    var N, ResponseText;
    if (!NAMWC.Canceled) {
        NAMWC.Progress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>Retrieving " + User.Username + "'s not activated wins...</span>";
        queueRequest(NAMWC, null, "http://www.sgtools.info/nonactivated/" + User.Username, function(Response) {
            ResponseText = Response.responseText;
            if (ResponseText.match(/has a private profile/)) {
                User.NAMWC.Results.Activated = false;
                User.NAMWC.Results.NotActivated = 0;
                User.NAMWC.Results.Unknown = true;
            } else {
                N = parseHTML(ResponseText).getElementsByClassName("notActivatedGame").length;
                User.NAMWC.Results.Activated = (N === 0) ? true : false;
                User.NAMWC.Results.NotActivated = N;
                User.NAMWC.Results.Unknown = false;
            }
            User.NAMWC.LastSearch = new Date().getTime();
            Callback();
        });
    }
}

function checkNAMWCMultiple(NAMWC, User, Callback) {
    var N;
    if (!NAMWC.Canceled) {
        NAMWC.Progress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>Retrieving " + User.Username + "'s multiple wins...</span>";
        queueRequest(NAMWC, null, "http://www.sgtools.info/multiple/" + User.Username, function(Response) {
            N = parseHTML(Response.responseText).getElementsByClassName("multiplewins").length;
            User.NAMWC.Results.NotMultiple = (N === 0) ? true : false;
            User.NAMWC.Results.Multiple = N;
            User.NAMWC.LastSearch = new Date().getTime();
            Callback();
        });
    }
}

function highlightNamwcUsers() {
    if (Object.keys(esgst.currentUsers).length) {
        var SavedUsers = GM_getValue("Users");
        for (var I = 0, N = SavedUsers.length; I < N; ++I) {
            var UserID = esgst.sg ? SavedUsers[I].Username : SavedUsers[I].SteamID64;
            if (esgst.currentUsers[UserID]) {
                highlightNAMWCUser(SavedUsers[I], esgst.currentUsers[UserID]);
            }
        }
    }
}

function highlightNAMWCUser(User, Matches) {
    var Name, Title, I, N;
    if (User.NAMWC && User.NAMWC.Results) {
        if (User.NAMWC.Results.None || (User.NAMWC.Results.Activated && User.NAMWC.Results.NotMultiple)) {
            Name = "NAMWCPositive";
        } else if (User.NAMWC.Results.Unknown) {
            Name = "NAMWCUnknown";
        } else {
            Name = "NAMWCNegative";
        }
        Title = User.Username + " has " + (User.NAMWC.Results.Unknown ? "?" : User.NAMWC.Results.NotActivated) + " not activated wins and " + User.NAMWC.Results.Multiple + " multiple wins.";
        for (I = 0, N = Matches.length; I < N; ++I) {
            Matches[I].classList.add(Name);
            Matches[I].title = Title;
        }
    }
}
