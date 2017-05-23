function loadWhitelistBlacklistChecker() {
    if (esgst.esgstHash){
        addWBCButton();
    } else {
        addWBCButton(esgst.mainPageHeading);
    }
    if (esgst.wbc_h) {
        addWbcIcons();
        esgst.endlessFeatures.push(addWbcIcons);
    }
}

function addWBCButton(Context) {
    var Popup, WBC, WBCButton;
    Popup = createPopup();
    WBC = {
        Update: (Context ? false : true),
        B: esgst.wbc_b,
        Username: GM_getValue("Username")
    };
    Popup.Popup.classList.add("rhPopupLarge");
    Popup.Icon.classList.add(WBC.Update ? "fa-cog" : "fa-question");
    Popup.Title.textContent = (WBC.Update ? "Manage Whitelist / Blacklist Checker caches" : ("Check for whitelists" + (WBC.B ? " / blacklists" : ""))) + ":";
    if (window.location.pathname.match(new RegExp("^\/user\/(?!" + WBC.Username + ")"))) {
        WBC.User = {
            Username: document.getElementsByClassName("featured__heading__medium")[0].textContent,
            ID: document.querySelector("[name='child_user_id']").value,
            SteamID64: document.querySelector("a[href*='/profiles/']").href.match(/\d+/)[0],
        };
    }
    createOptions(Popup.Options, WBC, [{
        Check: function() {
            return WBC.User;
        },
        Description: "Only check " + (WBC.User ? WBC.User.Username : "current user") + ".",
        Title: "If disabled, all users in the current page will be checked.",
        Name: "SingleCheck",
        Key: "SC",
        ID: "WBC_SC",
        Dependency: "FullListCheck"
    }, {
        Check: function() {
            return WBC.B;
        },
        Description: "Also check whitelist.",
        Title: "If disabled, a blacklist-only check will be performed (faster).",
        Name: "FullCheck",
        Key: "FC",
        ID: "WBC_FC"
    }, {
        Check: function() {
            return ((((WBC.User && !WBC.SC.checked) || !WBC.User) && !WBC.Update && !window.location.pathname.match(/^\/($|giveaways|discussions|users|archive)/)) ? true : false);
        },
        Description: "Check all pages.",
        Title: "If disabled, only the current page will be checked.",
        Name: "FullListCheck",
        Key: "FLC",
        ID: "WBC_FLC"
    }, {
        Check: function() {
            return true;
        },
        Description: "Return whitelists.",
        Title: "If enabled, everyone who has whitelisted you will be whitelisted back.",
        Name: "ReturnWhitelists",
        Key: "RW",
        ID: "WBC_RW"
    }, {
        Check: function() {
            return WBC.B;
        },
        Description: "Return blacklists.",
        Title: "If enabled, everyone who has blacklisted you will be blacklisted back.",
        Name: "ReturnBlacklists",
        Key: "RB",
        ID: "WBC_RB"
    }, {
        Check: function() {
            return WBC.Update;
        },
        Description: "Only update whitelists / blacklists.",
        Title: "If enabled, only users who have whitelisted / blacklisted you will be updated (faster).",
        Name: "SimpleUpdate",
        Key: "SU",
        ID: "WBC_SU"
    }, {
        Check: function() {
            return true;
        },
        Description: "Clear caches.",
        Title: "If enabled, the caches of all checked users will be cleared (slower).",
        Name: "ClearCaches",
        Key: "CC",
        ID: "WBC_CC"
    }]);
    Popup.Options.insertAdjacentHTML("afterEnd", createDescription("If an user is highlighted, that means they have been either checked for the first time or updated."));
    if (Context) {
        Context.insertAdjacentHTML(
            "afterBegin",
            "<a class=\"WBCButton\" title=\"Check for whitelists" + (WBC.B ? " / blacklists" : "") + ".\">" +
            "    <i class=\"fa fa-heart\"></i> " + (WBC.B ? (
                "<i class=\"fa fa-ban\"></i>") : "") +
            "    <i class=\"fa fa-question-circle\"></i>" +
            "</a>"
        );
    }
    WBCButton = document.getElementsByClassName("WBCButton")[0];
    createButton(Popup.Button, WBC.Update ? "fa-refresh" : "fa-question-circle", WBC.Update ? "Update" : "Check", "fa-times-circle", "Cancel", function(Callback) {
        WBC.ShowResults = false;
        WBCButton.classList.add("rhBusy");
        setWBCCheck(WBC, function() {
            WBCButton.classList.remove("rhBusy");
            Callback();
        });
    }, function() {
        clearInterval(WBC.Request);
        clearInterval(WBC.Save);
        WBC.Canceled = true;
        setTimeout(function() {
            WBC.Progress.innerHTML = "";
        }, 500);
        WBCButton.classList.remove("rhBusy");
    });
    WBC.Progress = Popup.Progress;
    WBC.OverallProgress = Popup.OverallProgress;
    createResults(Popup.Results, WBC, [{
        Icon: (
            "<span class=\"sidebar__shortcut-inner-wrap rhWBIcon\">" +
            "    <i class=\"fa fa-heart sidebar__shortcut__whitelist is-disabled is-selected\" style=\"background: none !important;\"></i> " +
            "</span>"
        ),
        Description: "You are whitelisted by",
        Key: "Whitelisted"
    }, {
        Icon: (
            "<span class=\"sidebar__shortcut-inner-wrap rhWBIcon\">" +
            "    <i class=\"fa fa-ban sidebar__shortcut__blacklist is-disabled is-selected\" style=\"background: none !important;\"></i> " +
            "</span>"
        ),
        Description: "You are blacklisted by",
        Key: "Blacklisted"
    }, {
        Icon: "<i class=\"fa fa-check-circle\"></i> ",
        Description: "You are neither whitelisted nor blacklisted by",
        Key: "None"
    }, {
        Icon: "<i class=\"fa fa-question-circle\"></i> ",
        Description: "You are not blacklisted and there is not enough information to know if you are whitelisted by",
        Key: "NotBlacklisted"
    }, {
        Icon: "<i class=\"fa fa-question-circle\"></i> ",
        Description: "There is not enough information to know if you are whitelisted or blacklisted by",
        Key: "Unknown"
    }]);
    WBCButton.addEventListener("click", function() {
        WBC.Popup = Popup.popUp(function() {
            if (WBC.Update) {
                WBC.ShowResults = true;
                setWBCCheck(WBC);
            }
        });
    });
}

function setWBCCheck(WBC, Callback) {
    var SavedUsers, I, N, Username, Match;
    WBC.Progress.innerHTML = WBC.OverallProgress.innerHTML = "";
    WBC.Whitelisted.classList.add("rhHidden");
    WBC.Blacklisted.classList.add("rhHidden");
    WBC.None.classList.add("rhHidden");
    WBC.NotBlacklisted.classList.add("rhHidden");
    WBC.Unknown.classList.add("rhHidden");
    WBC.WhitelistedCount.textContent = WBC.BlacklistedCount.textContent = WBC.NoneCount.textContent = WBC.NotBlacklistedCount.textContent = WBC.UnknownCount.textContent = "0";
    WBC.WhitelistedUsers.innerHTML = WBC.BlacklistedUsers.innerHTML = WBC.NoneUsers.innerHTML = WBC.NotBlacklistedUsers.innerHTML = WBC.UnknownUsers.innerHTML = "";
    WBC.Popup.reposition();
    WBC.Users = [];
    WBC.Canceled = false;
    if (WBC.Update) {
        SavedUsers = GM_getValue("Users");
        for (I = 0, N = SavedUsers.length; I < N; ++I) {
            if (SavedUsers[I].WBC && SavedUsers[I].WBC.Result && (WBC.ShowResults || (!WBC.ShowResults && ((WBC.SU.checked &&
                                                                                                            SavedUsers[I].WBC.Result.match(/^(Whitelisted|Blacklisted)$/)) ||
                                                                                                           !WBC.SU.checked)))) {
                WBC.Users.push(SavedUsers[I].Username);
            }
        }
        WBC.Users = sortArray(WBC.Users);
        if (WBC.ShowResults) {
            for (I = 0, N = WBC.Users.length; I < N; ++I) {
                setWBCResult(WBC, SavedUsers[getUserIndex({
                    Username: WBC.Users[I]
                }, SavedUsers)], false);
            }
        } else {
            checkWBCUsers(WBC, 0, WBC.Users.length, Callback);
        }
    } else if (WBC.User && WBC.SC.checked) {
        WBC.Users.push(WBC.User.Username);
        checkWBCUsers(WBC, 0, 1, Callback);
    } else {
        for (Username in esgst.users) {
            if (Username != WBC.Username) {
                WBC.Users.push(Username);
            }
        }
        if (WBC.FLC.checked) {
            Match = window.location.href.match(/(.+?)(\/search\?(page=(\d+))?(.*))?$/);
            getWBCUsers(WBC, 1, Match[4] ? parseInt(Match[4]) : 1, Match[1] + (window.location.pathname.match(/^\/$/) ? "giveaways/" : "/") + "search?" + (Match[5] ? (Match[5].replace(/^&|&$/g, "") + "&") :
                                                                                                                                       "") + "page=", function() {
                WBC.Users = sortArray(WBC.Users);
                checkWBCUsers(WBC, 0, WBC.Users.length, Callback);
            });
        } else {
            WBC.Users = sortArray(WBC.Users);
            checkWBCUsers(WBC, 0, WBC.Users.length, Callback);
        }
    }
}

function checkWBCUsers(WBC, I, N, Callback) {
    var User, SavedUser, Result;
    if (!WBC.Canceled) {
        WBC.Progress.innerHTML = "";
        WBC.OverallProgress.textContent = I + " of " + N + " users checked...";
        if (I < N) {
            User = (WBC.User && WBC.SC.checked) ? WBC.User : {
                Username: WBC.Users[I]
            };
            queueSave(WBC, function() {
                saveUser(User, WBC, function() {
                    GM_setValue("LastSave", 0);
                    SavedUser = getUser(User);
                    User.WBC = SavedUser.WBC;
                    if (User.WBC && User.WBC.Result) {
                        Result = User.WBC.Result;
                    }
                    User.Whitelisted = SavedUser.Whitelisted;
                    User.Blacklisted = SavedUser.Blacklisted;
                    if (esgst.wbc_n) {
                        User.Notes = SavedUser.Notes;
                    }
                    checkWBCUser(WBC, User, function() {
                        setTimeout(setWBCResult, 0, WBC, User, (Result != User.WBC.Result) ? true : false, I, N, Callback);
                    });
                });
            });
        } else if (Callback) {
            Callback();
        }
    }
}

function setWBCResult(WBC, User, New, I, N, Callback) {
    var Key;
    if (!WBC.Canceled) {
        Key = ((User.WBC.Result == "Blacklisted") && !WBC.B) ? "Unknown" : User.WBC.Result;
        WBC[Key].classList.remove("rhHidden");
        WBC[Key + "Count"].textContent = parseInt(WBC[Key + "Count"].textContent) + 1;
        WBC[Key + "Users"].insertAdjacentHTML("beforeEnd", "<a " + (New ? "class=\"rhBold rhItalic\" " : "") + "href=\"/user/" + User.Username + "\">" + User.Username + "</a>");
        if (!WBC.ShowResults) {
            WBC.Popup.reposition();
            if ((WBC.RW.checked && (User.WBC.Result == "Whitelisted") && !User.Whitelisted) || (WBC.B && WBC.RB.checked && (User.WBC.Result == "Blacklisted") && !User.Blacklisted)) {
                getUserID(User, WBC, function() {
                    returnWBCWhitelistBlacklist(WBC, User, function() {
                        queueSave(WBC, function() {
                            saveUser(User, WBC, function() {
                                GM_setValue("LastSave", 0);
                                setTimeout(checkWBCUsers, 0, WBC, ++I, N, Callback);
                            });
                        });
                    });
                });
            } else {
                queueSave(WBC, function() {
                    saveUser(User, WBC, function() {
                        GM_setValue("LastSave", 0);
                        setTimeout(checkWBCUsers, 0, WBC, ++I, N, Callback);
                    });
                });
            }
        }
    }
}

function returnWBCWhitelistBlacklist(WBC, User, Callback) {
    var Key, Type;
    if (!WBC.Canceled) {
        Key = User.WBC.Result;
        Type = Key.match(/(.+)ed/)[1].toLowerCase();
        WBC.Progress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>Returning " + Type + " for " + User.Username + "...</span>";
        if (window.location.pathname.match(new RegExp("^\/user\/" + User.Username))) {
            document.getElementsByClassName("sidebar__shortcut__" + Type)[0].click();
            User.Whitelisted = User.Blacklisted = false;
            User[Key] = true;
            if (esgst.wbc_n) {
                var msg = `${Key} in return.`;
                if (User.Notes) {
                    User.Notes = `${msg}\n\n${User.Notes}`;
                } else {
                    User.Notes = msg;
                }
            }
            Callback();
        } else {
            queueRequest(WBC, "xsrf_token=" + esgst.xsrfToken + "&do=" + Type + "&child_user_id=" + User.ID + "&action=insert", "/ajax.php", function(Response) {
                if (parseJSON(Response.responseText).type == "success") {
                    User.Whitelisted = User.Blacklisted = false;
                    User[Key] = true;
                }
                if (esgst.wbc_n) {
                    var msg = `${Key} in return.`;
                    if (User.Notes) {
                        User.Notes = `${msg}\n\n${User.Notes}`;
                    } else {
                        User.Notes = msg;
                    }
                }
                Callback();
            });
        }
    }
}

function checkWBCUser(WBC, User, Callback) {
    var Match;
    if (!WBC.Canceled) {
        if (WBC.CC.checked) {
            delete User.WBC;
        }
        if (!User.WBC) {
            User.WBC = {
                LastSearch: 0,
                Timestamp: 0
            };
        }
        if ((((new Date().getTime()) - User.WBC.LastSearch) > 86400000) || WBC.Update) {
            if ((WBC.FC.checked && User.WBC.WhitelistGiveaway) || (!WBC.FC.checked && User.WBC.Giveaway)) {
                WBC.Timestamp = User.WBC.Timestamp;
                checkWBCGiveaway(WBC, User, Callback);
            } else {
                WBC.Timestamp = 0;
                WBC.GroupGiveaways = [];
                Match = window.location.href.match(new RegExp("\/user\/" + User.Username + "(\/search\?page=(\d+))?"));
                getWBCGiveaways(WBC, User, 1, Match ? (Match[2] ? parseInt(Match[2]) : 1) : 0, "/user/" + User.Username + "/search?page=", Callback);
            }
        } else {
            Callback();
        }
    }
}

function checkWBCGiveaway(WBC, User, Callback) {
    var ResponseText;
    if (!WBC.Canceled) {
        queueRequest(WBC, null, User.WBC.WhitelistGiveaway || User.WBC.Giveaway, function(Response) {
            var responseHtml = parseHTML(Response.responseText);
            var errorMessage = responseHtml.getElementsByClassName(`table--summary`)[0];
            var stop;
            if (errorMessage) {
                errorMessage = errorMessage.textContent;
                if (errorMessage.match(/blacklisted the giveaway creator/)) {
                    User.WBC.Result = "NotBlacklisted";
                    stop = true;
                } else if (errorMessage.match(/blacklisted by the giveaway creator/)) {
                    User.WBC.Result = "Blacklisted";
                } else if (errorMessage.match(/not a member of the giveaway creator's whitelist/)) {
                    User.WBC.Result = "None";
                } else {
                    User.WBC.Result = "NotBlacklisted";
                }
            } else if (User.WBC.WhitelistGiveaway) {
                User.WBC.Result = "Whitelisted";
            } else {
                User.WBC.Result = "NotBlacklisted";
            }
            User.WBC.LastSearch = new Date().getTime();
            User.WBC.Timestamp = WBC.Timestamp;
            Callback(stop);
        });
    }
}

function getWBCGiveaways(WBC, User, NextPage, CurrentPage, URL, Callback, Context) {
    var Giveaway, Pagination;
    if (Context) {
        if (!User.WBC.Giveaway) {
            Giveaway = Context.querySelector("[class='giveaway__heading__name'][href*='/giveaway/']");
            User.WBC.Giveaway = Giveaway ? Giveaway.getAttribute("href") : null;
        }
        Pagination = Context.getElementsByClassName("pagination__navigation")[0];
        Giveaway = Context.getElementsByClassName("giveaway__summary")[0];
        if (Giveaway && (WBC.Timestamp === 0)) {
            WBC.Timestamp = parseInt(Giveaway.querySelector("[data-timestamp]").getAttribute("data-timestamp"));
            if (WBC.Timestamp >= (new Date().getTime())) {
                WBC.Timestamp = 0;
            }
        }
        if (User.WBC.Giveaway) {
            checkWBCGiveaway(WBC, User, function(stop) {
                var WhitelistGiveaways, I, N, GroupGiveaway;
                if ((User.WBC.Result == "NotBlacklisted") && !stop && WBC.FC.checked) {
                    WhitelistGiveaways = Context.getElementsByClassName("giveaway__column--whitelist");
                    for (I = 0, N = WhitelistGiveaways.length; (I < N) && !User.WBC.WhitelistGiveaway; ++I) {
                        GroupGiveaway = WhitelistGiveaways[I].parentElement.getElementsByClassName("giveaway__column--group")[0];
                        if (GroupGiveaway) {
                            WBC.GroupGiveaways.push(GroupGiveaway.getAttribute("href"));
                        } else {
                            User.WBC.WhitelistGiveaway = WhitelistGiveaways[I].closest(".giveaway__summary").getElementsByClassName("giveaway__heading__name")[0].getAttribute("href");
                        }
                    }
                    if (User.WBC.WhitelistGiveaway) {
                        checkWBCGiveaway(WBC, User, Callback);
                    } else if (((WBC.Timestamp >= User.WBC.Timestamp) || (WBC.Timestamp === 0)) && Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                        window.setTimeout(getWBCGiveaways, 0, WBC, User, NextPage, CurrentPage, URL, Callback);
                    } else if ((User.WBC.GroupGiveaways && User.WBC.GroupGiveaways.length) || WBC.GroupGiveaways.length) {
                        getWBCGroupGiveaways(WBC, 0, WBC.GroupGiveaways.length, User, function(Result) {
                            var Groups, GroupGiveaways, Found, J, NumGroups;
                            if (Result) {
                                Callback();
                            } else {
                                Groups = GM_getValue("Groups");
                                for (GroupGiveaway in User.WBC.GroupGiveaways) {
                                    Found = false;
                                    GroupGiveaways = User.WBC.GroupGiveaways[GroupGiveaway];
                                    for (I = 0, N = GroupGiveaways.length; (I < N) && !Found; ++I) {
                                        for (J = 0, NumGroups = Groups.length; (J < NumGroups) && (Groups[J].Code != GroupGiveaways[I]); ++J);
                                        if (J < NumGroups) {
                                            Found = true;
                                        }
                                    }
                                    if (!Found) {
                                        break;
                                    }
                                }
                                if (Found) {
                                    Callback();
                                } else {
                                    User.WBC.Result = "Whitelisted";
                                    Callback();
                                }
                            }
                        });
                    } else {
                        Callback();
                    }
                } else {
                    Callback();
                }
            });
        } else if (((WBC.Timestamp >= User.WBC.Timestamp) || (WBC.Timestamp === 0)) && Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
            window.setTimeout(getWBCGiveaways, 0, WBC, User, NextPage, CurrentPage, URL, Callback);
        } else {
            User.WBC.Result = "Unknown";
            User.WBC.LastSearch = new Date().getTime();
            User.WBC.Timestamp = WBC.Timestamp;
            Callback();
        }
    } else if (!WBC.Canceled) {
        WBC.Progress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>Retrieving " + User.Username + "'s giveaways (page " + NextPage + ")...</span>";
        if (CurrentPage != NextPage) {
            queueRequest(WBC, null, URL + NextPage, function(Response) {
                if (Response.finalUrl.match(/\/user\//)) {
                    window.setTimeout(getWBCGiveaways, 0, WBC, User, ++NextPage, CurrentPage, URL, Callback, parseHTML(Response.responseText));
                } else {
                    User.WBC.Result = "Unknown";
                    User.WBC.LastSearch = new Date().getTime();
                    User.WBC.Timestamp = WBC.Timestamp;
                    Callback();
                }
            });
        } else {
            window.setTimeout(getWBCGiveaways, 0, WBC, User, ++NextPage, CurrentPage, URL, Callback, document);
        }
    }
}

function getWBCGroupGiveaways(WBC, I, N, User, Callback) {
    if (!WBC.Canceled) {
        if (I < N) {
            WBC.Progress.innerHTML =
                "<i class=\"fa fa-circle-o-notch\"></i> " +
                "<span>Retrieving " + User.Username + "'s group giveaways (" + I + " of " + N + ")...</span>";
            getWBCGroups(WBC, WBC.GroupGiveaways[I] + "/search?page=", 1, User, function(Result) {
                if (Result) {
                    Callback(Result);
                } else {
                    window.setTimeout(getWBCGroupGiveaways, 0, WBC, ++I, N, User, Callback);
                }
            });
        } else {
            Callback();
        }
    }
}

function getWBCGroups(WBC, URL, NextPage, User, Callback) {
    if (!WBC.Canceled) {
        queueRequest(WBC, null, URL + NextPage, function(Response) {
            var ResponseText, ResponseHTML, Groups, N, GroupGiveaway, I, Group, Pagination;
            ResponseText = Response.responseText;
            ResponseHTML = parseHTML(ResponseText);
            Groups = ResponseHTML.getElementsByClassName("table__column__heading");
            N = Groups.length;
            if (N > 0) {
                if (!User.WBC.GroupGiveaways) {
                    User.WBC.GroupGiveaways = {};
                }
                GroupGiveaway = URL.match(/\/giveaway\/(.+)\//)[1];
                if (!User.WBC.GroupGiveaways[GroupGiveaway]) {
                    User.WBC.GroupGiveaways[GroupGiveaway] = [];
                }
                for (I = 0; I < N; ++I) {
                    Group = Groups[I].getAttribute("href").match(/\/group\/(.+)\//)[1];
                    if (User.WBC.GroupGiveaways[GroupGiveaway].indexOf(Group) < 0) {
                        User.WBC.GroupGiveaways[GroupGiveaway].push(Group);
                    }
                }
                Pagination = ResponseHTML.getElementsByClassName("pagination__navigation")[0];
                if (Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                    window.setTimeout(getWBCGroups, 0, WBC, URL, ++NextPage, User, Callback);
                } else {
                    Callback();
                }
            } else {
                var errorMessage = ResponseHTML.getElementsByClassName(`table--summary`)[0];
                if (errorMessage && errorMessage.textContent.match(/not a member of the giveaway creator's whitelist/)) {
                    User.WBC.Result = "None";
                    Callback(true);
                } else {
                    Callback(true);
                }
            }
        });
    }
}

function getWBCUsers(WBC, NextPage, CurrentPage, URL, Callback, Context) {
    var Matches, I, N, Match, Username, Pagination;
    if (Context) {
        Matches = Context.querySelectorAll("a[href*='/user/']");
        for (I = 0, N = Matches.length; I < N; ++I) {
            Match = Matches[I].getAttribute("href").match(/\/user\/(.+)/);
            if (Match) {
                Username = Match[1];
                if ((WBC.Users.indexOf(Username) < 0) && (Username != WBC.Username) && (Username == Matches[I].textContent) && !Matches[I].closest(".markdown")) {
                    WBC.Users.push(Username);
                }
            }
        }
        Pagination = Context.getElementsByClassName("pagination__navigation")[0];
        if (Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
            window.setTimeout(getWBCUsers, 0, WBC, NextPage, CurrentPage, URL, Callback);
        } else {
            Callback();
        }
    } else if (!WBC.Canceled) {
        WBC.Progress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>Retrieving users (page " + NextPage + ")...</span>";
        if (CurrentPage != NextPage) {
            queueRequest(WBC, null, URL + NextPage, function(Response) {
                window.setTimeout(getWBCUsers, 0, WBC, ++NextPage, CurrentPage, URL, Callback, parseHTML(Response.responseText));
            });
        } else {
            window.setTimeout(getWBCUsers, 0, WBC, ++NextPage, CurrentPage, URL, Callback, document);
        }
    }
}

function addWbcIcons() {
    if (Object.keys(esgst.currentUsers).length) {
        var SavedUsers = GM_getValue("Users");
        for (var I = 0, N = SavedUsers.length; I < N; ++I) {
            var UserID = esgst.sg ? SavedUsers[I].Username : SavedUsers[I].SteamID64;
            if (esgst.currentUsers[UserID]) {
                addWBCIcon(SavedUsers[I], esgst.currentUsers[UserID]);
            }
        }
    }
}

function addWBCIcon(User, Matches) {
    var Result, HTML, I, N, Context, Container;
    if (User.WBC) {
        Result = User.WBC.Result;
        if ((Result == "Whitelisted") || ((Result == "Blacklisted") && esgst.wbc_b)) {
            HTML =
                "<span class=\"sidebar__shortcut-inner-wrap WBCIcon rhWBIcon\" title=\"" + User.Username + " has " + Result.toLowerCase() + " you.\">" +
                "    <i class=\"fa sidebar__shortcut__" + ((Result == "Whitelisted") ? "whitelist fa-check" : "blacklist fa-times") + " is-disabled is-selected\"" +
                "    style=\"background: none !important;\"></i>" +
                "</span>";
            for (I = 0, N = Matches.length; I < N; ++I) {
                Context = Matches[I];
                Container = Context.parentElement;
                if (Container.classList.contains("comment__username")) {
                    Context = Container;
                }
                Context.insertAdjacentHTML("beforeBegin", HTML);
            }
        }
    }
}
