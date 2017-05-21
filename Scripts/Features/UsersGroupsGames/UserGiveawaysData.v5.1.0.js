function loadUserGiveawaysData(context, user) {
    var wonRow, sentRow;
    if (context.context) {
        wonRow = context.wonRow;
        sentRow = context.sentRow;
    } else {
        wonRow = esgst.wonRow;
        sentRow = esgst.sentRow;
        user = esgst.user;
    }
    if (wonRow && sentRow) {
        addUGDButton(wonRow, `Won`, user);
        addUGDButton(sentRow, `Sent`, user);
    }
}

function addUGDButton(Context, Key, User) {
    var UGD, UGDButton, Popup;
    UGD = {
        Key: Key
    };
    Context.insertAdjacentHTML(
        "beforeEnd",
        " <span class=\"UGDButton\" title=\"Get " + UGD.Key.toLowerCase() + " giveaways data.\">" +
        "    <i class=\"fa fa-bar-chart\"></i>" +
        "</span>"
    );
    UGDButton = Context.lastElementChild;
    Popup = createPopup();
    Popup.Popup.classList.add("rhPopupLarge");
    Popup.Icon.classList.add("fa-bar-chart");
    Popup.Title.textContent = "Get " + User.Username + "'s " + UGD.Key.toLowerCase() + " giveaways data:";
    createOptions(Popup.Options, UGD, [{
        Check: function() {
            return true;
        },
        Description: "Clear cache.",
        Title: "If enabled, the cache will be cleared and all giveaways will be retrieved again (slower).",
        Name: "ClearCache",
        Key: "CC",
        ID: "UGD_CC"
    }]);
    createButton(Popup.Button, "fa-bar-chart", "Get Data", "fa-times-circle", "Cancel", function(Callback) {
        UGD.Canceled = false;
        UGDButton.classList.add("rhBusy");
        queueSave(UGD, function() {
            saveUser(User, UGD, function() {
                var Match, CurrentPage;
                GM_setValue("LastSave", 0);
                User.UGD = getUser(User).UGD;
                if (UGD.CC.checked) {
                    delete User.UGD;
                }
                if (!User.UGD) {
                    User.UGD = {
                        Sent: {},
                        Won: {},
                        SentTimestamp: 0,
                        WonTimestamp: 0
                    };
                } else if (!User.UGD.SentTimestamp) {
                    User.UGD.Sent = {};
                    User.UGD.SentTimestamp = 0;
                } else if (!User.UGD.WonTimestamp) {
                    User.UGD.Won = {};
                    User.UGD.WonTimestamp = 0;
                }
                Match = window.location.pathname.match(new RegExp("^\/user\/" + User.Username + ((UGD.Key == "Won") ? "/giveaways/won" : "")));
                CurrentPage = window.location.href.match(/page=(\d+)/);
                CurrentPage = Match ? (CurrentPage ? parseInt(CurrentPage[1]) : 1) : 0;
                getUGDGiveaways(UGD, User, 1, CurrentPage, Match, "/user/" + User.Username + ((UGD.Key == "Won") ? "/giveaways/won" : "") + "/search?page=", function() {
                    queueSave(UGD, function() {
                        saveUser(User, UGD, function() {
                            var Giveaways, Types, TypesTotal, LevelsTotal, Total, Frequencies, Key, I, N, Giveaway, Private, Group, Whitelist, Region, Level, Copies, Value, HTML, Type,
                                Ordered;
                            GM_setValue("LastSave", 0);
                            UGDButton.classList.remove("rhBusy");
                            Giveaways = User.UGD[UGD.Key];
                            Types = {
                                Public: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                Private: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                Group: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                Whitelist: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                Group_Whitelist: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                Region: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                Region_Private: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                Region_Group: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                Region_Whitelist: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                Region_Group_Whitelist: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                            };
                            TypesTotal = {
                                Public: 0,
                                Private: 0,
                                Group: 0,
                                Whitelist: 0,
                                Group_Whitelist: 0,
                                Region: 0,
                                Region_Private: 0,
                                Region_Group: 0,
                                Region_Whitelist: 0,
                                Region_Group_Whitelist: 0
                            };
                            LevelsTotal = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                            Total = 0;
                            Frequencies = {};
                            for (Key in Giveaways) {
                                for (I = 0, N = Giveaways[Key].length; I < N; ++I) {
                                    Giveaway = Giveaways[Key][I];
                                    if (Giveaway.Entries > 0) {
                                        Private = Giveaway.Private;
                                        Group = Giveaway.Group;
                                        Whitelist = Giveaway.Whitelist;
                                        Region = Giveaway.Region;
                                        Level = Giveaway.Level;
                                        Copies = (UGD.Key == "Sent") ? Giveaway.Copies : 1;
                                        if (Private) {
                                            if (Region) {
                                                Types.Region_Private[Level] += Copies;
                                                TypesTotal.Region_Private += Copies;
                                            } else {
                                                Types.Private[Level] += Copies;
                                                TypesTotal.Private += Copies;
                                            }
                                        } else if (Group) {
                                            if (Region) {
                                                Types.Region_Group[Level] += Copies;
                                                TypesTotal.Region_Group += Copies;
                                            } else if (Whitelist) {
                                                if (Region) {
                                                    Types.Region_Group_Whitelist[Level] += Copies;
                                                    TypesTotal.Region_Group_Whitelist += Copies;
                                                } else {
                                                    Types.Group_Whitelist[Level] += Copies;
                                                    TypesTotal.Group_Whitelist += Copies;
                                                }
                                            } else {
                                                Types.Group[Level] += Copies;
                                                TypesTotal.Group += Copies;
                                            }
                                        } else if (Whitelist) {
                                            if (Region) {
                                                Types.Region_Whitelist[Level] += Copies;
                                                TypesTotal.Region_Whitelist += Copies;
                                            } else {
                                                Types.Whitelist[Level] += Copies;
                                                TypesTotal.Whitelist += Copies;
                                            }
                                        } else if (Region) {
                                            Types.Region[Level] += Copies;
                                            TypesTotal.Region += Copies;
                                        } else {
                                            Types.Public[Level] += Copies;
                                            TypesTotal.Public += Copies;
                                        }
                                        LevelsTotal[Level] += Copies;
                                        Total += Copies;
                                        if (UGD.Key == "Sent") {
                                            if (!Frequencies[Giveaway.ID]) {
                                                Frequencies[Giveaway.ID] = {
                                                    Name: Giveaway.Name,
                                                    Frequency: 0
                                                };
                                            }
                                            Frequencies[Giveaway.ID].Frequency += Copies;
                                        } else {
                                            if (!Frequencies[Giveaway.Creator]) {
                                                Frequencies[Giveaway.Creator] = {
                                                    Name: Giveaway.Creator,
                                                    Frequency: 0
                                                };
                                            }
                                            ++Frequencies[Giveaway.Creator].Frequency;
                                        }
                                    }
                                }
                            }
                            HTML =
                                "<table class=\"UGDData\">" +
                                "    <tr>" +
                                "        <th>Type</th>" +
                                "        <th>Level 0</th>" +
                                "        <th>Level 1</th>" +
                                "        <th>Level 2</th>" +
                                "        <th>Level 3</th>" +
                                "        <th>Level 4</th>" +
                                "        <th>Level 5</th>" +
                                "        <th>Level 6</th>" +
                                "        <th>Level 7</th>" +
                                "        <th>Level 8</th>" +
                                "        <th>Level 9</th>" +
                                "        <th>Level 10</th>" +
                                "        <th>Total</th>" +
                                "    </tr>";
                            for (Type in Types) {
                                HTML +=
                                    "<tr>" +
                                    "    <td>" + Type.replace(/_/g, " + ") + "</td>";
                                for (I = 0; I <= 10; ++I) {
                                    Value = Types[Type][I];
                                    HTML +=
                                        "<td" + (Value ? "" : " class=\"is-faded\"") + ">" + Value + "</td>";
                                }
                                Value = Math.round(TypesTotal[Type] / Total * 10000) / 100;
                                HTML +=
                                    "    <td" + (Value ? "" : " class=\"is-faded\"") + ">" + TypesTotal[Type] + " (" + Value + "%)</td>" +
                                    "</tr>";
                            }
                            HTML +=
                                "    <tr>" +
                                "        <td>Total</td>";
                            for (I = 0; I <= 10; ++I) {
                                Value = Math.round(LevelsTotal[I] / Total * 10000) / 100;
                                HTML +=
                                    "    <td" + (Value ? "" : " class=\"is-faded\"") + ">" + LevelsTotal[I] + " (" + Value +  "%)</td>";
                            }
                            HTML +=
                                "        <td" + (Total ? "" : " class=\"is-faded\"") + ">" + Total + "</td>" +
                                "    </tr>" +
                                "</table>";
                            Ordered = [];
                            for (Key in Frequencies) {
                                for (I = 0, N = Ordered.length; (I < N) && (Frequencies[Key].Frequency <= Ordered[I].Frequency); ++I);
                                Ordered.splice(I, 0, Frequencies[Key]);
                            }
                            HTML +=
                                "<div class=\"rhBold\">" + ((UGD.Key == "Sent") ? "Most given away:" : "Most won from:") + "</div>" +
                                "<ul>";
                            for (Key in Ordered) {
                                HTML +=
                                    "<li>" + Ordered[Key].Name + " - <span class=\"rhBold\">" + Ordered[Key].Frequency + "</span></li>";
                            }
                            HTML +=
                                "</ul>";
                            Popup.Results.innerHTML = HTML;
                            UGD.Popup.reposition();
                            Callback();
                        });
                    });
                });
            });
        });
    }, function() {
        clearInterval(UGD.Request);
        clearInterval(UGD.Save);
        UGD.Canceled = true;
        setTimeout(function() {
            UGD.Progress.innerHTML = UGD.OverallProgress = "";
        }, 500);
        UGDButton.classList.remove("rhBusy");
    });
    UGD.Progress = Popup.Progress;
    UGD.OverallProgress = Popup.OverallProgress;
    UGDButton.addEventListener("click", function() {
        UGD.Popup = Popup.popUp();
    });
}

function getUGDGiveaways(UGD, User, NextPage, CurrentPage, CurrentContext, URL, Callback, Context) {
    var Giveaways, I, NumGiveaways, Giveaway, Timestamp, Received, Data, Heading, SteamButton, Match, Matches, Links, J, NumLinks, Text, Found, Pagination;
    if (Context) {
        Giveaways = Context.getElementsByClassName("giveaway__summary");
        for (I = 0, NumGiveaways = Giveaways.length; I < NumGiveaways; ++I) {
            Giveaway = Giveaways[I];
            Timestamp = parseInt(Giveaway.getElementsByClassName("giveaway__columns")[0].querySelector("[data-timestamp]").getAttribute("data-timestamp")) * 1000;
            if (Timestamp < (new Date().getTime())) {
                if (!UGD.Timestamp) {
                    UGD.Timestamp = Timestamp;
                }
                if (Timestamp > User.UGD[UGD.Key + "Timestamp"]) {
                    Data = {};
                    Heading = Giveaway.getElementsByClassName("giveaway__heading")[0];
                    SteamButton = Heading.querySelector("[href*='store.steampowered.com']");
                    if (SteamButton) {
                        Match = Heading.getElementsByClassName("giveaway__heading__name")[0];
                        Data.Code = Match.getAttribute("href");
                        Data.Code = Data.Code ? Data.Code.match(/\/giveaway\/(.+?)\//)[1] : "";
                        Data.Name = Match.textContent;
                        Matches = Heading.getElementsByClassName("giveaway__heading__thin");
                        if (Matches.length > 1) {
                            Data.Copies = parseInt(Matches[0].textContent.replace(/,/, "").match(/\d+/)[0]);
                            Data.Points = parseInt(Matches[1].textContent.replace(/,/, "").match(/\d+/)[0]);
                        } else {
                            Data.Copies = 1;
                            Data.Points = parseInt(Matches[0].textContent.replace(/,/, "").match(/\d+/)[0]);
                        }
                        Data.ID = parseInt(SteamButton.getAttribute("href").match(/\d+/)[0]);
                        if (UGD.Key == "Won") {
                            Data.Creator = Giveaway.getElementsByClassName("giveaway__username")[0].textContent;
                        }
                        Data.Level = Giveaway.getElementsByClassName("giveaway__column--contributor-level")[0];
                        Data.Level = Data.Level ? parseInt(Data.Level.textContent.match(/\d+/)[0]) : 0;
                        Data.Private = Giveaway.getElementsByClassName("giveaway__column--invite-only")[0];
                        Data.Private = Data.Private ? true : false;
                        Data.Group = Giveaway.getElementsByClassName("giveaway__column--group")[0];
                        Data.Group = Data.Group ? true : false;
                        Data.Whitelist = Giveaway.getElementsByClassName("giveaway__column--whitelist")[0];
                        Data.Whitelist = Data.Whitelist ? true : false;
                        Data.Region = Giveaway.getElementsByClassName("giveaway__column--region-restricted")[0];
                        Data.Region = Data.Region ? true : false;
                        Links = Giveaway.getElementsByClassName("giveaway__links")[0].children;
                        for (J = 0, NumLinks = Links.length; J < NumLinks; ++J) {
                            Text = Links[J].textContent;
                            if (Text.match(/(entry|entries)/)) {
                                Data.Entries = parseInt(Text.replace(/,/g, "").match(/\d+/)[0]);
                            } else if (Text.match(/comment/)) {
                                Data.Comments = parseInt(Text.replace(/,/g, "").match(/\d+/)[0]);
                            }
                        }
                        if (!User.UGD[UGD.Key][Data.ID]) {
                            User.UGD[UGD.Key][Data.ID] = [];
                        }
                        User.UGD[UGD.Key][Data.ID].push(Data);
                    }
                } else {
                    Found = true;
                    break;
                }
            }
        }
        Pagination = Context.getElementsByClassName("pagination__navigation")[0];
        if (!Found && Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
            getUGDGiveaways(UGD, User, NextPage, CurrentPage, CurrentContext, URL, Callback);
        } else {
            User.UGD[UGD.Key + "Timestamp"] = UGD.Timestamp;
            Callback();
        }
    } else if (!UGD.Canceled) {
        UGD.Progress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>Retrieving giveaways (page " + NextPage + ")...</span>";
        if (CurrentPage != NextPage) {
            if (CurrentContext && document.getElementById("esgst-es-page-" + NextPage)) {
                getUGDGiveaways(UGD, User, ++NextPage, CurrentPage, CurrentContext, URL, Callback);
            } else {
                queueRequest(UGD, null, URL + NextPage, function(Response) {
                    getUGDGiveaways(UGD, User, ++NextPage, CurrentPage, CurrentContext, URL, Callback, parseHTML(Response.responseText));
                });
            }
        } else {
            getUGDGiveaways(UGD, User, ++NextPage, CurrentPage, CurrentContext, URL, Callback, document);
        }
    }
}
