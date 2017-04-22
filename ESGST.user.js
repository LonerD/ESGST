// ==UserScript==
// @name ESGST
// @namespace ESGST
// @author rafaelgs18
// @contributor Royalgamer06
// @description Adds some cool features to SteamGifts.
// @version 5.3.2
// @downloadURL https://github.com/rafaelgs18/ESGST/raw/master/ESGST.user.js
// @updateURL https://github.com/rafaelgs18/ESGST/raw/master/ESGST.meta.js
// @match https://www.steamgifts.com/*
// @match https://www.steamtrades.com/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_listValues
// @grant GM_xmlhttpRequest
// @grant GM_addStyle
// @connect steamgifts.com
// @connect script.google.com
// @connect script.googleusercontent.com
// @connect sgtools.info
// @connect steamcommunity.com
// @connect api.steampowered.com
// @require https://github.com/rafaelgs18/ESGST/raw/master/Features/FixedElements.v5.0.1.js
// @require https://github.com/rafaelgs18/ESGST/raw/master/Features/VisibleAttachedImages.v5.0.1.js
// @require https://github.com/rafaelgs18/ESGST/raw/master/Features/PinnedGiveawaysButton.v5.0.js
// @require https://github.com/rafaelgs18/ESGST/raw/master/Features/EntriesRemover.v5.0.1.js
// @require https://github.com/rafaelgs18/ESGST/raw/master/Features/UsernameHistory.v5.0.js
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @require https://github.com/dinbror/bpopup/raw/master/jquery.bpopup.min.js
// @require https://cdn.steamgifts.com/js/highcharts.js
// @run-at document-idle
// ==/UserScript==

var ESGST, SG, Path, Location, Hash, XSRFToken, Features, Users, Games, APBoxes;
ESGST = {};
ESGST.SG = SG = window.location.hostname.match(/steamgifts/);
ESGST.XSRFToken = document.getElementsByClassName(ESGST.SG ? "js__logout" : "js_logout")[0].getAttribute("data-form").match(/xsrf_token=(.+)/)[1];
ESGST.Path = Path = window.location.pathname;
ESGST.GiveawaysRegex = /^\/($|giveaways(?!.*\/(wishlist|created|entered|won|new)))/;
ESGST.GiveawaysPath = Path.match(ESGST.GiveawaysRegex);
ESGST.CommentsRegex = /^\/(giveaway(?!.+\/(entries|winners))|discussion|support\/ticket|trade)\//;
ESGST.CommentsPath = Path.match(ESGST.CommentsRegex);
ESGST.GiveawayCommentsRegex = /^\/giveaway(?!.+\/(entries|winners))\//;
ESGST.GiveawayCommentsPath = Path.match(ESGST.GiveawayCommentsRegex);
Location = window.location.href;
ESGST.CurrentPage = Location.match(/page=(\d+)/);
if (ESGST.CurrentPage) {
    ESGST.CurrentPage = parseInt(ESGST.CurrentPage[1]);
} else {
    ESGST.CurrentPage = 1;
}
Hash = window.location.hash;
Features = {
    PGB: {
        Name: "Pinned Giveaways Button"
    },
    FE: {
        Name: "Fixed Elements",
        FE_H: {
            Name: "Header"
        },
        FE_HG: {
            Name: "Heading"
        },
        FE_S: {
            Name: "Sidebar"
        },
        FE_F: {
            Name: "Footer"
        }
    },
    ES: {
        Name: "Endless Scrolling",
        ES_G: {
            Name: "Enable in main / giveaways pages."
        },
        ES_GC: {
            Name: "Enable in giveaway comments pages."
        },
        ES_D: {
            Name: "Enable in discussions / support / trades pages."
        },
        ES_DC: {
            Name: "Enable in discussion / support / trade comments pages."
        },
        ES_R: {
            Name: "Enable in the rest of the pages."
        },
        ES_RS: {
            Name: "Disable reverse scrolling."
        }
    },
    GV: {
        Name: "Grid View"
    },
    HIR: {
        Name: "Header Icons Refresher",
        HIR_B: {
            Name: "Run in the background and change the icon of the tab if new messages are found."
        }
    },
    PR: {
        Name: "Points Refresher",
        PR_B: {
            Name: "Run in the background and display the points in the title of the tab upon refreshing."
        }
    },
    VAI: {
        Name: "Visible Attached Images"
    },
    AT: {
        Name: "Accurate Timestamp",
        AT_G: {
            Name: "Enable in the main giveaways pages."
        }
    },
    GTS: {
        Name: "Giveaway Templates"
    },
    SGG: {
        Name: "Stickied Giveaway Groups"
    },
    AGS: {
        Name: "Advanced Giveaway Search"
    },
    EGF: {
        Name: "Entered Giveaways Filter"
    },
    ELGB: {
        Name: "Enter / Leave Giveaway Button"
    },
    GDCBP: {
        Name: "Giveaway Description / Comment Box Popup",
        GDCBP_EG: {
            Name: "Pop up when entering a giveaway if Enter / Leave Giveaway Button is enabled.",
            GDCBP_D: {
                Name: "Only pop up if the giveaway has a description."
            }
        }
    },
    GWC: {
        Name: "Giveaway Winning Chance"
    },
    GGP: {
        Name: "Giveaway Groups Popup"
    },
    GWL: {
        Name: "Giveaway Winners Link"
    },
    DGN: {
        Name: "Delivered Gifts Notifier",
    },
    UGS: {
        Name: "Unsent Gifts Sender"
    },
    ER: {
        Name: "Entries Remover",
        ER_S: {
            Name: "Remove entries upon syncing."
        }
    },
    ADOT: {
        Name: "Active Discussions On Top"
    },
    DH: {
        Name: "Discussions Highlighter"
    },
    MPP: {
        Name: "Main Post Popup",
        MPP_FV: {
            Name: "Hide main post after first visit."
        }
    },
    DED: {
        Name: "Discussion Edit Detector"
    },
    CH: {
        Name: "Comment History"
    },
    CT: {
        Name: "Comment Tracker",
        CT_G: {
            Name: "Fade out visited giveaways."
        },
        CT_LU: {
            Name: "Go to the last unread comment of a discussion instead of the first one from the discussions page."
        }
    },
    CFH: {
        Name: "Comment Formatting Helper",
        CFH_I: {
            Name: "Italic"
        },
        CFH_B: {
            Name: "Bold"
        },
        CFH_S: {
            Name: "Spoiler"
        },
        CFH_ST: {
            Name: "Strikethrough"
        },
        CFH_H1: {
            Name: "Heading 1"
        },
        CFH_H2: {
            Name: "Heading 2"
        },
        CFH_H3: {
            Name: "Heading 3"
        },
        CFH_BQ: {
            Name: "Blockquote"
        },
        CFH_LB: {
            Name: "Line Break"
        },
        CFH_OL: {
            Name: "Ordered List"
        },
        CFH_UL: {
            Name: "Unordered List"
        },
        CFH_IC: {
            Name: "Inline Code"
        },
        CFH_LC: {
            Name: "Line Code"
        },
        CFH_PC: {
            Name: "Paragraph Code"
        },
        CFH_L: {
            Name: "Link"
        },
        CFH_IMG: {
            Name: "Image"
        },
        CFH_T: {
            Name: "Table"
        },
        CFH_E: {
            Name: "Emojis"
        }
    },
    MCBP: {
        Name: "Main Comment Box Popup"
    },
    MR: {
        Name: "Multi-Reply"
    },
    RFI: {
        Name: "Reply From Inbox"
    },
    RML: {
        Name: "Reply Mention Link"
    },
    UH: {
        Name: "Username History"
    },
    PUN: {
        Name: "Permanent User Notes"
    },
    RWSCVL: {
        Name: "Real Won / Sent CV Links",
        RWSCVL_RO: {
            Name: "Reverse order (from new to old)."
        },
        RWSCVL_AL: {
            Name: "Automatically load real CV and show it on the profile."
        }
    },
    SWR: {
        Name: "Sent / Won Ratio"
    },
    SGPB: {
        Name: "SteamGifts Profile Button"
    },
    STPB: {
        Name: "SteamTrades Profile Button"
    },
    SGC: {
        Name: "Shared Groups Checker"
    },
    PUT: {
        Name: "Permanent User Tags"
    },
    WBH: {
        Name: "Whitelist / Blacklist Highlighter"
    },
    WBC: {
        Name: "Whitelist / Blacklist Checker",
        WBC_B: {
            Name: "Show blacklist information."
        },
        WBC_H: {
            Name: "Highlight users who have whitelisted / blacklisted you."
        }
    },
    NAMWC: {
        Name: "Not Activated / Multiple Wins Checker",
        NAMWC_H: {
            Name: "Highlight users."
        }
    },
    NRF: {
        Name: "Not Received Finder"
    },
    LUC: {
        Name: "Level Up Calculator"
    },
    UGD: {
        Name: "User Giveaways Data"
    },
    IWH: {
        Name: "Inbox Winners Highlighter"
    },
    AP: {
        Name: "Avatar Popout"
    },
    EGH: {
        Name: "Entered Games Highlighter"
    },
    GT: {
        Name: "Game Tags"
    },
    FCH: {
        Name: "Featured Container Hider"
    },
    BSH: {
        Name: "Blacklist Stats Hider"
    },
    MT: {
        Name: "Multi-Tag"
    },
    GH: {
        Name: "Groups Highlighter"
    },
    GS: {
        Name: "Groups Stats"
    },
    AS: {
        Name: "Archive Searcher"
    },
    SM_D: {
        Name: "Enable new features by default."
    },
    GESL: {
        Name: "Giveaway Error Search Links"
    }
};
if (window.Element && !window.Element.prototype.closest) {
    window.Element.prototype.closest = function(Query) {
        var Matches, Element, I;
        Matches = (this.document || this.ownerDocument).querySelectorAll(Query);
        Element = this;
        do {
            I = Matches.length - 1;
            while ((I >= 0) && (Matches[I] != Element)) {
                --I;
            }
        } while ((I < 0) && (Element = Element.parentElement));
        return Element;
    };
}
setDefaultValues();
updateGroups();
addStyles();
loadFeatures();
if (SG) {
    checkSync();
}
window.addEventListener("beforeunload", function(Event) {
    if (document.getElementsByClassName("rhBusy")[0]) {
        Event.returnValue = true;
        return true;
    }
});
window.addEventListener("hashchange", function() {
    goToComment();
});

// Helper Functions

function setDefaultValues() {
    var DefaultValues, rhSGST, Key;
    DefaultValues = {
        Avatar: "",
        Username: "",
        SteamID64: "",
        OwnedGames: [],
        Users: [],
        Games: {},
        Groups: [],
        LastRequest: 0,
        LastSave: 0,
        LastSync: 0,
        SyncFrequency: 7,
        Comments: {},
        Comments_ST: {},
        Emojis: "",
        Rerolls: [],
        CommentHistory: "",
        StickiedGroups: [],
        Templates: [],
        Winners: {}
    };
    rhSGST = GM_getValue("rhSGST");
    for (Key in DefaultValues) {
        if (typeof GM_getValue(Key) == "undefined") {
            if (rhSGST && rhSGST[Key]) {
                GM_setValue(Key, rhSGST[Key]);
            } else {
                GM_setValue(Key, DefaultValues[Key]);
            }
        }
    }
    for (Key in Features) {
        transferSettings(Key, rhSGST, Features[Key]);
    }
}

function transferSettings(Key, rhSGST, Feature) {
    if (typeof GM_getValue(Key) == "undefined") {
        if (rhSGST && (typeof rhSGST[Key] != "undefined")) {
            GM_setValue(Key, rhSGST[Key]);
        } else {
            GM_setValue(Key, GM_getValue("SM_D") ? true : false);
        }
    }
    ESGST[Key] = GM_getValue(Key);
    for (Key in Feature) {
        if (Key != "Name") {
            transferSettings(Key, rhSGST, Feature[Key]);
        }
    }
}

function updateGroups() {
    var Popup;
    if (!GM_getValue("GSync")) {
        Popup = createPopup(true);
        Popup.Icon.classList.add("fa-refresh", "fa-spin");
        Popup.Title.textContent = "ESGST is updating your groups. Please wait...";
        Popup.Groups = [];
        syncGroups(Popup, "/account/steam/groups/search?page=", 1, function(Groups) {
            GM_setValue("GSync", true);
            GM_setValue("Groups", Popup.Groups);
            Popup.Title.textContent = "Done. You can close this now.";
        });
        Popup.popUp();
    }
}

function loadFeatures() {
    var CommentBox;
    if (ESGST.UH) {
        addUHStyle();
    }
    if (SG) {
        addHMMenu();
    }
    if (GM_getValue("FCH") && SG && Path.match(/^\/($|giveaways(?!\/(wishlist|created|entered|won|new)))/)) {
        hideFCHContainer();
    } else if (GM_getValue("BSH") && Path.match(/^\/stats\/personal\/community/)) {
        hideBSHStats();
    }
    if (GM_getValue("FE")) {
        fixFEElements();
    }
    if (Path.match(/^\/account/)) {
        addSMButton();
        if (ESGST.ER_S && Path.match(/^\/account\/settings\/profile/) && !Location.match(/#/)) {
            addERButton();
        }
    } else if (Path.match(/^\/user\//)) {
        loadProfileFeatures(document);
    } else if (Path.match(/^\/support\/tickets\/new/)) {
        setUGSObserver();
    } else if (GM_getValue("DED") && Path.match(/^\/(giveaway|discussion|support\/ticket)\//)) {
        CommentBox = document.getElementsByClassName(SG ? "comment--submit" : "reply_form")[0];
        if (CommentBox) {
            addDEDButton(CommentBox);
        }
    } else if (ESGST.SG && ESGST.GiveawaysPath) {
        if (ESGST.AGS) {
            addAGSPanel();
        }
        if (ESGST.PGB) {
            addPGBButton();
        }
    } else if (GM_getValue("GWC") && Path.match(/^\/giveaways\/entered/)) {
        addGWCHeading();
    }
    if (GM_getValue("DH") && Path.match(/^\/discussion\//)) {
        highlightDHDiscussion();
    }
    if (Path.match(/^\/giveaway\//)) {
        if (ESGST.GESL && document.querySelector(".table.table--summary")) {
            addGESL();
        }
        if (GM_getValue("GWC") && !document.querySelector(".table.table--summary")) {
            addGWCChance();
        }
        if (GM_getValue("EGH")) {
            setEGHHighlighter();
        }
    }
    if (SG) {
        if (GM_getValue("HIR")) {
            setHIRRefresher();
        } else if (GM_getValue("DGN")) {
            checkDGNGifts();
        }
        if (GM_getValue("PR")) {
            setPRRefresher();
        }
        if (Path.match(/^\/giveaways\/new/) && !document.getElementsByClassName("table--summary")[0]) {
            if (GM_getValue("GTS")) {
                addGTSButtons();
            }
            if (GM_getValue("SGG")) {
                setSGGGroups();
            }
        }
        if (GM_getValue("GS") && Path.match(/^\/account\/steam\/groups/)) {
            addGSHeading();
        }
    }
    Users = {};
    Games = {};
    APBoxes = {};
    loadEndlessFeatures(document);
    if (GM_getValue("ADOT") && Path.match(/^\/($|giveaways(?!.+(new|wishlist|created|entered|won)))/)) {
        moveADOTDiscussions();
    }
    setTimeout(goToComment, 1000);
}

function loadProfileFeatures(Context) {
    var Heading, SteamButton, User;
    Heading = Context.getElementsByClassName(SG ? "featured__heading" : "page_heading")[0];
    SteamButton = Context.querySelector("a[href*='/profiles/']");
    User = {};
    User.ID = Context.querySelector("[name='child_user_id']");
    User.ID = User.ID ? User.ID.value : "";
    User.SteamID64 = SteamButton.getAttribute("href").match(/\d+/)[0];
    User.Username = SG ? Heading.textContent : "";
    if (SG) {
        if (ESGST.UH) {
            addUHContainer(Heading, User);
        }
        if (GM_getValue("STPB")) {
            addSTPBButton(Context, User);
        }
        if (GM_getValue("SGC") && (User.Username != GM_getValue("Username"))) {
            addSGCButton(Context, User);
        }
    } else if (GM_getValue("SGPB")) {
        addSGPBButton(User, SteamButton);
    }
    if (GM_getValue("PUN")) {
        addPUNButton(Heading, User);
    }
    loadWonSentFeatures(Context, User);
}

function loadWonSentFeatures(Context, User) {
    var Matches, I, N, Match, Key, Won, Sent;
    Matches = Context.getElementsByClassName("featured__table__row__left");
    for (I = 0, N = Matches.length; I < N; ++I) {
        Match = Matches[I].textContent.match(/Gifts (Won|Sent)/);
        if (Match) {
            Key = Match[1];
            if (GM_getValue("RWSCVL")) {
                addRWSCVLLink(Matches[I], Key, User);
            }
            if (GM_getValue("UGD")) {
                addUGDButton(Matches[I], Key, User);
            }
            if (Key == "Won") {
                Won = Matches[I];
                if (GM_getValue("NAMWC")) {
                    addNAMWCProfileButton(Won, User);
                }
            } else {
                Sent = Matches[I];
                if (GM_getValue("NRF")) {
                    addNRFButton(Sent, User);
                }
            }
        } else if (GM_getValue("LUC") && Matches[I].textContent.match(/Contributor Level/)) {
            calculateLUCValue(Matches[I]);
        }
    }
    if (GM_getValue("SWR")) {
        addSWRRatio(Won, Sent, User);
    }
}

function loadEndlessFeatures(Context) {
    var Matches, CurrentUsers, I, N, UserID, Match, SteamLink, Game, Title, CurrentGames, SavedUsers, SavedGames;
    Matches = Context.querySelectorAll("a[href*='/user/']");
    CurrentUsers = {};
    for (I = 0, N = Matches.length; I < N; ++I) {
        Match = Matches[I].getAttribute("href").match(/\/user\/(.+)/);
        if (Match) {
            UserID = Match[1];
            if (((SG && Matches[I].textContent == UserID) || (!SG && Matches[I].textContent && !Matches[I].children.length)) && !Matches[I].closest(".markdown")) {
                if (!Users[UserID]) {
                    Users[UserID] = [];
                }
                if (!CurrentUsers[UserID]) {
                    CurrentUsers[UserID] = [];
                }
                Users[UserID].push(Matches[I]);
                CurrentUsers[UserID].push(Matches[I]);
                if (GM_getValue("PUT")) {
                    addPUTButton(Matches[I], UserID);
                }
            }
        }
    }
    Matches = Context.querySelectorAll(Path.match(/^\/giveaway\//) ? ".featured__heading" : ".giveaway__heading, .table__column__heading");
    CurrentGames = {};
    for (I = 0, N = Matches.length; I < N; ++I) {
        Match = Matches[I];
        SteamLink = Match.querySelector("a[href*='store.steampowered.com']");
        if (SteamLink) {
            Game = SteamLink.getAttribute("href").match(/\d+/)[0];
            Title = Match.firstElementChild.textContent;
        } else if (!Match.classList.contains("giveaway__heading") && !Path.match(/^\/giveaway\//)) {
            Title = Match.textContent;
            Game = Match.closest(".table__row-outer-wrap").getElementsByClassName("global__image-inner-wrap")[0];
            if (Game) {
                Game = Game.getAttribute("style").match(/\/(apps|subs)\/(.+)\//);
                if (Game) {
                    Game = Game[2];
                }
            }
            Match = Match.parentElement;
        }
        if (Game) {
            if (!Games[Game]) {
                Games[Game] = [];
            }
            if (!CurrentGames[Game]) {
                CurrentGames[Game] = [];
            }
            Games[Game].push(Match);
            CurrentGames[Game].push(Match);
            if (GM_getValue("GT")) {
                addGTButton(Match, Game, Title);
            }
        }
    }
    SavedUsers = GM_getValue("Users");
    for (I = 0, N = SavedUsers.length; I < N; ++I) {
        UserID = SG ? SavedUsers[I].Username : SavedUsers[I].SteamID64;
        if (CurrentUsers[UserID]) {
            if (GM_getValue("WBH") && !Path.match(/^\/account\//)) {
                addWBHIcon(SavedUsers[I], CurrentUsers[UserID]);
            }
            if (GM_getValue("WBC") && GM_getValue("WBC_H")) {
                addWBCIcon(SavedUsers[I], CurrentUsers[UserID]);
            }
            if (GM_getValue("NAMWC") && GM_getValue("NAMWC_H")) {
                highlightNAMWCUser(SavedUsers[I], CurrentUsers[UserID]);
            }
            if (GM_getValue("PUT") && SavedUsers[I].Tags) {
                addPUTTags(UserID, SavedUsers[I].Tags);
            }
        }
    }
    SavedGames = GM_getValue("Games");
    for (Game in SavedGames) {
        if (CurrentGames[Game]) {
            if (GM_getValue("GT")) {
                addGTTags(Game, SavedGames[Game].Tags);
            }
            if (GM_getValue("EGH") && SavedGames[Game].Entered) {
                highlightEGHGame(SavedGames, Game, CurrentGames[Game]);
            }
        }
    }
    loadHeadingFeatures([{
        Check: GM_getValue("ES"),
        Name: "ESPanel",
        Callback: addESPanel
    }, {
        Check: GM_getValue("MT") && (GM_getValue("PUT") || GM_getValue("GT")) && Object.keys(CurrentUsers).length && !Path.match(/^\/account/),
        Name: "MTContainer",
        Callback: addMTContainer
    }, {
        Check: GM_getValue("ER") && Path.match(/\/giveaways\/entered/),
        Name: "ERButton",
        Callback: addERButton
    }, {
        Check: GM_getValue("UGS") && Path.match(/\/giveaways\/created/),
        Name: "UGSButton",
        Callback: addUGSButton
    }, {
        Check: GM_getValue("NAMWC") && SG && Object.keys(CurrentUsers).length && Path.match(/\/winners/),
        Name: "NAMWCButton",
        Callback: addNAMWCButton
    }, {
        Check: GM_getValue("WBC") && SG && Object.keys(CurrentUsers).length,
        Name: "WBCButton",
        Callback: addWBCButton
    }, {
        Check: GM_getValue("CT") && Path.match(/^\/(giveaway(?!.+(entries|winners))|discussion|support\/ticket|trade)\//),
        Name: "CTPanel",
        Callback: addCTPanel
    }, {
        Check: GM_getValue("MCBP") && Path.match(/^\/(giveaway(?!.+(entries|winners))|discussion|support\/ticket|trade)\//),
        Name: "MCBPButton",
        Callback: addMCBPButton
    }, {
        Check: GM_getValue("MPP") && Path.match(/^\/discussion\//),
        Name: "MPPButton",
        Callback: addMPPButton
    }, {
        Check: GM_getValue("AS") && Path.match(/^\/archive/),
        Name: "ASButton",
        Callback: addASButton
    }]);
    if (ESGST.VAI) {
        showVAIImages(Context);
    }
    loadMatchesFeatures(Context, [{
        Check: GM_getValue("GS") && Path.match(/^\/account\/steam\/groups/),
        Query: ".table__row-inner-wrap",
        Callback: loadGSStatus
    }, {
        Check: GM_getValue("SGG") && Path.match(/^\/account\/steam\/groups/),
        Query: ".table__row-inner-wrap",
        Callback: setSGGGroups,
        All: true
    }, {
        Check: GM_getValue("IWH") && Path.match(/^\/giveaway\/.+\/winners/),
        Query: ".table__gift-not-sent",
        Callback: setIWHObserver
    }, {
        Check: GM_getValue("IWH") && Path.match(/^\/messages/),
        Query: ".comments__entity",
        Callback: highlightIWHWinner
    }, {
        Check: GM_getValue("AP"),
        Query: ".global__image-outer-wrap--avatar-small",
        Callback: addAPContainer
    }, {
        Check: GM_getValue("EGF") && Path.match(/^\/($|giveaways)/),
        Query: ".giveaway__row-inner-wrap.is-faded",
        Callback: hideEGFGiveaway
    }, {
        Check: GM_getValue("GV") && Path.match(/^\/($|giveaways)/),
        Query: ".giveaway__row-outer-wrap",
        Callback: setGVContainer
    }, {
        Check: GM_getValue("GH") && !Path.match(/^\/account/),
        Query: ".table__column__heading[href*='/group/']",
        Callback: highlightGHGroups,
        All: true
    }, {
        Check: GM_getValue("GGP"),
        Query: ".giveaway__column--group",
        Callback: addGGPBox
    }, {
        Check: (GM_getValue("ELGB") || GM_getValue("GDCBP") || GM_getValue("GWC")) && Path.match(/^\/($|giveaways|(user|group)\/)/),
        Query: ".giveaway__row-inner-wrap",
        Callback: addGPPanel
    }, {
        Check: GM_getValue("GWC") && Path.match(/^\/giveaways\/entered/),
        Query: ".table__row-inner-wrap",
        Callback: addGWCChance
    }, {
        Check: true,
        Query: ".giveaway__row-inner-wrap.is-faded",
        Callback: setFadedGiveaway
    }, {
        Check: GM_getValue("DH") && Path.match(/^\/discussions/),
        Query: ".table__row-outer-wrap",
        Callback: highlightDHDiscussions,
        All: true
    }, {
        Check: GM_getValue("CT"),
        Query: ".table__column__heading, .giveaway__heading__name, .column_flex h3 a",
        Callback: checkCTVisited,
        All: true
    }, {
        Check: GM_getValue("AT") && ((GM_getValue("AT_G") && Path.match(/^\/($|giveaways)/)) || (!Path.match(/^\/($|giveaways)/))),
        Query: "[data-timestamp]",
        Callback: setATTimestamp
    }, {
        Check: GM_getValue("CFH"),
        Query: "textarea[name='description']",
        Callback: addCFHPanel
    }, {
        Check: GM_getValue("MR") || (GM_getValue("RFI") && Path.match(/^\/messages/)),
        Query: SG ? ".comment__actions" : ".action_list",
        Callback: addMRButton
    }, {
        Check: GM_getValue("GWL"),
        Query: ".giveaway__summary",
        Callback: addGWLLink
    }, {
        Check: GM_getValue("RML"),
        Query: SG ? ".comment__children" : ".comment_children",
        Callback: setRMLLink
    }, {
        Check: GM_getValue("CT") && Path.match(/^\/(giveaway(?!.+(entries|winners))|discussion|support\/ticket|trade)\//),
        Query: ".comment__summary, .comment_inner",
        Callback: setCTComment,
        All: true
    }]);
}

function loadHeadingFeatures(Items) {
    var Headings, Heading, I, N;
    Headings = document.getElementsByClassName(SG ? "page__heading" : "page_heading");
    Heading = Headings[Path.match(/^\/(giveaway(?!.+(winners|entries))|discussion|support\/ticket|trade)\//) ? 1 : 0];
    if (!Heading) {
        Heading = Headings[0];
    }
    for (I = 0, N = Items.length; I < N; ++I) {
        if (Items[I].Check && !document.getElementsByClassName(Items[I].Name)[0]) {
            Items[I].Callback(Heading);
        }
    }
}

function loadMatchesFeatures(Context, Items) {
    var I, N, Matches, NumMatches, J;
    for (I = 0, N = Items.length; I < N; ++I) {
        if (Items[I].Check) {
            Matches = Context.querySelectorAll(Items[I].Query);
            NumMatches = Matches.length;
            if (NumMatches) {
                if (Items[I].All) {
                    Items[I].Callback(Matches);
                } else {
                    for (J = 0; J < NumMatches; ++J) {
                        Items[I].Callback(Matches[J]);
                    }
                }
            }
        }
    }
}

function goToComment() {
    var ID, Element, Top, Heading, Permalink;
    ID = window.location.hash.replace(/#/, "");
    if (ID && !Path.match(/^\/account/)) {
        Element = document.getElementById(ID);
        if (Element) {
            Top = Element.offsetTop;
            if ((Top - 64) < (document.body.offsetHeight - window.innerHeight)) {
                Heading = document.getElementsByClassName("FEHeading")[0];
                window.scrollTo(0, Element.offsetTop - (Heading ? 0 : 39));
                window.scrollBy(0, -(document.getElementsByTagName("header")[0].offsetHeight + 64));
            }
            Permalink = document.getElementsByClassName("comment__permalink")[0];
            if (Permalink) {
                Permalink.remove();
            }
            Element.getElementsByClassName("comment__username")[0].insertAdjacentHTML(
                "beforeBegin",
                "<div class=\"comment__permalink\">" +
                "    <i class=\"fa fa-share\"></i>" +
                "</div>"
            );
        }
    }
}

function queueRequest(Element, Data, URL, Callback) {
    var CurrentDate, HTML;
    HTML = Element.Progress ? Element.Progress.innerHTML : "";
    Element.Request = setInterval(function() {
        CurrentDate = new Date().getTime();
        if ((CurrentDate - GM_getValue("LastRequest")) > 5000) {
            clearInterval(Element.Request);
            GM_setValue("LastRequest", CurrentDate);
            if (Element.Progress) {
                Element.Progress.innerHTML = HTML;
            }
            makeRequest(Data, URL, Element.Progress, function(Response) {
                GM_setValue("LastRequest", 0);
                Callback(Response);
            });
        } else if (Element.Progress) {
            Element.Progress.innerHTML =
                "<i class=\"fa fa-clock-o\"></i> " +
                "<span>Waiting for a free request slot...</span>";
        }
    }, 500);
}

function makeRequest(Data, URL, Context, Callback) {
    GM_xmlhttpRequest({
        data: Data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: (Data ? "POST" : "GET"),
        timeout: 300000,
        url: URL,
        onerror: function() {
            displayMessage(Context, "An error has ocurred.");
        },
        ontimeout: function() {
            displayMessage(Context, "The connection has timed out.");
        },
        onload: Callback
    });
}

function displayMessage(Context, Message) {
    if (Context) {
        Context.innerHTML =
            "<i class=\"fa fa-times-circle\"></i> " +
            "<span>" + Message + "</span>";
    } else {
        console.log(Message);
    }
}

function queueSave(Element, Callback) {
    var CurrentDate;
    Element.Save = setInterval(function() {
        CurrentDate = new Date().getTime();
        if ((CurrentDate - GM_getValue("LastSave")) > 5000) {
            clearInterval(Element.Save);
            GM_setValue("LastSave", CurrentDate);
            Element.Progress.innerHTML = "";
            Callback();
        } else {
            Element.Progress.innerHTML =
                "<i class=\"fa fa-clock-o\"></i> " +
                "<span>Waiting for a free save slot...</span>";
        }
    }, 100);
}

function updateUsers(UpdatedUsers) {
    var SavedUsers, I, N, User, J, Key;
    SavedUsers = GM_getValue("Users");
    for (I = 0, N = UpdatedUsers.length; I < N; ++I) {
        User = UpdatedUsers[I];
        J = getUserIndex(User, SavedUsers);
        if (J >= 0) {
            for (Key in User) {
                SavedUsers[J][Key] = User[Key];
            }
        } else {
            SavedUsers.push(User);
        }
    }
    GM_setValue("Users", SavedUsers);
}

function saveUser(User, Element, Callback) {
    var SavedUsers, I;
    SavedUsers = GM_getValue("Users");
    I = getUserIndex(User, SavedUsers);
    if (I >= 0) {
        checkUsernameChange(User, SavedUsers[I]);
        GM_setValue("Users", SavedUsers);
        Callback();
    } else if (User.Username && User.SteamID64) {
        SavedUsers.push(User);
        GM_setValue("Users", SavedUsers);
        Callback();
    } else {
        setUser(Element, User, function() {
            if (SG) {
                I = getUserIndex(User, SavedUsers);
                if (I >= 0) {
                    checkUsernameChange(User, SavedUsers[I]);
                } else {
                    SavedUsers.push(User);
                }
            } else {
                SavedUsers.push(User);
            }
            GM_setValue("Users", SavedUsers);
            Callback();
        });
    }
}

function setUser(Element, User, Callback) {
    queueRequest(Element, null, "https://www.steamgifts.com" + (SG ? "" : "/go") + "/user/" + (SG ? User.Username : User.SteamID64), function(Response) {
        var ResponseHTML;
        ResponseHTML = parseHTML(Response.responseText);
        if (SG) {
            User.SteamID64 = ResponseHTML.querySelector("a[href*='/profiles/']").getAttribute("href").match(/\d+/)[0];
        } else {
            User.Username = Response.finalUrl.match(/\/user\/(.+)/)[1];
        }
        User.ID = ResponseHTML.querySelector("input[name='child_user_id']");
        User.ID = User.ID ? User.ID.value : "";
        Callback();
    });
}

function getUserID(User, Element, Callback) {
    var SavedUser;
    SavedUser = getUser(User);
    if (SavedUser.ID) {
        User.ID = SavedUser.ID;
        Callback();
    } else {
        queueRequest(Element, null, "/user/" + User.Username, function(Response) {
            User.ID = parseHTML(Response.responseText).querySelector("[name='child_user_id']").value;
            Callback();
        });
    }
}

function getUser(User) {
    var SavedUsers, I;
    SavedUsers = GM_getValue("Users");
    I = getUserIndex(User, SavedUsers);
    return ((I >= 0) ? SavedUsers[I] : null);
}

function getUserIndex(User, SavedUsers) {
    var Query, Key, I;
    if (User.SteamID64) {
        Query = User.SteamID64;
        Key = "SteamID64";
    } else {
        Query = User.Username;
        Key = "Username";
    }
    for (I = SavedUsers.length - 1; (I >= 0) && (SavedUsers[I][Key] != Query); --I);
    return I;
}

function checkUsernameChange(User, SavedUser) {
    var Key;
    for (Key in User) {
        if (User.Username && (User.Username != SavedUser.Username) && (Key == "Tags")) {
            if (SavedUser.Tags) {
                if (User.Tags) {
                    SavedUser.Tags += ", " + User.Tags;
                }
            } else if (User.Tags) {
                SavedUser.Tags = User.Tags;
            }
        } else {
            SavedUser[Key] = User[Key];
        }
    }
}

function saveComment(TradeCode, ParentID, Description, URL, DEDStatus, Callback, DEDCallback) {
    var Data;
    Data = "xsrf_token=" + ESGST.XSRFToken + "&do=" + (SG ? "comment_new" : "comment_insert") + "&trade_code=" + TradeCode + "&parent_id=" + ParentID + "&description=" +
        encodeURIComponent(Description);
    makeRequest(Data, URL, DEDStatus, function(Response) {
        var Match, ResponseJSON;
        if (SG) {
            Match = Response.finalUrl.match(/(.+?)(#(.+))?$/);
            if (Match[3]) {
                Callback();
                if (GM_getValue("CH")) {
                    saveCHComment(DEDStatus.closest(".comment__children"), Match[1], parseHTML(Response.responseText).getElementsByTagName("title")[0].textContent, Match[3]);
                }
                if (DEDCallback) {
                    DEDCallback(Response, DEDStatus);
                } else {
                    window.location.href = "/go/comment/" + Match[3];
                }
            } else if (URL != Match[1]) {
                makeRequest(Data, Match[1], DEDStatus, function(Response) {
                    Callback();
                    Match = Response.finalUrl.match(/(.+?)(#(.+))?$/);
                    if (GM_getValue("CH")) {
                        saveCHComment(DEDStatus.closest(".comment__children"), Match[1], parseHTML(Response.responseText).getElementsByTagName("title")[0].textContent, Match[3]);
                    }
                    if (DEDCallback) {
                        DEDCallback(Response, DEDStatus);
                    } else {
                        window.location.href = "/go/comment/" + Match[3];
                    }
                });
            } else {
                Callback();
                if (DEDCallback) {
                    DEDCallback(Response, DEDStatus);
                } else {
                    DEDStatus.innerHTML =
                        "<i class=\"fa fa-times-circle\"></i> " +
                        "<span>Failed!</span>";
                }
            }
        } else {
            ResponseJSON = parseJSON(Response.responseText);
            if (ResponseJSON.success) {
                Callback();
                if (DEDCallback) {
                    DEDCallback(Response, DEDStatus);
                } else {
                    window.location.href = "/go/comment/" + parseHTML(ResponseJSON.html).getElementsByClassName("comment_outer")[0].id;
                }
            } else {
                Callback();
                if (DEDCallback) {
                    DEDCallback(Response, DEDStatus);
                } else {
                    DEDStatus.innerHTML =
                        "<i class=\"fa fa-times-circle\"></i> " +
                        "<span>Failed!</span>";
                }
            }
        }
    });
}

function checkSync(Update, Callback) {
    var SyncFrequency, CurrentDate;
    SyncFrequency = GM_getValue("SyncFrequency");
    CurrentDate = new Date().getTime();
    if (Update) {
        document.getElementsByClassName("SMSync")[0].addEventListener("click", function() {
            setSync(CurrentDate, Update, Callback);
        });
    } else if (SyncFrequency && ((CurrentDate - GM_getValue("LastSync")) > (SyncFrequency * 86400000))) {
        setSync(CurrentDate, Update, Callback);
    }
}

function setSync(CurrentDate, Update, Callback) {
    var Popup, Sync;
    GM_setValue("LastSync", CurrentDate);
    Popup = createPopup(Update ? false : true);
    Popup.Icon.classList.add("fa-refresh");
    Popup.Title.textContent = Update ? "Syncing..." : "ESGST is performing the automatic sync. Please do not close the popup or reload / close the tab until it has finished.";
    Sync = {};
    createButton(Popup.Button, "fa-times-circle", "Cancel", "", "", function() {
        Sync.Canceled = true;
        Popup.Close.click();
    }, null, true);
    Sync.Progress = Popup.Progress;
    Sync.OverallProgress = Popup.OverallProgress;
    Popup.popUp().reposition();
    sync(Sync, function(CurrentDate) {
        Popup.Icon.classList.remove("fa-refresh");
        Popup.Icon.classList.add("fa-check");
        Popup.Title.textContent = Update ? "Synced!" : "Automatic sync finished. You can now close the popup or reload / close the tab.";
        Popup.Button.innerHTML = "";
        Sync.Progress.innerHTML = Sync.OverallProgress.innerHTML = "";
        if (Update) {
            Popup.Close.click();
            Callback(CurrentDate);
        }
    });
}

function sync(Sync, Callback) {
    Sync.OverallProgress.innerHTML =
        "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
        "<span>Syncing your username and avatar...</span>";
    if (SG) {
        GM_setValue("Username", document.getElementsByClassName("nav__avatar-outer-wrap")[0].href.match(/\/user\/(.+)/)[1]);
    }
    GM_setValue("Avatar", document.getElementsByClassName(SG ? "nav__avatar-inner-wrap" : "nav_avatar")[0].style.backgroundImage.match(/\("(.+)"\)/)[1]);
    if (!GM_getValue("SteamID64") && GM_getValue("Username")) {
        getSteamID64(Sync, function() {
            continueSync(Sync, Callback);
        });
    } else {
        continueSync(Sync, Callback);
    }
}

function continueSync(Sync, Callback) {
    Sync.OverallProgress.innerHTML =
        "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
        "<span>Syncing your Steam groups...</span>";
    Sync.Groups = [];
    syncGroups(Sync, "/account/steam/groups/search?page=", 1, function() {
        GM_setValue("Groups", Sync.Groups);
        syncWhitelistBlacklist(Sync, function() {
            syncOwnedGames(Sync, function() {
                var CurrentDate;
                CurrentDate = new Date();
                GM_setValue("LastSync", CurrentDate.getTime());
                Callback(CurrentDate);
            });
        });
    });
}

function getSteamID64(Sync, Callback) {
    Sync.OverallProgress.innerHTML =
        "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
        "<span>Retrieving your SteamID64...</span>";
    makeRequest(null, "/user/" + GM_getValue("Username"), Sync.Progress, function(Response) {
        GM_setValue("SteamID64", parseHTML(Response.responseText).querySelector("a[href*='/profiles/']").getAttribute("href").match(/\d+/)[0]);
        Callback();
    });
}

function syncGroups(Sync, URL, NextPage, Callback) {
    if (!Sync.Canceled) {
        queueRequest(Sync, null, URL + NextPage, function(Response) {
            var ResponseHTML, Matches, I, N, Pagination;
            ResponseHTML = parseHTML(Response.responseText);
            Matches = ResponseHTML.getElementsByClassName("table__column__heading");
            for (I = 0, N = Matches.length; I < N; ++I) {
                Sync.Groups.push({
                    Code: Matches[I].getAttribute("href").match(/group\/(.+?)\//)[1],
                    Name: Matches[I].textContent
                });
            }
            Pagination = ResponseHTML.getElementsByClassName("pagination__navigation")[0];
            if (Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                syncGroups(Sync, URL, ++NextPage, Callback);
            } else {
                Callback();
            }
        });
    }
}

function syncWhitelistBlacklist(Sync, Callback) {
    var SavedUsers;
    if (!Sync.Canceled) {
        Sync.Users = [];
        SavedUsers = GM_getValue("Users");
        clearWhitelistBlacklist(Sync, 0, SavedUsers.length, SavedUsers, function() {
            Sync.OverallProgress.innerHTML =
                "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                "<span>Syncing your whitelist...</span>";
            getWhitelistBlacklist(Sync, "/account/manage/whitelist/search?page=", 1, "Whitelisted", function() {
                Sync.OverallProgress.innerHTML =
                    "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                    "<span>Syncing your blacklist...</span>";
                getWhitelistBlacklist(Sync, "/account/manage/blacklist/search?page=", 1, "Blacklisted", function() {
                    queueSave(Sync, function() {
                        updateUsers(Sync.Users);
                        GM_setValue("LastSave", 0);
                        Callback();
                    });
                });
            });
        });
    }
}

function clearWhitelistBlacklist(Sync, I, N, SavedUsers, Callback) {
    if (!Sync.Canceled) {
        if (I < N) {
            Sync.Users.push({
                Username: SavedUsers[I].Username,
                ID: SavedUsers[I].ID,
                SteamID64: SavedUsers[I].SteamID64,
                Whitelisted: false,
                Blacklisted: false
            });
            setTimeout(clearWhitelistBlacklist, 0, Sync, ++I, N, SavedUsers, Callback);
        } else {
            Callback();
        }
    }
}

function getWhitelistBlacklist(Sync, URL, NextPage, Key, Callback) {
    if (!Sync.Canceled) {
        queueRequest(Sync, null, URL + NextPage, function(Response) {
            var ResponseHTML, Matches;
            ResponseHTML = parseHTML(Response.responseText);
            Matches = ResponseHTML.getElementsByClassName("table__column__heading");
            getWhitelistBlacklistUsers(Sync, 0, Matches.length, Matches, Key, function() {
                var Pagination;
                Pagination = ResponseHTML.getElementsByClassName("pagination__navigation")[0];
                if (Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                    setTimeout(getWhitelistBlacklist, 0, Sync, URL, ++NextPage, Key, Callback);
                } else {
                    Callback();
                }
            });
        });
    }
}

function getWhitelistBlacklistUsers(Sync, I, N, Matches, Key, Callback) {
    var User, J;
    if (!Sync.Canceled) {
        if (I < N) {
            User = {
                Username: Matches[I].textContent
            };
            J = getUserIndex(User, Sync.Users);
            if (J >= 0) {
                Sync.Users[J][Key] = true;
                setTimeout(getWhitelistBlacklistUsers, 0, Sync, ++I, N, Matches, Key, Callback);
            } else {
                setUser(Sync, User, function() {
                    User[Key] = true;
                    Sync.Users.push(User);
                    setTimeout(getWhitelistBlacklistUsers, 0, Sync, ++I, N, Matches, Key, Callback);
                });
            }
        } else {
            Callback();
        }
    }
}

function syncOwnedGames(Sync, Callback) {
    var SteamAPIKey, URL;
    Sync.OverallProgress.innerHTML =
        "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
        "<span>Syncing your owned games...</span>";
    SteamAPIKey = GM_getValue("SteamAPIKey");
    if (SteamAPIKey) {
        URL = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" + SteamAPIKey + "&steamid=" + GM_getValue("SteamID64") + "&format=json";
        makeRequest(null, URL, Sync.Progress, function(Response) {
            var ResponseText, ResponseGames, N, OwnedGames, I;
            ResponseText = Response.responseText;
            if (!ResponseText.match(/<title>Forbidden<\/title>/)) {
                ResponseGames = parseJSON(ResponseText).response.games;
                N = ResponseGames.length;
                if (N != GM_getValue("OwnedGames").length) {
                    OwnedGames = [];
                    for (I = 0; I < N; ++I) {
                        OwnedGames.push(ResponseGames[I].appid);
                    }
                    GM_setValue("OwnedGames", OwnedGames);
                    Callback(1);
                } else {
                    Callback(2);
                }
            } else {
                Callback(3);
            }
        });
    } else {
        Callback(4);
    }
}

function parseJSON(String) {
    return JSON.parse(String);
}

function parseHTML(String) {
    return (new DOMParser()).parseFromString(String, "text/html");
}

function sortArray(Array) {
    return Array.sort(function (A, B) {
        return A.localeCompare(B, {
            sensitivity: "base"
        });
    });
}

function setSiblingsOpacity(Element, Opacity) {
    var Siblings, I, N;
    Siblings = Element.parentElement.children;
    for (I = 0, N = Siblings.length; I < N; ++I) {
        if (Siblings[I] != Element) {
            Siblings[I].style.opacity = Opacity;
        }
    }
}

function setHoverOpacity(Element, EnterOpacity, LeaveOpacity) {
    Element.addEventListener("mouseenter", function() {
        Element.style.opacity = EnterOpacity;
    });
    Element.addEventListener("mouseleave", function() {
        Element.style.opacity = LeaveOpacity;
    });
}

function setFadedGiveaway(Context) {
    Context.classList.remove("is-faded");
    Context.classList.add("rhFaded");
}

function formatDate(EntryDate) {
    var Months, Hours, Minutes, OutputDate, Suffix;
    Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    Hours = EntryDate.getHours();
    Minutes = EntryDate.getMinutes();
    Minutes = (Minutes > 9) ? Minutes : ("0" + Minutes);
    OutputDate = Months[EntryDate.getMonth()] + " " + EntryDate.getDate() + ", " + EntryDate.getFullYear() + " ";
    if (Hours >= 12) {
        if (Hours > 12) {
            Hours -= 12;
        }
        Suffix = "pm";
    } else {
        if (Hours === 0) {
            Hours = 12;
        }
        Suffix = "am";
    }
    OutputDate += Hours + ":" + Minutes + " " + Suffix;
    return OutputDate;
}

function createPopup(Temp) {
    var Popup;
    document.body.insertAdjacentHTML(
        "beforeEnd",
        "<div class=\"popup page__outer-wrap page_outer_wrap rhPopup\">" +
        "    <div class=\"popup_summary\">" +
        "        <div class=\"popup_icon\">" +
        "            <i class=\"fa popup__icon rhPopupIcon\"></i>" +
        "        </div>" +
        "        <div class=\"popup_heading popup__heading\">" +
        "            <div class=\"popup_heading_h2 rhPopupTitle\"></div>" +
        "        </div>" +
        "    </div>" +
        "    <div class=\"rhPopupDescription\">" +
        "        <textarea class=\"rhPopupTextArea rhHidden\"></textarea>" +
        "        <input class=\"rhPopupTextInput rhHidden\"/>" +
        "        <ul class=\"rhPopupOptions\"></ul>" +
        "        <div class=\"rhPopupButton\"></div>" +
        "        <div class=\"rhPopupStatus\">" +
        "            <div class=\"rhPopupProgress\"></div>" +
        "            <div class=\"rhPopupOverallProgress\"></div>" +
        "        </div>" +
        "        <ul class=\"rhPopupResults\"></ul>" +
        "    </div>" +
        "    <div class=\"popup__actions popup_actions\">" +
        "        <a href=\"https://www.steamgifts.com/account#ESGST\">Manage</a>" +
        "        <span class=\"b-close rhPopupClose\">Close</span>" +
        "    </div>" +
        "</div>"
    );
    Popup = {};
    Popup.Popup = document.body.lastElementChild;
    Popup.Icon = Popup.Popup.getElementsByClassName("rhPopupIcon")[0];
    Popup.Title = Popup.Popup.getElementsByClassName("rhPopupTitle")[0];
    Popup.Description = Popup.Popup.getElementsByClassName("rhPopupDescription")[0];
    Popup.TextArea = Popup.Popup.getElementsByClassName("rhPopupTextArea")[0];
    Popup.TextInput = Popup.Popup.getElementsByClassName("rhPopupTextInput")[0];
    Popup.Options = Popup.Popup.getElementsByClassName("rhPopupOptions")[0];
    Popup.Button = Popup.Popup.getElementsByClassName("rhPopupButton")[0];
    Popup.Status = Popup.Popup.getElementsByClassName("rhPopupStatus")[0];
    Popup.Progress = Popup.Popup.getElementsByClassName("rhPopupProgress")[0];
    Popup.OverallProgress = Popup.Popup.getElementsByClassName("rhPopupOverallProgress")[0];
    Popup.Results = Popup.Popup.getElementsByClassName("rhPopupResults")[0];
    Popup.Close = Popup.Popup.getElementsByClassName("rhPopupClose")[0];
    Popup.popUp = function(Callback) {
        return $(Popup.Popup).bPopup({
            amsl: [0],
            fadeSpeed: 200,
            followSpeed: 500,
            modalColor: "#3c424d",
            opacity: 0.85,
            onClose: function() {
                if (Temp) {
                    Popup.Popup.remove();
                }
            }
        }, Callback);
    };
    return Popup;
}

// Popout

function createPopout(Context) {
    var Popout;
    Context.insertAdjacentHTML("beforeEnd", "<div class=\"page__outer-wrap page_outer_wrap rhPopout rhHidden\"></div>");
    Popout = {
        Popout: Context.lastElementChild,
        customRule: function() {
            return true;
        },
        popOut: function(Context, Callback) {
            if (Callback) {
                Callback(Popout.Popout);
            }
            Popout.reposition(Context);
        },
        reposition: function(Context) {
            Popout.Popout.classList.remove("rhHidden");
            Popout.Popout.removeAttribute("style");
            repositionPopout(Popout.Popout, Context);
        }
    };
    document.addEventListener("click", function(Event) {
        if (!Popout.Popout.classList.contains("rhHidden") && document.body.contains(Event.target) && !Popout.Popout.contains(Event.target) && Popout.customRule(Event.target)) {
            Popout.Popout.classList.add("rhHidden");
        }
    });
    return Popout;
}

function repositionPopout(Popout, Context) {
    var PopoutRect, PopoutLeft, PopoutWidth, PopoutTop, PopoutHeight, ContextRect, ContextLeft, ContextWidth, ContextTop, ContextHeight;
    PopoutRect = Popout.getBoundingClientRect();
    PopoutLeft = PopoutRect.left;
    PopoutWidth = PopoutRect.width;
    PopoutTop = PopoutRect.top;
    PopoutHeight = PopoutRect.height;
    ContextRect = Context.getBoundingClientRect();
    ContextLeft = ContextRect.left;
    ContextWidth = ContextRect.width;
    ContextTop = ContextRect.top;
    ContextHeight = ContextRect.height;
    Popout.style.marginLeft = ((PopoutLeft + PopoutWidth) > document.documentElement.clientWidth) ?
        (-(PopoutWidth - ContextWidth - (ContextLeft - PopoutLeft)) + "px") : ((ContextLeft - PopoutLeft) + "px");
    if ((PopoutHeight + ContextTop + ContextHeight + 44) > document.documentElement.clientHeight) {
        Popout.style.marginTop = (PopoutTop > ContextTop) ? (-(PopoutHeight + (PopoutTop - ContextTop)) + "px") : (-(PopoutHeight - (ContextTop - PopoutTop)) + "px");
    } else {
        Popout.style.marginTop = (PopoutTop > ContextTop) ? (((ContextTop - PopoutTop) + ContextHeight) + "px") : (-((PopoutTop - ContextTop) - ContextHeight) + "px");
    }
}

function createButton(Context, DefaultIcon, DefaultName, OnClickIcon, OnClickName, DefaultCallback, OnClickCallback, White, Yellow) {
    var DefaultButton, OnClickButton;
    Context.innerHTML =
        "<div class=\"" + (White ? "form__saving-button white" : (Yellow ? "sidebar__entry-delete" : "form__submit-button green")) + " btn_action rhDefaultButton\">" +
        "    <i class=\"fa " + DefaultIcon + "\"></i>" +
        "    <span>" + DefaultName + "</span>" +
        "</div>" +
        "<div class=\"form__saving-button btn_action grey is-disabled is_disabled rhOnClickButton rhHidden\">" +
        "    <i class=\"fa " + OnClickIcon + "\"></i>" +
        "    <span>" + OnClickName + "</span>" +
        "</div>";
    DefaultButton = Context.firstElementChild;
    OnClickButton = Context.lastElementChild;
    DefaultButton.addEventListener("click", function() {
        DefaultButton.classList.add("rhHidden");
        OnClickButton.classList.remove("rhHidden");
        DefaultCallback(function() {
            OnClickButton.classList.add("rhHidden");
            DefaultButton.classList.remove("rhHidden");
        });
    });
    if (OnClickCallback) {
        OnClickButton.classList.remove("is-disabled", "is_disabled");
        OnClickButton.addEventListener("click", function() {
            OnClickButton.classList.add("rhHidden");
            DefaultButton.classList.remove("rhHidden");
            OnClickCallback();
        });
    }
}

function createCheckbox(Context, Default) {
    var Checkbox, Input, Disabled, Hover, Enabled;
    Context.innerHTML =
        "<span class=\"rhCheckbox\">" +
        "    <input class=\"rhHidden\" type=\"checkbox\">" +
        "    <i class=\"fa fa-circle-o\"></i>" +
        "    <i class=\"fa fa-circle rhHidden\"></i>" +
        "    <i class=\"fa fa-check-circle rhHidden\"></i>" +
        "</span>";
    Checkbox = Context.firstElementChild;
    Input = Checkbox.firstElementChild;
    Disabled = Input.nextElementSibling;
    Hover = Disabled.nextElementSibling;
    Enabled = Hover.nextElementSibling;
    Input.checked = Default;
    Checkbox.addEventListener("mouseenter", setCheckboxHover);
    Checkbox.addEventListener("mouseleave", setCheckboxDisabled);
    Checkbox.addEventListener("click", function() {
        Input.checked = Input.checked ? false : true;
        setCheckboxEnabled();
    });
    setCheckboxEnabled();

    function setCheckboxHover() {
        Disabled.classList.add("rhHidden");
        Enabled.classList.add("rhHidden");
        Hover.classList.remove("rhHidden");
    }

    function setCheckboxDisabled() {
        Hover.classList.add("rhHidden");
        Enabled.classList.add("rhHidden");
        Disabled.classList.remove("rhHidden");
    }

    function setCheckboxEnabled() {
        if (Input.checked) {
            Disabled.classList.add("rhHidden");
            Hover.classList.add("rhHidden");
            Enabled.classList.remove("rhHidden");
            Checkbox.removeEventListener("mouseenter", setCheckboxHover);
            Checkbox.removeEventListener("mouseleave", setCheckboxDisabled);
        } else {
            Enabled.classList.add("rhHidden");
            Disabled.classList.remove("rhHidden");
            Checkbox.addEventListener("mouseenter", setCheckboxHover);
            Checkbox.addEventListener("mouseleave", setCheckboxDisabled);
        }
    }

    return {
        Checkbox: Input,
        check: function() {
            Input.checked = true;
            setCheckboxEnabled();
        },
        uncheck: function() {
            Input.checked = false;
            setCheckboxEnabled();
        },
        toggle: function() {
            Input.checked = Input.checked ? false : true;
            setCheckboxEnabled();
        }
    };
}

function createOptions(Context, Element, Options) {
    var I, N;
    for (I = 0, N = Options.length; I < N; ++I) {
        createOption(Context, Options[I], Element);
    }
}

function createOption(Context, Option, Element) {
    var Name, Checkbox, Key, ID, Dependency;
    Context.insertAdjacentHTML(
        "beforeEnd",
        "<li" + (Option.Check() ? "" : " class=\"rhHidden\"") + ">" +
        "    <span></span>" +
        "    <span>" + Option.Description + "</span>" +
        "    <i class=\"fa fa-question-circle\" title=\"" + Option.Title + "\"></i>" +
        "</li>"
    );
    Name = Option.Name;
    Element[Name] = Context.lastElementChild;
    Checkbox = Element[Name].firstElementChild;
    Key = Option.Key;
    ID = Option.ID;
    Element[Key] = createCheckbox(Checkbox, GM_getValue(ID)).Checkbox;
    Dependency = Option.Dependency;
    Checkbox.addEventListener("click", function() {
        GM_setValue(ID, Element[Key].checked);
        if (Dependency) {
            Element[Dependency].classList.toggle("rhHidden");
        }
    });
}

function createResults(Context, Element, Results) {
    var I, N, Key;
    for (I = 0, N = Results.length; I < N; ++I) {
        Context.insertAdjacentHTML(
            "beforeEnd",
            "<li class=\"rhHidden\">" + Results[I].Icon +
            "    <span class=\"rhBold\">" + Results[I].Description + " (<span>0</span>):</span>" +
            "    <span class=\"popup__actions\"></span>" +
            "</li>"
        );
        Key = Results[I].Key;
        Element[Key] = Context.lastElementChild;
        Element[Key + "Count"] = Element[Key].firstElementChild.nextElementSibling.firstElementChild;
        Element[Key + "Users"] = Element[Key].lastElementChild;
    }
}

function createDescription(Description) {
    return (
        "<form>" +
        "    <div class=\"form__input-description rhDescription\">" +
        "        <div class=\"input_description\">" + Description + "</div>" +
        "    </div>" +
        "</form>"
    );
}

function createNavigationSection(Name, Items) {
    var Section, I, N;
    Section =
        "<h3 class=\"sidebar__heading\">" + Name + "</h3>" +
        "<ul class=\"sidebar__navigation\">";
    for (I = 0, N = Items.length; I < N; ++I) {
        Section += createNavigationItem(Items[I].Name, Items[I].URL, Items[I].Title);
    }
    Section += "</ul>";
    return Section;
}

function createNavigationItem(Name, URL, Title) {
    return (
        "<li class=\"sidebar__navigation__item" + (Name ? (" " + Name) : "") + "\">" +
        "    <a class=\"sidebar__navigation__item__link\" href=\"" + URL + "\">" +
        "        <div class=\"sidebar__navigation__item__name\">" + Title + "</div>" +
        "        <div class=\"sidebar__navigation__item__underline\"></div>" +
        "    </a>" +
        "</li>"
    );
}

// Header Menu

function addHMMenu() {
    var Context, HMBox, SMRecentUsernameChanges, SMCommentHistory, HMButton;
    Context = document.getElementsByClassName("nav__left-container")[0];
    Context.insertAdjacentHTML(
        "beforeEnd",
        "<div class=\"nav__button-container\">" +
        "    <div class=\"HMBox rhHidden\">" +
        "        <div class=\"nav__absolute-dropdown\">" +
        createHMItems([{
            Check: true,
            URL: "https://github.com/rafaelgs18/ESGST/raw/master/ESGST.user.js",
            Icon: "fa-refresh icon-blue",
            Title: "Update",
            Description: "Check for updates."
        }, {
            Check: true,
            URL: "https://github.com/rafaelgs18/ESGST",
            Target: true,
            Icon: "fa-github icon-grey",
            Title: "GitHub",
            Description: "Visit the GitHub page."
        }, {
            Check: true,
            URL: "/discussion/TDyzv/",
            Icon: "fa-commenting icon-green",
            Title: "Discussion",
            Description: "Visit the discussion page."
        }, {
            Check: GM_getValue("UH"),
            Name: "SMRecentUsernameChanges",
            Icon: "fa-user icon-red",
            Title: "Recent Username Changes",
            Description: "Check out the recent username changes."
        }, {
            Check: GM_getValue("CH"),
            Name: "SMCommentHistory",
            Icon: "fa-comments icon-yellow",
            Title: "Comment History",
            Description: "Check out your comment history."
        }]) +
        "        </div>" +
        "    </div>" +
        "    <a class=\"nav__button nav__button--is-dropdown\" href=\"/account#ESGST\">ESGST</a>" +
        "    <div class=\"nav__button nav__button--is-dropdown-arrow HMButton\">" +
        "        <i class=\"fa fa-angle-down\"></i>" +
        "    </div>" +
        "</div>" + (GM_getValue("BILGN") ? "" : (
            "<div class=\"nav__button-container\">" +
            "    <a class=\"nav__button\" href=\"/giveaway/bilgN/\" target=\"_blank\">" +
            "        <i class=\"fa fa-star\"></i>" +
            "    </a>" +
            "</div>"
        ))
    );
    Context.lastElementChild.firstElementChild.addEventListener("click", function() {
        GM_setValue("BILGN", true);
    });
    HMBox = Context.getElementsByClassName("HMBox")[0];
    SMRecentUsernameChanges = Context.getElementsByClassName("SMRecentUsernameChanges")[0];
    SMCommentHistory = Context.getElementsByClassName("SMCommentHistory")[0];
    HMButton = Context.getElementsByClassName("HMButton")[0];
    if (SMRecentUsernameChanges) {
        setSMRecentUsernameChanges(SMRecentUsernameChanges);
    }
    if (SMCommentHistory) {
        setSMCommentHistory(SMCommentHistory);
    }
    HMButton.addEventListener("click", function() {
        HMBox.classList.toggle("rhHidden");
    });
    document.addEventListener("click", function(Event) {
        if (!HMBox.classList.contains("rhHidden") && !HMBox.contains(Event.target) && !HMButton.contains(Event.target)) {
            HMBox.classList.add("rhHidden");
        }
    });
}

function createHMItems(Items) {
    var HTML, I, N;
    HTML = "";
    for (I = 0, N = Items.length; I < N; ++I) {
        if (Items[I].Check) {
            HTML +=
                "<a class=\"nav__row" + (Items[I].Name ? (" " + Items[I].Name) : "") + "\"" + (Items[I].URL ? (" href=\"" + Items[I].URL + "\"") : "") +
                (Items[I].Target ? " target=\"_blank\"" : "") + ">" +
                "    <i class=\"fa fa-fw " + Items[I].Icon + "\"></i>" +
                "    <div class=\"nav__row__summary\">" +
                "        <p class=\"nav__row__summary__name\">" + Items[I].Title + "</p>" +
                "        <p class=\"nav__row__summary__description\">" + Items[I].Description + "</p>" +
                "    </div>" +
                "</a>";
        }
    }
    return HTML;
}

// Settings Menu

function addSMButton() {
    var Sidebar, SMButton;
    Sidebar = document.getElementsByClassName("sidebar")[0];
    Sidebar.insertAdjacentHTML("beforeEnd", createNavigationSection("ESGST", [{
        Name: "SMButton",
        Title: "Settings",
        URL: "#ESGST"
    }, {
        Title: "Discussion",
        URL: "/discussion/TDyzv/"
    }, {
        Title: "GitHub",
        URL: "https://github.com/rafaelgs18/ESGST"
    }, {
        Title: "Update",
        URL: "https://github.com/rafaelgs18/ESGST/raw/master/ESGST.user.js"
    }]));
    SMButton = Sidebar.getElementsByClassName("SMButton")[0];
    SMButton.addEventListener("click", function() {
        window.location.hash = "ESGST";
        loadSMMenu(Sidebar, SMButton);
    });
    if (Hash.match(/ESGST/)) {
        loadSMMenu(Sidebar, SMButton);
    }
}

function loadSMMenu(Sidebar, SMButton) {
    var Selected, Item, SMSyncFrequency, I, Container, SMGeneral, SMGiveaways, SMDiscussions, SMCommenting, SMUsers, SMGames, SMOthers, SMManageData, SMRecentUsernameChanges,
        SMCommentHistory, SMManageTags, SMGeneralFeatures, SMGiveawayFeatures, SMDiscussionFeatures, SMCommentingFeatures, SMUserFeatures, SMGameFeatures, SMOtherFeatures, ID,
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
            Title: "Users",
            Name: "SMUsers"
        }, {
            Title: "Games",
            Name: "SMGames"
        }, {
            Title: "Others",
            Name: "SMOthers"
        }, {
            Title: "Sync Groups / Whitelist / Blacklist / Owned Games",
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
        Check: GM_getValue("UH"),
        Icons: ["fa-user"],
        Name: "SMRecentUsernameChanges",
        Title: "See recent username changes."
    }, {
        Check: GM_getValue("CH"),
        Icons: ["fa-comments"],
        Name: "SMCommentHistory",
        Title: "See comment history."
    }, {
        Check: GM_getValue("PUT"),
        Icons: ["fa-tags", "fa-cog"],
        Name: "SMManageTags",
        Title: "Manage tags."
    }, {
        Check: GM_getValue("WBC"),
        Icons: ["fa-heart", "fa-ban", "fa-cog"],
        Name: "WBCButton",
        Title: "Manage Whitelist / Blacklist Checker caches."
    }, {
        Check: GM_getValue("NAMWC"),
        Icons: ["fa-trophy", "fa-cog"],
        Name: "NAMWCButton",
        Title: "Manage Not Activated / Multiple Wins Checker caches."
    }]);
    SMGeneral = Container.getElementsByClassName("SMGeneral")[0];
    SMGiveaways = Container.getElementsByClassName("SMGiveaways")[0];
    SMDiscussions = Container.getElementsByClassName("SMDiscussions")[0];
    SMCommenting = Container.getElementsByClassName("SMCommenting")[0];
    SMUsers = Container.getElementsByClassName("SMUsers")[0];
    SMGames = Container.getElementsByClassName("SMGames")[0];
    SMOthers = Container.getElementsByClassName("SMOthers")[0];
    SMManageData = Container.getElementsByClassName("SMManageData")[0];
    SMRecentUsernameChanges = Container.getElementsByClassName("SMRecentUsernameChanges")[0];
    SMCommentHistory = Container.getElementsByClassName("SMCommentHistory")[0];
    SMManageTags = Container.getElementsByClassName("SMManageTags")[0];
    SMSyncFrequency = Container.getElementsByClassName("SMSyncFrequency")[0];
    SMLastSync = Container.getElementsByClassName("SMLastSync")[0];
    SMAPIKey = Container.getElementsByClassName("SMAPIKey")[0];
    SMGeneralFeatures = ["FE", "ES", "GV", "HIR", "AT", "PR", "VAI"];
    SMGiveawayFeatures = ["GTS", "SGG", "AGS", "PGB", "EGF", "ELGB", "GDCBP", "GWC", "GGP", "GWL", "DGN", "UGS", "ER", "GESL"];
    SMDiscussionFeatures = ["ADOT", "DH", "MPP", "DED"];
    SMCommentingFeatures = ["CH", "CT", "CFH", "MCBP", "MR", "RFI", "RML"];
    SMUserFeatures = ["UH", "PUN", "RWSCVL", "SWR", "SGPB", "STPB", "SGC", "PUT", "WBH", "WBC", "NAMWC", "NRF", "UGD", "LUC", "IWH", "AP"];
    SMGameFeatures = ["EGH", "GT"];
    SMOtherFeatures = ["FCH", "BSH", "MT", "GH", "GS", "AS", "SM_D"];
    for (ID in Features) {
        if (SMGeneralFeatures.indexOf(ID) >= 0) {
            SMGeneral.appendChild(getSMFeature(Features[ID], ID));
        } else if (SMGiveawayFeatures.indexOf(ID) >= 0) {
            SMGiveaways.appendChild(getSMFeature(Features[ID], ID));
        } else if (SMDiscussionFeatures.indexOf(ID) >= 0) {
            SMDiscussions.appendChild(getSMFeature(Features[ID], ID));
        } else if (SMCommentingFeatures.indexOf(ID) >= 0) {
            SMCommenting.appendChild(getSMFeature(Features[ID], ID));
        } else if (SMUserFeatures.indexOf(ID) >= 0) {
            SMUsers.appendChild(getSMFeature(Features[ID], ID));
        } else if (SMGameFeatures.indexOf(ID) >= 0) {
            SMGames.appendChild(getSMFeature(Features[ID], ID));
        } else if (SMOtherFeatures.indexOf(ID) >= 0) {
            SMOthers.appendChild(getSMFeature(Features[ID], ID));
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
    if (GM_getValue("SteamAPIKey")) {
        SMAPIKey.value = GM_getValue("SteamAPIKey");
    }
    if (document.getElementsByClassName("WBCButton")[0]) {
        addWBCButton();
    }
    if (document.getElementsByClassName("NAMWCButton")[0]) {
        addNAMWCButton();
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

function getSMFeature(Feature, ID) {
    var Menu, Checkbox, CheckboxInput, SMFeatures, Key;
    Menu = document.createElement("div");
    Menu.insertAdjacentHTML(
        "beforeEnd",
        "<span></span>" + (ID.match(/_/) ? (
            "<span> " + Feature.Name + "</span>") : (
            "<span class=\"popup__actions\">" +
            "    <a href=\"https://github.com/rafaelgs18/ESGST#" + Feature.Name.replace(/(-|\s)/g, "-").replace(/\//g, "").toLowerCase() + "\" target=\"_blank\">" + Feature.Name + "</a>" +
            "</span>")) +
        "<div class=\"form__row__indent SMFeatures rhHidden\"></div>"
    );
    Checkbox = Menu.firstElementChild;
    CheckboxInput = createCheckbox(Checkbox, GM_getValue(ID)).Checkbox;
    SMFeatures = Menu.lastElementChild;
    for (Key in Feature) {
        if (Key != "Name") {
            SMFeatures.appendChild(getSMFeature(Feature[Key], Key));
        }
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
        for (Key in Features) {
            exportSMSettings(Data.Settings, Key, Features[Key]);
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
            loadEndlessFeatures(Popup.Results);
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
        loadMatchesFeatures(Popup.Results, [{
            Check: true,
            Query: "[data-timestamp]",
            Callback: setATTimestamp
        }]);
        Popup.popUp();
    });
}

// [ADOT] Active Discussions On Top

GM_addStyle(
    ".ADOTContainer {" +
    "    margin: 25px 0;" +
    "}"
);

function moveADOTDiscussions() {
    var ADOTContainer, Container;
    ADOTContainer = document.getElementsByClassName("widget-container--margin-top")[0];
    ADOTContainer.classList.add("ADOTContainer");
    Container = document.getElementsByClassName("page__heading")[0].parentElement;
    Container.insertBefore(ADOTContainer.previousElementSibling, Container.firstElementChild);
    Container.insertBefore(ADOTContainer, Container.firstElementChild.nextElementSibling);
}

// Featured Container Hider

function hideFCHContainer() {
    document.getElementsByClassName("featured__container")[0].classList.add("rhHidden");
}

// Blacklist Stats Hider

function hideBSHStats() {
    var Chart, Match, Points, N, Data, I, CountDate, Year, Month, Day, Count, Context;
    Chart = document.getElementsByClassName("chart")[4];
    Match = Chart.previousElementSibling.textContent.match(/"Whitelists", data: \[(.+)\]},/)[1];
    Points = Match.split(/\],\[/);
    N = Points.length - 1;
    Points[0] = Points[0].replace(/^\[/, "");
    Points[N] = Points[N].replace(/\/]$/, "");
    Data = [];
    for (I = 0; I <= N; ++I) {
        Match = Points[I].match(/(.+), (.+)/);
        CountDate = Match[1].match(/\((.+?),(.+?),(.+?)\)/);
        Year = parseInt(CountDate[1]);
        Month = parseInt(CountDate[2]);
        Day = parseInt(CountDate[3]);
        Count = parseInt(Match[2]);
        Data.push([Date.UTC(Year, Month, Day), Count]);
    }
    Context = Chart.firstElementChild;
    Context.lastElementChild.remove();
    Context.lastElementChild.remove();
    Context = Context.nextElementSibling;
    Context.textContent = Context.textContent.replace(/and blacklists\s/, "");
    Context = Context.nextElementSibling;
    $(function() {
        chart_options.graph = {
            colors: ["#6187d4", "#ec656c"],
            tooltip: {
                headerFormat: "<p class=\"chart__tooltip-header\">{point.key}</p>",
                pointFormat: "<p class=\"chart__tooltip-point\" style=\"color: {point.color};\">{point.y:,.0f} {series.name}</p>"
            },
            series: [{
                name: "Whitelists",
                data: Data
            }]
        };
        $(Context).highcharts(Highcharts.merge(chart_options.default, chart_options.areaspline, chart_options.datetime, chart_options.graph));
    });
}

// Endless Scrolling

function addESPanel(Heading) {
    var Context, RS, Temp, I, N, RecentDiscussions, Container, CommentBox, MainPagination, ESPanel, ESRefresh, Match, URL, NextPage, CurrentPage,
        Navigation, ESPause, ESStatus;
    Heading.classList.add("ESHeading");
    Context = getESContext(document);
    if (Context || (typeof Context == "undefined")) {
        RS = !GM_getValue("ES_RS") && Path.match(/^\/discussion\//);
        if (RS) {
            Temp = document.createDocumentFragment();
            for (I = 0, N = Context.children.length; I < N; ++I) {
                Temp.appendChild(Context.lastElementChild);
            }
            Context.appendChild(Temp);
        }
        MainPagination = document.getElementsByClassName("pagination")[0];
        CommentBox = document.getElementsByClassName(SG ? "comment comment--submit" : "reply_form")[0];
        if (CommentBox && !CommentBox.classList.contains("is_hidden")) {
            Heading.insertAdjacentHTML(
                "afterEnd",
                "<div class=\"ESCommentBox\">" +
                "    <div class=\"pagination\"></div>" +
                "</div>" +
                "<div class=\"row-spacer\"></div>"
            );
            Heading.nextElementSibling.appendChild(CommentBox);
        }
        if (MainPagination) {
            Heading.insertAdjacentHTML("beforeEnd", "<div class=\"page_heading_btn ESPanel\"></div>");
            ESPanel = Heading.lastElementChild;
            ESPanel.insertAdjacentHTML(
                "beforeEnd",
                "<a class=\"ESRefresh\" title=\"Refresh current page.\">" +
                "    <i class=\"fa fa-refresh\"></i>" +
                "</a>"
            );
            ESRefresh = ESPanel.lastElementChild;
            Match = Location.match(/(.+?)(#.+?)?$/)[1].match(/(.+?)(\/search\?(page=(\d+))?(.*))?$/);
            URL = Match[1] + (Path.match(/^\/$/) ? (SG ? "giveaways/" : "trades/") : "/") + "search?" + (Match[5] ? (Match[5].replace(/^&|&$/g, "") + "&") : "") + "page=";
            NextPage = Match[4] ? (RS ? (parseInt(Match[4]) - 1) : (parseInt(Match[4]) + 1)) : (RS ? 0 : 2);
            CurrentPage = RS ? (NextPage + 1) : (NextPage - 1);
            if (Context) {
                Context.insertAdjacentHTML("afterBegin", "<div id=\"ESPage" + CurrentPage + "\"></div>");
            } else {
                Heading.parentElement.insertAdjacentHTML(
                    "beforeEnd",
                    "<div class=\"ESContext\">" +
                    "    <div class=\"rhHidden\" id=\"ESPage" + CurrentPage + "\"></div>" +
                    "</div>"
                );
            }
            Navigation = MainPagination.getElementsByClassName(SG ? "pagination__navigation" : "pagination_navigation")[0];
            if (Navigation) {
                ESPanel.insertBefore(Navigation, ESPanel.firstElementChild);
                MainPagination.remove();
                MainPagination = Navigation;
                setESPagination(MainPagination);
                if ((RS && !MainPagination.firstElementChild.classList.contains("is-selected")) || (!RS && !MainPagination.lastElementChild.classList.contains(SG ?
                    "is-selected" : "is_selected"))) {
                    ESPanel.insertAdjacentHTML(
                        "beforeEnd",
                        "<a class=\"ESPause\" title=\"Pause the endless scrolling.\">" +
                        "    <i class=\"fa fa-pause\"></i>" +
                        "</a>"
                    );
                    ESPause = ESPanel.lastElementChild;
                    ESPause.addEventListener("click", function() {
                        if (ESPause.classList.contains("ESPaused")) {
                            ESPause.classList.remove("ESPaused");
                            ESPause.title = "Pause the endless scrolling.";
                            ESPause.innerHTML = "<i class=\"fa fa-pause\"></i>";
                            loadESNextPage();
                            document.addEventListener("scroll", loadESNextPage);
                        } else {
                            document.removeEventListener("scroll", loadESNextPage);
                            ESPause.classList.add("ESPaused");
                            ESPause.title = "Resume the endless scrolling.";
                            ESPause.innerHTML = "<i class=\"fa fa-play\"></i>";
                        }
                    });
                    document.addEventListener("scroll", loadESNextPage);
                }
            } else {
                MainPagination.remove();
            }
            if (!document.getElementsByClassName("FEHeading")[0]) {
                fixFEHeading();
            }
            ESRefresh.addEventListener("click", function() {
                refreshESPage(ESRefresh, URL + CurrentPage, document.getElementById("ESPage" + CurrentPage), RS);
            });
        }
    }

    function loadESNextPage() {
        if (window.scrollY >= (document.body.offsetHeight - (window.innerHeight * 2))) {
            document.removeEventListener("scroll", loadESNextPage);
            Context.insertAdjacentHTML(
                "beforeEnd",
                "<div class=\"ESStatus\">" +
                "    <i class=\"fa fa-circle-o-notch fa-spin\"></i> Loading next page..." +
                "</div>"
            );
            ESStatus = Context.lastElementChild;
            makeRequest(null, URL + NextPage, ESStatus, function(Response) {
                var ResponseHTML, Pagination, Top, PaginationBackup;
                ResponseHTML = parseHTML(Response.responseText);
                ESStatus.innerHTML =
                    "<div class=\"page__heading page_heading\">" +
                    "    <div class=\"page__heading__breadcrumbs page_heading_breadcrumbs\">Page " + NextPage + "</div>" +
                    "</div>";
                Context.appendChild(getESContent(ResponseHTML, RS));
                ESStatus.nextElementSibling.id = "ESPage" + NextPage;
                Pagination = ResponseHTML.getElementsByClassName(SG ? "pagination__navigation" : "pagination_navigation")[0];
                if (Pagination && ((RS && !Pagination.firstElementChild.classList.contains("is-selected")) || (!RS && !Pagination.lastElementChild.classList.contains(SG ?
                    "is-selected" : "is_selected")))) {
                    if (RS) {
                        --NextPage;
                    } else {
                        ++NextPage;
                    }
                    document.addEventListener("scroll", loadESNextPage);
                }
                Top = ESStatus.offsetTop - Heading.getElementsByClassName("FEHeadingBackground")[0].offsetHeight;
                PaginationBackup = MainPagination.innerHTML;
                document.addEventListener("scroll", setESNextPage);

                function setESNextPage() {
                    if (window.scrollY > Top) {
                        document.removeEventListener("scroll", setESNextPage);
                        if (RS) {
                            --CurrentPage;
                        } else {
                            ++CurrentPage;
                        }
                        MainPagination.innerHTML = Pagination.innerHTML;
                        setESPagination(MainPagination);
                        document.addEventListener("scroll", setESPreviousPage);
                    }
                }

                function setESPreviousPage() {
                    if (window.scrollY <= Top) {
                        document.removeEventListener("scroll", setESPreviousPage);
                        if (RS) {
                            ++CurrentPage;
                        } else {
                            --CurrentPage;
                        }
                        MainPagination.innerHTML = PaginationBackup;
                        setESPagination(MainPagination);
                        document.addEventListener("scroll", setESNextPage);
                    }
                }
            });
        }
    }
}

function getESContext(Context) {
    if (SG) {
        if (Path.match(/(^\/$|^\/giveaways)/)) {
            if (GM_getValue("ES_R") && Path.match(/\/(created|entered|won|wishlist)/)) {
                
