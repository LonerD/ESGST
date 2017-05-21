function loadMultiTag() {
    addMTContainer(esgst.mainPageHeading);
}

function addMTContainer(Context, MT, SM) {
    var MTContainer, MTButton, MTBox, MTUsers, MTGames, MTAll, MTNone, MTInverse, MTUsersCheckbox, MTGamesCheckbox, Popup;
    if (!MT) {
        MT = {};
    }
    MT.UserCheckboxes = {};
    MT.GameCheckboxes = {};
    MT.UsersSelected = [];
    MT.GamesSelected = [];
    Context.insertAdjacentHTML(
        "afterBegin",
        "<div class=\"MTContainer" + (SM ? " rhHidden" : "") + "\">" +
        "    <a class=\"MTButton page_heading_btn\" title=\"Tag multiple users / games at the same times.\">" +
        "        <i class=\"fa fa-tags\"></i>" +
        "    </a>" +
        "</div>"
    );
    MTContainer = Context.firstElementChild;
    MTButton = MTContainer.firstElementChild;
    MTBox = createPopout(MTContainer);
    MTBox.Popout.classList.add("MTBox");
    MTBox.customRule = function(Target) {
        return (!MTContainer.contains(Target) && !Target.closest(".MTUserCheckbox") && !Target.closest(".MTGameCheckbox"));
    };
    Context = SM ? SM.Popup.Options : MTBox.Popout;
    Context.innerHTML =
        "<div" + ((GM_getValue("PUT") && !SM) ? "" : " class=\"rhHidden\"") + "><span class=\"MTUsers\"></span> Enable selection for user tags.</div>" +
        "<div" + ((GM_getValue("GT") && !SM) ? "" : " class=\"rhHidden\"") + "><span class=\"MTGames\"></span> Enable selection for game tags.</div>" +
        "<div><i class=\"fa fa-check-square-o MTAll\"></i> Select all.</div>" +
        "<div><i class=\"fa fa-square-o\ MTNone\"></i> Select none.</div>" +
        "<div><i class=\"fa fa-minus-square-o MTInverse\"></i> Select inverse.</div>" +
        "<div><span class=\"MTCount\">0</span> selected.</div>" +
        "<div class=\"MTTag\"></div>";
    MTUsers = Context.getElementsByClassName("MTUsers")[0];
    MTGames = Context.getElementsByClassName("MTGames")[0];
    MTAll = Context.getElementsByClassName("MTAll")[0];
    MTNone = Context.getElementsByClassName("MTNone")[0];
    MTInverse = Context.getElementsByClassName("MTInverse")[0];
    MT.Count = Context.getElementsByClassName("MTCount")[0];
    MT.Tag = Context.getElementsByClassName("MTTag")[0];
    MTUsersCheckbox = createCheckbox(MTUsers);
    MTGamesCheckbox = createCheckbox(MTGames);
    setMTCheckboxes(MTUsers, MTUsersCheckbox.Checkbox, esgst.users, "User", "beforeBegin", "previousElementSibling", MT);
    setMTCheckboxes(MTGames, MTGamesCheckbox.Checkbox, esgst.games, "Game", "afterBegin", "firstElementChild", MT);
    setMTSelect(MTAll, MT, "check");
    setMTSelect(MTNone, MT, "uncheck");
    setMTSelect(MTInverse, MT, "toggle");
    MT.Tag.classList.add("rhHidden");
    Popup = createPopup();
    Popup.Icon.classList.add("fa-tags");
    Popup.TextInput.classList.remove("rhHidden");
    Popup.TextInput.insertAdjacentHTML(
        "afterEnd",
        createDescription(
            "Use commas to separate tags, for example: Tag1, Tag2, ...<br/><br/>" +
            "A [*] tag means that the selected users / games have individual tags (not shared between all of them). Removing the [*] tag will delete those individual tags."
        )
    );
    createButton(MT.Tag, "fa-tags", "Multi-Tag", "", "", function(Callback) {
        var Tags, Shared, I, N, UserID, User, SavedUser, SavedTags, J, NumTags, SavedTag, SavedGames, SavedGame, Game, Key, Individual;
        Callback();
        if (!MTButton.classList.contains("rhBusy")) {
            Popup.Title.textContent = "Multi-tag " + MT.UsersSelected.length + " users and " + MT.GamesSelected.length + " games:";
            Tags = {};
            MT.UserTags = {};
            Shared = [];
            for (I = 0, N = MT.UsersSelected.length; I < N; ++I) {
                UserID = MT.UsersSelected[I];
                User = {};
                User[esgst.sg ? "Username" : "SteamID64"] = UserID;
                SavedUser = getUser(User);
                if (SavedUser && SavedUser.Tags) {
                    SavedTags = SavedUser.Tags.split(/,\s/);
                    Tags[UserID] = MT.UserTags[UserID] = SavedTags;
                    for (J = 0, NumTags = SavedTags.length; J < NumTags; ++J) {
                        SavedTag = SavedTags[J];
                        if (Shared.indexOf(SavedTag) < 0) {
                            Shared.push(SavedTag);
                        }
                    }
                } else {
                    Tags[UserID] = MT.UserTags[UserID] = "";
                }
            }
            SavedGames = GM_getValue("Games");
            MT.GameTags = {};
            for (I = 0, N = MT.GamesSelected.length; I < N; ++I) {
                Game = MT.GamesSelected[I];
                SavedGame = SavedGames[Game];
                if (SavedGame && SavedGame.Tags) {
                    SavedTags = SavedGame.Tags.split(/,\s/);
                    Tags[Game] = MT.GameTags[Game] = SavedTags;
                    for (J = 0, NumTags = SavedTags.length; J < NumTags; ++J) {
                        SavedTag = SavedTags[J];
                        if (Shared.indexOf(SavedTag) < 0) {
                            Shared.push(SavedTag);
                        }
                    }
                } else {
                    Tags[Game] = MT.GameTags[Game] = "";
                }
            }
            for (Key in Tags) {
                Shared = Shared.filter(function(N) {
                    if (Tags[Key].indexOf(N) >= 0) {
                        return true;
                    } else {
                        Individual = true;
                        return false;
                    }
                });
            }
            for (Key in Tags) {
                for (I = 0, N = Shared.length; I < N; ++I) {
                    J = Tags[Key].indexOf(Shared[I]);
                    if (J >= 0) {
                        Tags[Key].splice(J, 1);
                    }
                }
            }
            Popup.TextInput.value = Shared.length ? (Shared.join(", ") + (Individual ? ", [*]" : "")) : (Individual ? "[*]" : "");
        }
        Popup.popUp(function() {
            Popup.TextInput.focus();
        });
    });
    createButton(Popup.Button, "fa-check", "Save", "fa-times-circle", "Cancel", function(Callback) {
        var Shared, I, Individual, Keys;
        MT.Canceled = false;
        MTButton.classList.add("rhBusy");
        Shared = Popup.TextInput.value.replace(/(,\s*)+/g, function(Match, P1, Offset, String) {
            return (((Offset === 0) || (Offset == (String.length - Match.length))) ? "" : ", ");
        }).split(", ");
        I = Shared.indexOf("[*]");
        if (I >= 0) {
            Shared.splice(I, 1);
            Individual = true;
        } else {
            Individual = false;
        }
        Shared = Shared.join(", ");
        Keys = Object.keys(MT.UserTags);
        saveMTUserTags(MT, 0, Keys.length, Keys, Individual, Shared, MT.UserTags, function() {
            Keys = Object.keys(MT.GameTags);
            saveMTGameTags(MT, 0, Keys.length, Keys, Individual, Shared, MT.GameTags, function() {
                MTButton.classList.remove("rhBusy");
                MT.Progress.innerHTML = MT.OverallProgress.innerHTML = "";
                Callback();
                Popup.Close.click();
            });
        });
    }, function() {
        clearInterval(MT.Request);
        clearInterval(MT.Save);
        MT.Canceled = true;
        setTimeout(function() {
            MT.Progress.innerHTML = MT.OverallProgress.innerHTML = "";
        }, 500);
        MTButton.classList.remove("rhBusy");
    });
    MT.Progress = Popup.Progress;
    MT.OverallProgress = Popup.OverallProgress;
    MTButton.addEventListener("click", function() {
        if (MTBox.Popout.classList.contains("rhHidden")) {
            MTBox.popOut(MTContainer);
        } else {
            MTBox.Popout.classList.add("rhHidden");
        }
    });
}

function setMTCheckboxes(Element, Checkbox, Selection, Type, InsertionPosition, Position, MT) {
    Element.addEventListener("click", function() {
        var Key, Matches, I, N, Context, MTCheckbox;
        if (Checkbox.checked) {
            addMTCheckboxes(Selection, Type, InsertionPosition, Position, MT);
        } else {
            removeMTCheckboxes(Type, MT);
        }
    });
}

function addMTCheckboxes(Selection, Type, InsertionPosition, Position, MT) {
    var Key, Matches, I, N, Context, MTCheckbox;
    for (Key in Selection) {
        Matches = Selection[Key];
        for (I = 0, N = Matches.length; I < N; ++I) {
            Context = Matches[I];
            Context.insertAdjacentHTML(InsertionPosition, "<span class=\"MT" + Type + "Checkbox\"></span>");
            MTCheckbox = createCheckbox(Context[Position]);
            if (!MT[Type + "Checkboxes"][Key]) {
                MT[Type + "Checkboxes"][Key] = [];
            }
            MT[Type + "Checkboxes"][Key].push(MTCheckbox);
            setMTCheckbox(Type, Context[Position], MT, Key, MTCheckbox.Checkbox, MT.Tag);
        }
    }
}

function setMTCheckbox(Type, Context, MT, Key, Checkbox) {
    Context.addEventListener("click", function() {
        checkMTCheckbox(MT, Type, Key, Checkbox);
    });
}

function checkMTCheckbox(MT, Type, Key, Checkbox) {
    var Count, I, Checkboxes, N;
    Count = parseInt(MT.Count.textContent);
    I = MT[Type + "sSelected"].indexOf(Key);
    if (Checkbox.checked) {
        MT.Count.textContent = ++Count;
        if (I < 0) {
            MT[Type + "sSelected"].push(Key);
        }
    } else {
        MT.Count.textContent = --Count;
        if (I >= 0) {
            MT[Type + "sSelected"].splice(I, 1);
        }
    }
    Checkboxes = MT[Type + "Checkboxes"][Key];
    for (I = 0, N = Checkboxes.length; I < N; ++I) {
        if (Checkboxes[I].Checkbox != Checkbox) {
            Checkboxes[I].toggle();
        }
    }
    MT.Tag.classList[(Count > 1) ? "remove" : "add"]("rhHidden");
}

function removeMTCheckboxes(Type, MT) {
    var Matches, I, N;
    Matches = document.getElementsByClassName("MT" + Type + "Checkbox");
    for (I = 0, N = Matches.length; I < N; ++I) {
        Matches[0].remove();
    }
    MT[Type + "Checkboxes"] = {};
    MT[Type + "sSelected"] = [];
}

function setMTSelect(Element, MT, Call) {
    Element.addEventListener("click", function() {
        selectMTCheckboxes(MT.UserCheckboxes, Call, MT, "User");
        selectMTCheckboxes(MT.GameCheckboxes, Call, MT, "Game");
    });
}

function selectMTCheckboxes(MTCheckboxes, Call, MT, Type) {
    var Key, Checkbox, Previous, Current;
    for (Key in MTCheckboxes) {
        Checkbox = MTCheckboxes[Key][0];
        Previous = Checkbox.Checkbox.checked;
        Checkbox[Call]();
        Current = Checkbox.Checkbox.checked;
        if (Previous != Current) {
            checkMTCheckbox(MT, Type, Key, Checkbox.Checkbox);
        }
    }
}

function saveMTUserTags(MT, I, N, Keys, Individual, Shared, Tags, Callback) {
    var UserID, User;
    if (!MT.Canceled) {
        MT.OverallProgress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>" + I + " of " + N + " users tagged...</span>";
        if (I < N) {
            UserID = Keys[I];
            User = {
                Tags: Individual ? (Shared + ", " + Tags[UserID]) : Shared
            };
            User[esgst.sg ? "Username" : "SteamID64"] = UserID;
            queueSave(MT, function() {
                saveUser(User, MT, function() {
                    GM_setValue("LastSave", 0);
                    addPUTTags(UserID, getUser(User).Tags);
                    setTimeout(saveMTUserTags, 0, MT, ++I, N, Keys, Individual, Shared, Tags, Callback);
                });
            });
        } else {
            Callback();
        }
    }
}

function saveMTGameTags(MT, I, N, Keys, Individual, Shared, Tags, Callback) {
    var Game, SavedGames;
    if (!MT.Canceled) {
        MT.OverallProgress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>" + I + " of " + N + " groups tagged...</span>";
        if (I < N) {
            Game = Keys[I];
            SavedGames = GM_getValue("Games");
            if (!SavedGames[Game]) {
                SavedGames[Game] = {};
            }
            SavedGames[Game].Tags = Individual ? (Shared + ", " + Tags[Game]) : Shared;
            GM_setValue("Games", SavedGames);
            addGTTags(Game, SavedGames[Game].Tags);
            setTimeout(saveMTGameTags, 0, MT, ++I, N, Keys, Individual, Shared, Tags, Callback);
        } else {
            Callback();
        }
    }
}
