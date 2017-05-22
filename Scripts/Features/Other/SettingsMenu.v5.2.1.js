function addSMButton() {
    var Sidebar, SMButton;
    Sidebar = document.getElementsByClassName("sidebar")[0];
    Sidebar.insertAdjacentHTML("beforeEnd", createNavigationSection("ESGST", [{
        Name: "SMButton",
        Title: "Settings",
        URL: "#ESGST"
    }, {
        Title: "Update",
        URL: "https://github.com/revilheart/ESGST/raw/master/ESGST.user.js"
    }, {
        Title: "GitHub",
        URL: "https://github.com/revilheart/ESGST"
    }, {
        Title: "Discussion",
        URL: "/discussion/TDyzv/"
    }]));
    SMButton = Sidebar.getElementsByClassName("SMButton")[0];
    SMButton.addEventListener("click", function() {
        window.location.hash = "ESGST";
        window.location.reload();
    });
    if (esgst.esgstHash) {
        loadSMMenu(Sidebar, SMButton);
    }
}

function loadSMMenu(Sidebar, SMButton) {
    var Selected, Item, SMSyncFrequency, I, Container, SMGeneral, SMGiveaways, SMDiscussions, SMCommenting, SMUsers, SMOthers, SMManageData, SMRecentUsernameChanges,
        SMCommentHistory, SMManageTags, SMGeneralFeatures, SMGiveawayFeatures, SMDiscussionFeatures, SMCommentingFeatures, SMUserGroupGamesFeatures, SMOtherFeatures, ID,
        SMLastSync, LastSync, SMAPIKey;
    Selected = Sidebar.getElementsByClassName("is-selected")[0];
    Selected.classList.remove("is-selected");
    SMButton.classList.add("is-selected");
    Item = SMButton.getElementsByClassName("sidebar__navigation__item__link")[0];
    Item.insertBefore(Selected.getElementsByClassName("fa")[0], Item.firstElementChild);
    SMSyncFrequency = "<select class=\"SMSyncFrequency\">";
    for (I = 0; I <= 30; ++I) {
        SMSyncFrequency += "<option>" + I + "</option>";
    }
    SMSyncFrequency += "</select>";
    Container = Sidebar.nextElementSibling;
    Container.innerHTML =
        "<div class=\"page__heading\">" +
        "    <div class=\"page__heading__breadcrumbs\">" +
        "        <a href=\"/account\">Account</a>" +
        "        <i class=\"fa fa-angle-right\"></i>" +
        "        <a href=\"#ESGST\">Enhanced SteamGifts & SteamTrades</a>" +
        "    </div>" +
        "</div>" +
        "<div class=\"form__rows SMMenu\">" +
        createSMSections([{
            Title: "General",
            Name: "SMGeneral"
        }, {
            Title: "Giveaways",
            Name: "SMGiveaways"
        }, {
            Title: "Discussions",
            Name: "SMDiscussions"
        }, {
            Title: "Commenting",
            Name: "SMCommenting"
        }, {
            Title: "Users, Groups & Games",
            Name: "SMUsers"
        }, {
            Title: "Others",
            Name: "SMOthers"
        }, {
            Title: "Sync Groups / Whitelist / Blacklist / Owned Games / Wishlist",
            HTML: SMSyncFrequency + createDescription("Select from how many days to how many days you want the automatic sync to run (0 to disable it).") + (
                "<div class=\"form__sync\">" +
                "    <div class=\"form__sync-data\">" +
                "        <div class=\"notification notification--warning SMLastSync\">" +
                "            <i class=\"fa fa-question-circle\"></i> Never synced." +
                "        </div>" +
                "    </div>" +
                "    <div class=\"form__submit-button SMSync\">" +
                "        <i class=\"fa fa-refresh\"></i> Sync" +
                "    </div>" +
                "</div>"
            )
        },
        {
            Title: "Sync Bundle List",
            HTML: (
                "<div class=\"form__sync\">" +
                "    <div class=\"form__sync-data\">" +
                "        <div class=\"notification notification--warning SMLastBundleSync\">" +
                "            <i class=\"fa fa-question-circle\"></i> Never synced." +
                "        </div>" +
                "    </div>" +
                "    <div class=\"form__submit-button SMBundleSync\">" +
                "        <i class=\"fa fa-refresh\"></i> Sync" +
                "    </div>" +
                "</div>"
            )
        }, {
            Title: "Steam API Key",
            HTML: "<input class=\"SMAPIKey\" type=\"text\"/>" +
            createDescription("This is required for Entries Remover to work." +
                              "Get a Steam API Key <a class=\"rhBold\" href=\"https://steamcommunity.com/dev/apikey\" target=\"_blank\">here</a>.")
        }]) +
        "</div>";
    createSMButtons([{
        Check: true,
        Icons: ["fa-arrow-circle-up", "fa-arrow-circle-down", "fa-trash"],
        Name: "SMManageData",
        Title: "Manage data."
    }, {
        Check: esgst.uh,
        Icons: ["fa-user"],
        Name: "SMRecentUsernameChanges",
        Title: "See recent username changes."
    }, {
        Check: esgst.ch,
        Icons: ["fa-comments"],
        Name: "SMCommentHistory",
        Title: "See comment history."
    }, {
        Check: esgst.ut,
        Icons: ["fa-tags", "fa-cog"],
        Name: "SMManageTags",
        Title: "Manage tags."
    }, {
        Check: esgst.wbc,
        Icons: ["fa-heart", "fa-ban", "fa-cog"],
        Name: "WBCButton",
        Title: "Manage Whitelist / Blacklist Checker caches."
    }, {
        Check: esgst.namwc,
        Icons: ["fa-trophy", "fa-cog"],
        Name: "NAMWCButton",
        Title: "Manage Not Activated / Multiple Wins Checker caches."
    }]);
    esgst.mainPageHeading = Container.getElementsByClassName(`page__heading`)[0];
    SMGeneral = Container.getElementsByClassName("SMGeneral")[0];
    SMGiveaways = Container.getElementsByClassName("SMGiveaways")[0];
    SMDiscussions = Container.getElementsByClassName("SMDiscussions")[0];
    SMCommenting = Container.getElementsByClassName("SMCommenting")[0];
    SMUsers = Container.getElementsByClassName("SMUsers")[0];
    SMOthers = Container.getElementsByClassName("SMOthers")[0];
    SMManageData = Container.getElementsByClassName("SMManageData")[0];
    SMRecentUsernameChanges = Container.getElementsByClassName("SMRecentUsernameChanges")[0];
    SMCommentHistory = Container.getElementsByClassName("SMCommentHistory")[0];
    SMManageTags = Container.getElementsByClassName("SMManageTags")[0];
    SMSyncFrequency = Container.getElementsByClassName("SMSyncFrequency")[0];
    SMLastSync = Container.getElementsByClassName("SMLastSync")[0];
    SMLastBundleSync = Container.getElementsByClassName("SMLastBundleSync")[0];
    SMAPIKey = Container.getElementsByClassName("SMAPIKey")[0];
    SMGeneralFeatures = ["fh", "fs", "fmph", "ff", "hir", "vai", "ev", "hbs", "at", "pnot", "es"];
    SMGiveawayFeatures = ["dgn", "pr", "hfc", "ags", "pgb", "gv", "egf", "gp", "ggp", "gt", "sgg", "ugs", "er", "gwl", "gesl", "as"];
    SMDiscussionFeatures = ["adot", "dh", "mpp", "ded"];
    SMCommentingFeatures = ["ch", "ct", "cfh", "rbot", "rbp", "mr", "rfi", "rml"];
    SMUserGroupGamesFeatures = ["ap", "uh", "un", "rwscvl", "ugd", "namwc", "nrf", "swr", "luc", "sgpb", "stpb", "sgc", "wbc", "wbh", "ut", "iwh", "gh", "gs", "ggh", "ggt", "gc", "mt"];
    SMOtherFeatures = ["sm_ebd", "sm_hb"];
    for (var i = 0, n = esgst.features.length; i < n; ++i) {
        var id = esgst.features[i].id;
        if (SMGeneralFeatures.indexOf(id) >= 0) {
            SMGeneral.appendChild(getSMFeature(esgst.features[i]));
        } else if (SMGiveawayFeatures.indexOf(id) >= 0) {
            SMGiveaways.appendChild(getSMFeature(esgst.features[i]));
        } else if (SMDiscussionFeatures.indexOf(id) >= 0) {
            SMDiscussions.appendChild(getSMFeature(esgst.features[i]));
        } else if (SMCommentingFeatures.indexOf(id) >= 0) {
            SMCommenting.appendChild(getSMFeature(esgst.features[i]));
        } else if (SMUserGroupGamesFeatures.indexOf(id) >= 0) {
            SMUsers.appendChild(getSMFeature(esgst.features[i]));
        } else if (SMOtherFeatures.indexOf(id) >= 0) {
            SMOthers.appendChild(getSMFeature(esgst.features[i]));
        }
    }
    SMSyncFrequency.selectedIndex = GM_getValue("SyncFrequency");
    LastSync = GM_getValue("LastSync");
    if (LastSync) {
        SMLastSync.classList.remove("notification--warning");
        SMLastSync.classList.add("notification--success");
        SMLastSync.innerHTML = "<i class=\"fa fa-check-circle\"></i> Last synced " + (new Date(LastSync).toLocaleString()) + ".";
    }
    checkSync(true, function(CurrentDate) {
        SMLastSync.classList.remove("notification--warning");
        SMLastSync.classList.add("notification--success");
        SMLastSync.innerHTML =
            "<i class=\"fa fa-check-circle\"></i> Last synced " + CurrentDate.toLocaleString() + ".";
    });
    LastBundleSync = GM_getValue("LastBundleSync");
    if (LastBundleSync) {
        SMLastBundleSync.classList.remove("notification--warning");
        SMLastBundleSync.classList.add("notification--success");
        SMLastBundleSync.innerHTML = "<i class=\"fa fa-check-circle\"></i> Last synced " + (new Date(LastBundleSync).toLocaleString()) + ".";
    }
    document.getElementsByClassName("SMBundleSync")[0].addEventListener("click", function() {
        if (((new Date().getTime()) - LastBundleSync) > 604800000) {
            syncBundleList();
        } else {
            window.alert(`You synced the bundle list in less than a week ago. You can sync only once per week.`);
        }
    });
    if (GM_getValue("SteamAPIKey")) {
        SMAPIKey.value = GM_getValue("SteamAPIKey");
    }
    SMSyncFrequency.addEventListener("change", function() {
        GM_setValue("SyncFrequency", SMSyncFrequency.selectedIndex);
    });
    SMManageData.addEventListener("click", function() {
        var Popup, SM, SMImport, SMExport, SMDelete;
        Popup = createPopup(true);
        Popup.Icon.classList.add("fa-cog");
        Popup.Title.textContent = "Manage data:";
        SM = {
            Names: {
                Users: "U",
                Games: "G",
                Comments: "C",
                Comments_ST: "C_ST",
                Emojis: "E",
                Rerolls: "R",
                CommentHistory: "CH",
                StickiedGroups: "SG",
                Templates: "T"
            }
        };
        createOptions(Popup.Options, SM, [{
            Check: function() {
                return true;
            },
            Description: "Users data.",
            Title: "Includes user notes, tags and checker caches.",
            Name: "Users",
            Key: "U",
            ID: "SM_U"
        }, {
            Check: function() {
                return true;
            },
            Description: "Games data.",
            Title: "Includes game tags and Entered Games Highlighter data.",
            Name: "Games",
            Key: "G",
            ID: "SM_G"
        }, {
            Check: function() {
                return true;
            },
            Description: "Comments data (SteamGifts).",
            Title: "Includes Comment Tracker data from SteamGifts.",
            Name: "Comments",
            Key: "C",
            ID: "SM_C"
        }, {
            Check: function() {
                return true;
            },
            Description: "Comments data (SteamTrades).",
            Title: "Includes Comment Tracker data from SteamTrades.",
            Name: "Comments_ST",
            Key: "C_ST",
            ID: "SM_C_ST"
        }, {
            Check: function() {
                return true;
            },
            Description: "Emojis data.",
            Title: "Includes Comment Formatting Helper emojis data.",
            Name: "Emojis",
            Key: "E",
            ID: "SM_E"
        }, {
            Check: function() {
                return true;
            },
            Description: "Rerolls data.",
            Title: "Includes Unsent Gifts Sender rerolls data.",
            Name: "Rerolls",
            Key: "R",
            ID: "SM_R"
        }, {
            Check: function() {
                return true;
            },
            Description: "Comment history data.",
            Title: "Includes Comment History data.",
            Name: "CommentHistory",
            Key: "CH",
            ID: "SM_CH"
        }, {
            Check: function() {
                return true;
            },
            Description: "Stickied groups data.",
            Title: "Includes Stickied Giveaway Groups data.",
            Name: "StickiedGroups",
            Key: "SG",
            ID: "SM_SG"
        }, {
            Check: function() {
                return true;
            },
            Description: "Templates data.",
            Title: "Includes Giveaway Templates data.",
            Name: "Templates",
            Key: "T",
            ID: "SM_T"
        }, {
            Check: function() {
                return true;
            },
            Description: "Settings data.",
            Title: "Includes feature settings.",
            Name: "Settings",
            Key: "S",
            ID: "SM_S"
        }]);
        Popup.Button.classList.add("SMManageDataPopup");
        Popup.Button.innerHTML =
            "<div class=\"SMImport\"></div>" +
            "<div class=\"SMExport\"></div>" +
            "<div class=\"SMDelete\"></div>";
        SMImport = Popup.Button.firstElementChild;
        SMExport = SMImport.nextElementSibling;
        SMDelete = SMExport.nextElementSibling;
        createButton(SMImport, "fa-arrow-circle-up", "Import", "", "", function(Callback) {
            Callback();
            importSMData(SM);
        });
        createButton(SMExport, "fa-arrow-circle-down", "Export", "", "", function(Callback) {
            Callback();
            exportSMData(SM);
        });
        createButton(SMDelete, "fa-trash", "Delete", "", "", function(Callback) {
            Callback();
            deleteSMData(SM);
        });
        Popup.popUp();
    });
    if (SMManageTags) {
        SMManageTags.addEventListener("click", function() {
            var Popup, MT, SMManageTagsPopup;
            Popup = createPopup(true);
            Popup.Icon.classList.add("fa-cog");
            Popup.Title.textContent = "Manage tags:";
            Popup.TextInput.classList.remove("rhHidden");
            Popup.TextInput.insertAdjacentHTML("beforeBegin", "<div class=\"page__heading\"></div>");
            MT = {};
            addMTContainer(Popup.TextInput.previousElementSibling, MT, {
                Popup: Popup
            });
            Popup.TextInput.insertAdjacentHTML(
                "afterEnd",
                createDescription("Filter users by tag (use commas to separate filters, for example: Filter1, Filter2, ...). Filters are not case sensitive.")
            );
            SMManageTagsPopup = Popup.popUp(function() {
                var SavedUsers, MTUsers, Tags, I, N, Context, Username, SavedTags, J, NumTags, Key;
                Popup.TextInput.focus();
                SavedUsers = GM_getValue("Users");
                MTUsers = {};
                Tags = {};
                for (I = 0, N = SavedUsers.length; I < N; ++I) {
                    if (SavedUsers[I].Tags) {
                        Popup.Results.insertAdjacentHTML(
                            "beforeEnd",
                            "<div>" +
                            "    <a href=\"/user/" + SavedUsers[I].Username + "\">" + SavedUsers[I].Username + "</a>" +
                            "</div>"
                        );
                        Context = Popup.Results.lastElementChild.firstElementChild;
                        Username = SavedUsers[I].Username;
                        if (!MTUsers[Username]) {
                            MTUsers[Username] = [];
                        }
                        MTUsers[Username].push(Context);
                        SMManageTagsPopup.reposition();
                        SavedTags = SavedUsers[I].Tags.split(/,\s/g);
                        for (J = 0, NumTags = SavedTags.length; J < NumTags; ++J) {
                            Key = SavedTags[J].toLowerCase();
                            if (!Tags[Key]) {
                                Tags[Key] = [];
                            }
                            Tags[Key].push(Popup.Results.children.length - 1);
                        }
                    }
                }
                addMTCheckboxes(MTUsers, "User", "beforeBegin", "previousElementSibling", MT);
                loadEndlessFeatures(Popup.Results);
                Popup.TextInput.addEventListener("input", function() {
                    var MTUsers, Matches, Filters, Context, Username;
                    selectMTCheckboxes(MT.UserCheckboxes, "uncheck", MT, "User");
                    removeMTCheckboxes("User", MT);
                    MTUsers = {};
                    Matches = Popup.Results.getElementsByClassName("SMTag");
                    for (I = 0, N = Matches.length; I < N; ++I) {
                        if (Matches[I]) {
                            Matches[I].classList.remove("SMTag");
                        }
                    }
                    if (Popup.TextInput.value) {
                        Popup.Results.classList.add("SMTags");
                        Filters = Popup.TextInput.value.split(/,\s*/g);
                        for (I = 0, N = Filters.length; I < N; ++I) {
                            Key = Filters[I].toLowerCase();
                            if (Tags[Key]) {
                                for (J = 0, NumTags = Tags[Key].length; J < NumTags; ++J) {
                                    Context = Popup.Results.children[Tags[Key][J]];
                                    Context.classList.add("SMTag");
                                    Context = Context.querySelector("a[href*='/user/']");
                                    Username = Context.textContent;
                                    if (!MTUsers[Username]) {
                                        MTUsers[Username] = [];
                                    }
                                    MTUsers[Username].push(Context);
                                }
                            }
                        }
                    } else {
                        Popup.Results.classList.remove("SMTags");
                        Matches = Popup.Results.querySelectorAll("a[href*='/user/']");
                        for (I = 0, N = Matches.length; I < N; ++I) {
                            Context = Matches[I];
                            Username = Context.textContent;
                            if (!MTUsers[Username]) {
                                MTUsers[Username] = [];
                            }
                            MTUsers[Username].push(Context);
                        }
                    }
                    addMTCheckboxes(MTUsers, "User", "beforeBegin", "previousElementSibling", MT);
                    SMManageTagsPopup.reposition();
                });
            });
        });
    }
    if (SMRecentUsernameChanges) {
        setSMRecentUsernameChanges(SMRecentUsernameChanges);
    }
    if (SMCommentHistory) {
        setSMCommentHistory(SMCommentHistory);
    }
    SMAPIKey.addEventListener("input", function() {
        GM_setValue("SteamAPIKey", SMAPIKey.value);
    });
}

function getSMFeature(Feature, mainId) {
    var Menu, Checkbox, CheckboxInput, SMFeatures, Key;
    Menu = document.createElement("div");
    var ID = Feature.id;
    Menu.insertAdjacentHTML(
        "beforeEnd",
        "<span></span>" + (ID.match(/_/) ? (
            "<span> " + Feature.name + "</span>") : (
            "<span class=\"popup__actions\">" +
            "    <a href=\"https://github.com/rafaelgs18/ESGST#" + Feature.name.replace(/(-|\s)/g, "-").replace(/\//g, "").toLowerCase() + "\" target=\"_blank\">" + Feature.name + "</a>" +
            "</span>")) +
        "<div class=\"form__row__indent SMFeatures rhHidden\"></div>"
    );
    Checkbox = Menu.firstElementChild;
    CheckboxInput = createCheckbox(Checkbox, GM_getValue(ID)).Checkbox;
    SMFeatures = Menu.lastElementChild;
    if (Feature.options) {
        for (var i = 0, n = Feature.options.length; i < n; ++i) {
            SMFeatures.appendChild(getSMFeature(Feature.options[i], Feature.id));
        }
    }
    if (mainId == `gc`) {
        var color = GM_getValue(`${Feature.id}_color`);
        var bgColor = GM_getValue(`${Feature.id}_bgColor`);
        var html = `
            <div class="esgst-sm-colors">
                Text: <input type="color" value="${color}">
                Background: <input type="color" value="${bgColor}">
            </div>
        `;
        SMFeatures.insertAdjacentHTML(`beforeEnd`, html);
        var colorContext = SMFeatures.lastElementChild.firstElementChild;
        var bgColorContext = colorContext.nextElementSibling;
        addColorObserver(colorContext, Feature.id, `color`);
        addColorObserver(bgColorContext, Feature.id, `bgColor`);
    }
    if (CheckboxInput.checked && SMFeatures.children.length) {
        SMFeatures.classList.remove("rhHidden");
    }
    Checkbox.addEventListener("click", function() {
        GM_setValue(ID, CheckboxInput.checked);
        if (CheckboxInput.checked && SMFeatures.children.length) {
            SMFeatures.classList.remove("rhHidden");
        } else {
            SMFeatures.classList.add("rhHidden");
        }
    });
    return Menu;
}

function addColorObserver(context, id, key) {
    context.addEventListener(`change`, function() {
        GM_setValue(`${id}_${key}`, context.value);
    });
}

function createSMSections(Sections) {
    var SectionsHTML, I, N;
    SectionsHTML = "";
    for (I = 0, N = Sections.length; I < N; ++I) {
        SectionsHTML +=
            "<div class=\"form__row\">" +
            "    <div class=\"form__heading\">" +
            "        <div class=\"form__heading__number\">" + (I + 1) + ".</div>" +
            "        <div class=\"form__heading__text\">" + Sections[I].Title + "</div>" +
            "    </div>" +
            "    <div class=\"form__row__indent" + (Sections[I].Name ? (" " + Sections[I].Name) : "") + "\">" + (Sections[I].HTML ? Sections[I].HTML : "") + "</div>" +
            "</div>";
    }
    return SectionsHTML;
}

function createSMButtons(Items) {
    var Heading, I, N, Item, Icons, J, NumIcons;
    Heading = document.getElementsByClassName("page__heading")[0];
    for (I = 0, N = Items.length; I < N; ++I) {
        Item = Items[I];
        if (Item.Check) {
            Icons = "";
            for (J = 0, NumIcons = Item.Icons.length; J < NumIcons; ++J) {
                Icons += "<i class=\"fa " + Item.Icons[J] + "\"></i> ";
            }
            Heading.insertAdjacentHTML("beforeEnd", "<a class=\"" + Item.Name + "\" title=\"" + Item.Title + "\">" + Icons + "</a>");
        }
    }
}

function importSMData(SM) {
    var File, Reader;
    File = document.createElement("input");
    File.type = "file";
    File.click();
    File.addEventListener("change", function() {
        File = File.files[0];
        if (File.name.match(/\.json/)) {
            Reader = new FileReader();
            Reader.readAsText(File);
            Reader.onload = function() {
                var Key, Setting;
                File = parseJSON(Reader.result);
                if ((File.rhSGST && (File.rhSGST == "Data")) || (File.ESGST && (File.ESGST == "Data"))) {
                    if (window.confirm("Are you sure you want to import this data? A copy will be downloaded as precaution.")) {
                        exportSMData(SM);
                        for (Key in File.Data) {
                            if (Key == "Settings") {
                                if (SM.S.checked) {
                                    for (Setting in File.Data.Settings) {
                                        GM_setValue(Setting, File.Data.Settings[Setting]);
                                    }
                                }
                            } else if (SM[SM.Names[Key]].checked) {
                                GM_setValue(Key, File.Data[Key]);
                            }
                        }
                        window.alert("Imported!");
                    }
                } else {
                    window.alert("Wrong file!");
                }
            };
        } else {
            window.alert("File should be in the .json format.");
        }
    });
}

function exportSMData(SM) {
    var File, Data, Key, URL;
    File = document.createElement("a");
    File.download = "ESGST.json";
    Data = {};
    for (Key in SM.Names) {
        if (SM[SM.Names[Key]].checked) {
            Data[Key] = GM_getValue(Key);
        }
    }
    if (SM.S.checked) {
        Data.Settings = {};
        for (var i = 0, n = esgst.features.length; i < n; ++i) {
            Data.Settings[esgst.features[i].id] = esgst[esgst.features[i].id];
            if (esgst.features[i].options) {
                for (var j = 0, numO = esgst.features[i].options; j < numO; ++j) {
                    Data.Settings[esgst.features[i].options[j].id] = esgst[esgst.features[i].options[j].id];
                }
            }
        }
    }
    Data = new Blob([JSON.stringify({
        ESGST: "Data",
        Data: Data
    })]);
    URL = window.URL.createObjectURL(Data);
    File.href = URL;
    document.body.appendChild(File);
    File.click();
    File.remove();
    window.URL.revokeObjectURL(URL);
    window.alert("Exported!");
}

function exportSMSettings(Data, Key, Feature) {
    Data[Key] = GM_getValue(Key);
    for (Key in Feature) {
        if (Key != "Name") {
            exportSMSettings(Data, Key, Feature[Key]);
        }
    }
}

function deleteSMData(SM) {
    var Key;
    if (window.confirm("Are you sure you want to delete this data? A copy will be downloaded as precaution.")) {
        exportSMData(SM);
        for (Key in SM.Names) {
            if (SM[SM.Names[Key]].checked) {
                GM_deleteValue(Key);
            }
        }
        if (SM.S.checked) {
            for (Key in Features) {
                deleteSMSettings(Key, Features[Key]);
            }
        }
        window.alert("Deleted!");
    }
}

function deleteSMSettings(Key, Feature) {
    for (Key in Feature) {
        if (Key != "Name") {
            deleteSMSettings(Key, Feature[Key]);
        }
    }
}

function setSMRecentUsernameChanges(SMRecentUsernameChanges) {
    SMRecentUsernameChanges.addEventListener("click", function() {
        var Popup, SMRecentUsernameChangesPopup;
        Popup = createPopup(true);
        Popup.Results.classList.add("SMRecentUsernameChangesPopup");
        Popup.Icon.classList.add("fa-comments");
        Popup.Title.textContent = "Recent Username Changes";
        Popup.Progress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>Loading recent username changes...</span>";
        makeRequest(null, "https://script.google.com/macros/s/AKfycbzvOuHG913mRIXOsqHIeAuQUkLYyxTHOZim5n8iP-k80iza6g0/exec?Action=2", Popup.Progress, function(Response) {
            var RecentChanges, HTML, I, N;
            Popup.Progress.innerHTML = "";
            RecentChanges = parseJSON(Response.responseText).RecentChanges;
            HTML = "";
            for (I = 0, N = RecentChanges.length; I < N; ++I) {
                HTML += "<div>" + RecentChanges[I][0] + " changed to <a class=\"rhBold\" href=\"/user/" + RecentChanges[I][1] + "\">" + RecentChanges[I][1] + "</a></div>";
            }
            Popup.Results.innerHTML = HTML;
            if (esgst.sg) {
                loadEndlessFeatures(Popup.Results);
            }
            SMRecentUsernameChangesPopup.reposition();
        });
        SMRecentUsernameChangesPopup = Popup.popUp();
    });
}

function setSMCommentHistory(SMCommentHistory) {
    SMCommentHistory.addEventListener("click", function() {
        var Popup;
        Popup = createPopup(true);
        Popup.Popup.style.width = "600px";
        Popup.Icon.classList.add("fa-comments");
        Popup.Title.textContent = "Comment History";
        Popup.Results.classList.add("SMComments");
        Popup.Results.innerHTML = GM_getValue("CommentHistory");
        if (esgst.at) {
            loadAccurateTimestamps(Popup.Results);
        }
        Popup.popUp();
    });
}
